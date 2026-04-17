import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
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

async function fetchRequestDetail(
  requestId: string
): Promise<RequestItem | null> {
  const response = await fetch(`http://localhost:3000/api/requests/${requestId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("FETCH_REQUEST_DETAIL_FAILED");
  }

  const result = await response.json();
  return result?.data ?? null;
}

export function RequestDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const language = useUiStore((state) => state.language);

  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["request-detail", id],
    queryFn: () => fetchRequestDetail(id ?? ""),
    enabled: Boolean(id),
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/requests/${id}/cancel`,
      {
        method: "PATCH",
      }
      
    );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message ?? "Failed to cancel request";
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      await queryClient.invalidateQueries({ queryKey: ["request-detail", id] });
    },
  });

  const timelineItems: ApprovalTimelineItem[] = useMemo(() => {
    if (!request) {
      return [];
    }

    const items: ApprovalTimelineItem[] = [
      {
        id: 1,
        title: t(language, "requestDetail.timeline.created"),
        actorName: request.applicantName,
        actorRole: "Requester",
        actionTime: request.createdAt,
        toStatus: REQUEST_STATUS.DRAFT,
      },
    ];

    if (request.submittedAt) {
      items.push({
        id: 2,
        title: t(language, "requestDetail.timeline.submitted"),
        actorName: request.applicantName,
        actorRole: "Requester",
        actionTime: request.submittedAt,
        toStatus:
          request.status === REQUEST_STATUS.DRAFT
            ? REQUEST_STATUS.PENDING_MANAGER
            : request.status,
        comment: t(language, "requestDetail.timeline.submittedComment"),
      });
    }

    if (request.status === REQUEST_STATUS.RETURNED_BY_MANAGER) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.returnedByManager"),
        actorName: request.currentApproverName ?? t(language, "role.MANAGER"),
        actorRole: "Manager",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.RETURNED_BY_MANAGER,
      });
    }

    if (request.status === REQUEST_STATUS.REJECTED_BY_MANAGER) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.rejectedByManager"),
        actorName: request.currentApproverName ?? t(language, "role.MANAGER"),
        actorRole: "Manager",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.REJECTED_BY_MANAGER,
      });
    }

    if (request.status === REQUEST_STATUS.PENDING_HR) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.sentToHr"),
        actorName: t(language, "role.MANAGER"),
        actorRole: "Manager",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.PENDING_HR,
      });
    }

    if (request.status === REQUEST_STATUS.RETURNED_BY_HR) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.returnedByHr"),
        actorName: "HR",
        actorRole: "HR",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.RETURNED_BY_HR,
      });
    }

    if (request.status === REQUEST_STATUS.REJECTED_BY_HR) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.rejectedByHr"),
        actorName: "HR",
        actorRole: "HR",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.REJECTED_BY_HR,
      });
    }

    if (request.status === REQUEST_STATUS.APPROVED) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.approved"),
        actorName: "HR",
        actorRole: "HR",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.APPROVED,
      });
    }

    if (request.status === REQUEST_STATUS.CANCELLED) {
      items.push({
        id: 3,
        title: t(language, "requestDetail.timeline.cancelled"),
        actorName: request.applicantName,
        actorRole: "Requester",
        actionTime: request.updatedAt,
        toStatus: REQUEST_STATUS.CANCELLED,
      });
    }

    return items;
  }, [request, language]);

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
        description: t(language, "requestDetail.stepper.requester"),
        state: requesterState,
      },
      {
        key: "manager",
        label: t(language, "role.MANAGER"),
        description: t(language, "requestDetail.stepper.manager"),
        state: managerState,
      },
      {
        key: "hr",
        label: "HR",
        description: t(language, "requestDetail.stepper.hr"),
        state: hrState,
      },
    ];
  }, [request, language]);

  const canEdit =
    request?.status === REQUEST_STATUS.DRAFT ||
    request?.status === REQUEST_STATUS.RETURNED_BY_MANAGER ||
    request?.status === REQUEST_STATUS.RETURNED_BY_HR;

  const canWithdraw =
    request?.status === REQUEST_STATUS.PENDING_MANAGER ||
    request?.status === REQUEST_STATUS.RETURNED_BY_MANAGER ||
    request?.status === REQUEST_STATUS.RETURNED_BY_HR ||
    request?.status === REQUEST_STATUS.DRAFT;

  const handleBack = () => {
    navigate(APP_ROUTES.REQUEST_LIST);
  };

  const handleEdit = () => {
    if (!request) return;
    navigate(APP_ROUTES.REQUEST_EDIT.replace(":id", String(request.id)));
  };

  const handleWithdraw = async () => {
    if (!request) return;

    const confirmed = window.confirm(
      t(language, "requestDetail.withdrawConfirm").replace(
        "{requestNo}",
        request.requestNo
      )
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelRequestMutation.mutateAsync();
      alert(t(language, "requestDetail.withdrawSuccess"));
      navigate(APP_ROUTES.REQUEST_LIST);
    } catch (err) {
      console.error("撤回申請失敗：", err);
      alert(
        err instanceof Error
          ? err.message
          : t(language, "requestDetail.withdrawFailed")
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title={t(language, "requestDetail.title")}
          description={t(language, "requestDetail.loadingDescription")}
          breadcrumbs={[
            { label: t(language, "common.home") },
            { label: t(language, "requestList.title") },
            { label: t(language, "requestDetail.title") },
          ]}
          actions={
            <Button variant="secondary" onClick={handleBack}>
              {t(language, "requestDetail.backToList")}
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
            {t(language, "requestDetail.loading")}
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader
          title={t(language, "requestDetail.title")}
          description={t(language, "requestDetail.loadFailed")}
          breadcrumbs={[
            { label: t(language, "common.home") },
            { label: t(language, "requestList.title") },
            { label: t(language, "requestDetail.title") },
          ]}
          actions={
            <Button variant="secondary" onClick={handleBack}>
              {t(language, "requestDetail.backToList")}
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
            {error instanceof Error
              ? error.message
              : t(language, "requestDetail.loadError")}
          </div>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div>
        <PageHeader
          title={t(language, "requestDetail.title")}
          description={t(language, "requestDetail.notFoundDescription")}
          breadcrumbs={[
            { label: t(language, "common.home") },
            { label: t(language, "requestList.title") },
            { label: t(language, "requestDetail.title") },
          ]}
          actions={
            <Button variant="secondary" onClick={handleBack}>
              {t(language, "requestDetail.backToList")}
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
            {t(language, "requestDetail.notFound")}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t(language, "requestDetail.title")}
        description={t(language, "requestDetail.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "requestList.title") },
          { label: t(language, "requestDetail.title") },
        ]}
        actions={
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {canEdit ? (
              <Button variant="secondary" onClick={handleEdit}>
                {t(language, "requestDetail.edit")}
              </Button>
            ) : null}

            {canWithdraw ? (
              <Button
                variant="danger"
                onClick={handleWithdraw}
                disabled={cancelRequestMutation.isPending}
              >
                {cancelRequestMutation.isPending
                  ? t(language, "requestDetail.withdrawing")
                  : t(language, "requestDetail.withdraw")}
              </Button>
            ) : null}

            <Button variant="secondary" onClick={handleBack}>
              {t(language, "requestDetail.backToList")}
            </Button>
          </div>
        }
      />

      <Card title={t(language, "requestDetail.basicInfo")}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <InfoField label={t(language, "requestDetail.requestNo")} value={request.requestNo} />
          <InfoField label={t(language, "requestDetail.applicant")} value={request.applicantName} />
          <InfoField
            label={t(language, "common.requestType")}
            value={getRequestTypeLabel(language, request.requestType)}
          />
          <InfoField label={t(language, "requestDetail.requestTitle")} value={request.title} />
          <InfoField
            label={t(language, "requestDetail.currentStatus")}
            value={<StatusBadge status={request.status} />}
          />
          <InfoField label={t(language, "requestDetail.currentStep")} value={request.currentStep} />
          <InfoField label={t(language, "common.startDate")} value={request.startDate ?? "—"} />
          <InfoField label={t(language, "common.endDate")} value={request.endDate ?? "—"} />
          <InfoField label={t(language, "requestDetail.createdAt")} value={request.createdAt} />
          <InfoField label={t(language, "requestDetail.submittedAt")} value={request.submittedAt ?? "—"} />
          <InfoField
            label={t(language, "requestList.currentApprover")}
            value={request.currentApproverName ?? "—"}
          />
          <InfoField label={t(language, "common.updatedAt")} value={request.updatedAt} />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card title={t(language, "requestDetail.contentTitle")}>
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
          title={t(language, "requestDetail.progressTitle")}
          subtitle={t(language, "requestDetail.progressSubtitle")}
        >
          <ApprovalStepper steps={stepperSteps} />
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "requestDetail.timelineTitle")}
          subtitle={t(language, "requestDetail.timelineSubtitle")}
        >
          <ApprovalTimeline items={timelineItems} />
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card title={t(language, "requestDetail.statusDescriptionTitle")}>
          <StatusDescription status={request.status} />
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

interface StatusDescriptionProps {
  status: RequestItem["status"];
}

function StatusDescription({ status }: StatusDescriptionProps) {
  const language = useUiStore((state) => state.language);

  const descriptionMap: Record<RequestItem["status"], string> = {
    DRAFT: t(language, "requestDetail.statusDesc.DRAFT"),
    PENDING_MANAGER: t(language, "requestDetail.statusDesc.PENDING_MANAGER"),
    RETURNED_BY_MANAGER: t(language, "requestDetail.statusDesc.RETURNED_BY_MANAGER"),
    REJECTED_BY_MANAGER: t(language, "requestDetail.statusDesc.REJECTED_BY_MANAGER"),
    PENDING_HR: t(language, "requestDetail.statusDesc.PENDING_HR"),
    RETURNED_BY_HR: t(language, "requestDetail.statusDesc.RETURNED_BY_HR"),
    REJECTED_BY_HR: t(language, "requestDetail.statusDesc.REJECTED_BY_HR"),
    APPROVED: t(language, "requestDetail.statusDesc.APPROVED"),
    CANCELLED: t(language, "requestDetail.statusDesc.CANCELLED"),
  };

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#374151",
        lineHeight: 1.7,
      }}
    >
      {descriptionMap[status]}
    </div>
  );
}