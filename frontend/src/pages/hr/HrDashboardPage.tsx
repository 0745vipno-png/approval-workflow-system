import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { REQUEST_STATUS } from "../../constants/requestStatus";
import { APP_ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import type { RequestItem } from "../../types/request";
import { t } from "../../lib/i18n";

export function HrDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const language = useUiStore((state) => state.language);

  const mockHrRequests: RequestItem[] = [
    {
      id: 201,
      requestNo: "REQ202604150201",
      applicantId: 301,
      applicantName: "王小明",
      requestType: "LEAVE",
      title: "家庭因素請假申請",
      content: "因家庭因素需請假兩天。",
      startDate: "2026-04-16",
      endDate: "2026-04-17",
      status: REQUEST_STATUS.PENDING_HR,
      currentStep: "HR_REVIEW",
      currentApproverName: "人資部門",
      submittedAt: "2026-04-15 11:00",
      createdAt: "2026-04-15 08:30",
      updatedAt: "2026-04-15 11:00",
    },
    {
      id: 202,
      requestNo: "REQ202604150202",
      applicantId: 302,
      applicantName: "李小華",
      requestType: "REIMBURSEMENT",
      title: "交通費報銷申請",
      content: "申請報銷交通費。",
      startDate: "2026-04-15",
      endDate: "2026-04-15",
      status: REQUEST_STATUS.PENDING_HR,
      currentStep: "HR_REVIEW",
      currentApproverName: "人資部門",
      submittedAt: "2026-04-15 12:20",
      createdAt: "2026-04-15 10:00",
      updatedAt: "2026-04-15 12:20",
    },
    {
      id: 203,
      requestNo: "REQ202604140203",
      applicantId: 303,
      applicantName: "陳美玲",
      requestType: "OVERTIME",
      title: "專案加班申請",
      content: "專案需求申請加班。",
      startDate: "2026-04-14",
      endDate: "2026-04-14",
      status: REQUEST_STATUS.APPROVED,
      currentStep: "COMPLETED",
      approvedAt: "2026-04-14 16:40",
      createdAt: "2026-04-14 09:10",
      updatedAt: "2026-04-14 16:40",
    },
    {
      id: 204,
      requestNo: "REQ202604140204",
      applicantId: 304,
      applicantName: "周佩珊",
      requestType: "LEAVE",
      title: "病假申請",
      content: "因身體不適申請病假。",
      startDate: "2026-04-14",
      endDate: "2026-04-14",
      status: REQUEST_STATUS.RETURNED_BY_HR,
      currentStep: "REQUESTER_REVISION",
      createdAt: "2026-04-14 10:00",
      updatedAt: "2026-04-14 15:20",
    },
  ];

  const summary = useMemo(() => {
    const pendingCount = mockHrRequests.filter(
      (item) => item.status === REQUEST_STATUS.PENDING_HR
    ).length;

    const approvedCount = mockHrRequests.filter(
      (item) => item.status === REQUEST_STATUS.APPROVED
    ).length;

    const returnedCount = mockHrRequests.filter(
      (item) => item.status === REQUEST_STATUS.RETURNED_BY_HR
    ).length;

    const todayPendingCount = mockHrRequests.filter(
      (item) =>
        item.status === REQUEST_STATUS.PENDING_HR &&
        item.submittedAt?.startsWith("2026-04-15")
    ).length;

    return {
      pendingCount,
      approvedCount,
      returnedCount,
      todayPendingCount,
    };
  }, [mockHrRequests]);

  const recentPendingRequests = useMemo(() => {
    return mockHrRequests
      .filter((item) => item.status === REQUEST_STATUS.PENDING_HR)
      .slice(0, 5);
  }, [mockHrRequests]);

  const handleGoToPendingList = () => {
    navigate(APP_ROUTES.HR_PENDING);
  };

  const handleViewDetail = (requestId: number) => {
    navigate(`/hr/approvals/${requestId}`);
  };

  const userName =
    currentUser?.name ?? t(language, "hrDashboard.defaultUserName");

  return (
    <div>
      <PageHeader
        title={t(language, "hrDashboard.title", { name: userName })}
        description={t(language, "hrDashboard.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "sidebar.dashboard") },
        ]}
        actions={
          <Button onClick={handleGoToPendingList}>
            {t(language, "hrDashboard.viewPending")}
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
          title={t(language, "hrDashboard.summary.pending.title")}
          value={summary.pendingCount}
          description={t(language, "hrDashboard.summary.pending.description")}
        />
        <SummaryCard
          title={t(language, "hrDashboard.summary.todaySubmitted.title")}
          value={summary.todayPendingCount}
          description={t(
            language,
            "hrDashboard.summary.todaySubmitted.description"
          )}
        />
        <SummaryCard
          title={t(language, "hrDashboard.summary.approved.title")}
          value={summary.approvedCount}
          description={t(language, "hrDashboard.summary.approved.description")}
        />
        <SummaryCard
          title={t(language, "hrDashboard.summary.returned.title")}
          value={summary.returnedCount}
          description={t(language, "hrDashboard.summary.returned.description")}
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "hrDashboard.quickActions.title")}
          subtitle={t(language, "hrDashboard.quickActions.subtitle")}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button onClick={handleGoToPendingList}>
              {t(language, "hrDashboard.quickActions.enterPendingList")}
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "hrDashboard.recentRequests.title")}
          subtitle={t(language, "hrDashboard.recentRequests.subtitle")}
        >
          {recentPendingRequests.length === 0 ? (
            <EmptyDashboardState
              message={t(language, "hrDashboard.empty")}
            />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <TableHeaderCell>
                      {t(language, "common.requestNo")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "hrDashboard.applicant")}
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
                      {t(language, "hrDashboard.submittedAt")}
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
                          {t(language, "hrDashboard.viewDetail")}
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