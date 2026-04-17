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

interface UserManagementItem {
  id: number;
  employeeNo: string;
  name: string;
  email: string;
  departmentId?: number | null;
  departmentName: string | null;
  roles: string[];
  accountStatus: "ACTIVE" | "INACTIVE" | "LOCKED";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface FetchAdminUsersParams {
  keyword: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED" | "";
  role: string;
}

interface CreateAdminUserPayload {
  employeeNo: string;
  name: string;
  email: string;
  departmentId?: number | null;
  departmentName?: string | null;
  roles: string[];
  accountStatus: "ACTIVE" | "INACTIVE" | "LOCKED";
}

async function fetchAdminUsers(
  params: FetchAdminUsersParams
): Promise<UserManagementItem[]> {
  const searchParams = new URLSearchParams();

  if (params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `http://localhost:3000/api/admin/users?${queryString}`
    : "http://localhost:3000/api/admin/users";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("載入使用者資料失敗");
  }

  const result: ApiResponse<UserManagementItem[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "載入使用者資料失敗");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("使用者資料格式錯誤");
  }

  return result.data;
}

async function createAdminUser(
  payload: CreateAdminUserPayload
): Promise<UserManagementItem> {
  const response = await fetch("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<UserManagementItem> = await response.json().catch(
    () => ({
      success: false,
      message: "新增使用者失敗",
      data: {} as UserManagementItem,
    })
  );

  if (!response.ok || !result.success) {
    throw new Error(result.message || "新增使用者失敗");
  }

  return result.data;
}

export function UserManagementPage() {
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "ACTIVE" | "INACTIVE" | "LOCKED" | ""
  >("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formValues, setFormValues] = useState<CreateAdminUserPayload>({
    employeeNo: "",
    name: "",
    email: "",
    departmentId: null,
    departmentName: "",
    roles: [ROLES.REQUESTER],
    accountStatus: "ACTIVE",
  });

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-users", keyword, selectedStatus, selectedRole],
    queryFn: () =>
      fetchAdminUsers({
        keyword,
        status: selectedStatus,
        role: selectedRole,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      setFormValues({
        employeeNo: "",
        name: "",
        email: "",
        departmentId: null,
        departmentName: "",
        roles: [ROLES.REQUESTER],
        accountStatus: "ACTIVE",
      });

      setShowCreateForm(false);
      alert("使用者新增成功。");
    },
  });

  const handleCreate = () => {
    setShowCreateForm((prev) => !prev);
  };

  const handleEdit = (userId: number) => {
    alert(`目前尚未串接編輯使用者功能，使用者 ID = ${userId}`);
  };

  const handleSubmitCreate = async () => {
    try {
      await createMutation.mutateAsync({
        ...formValues,
        departmentName: formValues.departmentName?.trim()
          ? formValues.departmentName
          : null,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "新增使用者失敗");
    }
  };

  return (
    <div>
      <PageHeader
        title="使用者管理"
        description="維護系統使用者帳號、部門、角色與帳號狀態。"
        breadcrumbs={[
          { label: "首頁" },
          { label: "系統管理" },
          { label: "使用者管理" },
        ]}
        actions={
          <Button onClick={handleCreate}>
            {showCreateForm ? "收合表單" : "+ 新增使用者"}
          </Button>
        }
      />

      {showCreateForm ? (
        <div style={{ marginBottom: "16px" }}>
          <Card
            title="新增使用者"
            subtitle="請輸入基本帳號資訊、部門與角色。"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <Input
                label="員工編號"
                value={formValues.employeeNo}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    employeeNo: e.target.value,
                  }))
                }
              />

              <Input
                label="姓名"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />

              <Input
                label="Email"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />

              <Input
                label="部門 ID"
                type="number"
                value={formValues.departmentId ? String(formValues.departmentId) : ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    departmentId: Number(e.target.value || 0) || null,
                  }))
                }
              />

              <Input
                label="部門名稱"
                value={formValues.departmentName ?? ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    departmentName: e.target.value,
                  }))
                }
              />

              <FormSelect
                label="角色"
                value={formValues.roles[0]}
                onChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    roles: [value],
                  }))
                }
                options={[
                  { label: "Requester", value: ROLES.REQUESTER },
                  { label: "Manager", value: ROLES.MANAGER },
                  { label: "HR", value: ROLES.HR },
                  { label: "Admin", value: ROLES.ADMIN },
                ]}
              />

              <FormSelect
                label="帳號狀態"
                value={formValues.accountStatus}
                onChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    accountStatus: value as "ACTIVE" | "INACTIVE" | "LOCKED",
                  }))
                }
                options={[
                  { label: "啟用中", value: "ACTIVE" },
                  { label: "停用", value: "INACTIVE" },
                  { label: "鎖定", value: "LOCKED" },
                ]}
              />
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={handleSubmitCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "新增中..." : "確認新增"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={createMutation.isPending}
              >
                取消
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <Card
        title="查詢條件"
        subtitle="可依姓名、工號、Email、部門、帳號狀態與角色篩選。"
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
            label="帳號狀態"
            value={selectedStatus}
            onChange={(value) =>
              setSelectedStatus(value as "ACTIVE" | "INACTIVE" | "LOCKED" | "")
            }
            options={[
              { label: "全部", value: "" },
              { label: "啟用中", value: "ACTIVE" },
              { label: "停用", value: "INACTIVE" },
              { label: "鎖定", value: "LOCKED" },
            ]}
          />

          <FormSelect
            label="角色"
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
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
          title="使用者列表"
          subtitle={isLoading ? "資料載入中..." : `共找到 ${users.length} 筆資料`}
        >
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              message={
                error instanceof Error
                  ? error.message
                  : "載入使用者資料失敗。"
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
                    <TableHeaderCell>角色</TableHeaderCell>
                    <TableHeaderCell>帳號狀態</TableHeaderCell>
                    <TableHeaderCell>建立時間</TableHeaderCell>
                    <TableHeaderCell>最後更新</TableHeaderCell>
                    <TableHeaderCell>操作</TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <TableBodyCell>{user.name}</TableBodyCell>
                      <TableBodyCell>{user.employeeNo}</TableBodyCell>
                      <TableBodyCell>{user.email}</TableBodyCell>
                      <TableBodyCell>{user.departmentName ?? "—"}</TableBodyCell>
                      <TableBodyCell>
                        <RoleGroup roles={user.roles} />
                      </TableBodyCell>
                      <TableBodyCell>
                        <AccountStatusPill status={user.accountStatus} />
                      </TableBodyCell>
                      <TableBodyCell>{user.createdAt}</TableBodyCell>
                      <TableBodyCell>{user.updatedAt}</TableBodyCell>
                      <TableBodyCell>
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(user.id)}
                        >
                          編輯
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
  roles: string[];
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

interface AccountStatusPillProps {
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
}

function AccountStatusPill({ status }: AccountStatusPillProps) {
  const styleMap: Record<
    AccountStatusPillProps["status"],
    { label: string; backgroundColor: string; color: string }
  > = {
    ACTIVE: {
      label: "啟用中",
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    INACTIVE: {
      label: "停用",
      backgroundColor: "#e5e7eb",
      color: "#4b5563",
    },
    LOCKED: {
      label: "鎖定",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
  };

  const config = styleMap[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        backgroundColor: config.backgroundColor,
        color: config.color,
      }}
    >
      {config.label}
    </span>
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
      查無符合條件的使用者資料。
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
      使用者資料載入中...
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