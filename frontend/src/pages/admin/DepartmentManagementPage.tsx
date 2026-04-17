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

interface DepartmentItem {
  id: number;
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName: string | null;
  memberCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface FetchDepartmentsParams {
  keyword: string;
  status: "ACTIVE" | "INACTIVE" | "";
}

interface DepartmentFormPayload {
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName?: string | null;
  memberCount: number;
  status: "ACTIVE" | "INACTIVE";
}

async function fetchDepartments(
  params: FetchDepartmentsParams
): Promise<DepartmentItem[]> {
  const searchParams = new URLSearchParams();

  if (params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `http://localhost:3000/api/admin/departments?${queryString}`
    : "http://localhost:3000/api/admin/departments";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("載入部門資料失敗");
  }

  const result: ApiResponse<DepartmentItem[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "載入部門資料失敗");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("部門資料格式錯誤");
  }

  return result.data;
}

async function createDepartment(
  payload: DepartmentFormPayload
): Promise<DepartmentItem> {
  const response = await fetch("http://localhost:3000/api/admin/departments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();

  let result: ApiResponse<DepartmentItem>;

  try {
    result = JSON.parse(rawText) as ApiResponse<DepartmentItem>;
  } catch {
    throw new Error("新增部門失敗，後端未回傳有效 JSON");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "新增部門失敗");
  }

  return result.data;
}

async function updateDepartment(
  departmentId: number,
  payload: DepartmentFormPayload
): Promise<DepartmentItem> {
  const response = await fetch(
    `http://localhost:3000/api/admin/departments/${departmentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const rawText = await response.text();

  let result: ApiResponse<DepartmentItem>;

  try {
    result = JSON.parse(rawText) as ApiResponse<DepartmentItem>;
  } catch {
    throw new Error("更新部門失敗，後端未回傳有效 JSON");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "更新部門失敗");
  }

  return result.data;
}

export function DepartmentManagementPage() {
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "ACTIVE" | "INACTIVE" | ""
  >("");
  const [showForm, setShowForm] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(
    null
  );

  const [formValues, setFormValues] = useState<DepartmentFormPayload>({
    departmentCode: "",
    departmentName: "",
    managerId: null,
    managerName: "",
    memberCount: 0,
    status: "ACTIVE",
  });

  const {
    data: departments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-departments", keyword, selectedStatus],
    queryFn: () =>
      fetchDepartments({
        keyword,
        status: selectedStatus,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-departments"],
      });

      resetForm();
      setShowForm(false);
      alert("部門新增成功。");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      departmentId,
      payload,
    }: {
      departmentId: number;
      payload: DepartmentFormPayload;
    }) => updateDepartment(departmentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-departments"],
      });

      resetForm();
      setShowForm(false);
      alert("部門更新成功。");
    },
  });

  function resetForm() {
    setEditingDepartmentId(null);
    setFormValues({
      departmentCode: "",
      departmentName: "",
      managerId: null,
      managerName: "",
      memberCount: 0,
      status: "ACTIVE",
    });
  }

  const handleCreate = () => {
    if (showForm && editingDepartmentId === null) {
      setShowForm(false);
      resetForm();
      return;
    }

    resetForm();
    setShowForm(true);
  };

  const handleEdit = (departmentId: number) => {
    const targetDepartment = departments.find(
      (department) => department.id === departmentId
    );

    if (!targetDepartment) {
      alert("找不到要編輯的部門資料。");
      return;
    }

    setEditingDepartmentId(departmentId);
    setFormValues({
      departmentCode: targetDepartment.departmentCode,
      departmentName: targetDepartment.departmentName,
      managerId: targetDepartment.managerId ?? null,
      managerName: targetDepartment.managerName ?? "",
      memberCount: targetDepartment.memberCount,
      status: targetDepartment.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      const payload: DepartmentFormPayload = {
        ...formValues,
        managerName: formValues.managerName?.trim()
          ? formValues.managerName
          : null,
      };

      if (editingDepartmentId !== null) {
        await updateMutation.mutateAsync({
          departmentId: editingDepartmentId,
          payload,
        });
        return;
      }

      await createMutation.mutateAsync(payload);
    } catch (err) {
      alert(err instanceof Error ? err.message : "儲存部門失敗");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <PageHeader
        title="部門管理"
        description="維護系統中的部門資料，包含部門代碼、名稱、主管與啟用狀態。"
        breadcrumbs={[
          { label: "首頁" },
          { label: "系統管理" },
          { label: "部門管理" },
        ]}
        actions={
          <Button onClick={handleCreate}>
            {showForm && editingDepartmentId === null ? "收合表單" : "+ 新增部門"}
          </Button>
        }
      />

      {showForm ? (
        <div style={{ marginBottom: "16px" }}>
          <Card
            title={editingDepartmentId !== null ? "編輯部門" : "新增部門"}
            subtitle="請輸入部門基本資訊、主管與狀態。"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <Input
                label="部門代碼"
                value={formValues.departmentCode}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    departmentCode: e.target.value,
                  }))
                }
              />

              <Input
                label="部門名稱"
                value={formValues.departmentName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    departmentName: e.target.value,
                  }))
                }
              />

              <Input
                label="主管 ID"
                type="number"
                value={formValues.managerId ? String(formValues.managerId) : ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    managerId: Number(e.target.value || 0) || null,
                  }))
                }
              />

              <Input
                label="主管姓名"
                value={formValues.managerName ?? ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    managerName: e.target.value,
                  }))
                }
              />

              <Input
                label="部門人數"
                type="number"
                value={String(formValues.memberCount)}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    memberCount: Number(e.target.value || 0),
                  }))
                }
              />

              <FormSelect
                label="部門狀態"
                value={formValues.status}
                onChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    status: value as "ACTIVE" | "INACTIVE",
                  }))
                }
                options={[
                  { label: "啟用中", value: "ACTIVE" },
                  { label: "停用", value: "INACTIVE" },
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
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {createMutation.isPending
                  ? "新增中..."
                  : updateMutation.isPending
                  ? "更新中..."
                  : editingDepartmentId !== null
                  ? "確認更新"
                  : "確認新增"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                取消
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <Card
        title="查詢條件"
        subtitle="可依部門代碼、部門名稱、主管姓名與狀態進行篩選。"
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
            placeholder="輸入部門代碼、部門名稱或主管姓名"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <FormSelect
            label="部門狀態"
            value={selectedStatus}
            onChange={(value) =>
              setSelectedStatus(value as "ACTIVE" | "INACTIVE" | "")
            }
            options={[
              { label: "全部", value: "" },
              { label: "啟用中", value: "ACTIVE" },
              { label: "停用", value: "INACTIVE" },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card
          title="部門列表"
          subtitle={
            isLoading ? "資料載入中..." : `共找到 ${departments.length} 筆資料`
          }
        >
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              message={
                error instanceof Error
                  ? error.message
                  : "載入部門資料失敗。"
              }
            />
          ) : departments.length === 0 ? (
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
                    <TableHeaderCell>部門代碼</TableHeaderCell>
                    <TableHeaderCell>部門名稱</TableHeaderCell>
                    <TableHeaderCell>主管</TableHeaderCell>
                    <TableHeaderCell>人數</TableHeaderCell>
                    <TableHeaderCell>狀態</TableHeaderCell>
                    <TableHeaderCell>建立時間</TableHeaderCell>
                    <TableHeaderCell>最後更新</TableHeaderCell>
                    <TableHeaderCell>操作</TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {departments.map((department) => (
                    <tr key={department.id}>
                      <TableBodyCell>{department.departmentCode}</TableBodyCell>
                      <TableBodyCell>{department.departmentName}</TableBodyCell>
                      <TableBodyCell>{department.managerName ?? "—"}</TableBodyCell>
                      <TableBodyCell>{department.memberCount}</TableBodyCell>
                      <TableBodyCell>
                        <DepartmentStatusPill status={department.status} />
                      </TableBodyCell>
                      <TableBodyCell>{department.createdAt}</TableBodyCell>
                      <TableBodyCell>{department.updatedAt}</TableBodyCell>
                      <TableBodyCell>
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(department.id)}
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

interface DepartmentStatusPillProps {
  status: "ACTIVE" | "INACTIVE";
}

function DepartmentStatusPill({ status }: DepartmentStatusPillProps) {
  const isActive = status === "ACTIVE";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        backgroundColor: isActive ? "#dcfce7" : "#e5e7eb",
        color: isActive ? "#166534" : "#4b5563",
      }}
    >
      {isActive ? "啟用中" : "停用"}
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
      查無符合條件的部門資料。
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
      部門資料載入中...
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