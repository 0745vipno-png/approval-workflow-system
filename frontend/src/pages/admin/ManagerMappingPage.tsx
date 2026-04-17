import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface ManagerMappingItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeNo: string;
  departmentId?: number;
  departmentName: string;
  managerId: number;
  managerName: string;
  managerNo: string;
  effectiveStart: string;
  effectiveEnd?: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface FetchManagerMappingsParams {
  keyword: string;
  status: "ACTIVE" | "INACTIVE" | "";
}

interface CreateManagerMappingPayload {
  employeeId: number;
  employeeName: string;
  employeeNo: string;
  departmentId: number;
  departmentName: string;
  managerId: number;
  managerName: string;
  managerNo: string;
  effectiveStart: string;
  effectiveEnd?: string | null;
  status: "ACTIVE" | "INACTIVE";
}

async function fetchManagerMappings(
  params: FetchManagerMappingsParams
): Promise<ManagerMappingItem[]> {
  const searchParams = new URLSearchParams();

  if (params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `http://localhost:3000/api/admin/manager-mappings?${queryString}`
    : "http://localhost:3000/api/admin/manager-mappings";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("載入主管關聯資料失敗");
  }

  const result: ApiResponse<ManagerMappingItem[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "載入主管關聯資料失敗");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("主管關聯資料格式錯誤");
  }

  return result.data;
}

async function createManagerMapping(
  payload: CreateManagerMappingPayload
): Promise<ManagerMappingItem> {
  const response = await fetch("http://localhost:3000/api/admin/manager-mappings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<ManagerMappingItem> = await response.json().catch(
    () => ({
      success: false,
      message: "新增主管關聯失敗",
      data: {} as ManagerMappingItem,
    })
  );

  if (!response.ok || !result.success) {
    throw new Error(result.message || "新增主管關聯失敗");
  }

  return result.data;
}

export function ManagerMappingPage() {
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "ACTIVE" | "INACTIVE" | ""
  >("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formValues, setFormValues] = useState<CreateManagerMappingPayload>({
    employeeId: 0,
    employeeName: "",
    employeeNo: "",
    departmentId: 0,
    departmentName: "",
    managerId: 0,
    managerName: "",
    managerNo: "",
    effectiveStart: "",
    effectiveEnd: "",
    status: "ACTIVE",
  });

  const {
    data: mappings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-manager-mappings", keyword, selectedStatus],
    queryFn: () =>
      fetchManagerMappings({
        keyword,
        status: selectedStatus,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createManagerMapping,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-manager-mappings"],
      });

      setFormValues({
        employeeId: 0,
        employeeName: "",
        employeeNo: "",
        departmentId: 0,
        departmentName: "",
        managerId: 0,
        managerName: "",
        managerNo: "",
        effectiveStart: "",
        effectiveEnd: "",
        status: "ACTIVE",
      });

      setShowCreateForm(false);
      alert("主管關聯新增成功。");
    },
  });

  const handleCreate = () => {
    setShowCreateForm((prev) => !prev);
  };

  const handleEdit = (mappingId: number) => {
    alert(`目前尚未串接編輯主管關聯功能，關聯 ID = ${mappingId}`);
  };

  const handleSubmitCreate = async () => {
    try {
      await createMutation.mutateAsync({
        ...formValues,
        effectiveEnd: formValues.effectiveEnd?.trim()
          ? formValues.effectiveEnd
          : null,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "新增主管關聯失敗");
    }
  };

  return (
    <div>
      <PageHeader
        title="主管關聯設定"
        description="維護員工與直屬主管的對應關係，作為簽核流程自動指派依據。"
        breadcrumbs={[
          { label: "首頁" },
          { label: "系統管理" },
          { label: "主管關聯設定" },
        ]}
        actions={
          <Button onClick={handleCreate}>
            {showCreateForm ? "收合表單" : "+ 新增關聯"}
          </Button>
        }
      />

      {showCreateForm ? (
        <div style={{ marginBottom: "16px" }}>
          <Card
            title="新增主管關聯"
            subtitle="請輸入員工、主管、部門與生效資訊。"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <Input
                label="員工 ID"
                type="number"
                value={String(formValues.employeeId || "")}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    employeeId: Number(e.target.value || 0),
                  }))
                }
              />

              <Input
                label="員工姓名"
                value={formValues.employeeName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    employeeName: e.target.value,
                  }))
                }
              />

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
                label="部門 ID"
                type="number"
                value={String(formValues.departmentId || "")}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    departmentId: Number(e.target.value || 0),
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
                value={String(formValues.managerId || "")}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    managerId: Number(e.target.value || 0),
                  }))
                }
              />

              <Input
                label="主管姓名"
                value={formValues.managerName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    managerName: e.target.value,
                  }))
                }
              />

              <Input
                label="主管編號"
                value={formValues.managerNo}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    managerNo: e.target.value,
                  }))
                }
              />

              <Input
                label="生效起日"
                type="date"
                value={formValues.effectiveStart}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    effectiveStart: e.target.value,
                  }))
                }
              />

              <Input
                label="生效迄日"
                type="date"
                value={formValues.effectiveEnd ?? ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    effectiveEnd: e.target.value,
                  }))
                }
              />

              <FormSelect
                label="狀態"
                value={formValues.status}
                onChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    status: value as "ACTIVE" | "INACTIVE",
                  }))
                }
                options={[
                  { label: "啟用中", value: "ACTIVE" },
                  { label: "已停用", value: "INACTIVE" },
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
        subtitle="可依員工、主管、部門或狀態篩選主管關聯資料。"
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
            placeholder="輸入員工姓名、工號、主管姓名、主管工號或部門"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <FormSelect
            label="關聯狀態"
            value={selectedStatus}
            onChange={(value) =>
              setSelectedStatus(value as "ACTIVE" | "INACTIVE" | "")
            }
            options={[
              { label: "全部", value: "" },
              { label: "啟用中", value: "ACTIVE" },
              { label: "已停用", value: "INACTIVE" },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card
          title="主管關聯列表"
          subtitle={
            isLoading ? "資料載入中..." : `共找到 ${mappings.length} 筆資料`
          }
        >
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              message={
                error instanceof Error
                  ? error.message
                  : "載入主管關聯資料失敗。"
              }
            />
          ) : mappings.length === 0 ? (
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
                    <TableHeaderCell>員工姓名</TableHeaderCell>
                    <TableHeaderCell>員工編號</TableHeaderCell>
                    <TableHeaderCell>部門</TableHeaderCell>
                    <TableHeaderCell>主管姓名</TableHeaderCell>
                    <TableHeaderCell>主管編號</TableHeaderCell>
                    <TableHeaderCell>生效起日</TableHeaderCell>
                    <TableHeaderCell>生效迄日</TableHeaderCell>
                    <TableHeaderCell>狀態</TableHeaderCell>
                    <TableHeaderCell>操作</TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {mappings.map((item) => (
                    <tr key={item.id}>
                      <TableBodyCell>{item.employeeName}</TableBodyCell>
                      <TableBodyCell>{item.employeeNo}</TableBodyCell>
                      <TableBodyCell>{item.departmentName}</TableBodyCell>
                      <TableBodyCell>{item.managerName}</TableBodyCell>
                      <TableBodyCell>{item.managerNo}</TableBodyCell>
                      <TableBodyCell>{item.effectiveStart}</TableBodyCell>
                      <TableBodyCell>{item.effectiveEnd ?? "—"}</TableBodyCell>
                      <TableBodyCell>
                        <StatusPill status={item.status} />
                      </TableBodyCell>
                      <TableBodyCell>
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(item.id)}
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

interface StatusPillProps {
  status: "ACTIVE" | "INACTIVE";
}

function StatusPill({ status }: StatusPillProps) {
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
      {isActive ? "啟用中" : "已停用"}
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
      查無符合條件的主管關聯資料。
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
      主管關聯資料載入中...
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