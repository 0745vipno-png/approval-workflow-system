import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { APP_ROUTES } from "../../constants/routes";
import { REQUEST_STATUS } from "../../constants/requestStatus";
import type { RequestItem } from "../../types/request";

type RequestType = "LEAVE" | "REIMBURSEMENT" | "OVERTIME";

interface DetailResponse {
  data?: RequestItem;
  message?: string;
}

export function RequestEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [requestType, setRequestType] = useState<RequestType>("LEAVE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const requestId = id ?? "";

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `http://localhost:3000/api/requests/${requestId}`
      );

      const result = (await response.json()) as DetailResponse;

      if (!response.ok || !result.data) {
        throw new Error(result.message || "載入案件失敗");
      }

      const item = result.data;

    const isEditable =
    item.status === REQUEST_STATUS.DRAFT ||
    item.status === REQUEST_STATUS.RETURNED_BY_MANAGER ||
    item.status === REQUEST_STATUS.RETURNED_BY_HR;

    if (!isEditable) {
        throw new Error("此案件目前不可編輯");
}

      setRequestType(item.requestType as RequestType);
      setTitle(item.title);
      setContent(item.content);
      setStartDate(item.startDate ?? "");
      setEndDate(item.endDate ?? "");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "載入案件失敗"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchDetail();
    }
  }, [requestId]);

  const buildPayload = () => ({
    requestType,
    title,
    content,
    startDate: startDate || null,
    endDate: endDate || null,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await fetch(
        `http://localhost:3000/api/requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload()),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "更新失敗");
      }

      navigate(`${APP_ROUTES.REQUEST_LIST}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "更新失敗"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const updateResponse = await fetch(
        `http://localhost:3000/api/requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload()),
        }
      );

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateResult.message || "更新失敗");
      }

      const submitResponse = await fetch(
        `http://localhost:3000/api/requests/${requestId}/resubmit`,
        {
          method: "PATCH",
        }
      );

      const submitResult = await submitResponse.json();

      if (!submitResponse.ok) {
        throw new Error(submitResult.message || "重新送出失敗");
      }

      navigate(APP_ROUTES.REQUEST_DETAIL.replace(":id", requestId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "重新送出失敗"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(APP_ROUTES.REQUEST_LIST);
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="編輯申請"
          description="載入案件資料中..."
          breadcrumbs={[
            { label: "首頁" },
            { label: "我的申請" },
            { label: "編輯申請" },
          ]}
        />

        <Card>
          <div style={{ padding: "24px" }}>載入中...</div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="編輯申請"
        description="可修改退回案件或草稿內容，並重新送出。"
        breadcrumbs={[
          { label: "首頁" },
          { label: "我的申請" },
          { label: "編輯申請" },
        ]}
        actions={
          <Button variant="secondary" onClick={handleBack}>
            返回列表
          </Button>
        }
      />

      <Card title="申請資料">
        <div style={gridStyle}>
          <FormSelect
            label="申請類型"
            value={requestType}
            onChange={(value) => setRequestType(value as RequestType)}
            options={[
              { label: "請假", value: "LEAVE" },
              { label: "報銷", value: "REIMBURSEMENT" },
              { label: "加班", value: "OVERTIME" },
            ]}
          />

          <Input
            label="申請標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入申請標題"
          />

          <Input
            label="開始日期"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="結束日期"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <Textarea
            label="申請內容"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="請輸入申請說明"
          />
        </div>

        {errorMessage ? (
          <div style={errorStyle}>{errorMessage}</div>
        ) : null}

        <div style={actionStyle}>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? "儲存中..." : "儲存修改"}
          </Button>

          <Button
            onClick={handleResubmit}
            disabled={isSaving || isSubmitting}
          >
            {isSubmitting ? "送出中..." : "重新送出"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: FormSelectProps) {
  return (
    <div style={{ display: "grid", gap: "6px" }}>
      <label style={labelStyle}>{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  padding: "0 12px",
  backgroundColor: "#ffffff",
  fontSize: "14px",
};

const actionStyle: React.CSSProperties = {
  marginTop: "20px",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const errorStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "10px 12px",
  borderRadius: "10px",
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontSize: "14px",
};