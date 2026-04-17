import { useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { APP_ROUTES } from "../../constants/routes";
import { REQUEST_STATUS } from "../../constants/requestStatus";
import type { RequestItem } from "../../types/request";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { t } from "../../lib/i18n";

export function RequesterDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const language = useUiStore((state) => state.language);

  const mockRequests: RequestItem[] = [
    {
      id: 1,
      requestNo: "REQ202604150001",
      applicantId: 101,
      applicantName: "王小明",
      requestType: "LEAVE",
      title: "家庭因素請假申請",
      content: "因家庭因素需請假兩天，敬請主管核准。",
      startDate: "2026-04-16",
      endDate: "2026-04-17",
      status: REQUEST_STATUS.PENDING_MANAGER,
      currentStep: "MANAGER_REVIEW",
      currentApproverId: 2,
      currentApproverName: "陳主任",
      submittedAt: "2026-04-15 09:00",
      createdAt: "2026-04-15 08:30",
      updatedAt: "2026-04-15 09:00",
    },
    {
      id: 2,
      requestNo: "REQ202604140002",
      applicantId: 101,
      applicantName: "王小明",
      requestType: "REIMBURSEMENT",
      title: "研討會交通費報銷",
      content: "申請報銷參加研討會之交通費用。",
      startDate: "2026-04-12",
      endDate: "2026-04-12",
      status: REQUEST_STATUS.APPROVED,
      currentStep: "COMPLETED",
      submittedAt: "2026-04-14 10:00",
      approvedAt: "2026-04-14 16:30",
      createdAt: "2026-04-14 09:30",
      updatedAt: "2026-04-14 16:30",
    },
    {
      id: 3,
      requestNo: "REQ202604130003",
      applicantId: 101,
      applicantName: "王小明",
      requestType: "LEAVE",
      title: "個人事由請假申請",
      content: "因個人事由需請假一天，敬請主管核准。",
      startDate: "2026-04-20",
      endDate: "2026-04-20",
      status: REQUEST_STATUS.RETURNED_BY_MANAGER,
      currentStep: "REQUESTER_REVISION",
      createdAt: "2026-04-13 08:20",
      updatedAt: "2026-04-13 15:40",
      submittedAt: "2026-04-13 09:00",
    },
    {
      id: 4,
      requestNo: "REQ202604120004",
      applicantId: 101,
      applicantName: "王小明",
      requestType: "OVERTIME",
      title: "專案加班申請",
      content: "因專案進度需求申請加班。",
      startDate: "2026-04-11",
      endDate: "2026-04-11",
      status: REQUEST_STATUS.DRAFT,
      currentStep: "DRAFT_STEP",
      createdAt: "2026-04-12 18:30",
      updatedAt: "2026-04-12 18:30",
    },
  ];

  const summary = useMemo(() => {
    const total = mockRequests.length;

    const pendingCount = mockRequests.filter(
      (item) =>
        item.status === REQUEST_STATUS.PENDING_MANAGER ||
        item.status === REQUEST_STATUS.PENDING_HR
    ).length;

    const returnedCount = mockRequests.filter(
      (item) =>
        item.status === REQUEST_STATUS.RETURNED_BY_MANAGER ||
        item.status === REQUEST_STATUS.RETURNED_BY_HR
    ).length;

    const approvedCount = mockRequests.filter(
      (item) => item.status === REQUEST_STATUS.APPROVED
    ).length;

    const draftCount = mockRequests.filter(
      (item) => item.status === REQUEST_STATUS.DRAFT
    ).length;

    return {
      total,
      pendingCount,
      returnedCount,
      approvedCount,
      draftCount,
    };
  }, [mockRequests]);

  const recentRequests = useMemo(() => {
    return mockRequests.slice(0, 3);
  }, [mockRequests]);

  const handleGoToRequestList = () => {
    navigate(APP_ROUTES.REQUEST_LIST);
  };

  const handleGoToCreate = () => {
    navigate(APP_ROUTES.REQUEST_CREATE);
  };

  const handleViewDetail = (requestId: number) => {
    navigate(`/requests/${requestId}`);
  };

  const userName =
    currentUser?.name ??
    t(language, "requesterDashboard.defaultUserName");

  return (
    <div>
      <PageHeader
        title={t(language, "requesterDashboard.title", {
          name: userName,
        })}
        description={t(language, "requesterDashboard.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "sidebar.dashboard") },
        ]}
        actions={
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={handleGoToRequestList}>
              {t(language, "requesterDashboard.viewMyRequests")}
            </Button>
            <Button onClick={handleGoToCreate}>
              {t(language, "requestList.createButton")}
            </Button>
          </div>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <SummaryCard
          title={t(language, "requesterDashboard.summary.total.title")}
          value={summary.total}
          description={t(
            language,
            "requesterDashboard.summary.total.description"
          )}
        />

        <SummaryCard
          title={t(language, "requesterDashboard.summary.pending.title")}
          value={summary.pendingCount}
          description={t(
            language,
            "requesterDashboard.summary.pending.description"
          )}
        />

        <SummaryCard
          title={t(language, "requesterDashboard.summary.returned.title")}
          value={summary.returnedCount}
          description={t(
            language,
            "requesterDashboard.summary.returned.description"
          )}
        />

        <SummaryCard
          title={t(language, "requesterDashboard.summary.approved.title")}
          value={summary.approvedCount}
          description={t(
            language,
            "requesterDashboard.summary.approved.description"
          )}
        />

        <SummaryCard
          title={t(language, "requesterDashboard.summary.draft.title")}
          value={summary.draftCount}
          description={t(
            language,
            "requesterDashboard.summary.draft.description"
          )}
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "requesterDashboard.quickActions.title")}
          subtitle={t(language, "requesterDashboard.quickActions.subtitle")}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Button onClick={handleGoToCreate}>
              {t(language, "requesterDashboard.quickActions.create")}
            </Button>
            <Button variant="secondary" onClick={handleGoToRequestList}>
              {t(language, "requesterDashboard.quickActions.viewAll")}
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "requesterDashboard.recentRequests.title")}
          subtitle={t(language, "requesterDashboard.recentRequests.subtitle")}
        >
          {recentRequests.length === 0 ? (
            <EmptyDashboardState
              message={t(language, "requesterDashboard.empty")}
            />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <TableHeaderCell>
                      {t(language, "common.requestNo")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.requestType")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.title")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.status")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "requestList.currentApprover")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.updatedAt")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.actions")}
                    </TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id}>
                      <TableBodyCell>{request.requestNo}</TableBodyCell>
                      <TableBodyCell>
                        {getRequestTypeLabel(language, request.requestType)}
                      </TableBodyCell>
                      <TableBodyCell>{request.title}</TableBodyCell>
                      <TableBodyCell>
                        <StatusBadge status={request.status} />
                      </TableBodyCell>
                      <TableBodyCell>
                        {request.currentApproverName ??
                          t(language, "common.notAvailable")}
                      </TableBodyCell>
                      <TableBodyCell>{request.updatedAt}</TableBodyCell>
                      <TableBodyCell>
                        <Button
                          variant="secondary"
                          onClick={() => handleViewDetail(request.id)}
                        >
                          {t(language, "common.view")}
                        </Button>
                      </TableBodyCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
}

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <Card>
      <div style={{ display: "grid", gap: "8px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#6b7280",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#6b7280",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    </Card>
  );
}

function EmptyDashboardState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
        border: "1px dashed #d1d5db",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
      }}
    >
      {message}
    </div>
  );
}

interface TableCellProps {
  children: ReactNode;
}

function TableHeaderCell({ children }: TableCellProps) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "13px",
        color: "#6b7280",
        backgroundColor: "#f9fafb",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function TableBodyCell({ children }: TableCellProps) {
  return (
    <td
      style={{
        padding: "12px",
        borderBottom: "1px solid #f3f4f6",
        fontSize: "14px",
        color: "#111827",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

function getRequestTypeLabel(language: "zh-TW" | "en", type: RequestItem["requestType"]): string {
  const labelMap: Record<RequestItem["requestType"], string> = {
    LEAVE: t(language, "requestType.LEAVE"),
    REIMBURSEMENT: t(language, "requestType.REIMBURSEMENT"),
    OVERTIME: t(language, "requestType.OVERTIME"),
  };

  return labelMap[type];
}