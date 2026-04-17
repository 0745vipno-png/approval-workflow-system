import { useMemo, useState, type ReactNode, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/approval/StatusBadge";
import { REQUEST_STATUS, type RequestStatus } from "../../constants/requestStatus";
import type { RequestItem, RequestType } from "../../types/request";
import { t } from "../../lib/i18n";
import { useUiStore } from "../../store/ui.store";

async function fetchRequests(): Promise<RequestItem[]> {
  const response = await fetch("http://localhost:3000/api/requests");

  if (!response.ok) {
    throw new Error("FETCH_PENDING_APPROVAL_REQUESTS_FAILED");
  }

  const result = await response.json();
  const requestList = Array.isArray(result) ? result : result.data;

  if (!Array.isArray(requestList)) {
    throw new Error("INVALID_RESPONSE_FORMAT");
  }

  return requestList;
}

export function PendingApprovalPage() {
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
    queryKey: ["manager-pending-requests"],
    queryFn: fetchRequests,
  });

  const pendingRequests = useMemo(() => {
    return requests.filter((request) => {
      return (
        request.status === REQUEST_STATUS.PENDING_MANAGER ||
        request.status === REQUEST_STATUS.RETURNED_BY_MANAGER ||
        request.status === REQUEST_STATUS.REJECTED_BY_MANAGER
      );
    });
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return pendingRequests.filter((request) => {
      const normalizedKeyword = keyword.trim().toLowerCase();

      const matchesKeyword =
        !normalizedKeyword ||
        request.requestNo.toLowerCase().includes(normalizedKeyword) ||
        request.applicantName.toLowerCase().includes(normalizedKeyword) ||
        request.title.toLowerCase().includes(normalizedKeyword) ||
        request.content.toLowerCase().includes(normalizedKeyword);

      const matchesStatus =
        !selectedStatus || request.status === selectedStatus;

      const matchesType =
        !selectedType || request.requestType === selectedType;

      return matchesKeyword && matchesStatus && matchesType;
    });
  }, [pendingRequests, keyword, selectedStatus, selectedType]);

  const handleViewDetail = (requestId: number) => {
    navigate(`/manager/approvals/${requestId}`);
  };

  const getErrorMessage = () => {
    if (!(error instanceof Error)) {
      return t(language, "pendingApproval.loadError");
    }

    switch (error.message) {
      case "FETCH_PENDING_APPROVAL_REQUESTS_FAILED":
        return t(language, "pendingApproval.fetchError");
      case "INVALID_RESPONSE_FORMAT":
        return t(language, "pendingApproval.invalidResponse");
      default:
        return t(language, "pendingApproval.loadError");
    }
  };

  return (
    <div>
      <PageHeader
        title={t(language, "pendingApproval.title")}
        description={t(language, "pendingApproval.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "pendingApproval.title") },
        ]}
      />

      <Card
        title={t(language, "pendingApproval.filterTitle")}
        subtitle={t(language, "pendingApproval.filterSubtitle")}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Input
            label={t(language, "pendingApproval.keywordLabel")}
            placeholder={t(language, "pendingApproval.keywordPlaceholder")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <FormSelect
            label={t(language, "common.status")}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as RequestStatus | "")}
            options={[
              {
                label: t(language, "common.all"),
                value: "",
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
                label: t(language, "status.REJECTED_BY_MANAGER"),
                value: REQUEST_STATUS.REJECTED_BY_MANAGER,
              },
            ]}
          />

          <FormSelect
            label={t(language, "common.requestType")}
            value={selectedType}
            onChange={(value) => setSelectedType(value as RequestType | "")}
            options={[
              {
                label: t(language, "common.all"),
                value: "",
              },
              {
                label: t(language, "requestType.LEAVE"),
                value: "LEAVE",
              },
              {
                label: t(language, "requestType.REIMBURSEMENT"),
                value: "REIMBURSEMENT",
              },
              {
                label: t(language, "requestType.OVERTIME"),
                value: "OVERTIME",
              },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: "16px" }}>
        <Card
          title={t(language, "pendingApproval.tableTitle")}
          subtitle={
            isLoading
              ? t(language, "pendingApproval.loading")
              : t(language, "pendingApproval.resultCount", {
                  count: filteredRequests.length,
                })
          }
        >
          {isLoading ? (
            <LoadingState message={t(language, "pendingApproval.loading")} />
          ) : isError ? (
            <ErrorState message={getErrorMessage()} />
          ) : filteredRequests.length === 0 ? (
            <EmptyListState message={t(language, "pendingApproval.empty")} />
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
                      {t(language, "pendingApproval.applicant")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.requestType")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.title")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.startDate")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.endDate")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.status")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "pendingApproval.submittedAt")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t(language, "common.actions")}
                    </TableHeaderCell>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <TableBodyCell>{request.requestNo}</TableBodyCell>
                      <TableBodyCell>{request.applicantName}</TableBodyCell>
                      <TableBodyCell>
                        {getRequestTypeLabel(language, request.requestType)}
                      </TableBodyCell>
                      <TableBodyCell>{request.title}</TableBodyCell>
                      <TableBodyCell>
                        {request.startDate ?? t(language, "common.notAvailable")}
                      </TableBodyCell>
                      <TableBodyCell>
                        {request.endDate ?? t(language, "common.notAvailable")}
                      </TableBodyCell>
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
                          {t(language, "pendingApproval.viewDetail")}
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

function getRequestTypeLabel(language: "zh-TW" | "en", type: RequestType): string {
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

function EmptyListState({ message }: { message: string }) {
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

function LoadingState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      {message}
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