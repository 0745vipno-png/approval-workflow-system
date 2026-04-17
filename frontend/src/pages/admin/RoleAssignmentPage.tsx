import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ROLES } from "../../constants/roles";

type RoleCode =
  | typeof ROLES.REQUESTER
  | typeof ROLES.MANAGER
  | typeof ROLES.HR
  | typeof ROLES.ADMIN;

interface RoleAssignmentItem {
  id: number;
  employeeNo: string;
  name: string;
  email: string;
  departmentName: string;
  roles: RoleCode[];
  accountStatus: "ACTIVE" | "INACTIVE" | "LOCKED";
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function fetchRoleAssignments(params: {
  keyword: string;
  role: string;
}): Promise<RoleAssignmentItem[]> {
  const searchParams = new URLSearchParams();

  if (params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (params.role.trim()) {
    searchParams.set("role", params.role.trim());
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `http://localhost:3000/api/admin/role-assignments?${queryString}`
    : "http://localhost:3000/api/admin/role-assignments";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("載入角色指派資料失敗");
  }

  const result: ApiResponse<RoleAssignmentItem[]> = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(result.message || "角色指派資料格式錯誤");
  }

  return result.data;
}

async function assignRole(userId: number, role: RoleCode) {
  const response = await fetch(
    `http://localhost:3000/api/admin/role-assignments/${userId}/roles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  const result = (await response.json().catch(() => null)) as ApiResponse<RoleAssignmentItem> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "角色指派失敗");
  }

  return result.data;
}

async function removeRole(userId: number, role: RoleCode) {
  const response = await fetch(
    `http://localhost:3000/api/admin/role-assignments/${userId}/roles/${role}`,
    {
      method: "DELETE",
    }
  );

  const result = (await response.json().catch(() => null)) as ApiResponse<RoleAssignmentItem> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "角色移除失敗");
  }

  return result.data;
}

export function RoleAssignmentPage() {
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleCode | "">("");

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-role-assignments", keyword, selectedRole],
    queryFn: () =>
      fetchRoleAssignments({
        keyword,
        role: selectedRole,
      }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: RoleCode }) =>
      assignRole(userId, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-role-assignments"],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: RoleCode }) =>
      removeRole(userId, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-role-assignments"],
      });
    },
  });

  const handleAssignRole = async (userId: number, role: RoleCode) => {
    try {
      await assignMutation.mutateAsync({ userId, role });
      alert(`角色 ${role} 指派成功`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "角色指派失敗");
    }
  };

  const handleRemoveRole = async (userId: number, role: RoleCode) => {
    try {
      await removeMutation.mutateAsync({ userId, role });
      alert(`角色 ${role} 移除成功`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "角色移除失敗");
    }
  };

  const isMutating = assignMutation.isPending || removeMutation.isPending;

  return (
    <div>
      <PageHeader
        title="角色指派"
        description="管理使用者的角色配置，決定其可使用的功能與權限範圍。"
        breadcrumbs={[
          { label: "首頁" },
          { label: "系統管理" },
          { label: "角色指派" },
        ]}
      />

      <Card
        title="查詢條件"
        subtitle="可依姓名、工號、Email、部門或角色篩選使用者。"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Input
            label="關鍵字搜尋"
            placeholder="輸入姓名、工號、Email 或部門"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <FormSelect
            label="角色篩選"
            value={selectedRole}
            onChange={(value) => setSelectedRole(value as RoleCode | "")}
            options={[
              { label: "全部", value: "" },
              { label: "Requester", value: ROLES.REQUESTER },
              { label: "Manager", value: ROLES.MANAGER },
              { label: "HR", value: ROLES.HR },
              { label: "Admin", value: ROLES.ADMIN },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card
          title="角色指派列表"
          subtitle={
            isLoading ? "資料載入中..." : `共找到 ${users.length} 筆資料`
          }
        >
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              message={
                error instanceof Error
                  ? error.message
                  : "載入角色指派資料失敗。"
              }
            />
          ) : users.length === 0 ? (
            <EmptyState />
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
                    <TableHeaderCell>姓名</TableHeaderCell>
                    <TableHeaderCell>員工編號</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>部門</TableHeaderCell>
                    <TableHeaderCell>目前角色</TableHeaderCell>
                    <TableHeaderCell>快速指派</TableHeaderCell>
                    <TableHeaderCell>快速移除</TableHeaderCell>
                    <TableHeaderCell>最後更新</TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <TableBodyCell>{user.name}</TableBodyCell>
                      <TableBodyCell>{user.employeeNo}</TableBodyCell>
                      <TableBodyCell>{user.email}</TableBodyCell>
                      <TableBodyCell>{user.departmentName}</TableBodyCell>
                      <TableBodyCell>
                        <RoleGroup roles={user.roles} />
                      </TableBodyCell>
                      <TableBodyCell>
                        <RoleActionGroup>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleAssignRole(user.id, ROLES.REQUESTER)
                            }
                            disabled={isMutating}
                          >
                            + Requester
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleAssignRole(user.id, ROLES.MANAGER)
                            }
                            disabled={isMutating}
                          >
                            + Manager
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleAssignRole(user.id, ROLES.HR)}
                            disabled={isMutating}
                          >
                            + HR
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleAssignRole(user.id, ROLES.ADMIN)
                            }
                            disabled={isMutating}
                          >
                            + Admin
                          </Button>
                        </RoleActionGroup>
                      </TableBodyCell>
                      <TableBodyCell>
                        <RoleActionGroup>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleRemoveRole(user.id, ROLES.REQUESTER)
                            }
                            disabled={isMutating}
                          >
                            - Requester
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleRemoveRole(user.id, ROLES.MANAGER)
                            }
                            disabled={isMutating}
                          >
                            - Manager
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveRole(user.id, ROLES.HR)}
                            disabled={isMutating}
                          >
                            - HR
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleRemoveRole(user.id, ROLES.ADMIN)
                            }
                            disabled={isMutating}
                          >
                            - Admin
                          </Button>
                        </RoleActionGroup>
                      </TableBodyCell>
                      <TableBodyCell>{user.updatedAt}</TableBodyCell>
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

interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  options: FormSelectOption[];
  onChange: (value: string) => void;
}

function FormSelect({ label, value, options, onChange }: FormSelectProps) {
  return (
    <div style={{ display: "grid", gap: "6px" }}>
      <label
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {options.map((option) => (
          <option key={`${option.label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface RoleGroupProps {
  roles: RoleCode[];
}

function RoleGroup({ roles }: RoleGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
      }}
    >
      {roles.map((role) => (
        <span
          key={role}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 700,
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
          }}
        >
          {role}
        </span>
      ))}
    </div>
  );
}

interface RoleActionGroupProps {
  children: ReactNode;
}

function RoleActionGroup({ children }: RoleActionGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

function EmptyState() {
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
      查無符合條件的角色指派資料。
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      角色指派資料載入中...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        color: "#b91c1c",
        fontSize: "14px",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        backgroundColor: "#fef2f2",
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

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  fontSize: "14px",
  outline: "none",
};