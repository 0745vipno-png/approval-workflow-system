import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { REQUEST_STATUS } from "../../constants/requestStatus";
import type { RequestStatus } from "../../constants/requestStatus";
import type { RequestItem, RequestType } from "../../types/request";
import { APP_ROUTES } from "../../constants/routes";
import { useUiStore } from "../../store/ui.store";
import { t } from "../../lib/i18n";

async function fetchRequests(): Promise<RequestItem[]> {
  const response = await fetch("http://localhost:3000/api/requests");

  if (!response.ok) {
    throw new Error("Failed to fetch requests");
  }

  const result = await response.json();
  const requestList = Array.isArray(result) ? result : result.data;

  if (!Array.isArray(requestList)) {
    throw new Error("Invalid response format");
  }

  return requestList;
}

export function RequestListPage() {
  const navigate = useNavigate();
  const language = useUiStore((state) => state.language);

  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "">("");
  const [selectedType, setSelectedType] = useState<RequestType | "">("");

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const normalizedKeyword = keyword.trim().toLowerCase();

      const matchesKeyword =
        !normalizedKeyword ||
        request.requestNo.toLowerCase().includes(normalizedKeyword) ||
        request.title.toLowerCase().includes(normalizedKeyword) ||
        request.content.toLowerCase().includes(normalizedKeyword);

      const matchesStatus =
        !selectedStatus || request.status === selectedStatus;

      const matchesType =
        !selectedType || request.requestType === selectedType;

      return matchesKeyword && matchesStatus && matchesType;
    });
  }, [requests, keyword, selectedStatus, selectedType]);

  const handleNavigateToCreate = () => {
    navigate(APP_ROUTES.REQUEST_CREATE);
  };

  const handleViewDetail = (requestId: number) => {
    navigate(APP_ROUTES.REQUEST_DETAIL.replace(":id", String(requestId)));
  };

  const handleEdit = (requestId: number) => {
    navigate(APP_ROUTES.REQUEST_EDIT.replace(":id", String(requestId)));
  };

  return (
    <div>
      <PageHeader
        title={t(language, "requestList.title")}
        description={t(language, "requestList.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "requestList.title") },
        ]}
        actions={
          <Button onClick={handleNavigateToCreate}>
            {t(language, "requestList.createButton")}
          </Button>
        }
      />

      <Card
        title={t(language, "requestList.filterTitle")}
        subtitle={t(language, "requestList.filterSubtitle")}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Input
            label={t(language, "requestList.keywordLabel")}
            placeholder={t(language, "requestList.keywordPlaceholder")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <FormSelect
            label={t(language, "common.status")}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as RequestStatus | "")}
            options={[
              { label: t(language, "common.all"), value: "" },
              {
                label: t(language, "status.DRAFT"),
                value: REQUEST_STATUS.DRAFT,
              },
              {
                label: t(language, "status.PENDING_MANAGER"),
                value: REQUEST_STATUS.PENDING_MANAGER,
              },
              {
                label: t(language, "status.RETURNED_BY_MANAGER"),
                value: REQUEST_STATUS.RETURNED_BY_MANAGER,
              },
              {
                label: t(language, "status.PENDING_HR"),
                value: REQUEST_STATUS.PENDING_HR,
              },
              {
                label: t(language, "status.RETURNED_BY_HR"),
                value: REQUEST_STATUS.RETURNED_BY_HR,
              },
              {
                label: t(language, "status.APPROVED"),
                value: REQUEST_STATUS.APPROVED,
              },
              {
                label: t(language, "status.CANCELLED"),
                value: REQUEST_STATUS.CANCELLED,
              },
            ]}
          />

          <FormSelect
            label={t(language, "common.requestType")}
            value={selectedType}
            onChange={(value) => setSelectedType(value as RequestType | "")}
            options={[
              { label: t(language, "common.all"), value: "" },
              { label: t(language, "requestType.LEAVE"), value: "LEAVE" },
              {
                label: t(language, "requestType.REIMBURSEMENT"),
                value: "REIMBURSEMENT",
              },
              { label: t(language, "requestType.OVERTIME"), value: "OVERTIME" },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "requestList.tableTitle")}
          subtitle={
            isLoading
              ? t(language, "common.loading")
              : t(language, "requestList.resultCount").replace(
                  "{filteredRequests.length}",
                  String(filteredRequests.length)
                )
          }
        >
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              message={
                error instanceof Error
                  ? error.message
                  : t(language, "requestList.loadError")
              }
            />
          ) : filteredRequests.length === 0 ? (
            <EmptyListState />
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
                    <TableHeaderCell>{t(language, "common.title")}</TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.startDate")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.endDate")}
                    </TableHeaderCell>
                    <TableHeaderCell>{t(language, "common.status")}</TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "requestList.currentApprover")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.updatedAt")}
                    </TableHeaderCell>
                    <TableHeaderCell>{t(language, "common.actions")}</TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => {
                    const canEdit =
                      request.status === REQUEST_STATUS.DRAFT ||
                      request.status === REQUEST_STATUS.RETURNED_BY_MANAGER ||
                      request.status === REQUEST_STATUS.RETURNED_BY_HR;

                    return (
                      <tr key={request.id}>
                        <TableBodyCell>{request.requestNo}</TableBodyCell>
                        <TableBodyCell>
                          {getRequestTypeLabel(language, request.requestType)}
                        </TableBodyCell>
                        <TableBodyCell>{request.title}</TableBodyCell>
                        <TableBodyCell>{request.startDate ?? t(language, "common.notAvailable")}</TableBodyCell>
                        <TableBodyCell>{request.endDate ?? t(language, "common.notAvailable")}</TableBodyCell>
                        <TableBodyCell>
                          <StatusBadge status={request.status} />
                        </TableBodyCell>
                        <TableBodyCell>
                          {request.currentApproverName ?? t(language, "common.notAvailable")}
                        </TableBodyCell>
                        <TableBodyCell>{request.updatedAt}</TableBodyCell>
                        <TableBodyCell>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              variant="secondary"
                              onClick={() => handleViewDetail(request.id)}
                            >
                              {t(language, "common.view")}
                            </Button>

                            {canEdit ? (
                              <Button
                                variant="secondary"
                                onClick={() => handleEdit(request.id)}
                              >
                                {t(language, "common.edit")}
                              </Button>
                            ) : null}
                          </div>
                        </TableBodyCell>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function getRequestTypeLabel(
  language: "zh-TW" | "en",
  type: RequestType
): string {
  const labelMap: Record<RequestType, string> = {
    LEAVE: t(language, "requestType.LEAVE"),
    REIMBURSEMENT: t(language, "requestType.REIMBURSEMENT"),
    OVERTIME: t(language, "requestType.OVERTIME"),
  };

  return labelMap[type];
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

function EmptyListState() {
  const language = useUiStore((state) => state.language);

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
      {t(language, "requestList.empty")}
    </div>
  );
}

function LoadingState() {
  const language = useUiStore((state) => state.language);

  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      {t(language, "requestList.loading")}
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