import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { useAuthStore } from "../../store/auth.store";
import { APP_ROUTES } from "../../constants/routes";
import type { RequestItem } from "../../types/request";

interface AdminDashboardSummary {
  usersCount: number;
  departmentsCount: number;
  managerMappingsCount: number;
  activeRequestsCount: number;
  pendingManagerCount: number;
  pendingHrCount: number;
  approvedCount: number;
  returnedCount: number;
}

interface AdminDashboardResponse {
  summary: AdminDashboardSummary;
  recentRequests: RequestItem[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  const response = await fetch("http://localhost:3000/api/admin/dashboard");

  if (!response.ok) {
    throw new Error("載入管理首頁資料失敗");
  }

  const result: ApiResponse<AdminDashboardResponse> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "載入管理首頁資料失敗");
  }

  const data = result.data;

  if (!data || !data.summary || !Array.isArray(data.recentRequests)) {
    throw new Error("管理首頁回傳資料格式錯誤");
  }

  return data;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });

  const handleGoToUsers = () => {
    navigate(APP_ROUTES.ADMIN_USERS);
  };

  const handleGoToManagerMapping = () => {
    navigate(APP_ROUTES.ADMIN_MANAGER_MAPPING);
  };

  return (
    <div>
      <PageHeader
        title={`你好，${currentUser?.name ?? "系統管理員"}`}
        description="以下為目前簽核系統的整體摘要與管理入口。"
        breadcrumbs={[
          { label: "首頁" },
          { label: "Dashboard" },
        ]}
      />

      {isLoading ? (
        <Card>
          <div
            style={{
              padding: "24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            管理首頁資料載入中...
          </div>
        </Card>
      ) : isError ? (
        <Card>
          <div
            style={{
              padding: "24px",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error instanceof Error ? error.message : "載入管理首頁失敗"}
          </div>
        </Card>
      ) : !data ? (
        <Card>
          <div
            style={{
              padding: "24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            查無管理首頁資料。
          </div>
        </Card>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <SummaryCard
              title="使用者總數"
              value={data.summary.usersCount}
              description="目前系統內啟用的使用者數量"
            />

            <SummaryCard
              title="部門總數"
              value={data.summary.departmentsCount}
              description="目前已建立的部門數量"
            />

            <SummaryCard
              title="主管關聯數"
              value={data.summary.managerMappingsCount}
              description="目前員工與主管的對應資料筆數"
            />

            <SummaryCard
              title="進行中案件"
              value={data.summary.activeRequestsCount}
              description="目前仍在簽核流程中的案件數量"
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <Card
              title="近期案件狀態摘要"
              subtitle="這裡顯示近期案件在不同流程階段的分布情況。"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                <MiniSummaryItem
                  label="待主管簽核"
                  value={data.summary.pendingManagerCount}
                />
                <MiniSummaryItem
                  label="待 HR 核定"
                  value={data.summary.pendingHrCount}
                />
                <MiniSummaryItem
                  label="已核准"
                  value={data.summary.approvedCount}
                />
                <MiniSummaryItem
                  label="已退回"
                  value={data.summary.returnedCount}
                />
              </div>
            </Card>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Card
              title="快速操作"
              subtitle="可快速進入常用的系統管理功能。"
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Button onClick={handleGoToUsers}>使用者管理</Button>
                <Button variant="secondary" onClick={handleGoToManagerMapping}>
                  主管關聯設定
                </Button>
              </div>
            </Card>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Card
              title="近期案件"
              subtitle="顯示最近幾筆案件，方便快速了解系統近期流動狀況。"
            >
              {data.recentRequests.length === 0 ? (
                <EmptyDashboardState />
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
                        <TableHeaderCell>單號</TableHeaderCell>
                        <TableHeaderCell>申請人</TableHeaderCell>
                        <TableHeaderCell>類型</TableHeaderCell>
                        <TableHeaderCell>標題</TableHeaderCell>
                        <TableHeaderCell>狀態</TableHeaderCell>
                        <TableHeaderCell>目前簽核人</TableHeaderCell>
                        <TableHeaderCell>最後更新</TableHeaderCell>
                      </tr>
                    </thead>

                    <tbody>
                      {data.recentRequests.map((request) => (
                        <tr key={request.id}>
                          <TableBodyCell>{request.requestNo}</TableBodyCell>
                          <TableBodyCell>{request.applicantName}</TableBodyCell>
                          <TableBodyCell>
                            {getRequestTypeLabel(request.requestType)}
                          </TableBodyCell>
                          <TableBodyCell>{request.title}</TableBodyCell>
                          <TableBodyCell>
                            <StatusBadge status={request.status} />
                          </TableBodyCell>
                          <TableBodyCell>
                            {request.currentApproverName ?? "—"}
                          </TableBodyCell>
                          <TableBodyCell>{request.updatedAt}</TableBodyCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
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

interface MiniSummaryItemProps {
  label: string;
  value: number;
}

function MiniSummaryItem({ label, value }: MiniSummaryItemProps) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyDashboardState() {
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
      目前尚無近期案件資料。
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

function getRequestTypeLabel(type: RequestItem["requestType"]): string {
  const labelMap: Record<RequestItem["requestType"], string> = {
    LEAVE: "請假",
    REIMBURSEMENT: "報銷",
    OVERTIME: "加班",
  };

  return labelMap[type];
}