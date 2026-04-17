import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { REQUEST_STATUS } from "../../constants/requestStatus";
import type { RequestItem } from "../../types/request";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { APP_ROUTES } from "../../constants/routes";
import { t } from "../../lib/i18n";

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const language = useUiStore((state) => state.language);

  const mockManagerRequests: RequestItem[] = [
    {
      id: 11,
      requestNo: "REQ202604150010",
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
      id: 12,
      requestNo: "REQ202604150011",
      applicantId: 102,
      applicantName: "李小華",
      requestType: "REIMBURSEMENT",
      title: "交通費報銷申請",
      content: "申請報銷外出會議之交通費。",
      startDate: "2026-04-14",
      endDate: "2026-04-14",
      status: REQUEST_STATUS.PENDING_MANAGER,
      currentStep: "MANAGER_REVIEW",
      currentApproverId: 2,
      currentApproverName: "陳主任",
      submittedAt: "2026-04-15 10:20",
      createdAt: "2026-04-15 10:00",
      updatedAt: "2026-04-15 10:20",
    },
    {
      id: 13,
      requestNo: "REQ202604150012",
      applicantId: 103,
      applicantName: "陳美玲",
      requestType: "OVERTIME",
      title: "專案加班申請",
      content: "因系統上線前測試需求申請加班。",
      startDate: "2026-04-15",
      endDate: "2026-04-15",
      status: REQUEST_STATUS.PENDING_MANAGER,
      currentStep: "MANAGER_REVIEW",
      currentApproverId: 2,
      currentApproverName: "陳主任",
      submittedAt: "2026-04-15 11:10",
      createdAt: "2026-04-15 10:50",
      updatedAt: "2026-04-15 11:10",
    },
    {
      id: 14,
      requestNo: "REQ202604140020",
      applicantId: 104,
      applicantName: "林志豪",
      requestType: "LEAVE",
      title: "個人事由請假申請",
      content: "因個人事由需請假一天。",
      startDate: "2026-04-18",
      endDate: "2026-04-18",
      status: REQUEST_STATUS.RETURNED_BY_MANAGER,
      currentStep: "REQUESTER_REVISION",
      submittedAt: "2026-04-14 09:30",
      createdAt: "2026-04-14 09:00",
      updatedAt: "2026-04-14 14:00",
    },
    {
      id: 15,
      requestNo: "REQ202604130021",
      applicantId: 105,
      applicantName: "周佩珊",
      requestType: "REIMBURSEMENT",
      title: "出差報銷申請",
      content: "申請報銷出差住宿與交通費。",
      startDate: "2026-04-13",
      endDate: "2026-04-13",
      status: REQUEST_STATUS.REJECTED_BY_MANAGER,
      currentStep: "COMPLETED",
      submittedAt: "2026-04-13 08:50",
      createdAt: "2026-04-13 08:10",
      updatedAt: "2026-04-13 12:30",
    },
  ];

  const summary = useMemo(() => {
    const pendingCount = mockManagerRequests.filter(
      (item) => item.status === REQUEST_STATUS.PENDING_MANAGER
    ).length;

    const returnedCount = mockManagerRequests.filter(
      (item) => item.status === REQUEST_STATUS.RETURNED_BY_MANAGER
    ).length;

    const rejectedCount = mockManagerRequests.filter(
      (item) => item.status === REQUEST_STATUS.REJECTED_BY_MANAGER
    ).length;

    const todaySubmittedCount = mockManagerRequests.filter((item) =>
      item.submittedAt?.startsWith("2026-04-15")
    ).length;

    return {
      pendingCount,
      returnedCount,
      rejectedCount,
      todaySubmittedCount,
    };
  }, [mockManagerRequests]);

  const recentPendingRequests = useMemo(() => {
    return mockManagerRequests
      .filter((item) => item.status === REQUEST_STATUS.PENDING_MANAGER)
      .slice(0, 5);
  }, [mockManagerRequests]);

  const handleGoToPendingList = () => {
    navigate(APP_ROUTES.MANAGER_PENDING);
  };

  const handleViewDetail = (requestId: number) => {
    navigate(`/manager/approvals/${requestId}`);
  };

  const userName =
    currentUser?.name ?? t(language, "managerDashboard.defaultUserName");

  return (
    <div>
      <PageHeader
        title={t(language, "managerDashboard.title", { name: userName })}
        description={t(language, "managerDashboard.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "sidebar.dashboard") },
        ]}
        actions={
          <Button onClick={handleGoToPendingList}>
            {t(language, "managerDashboard.viewPending")}
          </Button>
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
          title={t(language, "managerDashboard.summary.pending.title")}
          value={summary.pendingCount}
          description={t(language, "managerDashboard.summary.pending.description")}
        />

        <SummaryCard
          title={t(language, "managerDashboard.summary.todaySubmitted.title")}
          value={summary.todaySubmittedCount}
          description={t(
            language,
            "managerDashboard.summary.todaySubmitted.description"
          )}
        />

        <SummaryCard
          title={t(language, "managerDashboard.summary.returned.title")}
          value={summary.returnedCount}
          description={t(
            language,
            "managerDashboard.summary.returned.description"
          )}
        />

        <SummaryCard
          title={t(language, "managerDashboard.summary.rejected.title")}
          value={summary.rejectedCount}
          description={t(
            language,
            "managerDashboard.summary.rejected.description"
          )}
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "managerDashboard.quickActions.title")}
          subtitle={t(language, "managerDashboard.quickActions.subtitle")}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Button onClick={handleGoToPendingList}>
              {t(language, "managerDashboard.quickActions.enterPendingList")}
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "managerDashboard.recentRequests.title")}
          subtitle={t(language, "managerDashboard.recentRequests.subtitle")}
        >
          {recentPendingRequests.length === 0 ? (
            <EmptyDashboardState
              message={t(language, "managerDashboard.empty")}
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
                      {t(language, "managerDashboard.applicant")}
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
                      {t(language, "managerDashboard.submittedAt")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.actions")}
                    </TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {recentPendingRequests.map((request) => (
                    <tr key={request.id}>
                      <TableBodyCell>{request.requestNo}</TableBodyCell>
                      <TableBodyCell>{request.applicantName}</TableBodyCell>
                      <TableBodyCell>
                        {getRequestTypeLabel(language, request.requestType)}
                      </TableBodyCell>
                      <TableBodyCell>{request.title}</TableBodyCell>
                      <TableBodyCell>
                        <StatusBadge status={request.status} />
                      </TableBodyCell>
                      <TableBodyCell>
                        {request.submittedAt ?? t(language, "common.notAvailable")}
                      </TableBodyCell>
                      <TableBodyCell>
                        <Button
                          variant="secondary"
                          onClick={() => handleViewDetail(request.id)}
                        >
                          {t(language, "managerDashboard.viewDetail")}
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