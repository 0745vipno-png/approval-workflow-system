import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { ApprovalStepper } from "../../components/approval/ApprovalStepper";
import { ApprovalTimeline } from "../../components/approval/ApprovalTimeline";
import type {
  ApprovalStepItem,
  ApprovalTimelineItem,
} from "../../types/approval";
import type { RequestItem } from "../../types/request";
import { REQUEST_STATUS } from "../../constants/requestStatus";
import { APP_ROUTES } from "../../constants/routes";
import { useUiStore } from "../../store/ui.store";
import { t } from "../../lib/i18n";

interface ApprovalLogApiItem {
  id: number;
  requestId: number;
  actionBy: string;
  actionRole: string;
  actionType: string;
  fromStatus?: RequestItem["status"];
  toStatus: RequestItem["status"];
  comment?: string;
  actionTime: string;
}

async function fetchApprovalRequestDetail(
  requestId: string
): Promise<RequestItem | null> {
  const response = await fetch(`http://localhost:3000/api/requests/${requestId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch approval request detail");
  }

  const result = await response.json();
  return result?.data ?? null;
}

async function fetchApprovalLogs(
  requestId: string,
  language: "zh-TW" | "en"
): Promise<ApprovalTimelineItem[]> {
  const response = await fetch(
    `http://localhost:3000/api/requests/${requestId}/logs`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch approval logs");
  }

  const result = await response.json();
  const logs = Array.isArray(result?.data) ? result.data : [];

  return logs.map((item: ApprovalLogApiItem) => ({
    id: item.id,
    title: getTimelineTitle(item, language),
    actorName: item.actionBy,
    actorRole: item.actionRole,
    actionTime: item.actionTime,
    comment: item.comment,
    toStatus: item.toStatus,
  }));
}

function getTimelineTitle(
  item: ApprovalLogApiItem,
  language: "zh-TW" | "en"
): string {
  switch (item.actionType) {
    case "SAVE_DRAFT":
      return t(language, "managerApproval.timeline.savedDraft");
    case "SUBMIT":
      return t(language, "managerApproval.timeline.submitted");
    case "APPROVE":
      if (item.actionRole === "Manager") {
        return t(language, "managerApproval.timeline.managerApproved");
      }
      if (item.actionRole === "HR") {
        return t(language, "managerApproval.timeline.hrApproved");
      }
      return t(language, "managerApproval.timeline.approved");
    case "RETURN":
      if (item.actionRole === "Manager") {
        return t(language, "managerApproval.timeline.managerReturned");
      }
      if (item.actionRole === "HR") {
        return t(language, "managerApproval.timeline.hrReturned");
      }
      return t(language, "managerApproval.timeline.returned");
    case "REJECT":
      if (item.actionRole === "Manager") {
        return t(language, "managerApproval.timeline.managerRejected");
      }
      if (item.actionRole === "HR") {
        return t(language, "managerApproval.timeline.hrRejected");
      }
      return t(language, "managerApproval.timeline.rejected");
    case "CANCEL":
      return t(language, "managerApproval.timeline.cancelled");
    case "RESUBMIT":
      return t(language, "managerApproval.timeline.resubmitted");
    default:
      return t(language, "managerApproval.timeline.updated");
  }
}

export function ApprovalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const language = useUiStore((state) => state.language);

  const [approvalComment, setApprovalComment] = useState("");

  const {
    data: request,
    isLoading: isRequestLoading,
    isError: isRequestError,
    error: requestError,
  } = useQuery({
    queryKey: ["manager-approval-detail", id],
    queryFn: () => fetchApprovalRequestDetail(id ?? ""),
    enabled: Boolean(id),
  });

  const {
    data: timelineItems = [],
    isLoading: isLogsLoading,
    isError: isLogsError,
    error: logsError,
  } = useQuery({
    queryKey: ["manager-approval-logs", id, language],
    queryFn: () => fetchApprovalLogs(id ?? "", language),
    enabled: Boolean(id),
  });

  const actionMutation = useMutation({
    mutationFn: async (action: "approve" | "return" | "reject") => {
      const response = await fetch(
        `http://localhost:3000/api/requests/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: approvalComment,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || t(language, "managerApproval.actionFailed")
        );
      }

      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      await queryClient.invalidateQueries({
        queryKey: ["manager-approval-detail", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["manager-approval-logs", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["manager-pending-requests"],
      });
    },
  });

  const stepperSteps: ApprovalStepItem[] = useMemo(() => {
    if (!request) {
      return [];
    }

    const status = request.status;

    const requesterState: ApprovalStepItem["state"] =
      status === REQUEST_STATUS.DRAFT ? "current" : "completed";

    let managerState: ApprovalStepItem["state"] = "pending";
    let hrState: ApprovalStepItem["state"] = "pending";

    if (status === REQUEST_STATUS.PENDING_MANAGER) {
      managerState = "current";
    } else if (status === REQUEST_STATUS.RETURNED_BY_MANAGER) {
      managerState = "returned";
    } else if (status === REQUEST_STATUS.REJECTED_BY_MANAGER) {
      managerState = "rejected";
    } else if (
      status === REQUEST_STATUS.PENDING_HR ||
      status === REQUEST_STATUS.RETURNED_BY_HR ||
      status === REQUEST_STATUS.REJECTED_BY_HR ||
      status === REQUEST_STATUS.APPROVED
    ) {
      managerState = "completed";
    }

    if (status === REQUEST_STATUS.PENDING_HR) {
      hrState = "current";
    } else if (status === REQUEST_STATUS.RETURNED_BY_HR) {
      hrState = "returned";
    } else if (status === REQUEST_STATUS.REJECTED_BY_HR) {
      hrState = "rejected";
    } else if (status === REQUEST_STATUS.APPROVED) {
      hrState = "completed";
    }

    return [
      {
        key: "requester",
        label: t(language, "role.REQUESTER"),
        description: t(language, "managerApproval.stepper.requester"),
        state: requesterState,
      },
      {
        key: "manager",
        label: t(language, "role.MANAGER"),
        description: t(language, "managerApproval.stepper.manager"),
        state: managerState,
      },
      {
        key: "hr",
        label: "HR",
        description: t(language, "managerApproval.stepper.hr"),
        state: hrState,
      },
    ];
  }, [request, language]);

  const isLoading = isRequestLoading || isLogsLoading;
  const isError = isRequestError || isLogsError;

  const handleBack = () => {
    navigate(APP_ROUTES.MANAGER_PENDING);
  };

  const handleApprove = async () => {
    if (!request) return;

    try {
      await actionMutation.mutateAsync("approve");
      alert(t(language, "managerApproval.toast.approveSuccess"));
      setApprovalComment("");
      navigate(APP_ROUTES.MANAGER_PENDING);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : t(language, "managerApproval.toast.approveFailed")
      );
    }
  };

  const handleReturn = async () => {
    if (!request) return;

    try {
      await actionMutation.mutateAsync("return");
      alert(t(language, "managerApproval.toast.returnSuccess"));
      setApprovalComment("");
      navigate(APP_ROUTES.MANAGER_PENDING);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : t(language, "managerApproval.toast.returnFailed")
      );
    }
  };

  const handleReject = async () => {
    if (!request) return;

    try {
      await actionMutation.mutateAsync("reject");
      alert(t(language, "managerApproval.toast.rejectSuccess"));
      setApprovalComment("");
      navigate(APP_ROUTES.MANAGER_PENDING);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : t(language, "managerApproval.toast.rejectFailed")
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title={t(language, "managerApproval.title")}
          description={t(language, "managerApproval.loadingDescription")}
          breadcrumbs={[
            { label: t(language, "common.home") },
            { label: t(language, "managerApproval.pendingTitle") },
            { label: t(language, "managerApproval.title") },
          ]}
          actions={
            <Button variant="secondary" onClick={handleBack}>
              {t(language, "managerApproval.backToList")}
            </Button>
          }
        />

        <Card>
          <div
            style={{
              padding: "24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            {t(language, "managerApproval.loading")}
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader
          title={t(language, "managerApproval.title")}
          description={t(language, "managerApproval.loadFailed")}
          breadcrumbs={[
            { label: t(language, "common.home") },
            { label: t(language, "managerApproval.pendingTitle") },
            { label: t(language, "managerApproval.title") },
          ]}
          actions={
            <Button variant="secondary" onClick={handleBack}>
              {t(language, "managerApproval.backToList")}
            </Button>
          }
        />

        <Card>
          <div
            style={{
              padding: "24px",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {requestError instanceof Error
              ? requestError.message
              : logsError instanceof Error
                ? logsError.message
                : t(language, "managerApproval.loadError")}
          </div>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div>
        <PageHeader
          title={t(language, "managerApproval.title")}
          description={t(language, "managerApproval.notFoundDescription")}
          breadcrumbs={[
            { label: t(language, "common.home") },
            { label: t(language, "managerApproval.pendingTitle") },
            { label: t(language, "managerApproval.title") },
          ]}
          actions={
            <Button variant="secondary" onClick={handleBack}>
              {t(language, "managerApproval.backToList")}
            </Button>
          }
        />

        <Card>
          <div
            style={{
              padding: "24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            {t(language, "managerApproval.notFound")}
          </div>
        </Card>
      </div>
    );
  }

  const isPendingManager = request.status === REQUEST_STATUS.PENDING_MANAGER;
  const isProcessing = actionMutation.isPending;

  return (
    <div>
      <PageHeader
        title={t(language, "managerApproval.title")}
        description={t(language, "managerApproval.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "managerApproval.pendingTitle") },
          { label: t(language, "managerApproval.title") },
        ]}
        actions={
          <Button variant="secondary" onClick={handleBack}>
            {t(language, "managerApproval.backToList")}
          </Button>
        }
      />

      <Card title={t(language, "managerApproval.basicInfo")}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <InfoField
            label={t(language, "managerApproval.requestNo")}
            value={request.requestNo}
          />
          <InfoField
            label={t(language, "managerApproval.applicant")}
            value={request.applicantName}
          />
          <InfoField
            label={t(language, "common.requestType")}
            value={getRequestTypeLabel(language, request.requestType)}
          />
          <InfoField
            label={t(language, "managerApproval.currentStatus")}
            value={<StatusBadge status={request.status} />}
          />
          <InfoField
            label={t(language, "common.startDate")}
            value={request.startDate ?? "—"}
          />
          <InfoField
            label={t(language, "common.endDate")}
            value={request.endDate ?? "—"}
          />
          <InfoField
            label={t(language, "managerApproval.submittedAt")}
            value={request.submittedAt ?? "—"}
          />
          <InfoField
            label={t(language, "requestList.currentApprover")}
            value={request.currentApproverName ?? "—"}
          />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card title={t(language, "managerApproval.contentTitle")}>
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              color: "#374151",
              fontSize: "14px",
            }}
          >
            {request.content}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "managerApproval.progressTitle")}
          subtitle={t(language, "managerApproval.progressSubtitle")}
        >
          <ApprovalStepper steps={stepperSteps} />
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "managerApproval.timelineTitle")}
          subtitle={t(language, "managerApproval.timelineSubtitle")}
        >
          <ApprovalTimeline items={timelineItems} />
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "managerApproval.actionTitle")}
          subtitle={t(language, "managerApproval.actionSubtitle")}
        >
          {isPendingManager ? (
            <div style={{ display: "grid", gap: "16px" }}>
              <Textarea
                label={t(language, "managerApproval.commentLabel")}
                placeholder={t(language, "managerApproval.commentPlaceholder")}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={5}
              />

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Button onClick={handleApprove} disabled={isProcessing}>
                  {isProcessing
                    ? t(language, "common.processing")
                    : t(language, "managerApproval.approve")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReturn}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? t(language, "common.processing")
                    : t(language, "managerApproval.return")}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? t(language, "common.processing")
                    : t(language, "managerApproval.reject")}
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                border: "1px dashed #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#6b7280",
                backgroundColor: "#f9fafb",
              }}
            >
              {t(language, "managerApproval.notPending").replace(
                "{status}",
                t(language, `status.${request.status}`)
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function getRequestTypeLabel(
  language: "zh-TW" | "en",
  type: RequestItem["requestType"]
): string {
  const labelMap: Record<RequestItem["requestType"], string> = {
    LEAVE: t(language, "requestType.LEAVE"),
    REIMBURSEMENT: t(language, "requestType.REIMBURSEMENT"),
    OVERTIME: t(language, "requestType.OVERTIME"),
  };

  return labelMap[type];
}

interface InfoFieldProps {
  label: string;
  value: ReactNode;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "6px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          minHeight: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {value}
      </div>
    </div>
  );
}