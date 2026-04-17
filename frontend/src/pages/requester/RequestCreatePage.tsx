import { useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import type { RequestFormValues, RequestType } from "../../types/request";
import { useUiStore } from "../../store/ui.store";
import { t } from "../../lib/i18n";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILE_COUNT = 5;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

type RequestMode = "draft" | "submit";

export function RequestCreatePage() {
  const navigate = useNavigate();
  const language = useUiStore((state) => state.language);

  const [formValues, setFormValues] = useState<RequestFormValues>({
    requestType: "LEAVE",
    title: "",
    content: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RequestFormValues, string>>
  >({});

  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof RequestFormValues>(
    field: K,
    value: RequestFormValues[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RequestFormValues, string>> = {};

    if (!formValues.title.trim()) {
      newErrors.title = t(language, "requestCreate.validation.titleRequired");
    }

    if (!formValues.content.trim()) {
      newErrors.content = t(language, "requestCreate.validation.contentRequired");
    }

    if (
      formValues.startDate &&
      formValues.endDate &&
      formValues.startDate > formValues.endDate
    ) {
      newErrors.endDate = t(language, "requestCreate.validation.endDateInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    setAttachmentError("");

    const totalCount = attachments.length + selectedFiles.length;
    if (totalCount > MAX_FILE_COUNT) {
    setAttachmentError(
    t(language, "requestCreate.attachment.maxCount", {
    count: MAX_FILE_COUNT,
    })
);
      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        file.size > MAX_FILE_SIZE_BYTES ||
        !ALLOWED_FILE_TYPES.includes(file.type)
    );

    if (invalidFile) {
      if (invalidFile.size > MAX_FILE_SIZE_BYTES) {
        setAttachmentError(
          t(language, "requestCreate.attachment.maxSize")
            .replace("{name}", invalidFile.name)
            .replace("{size}", String(MAX_FILE_SIZE_MB))
        );
      } else {
        setAttachmentError(
          t(language, "requestCreate.attachment.invalidType").replace(
            "{name}",
            invalidFile.name
          )
        );
      }

      event.target.value = "";
      return;
    }

    setAttachments((prev) => [...prev, ...selectedFiles]);
    event.target.value = "";
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const buildFormData = (mode: RequestMode) => {
    const formData = new FormData();

    formData.append("requestType", formValues.requestType);
    formData.append("title", formValues.title);
    formData.append("content", formValues.content);
    formData.append("mode", mode);

    if (formValues.startDate) {
      formData.append("startDate", formValues.startDate);
    }

    if (formValues.endDate) {
      formData.append("endDate", formValues.endDate);
    }

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    return formData;
  };

  const submitRequest = async (mode: RequestMode) => {
    const formData = buildFormData(mode);

    const response = await fetch("http://localhost:3000/api/requests", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Request submission failed");
    }

    return response.json();
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const result = await submitRequest("draft");
      console.log("儲存草稿成功：", result);
      alert(t(language, "requestCreate.toast.draftSaved"));
    } catch (error) {
      console.error("儲存草稿失敗：", error);
      alert(t(language, "requestCreate.toast.draftFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitRequest("submit");
      console.log("送出申請成功：", result);
      alert(t(language, "requestCreate.toast.submitSuccess"));
      navigate(-1);
    } catch (error) {
      console.error("送出申請失敗：", error);
      alert(t(language, "requestCreate.toast.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div>
      <PageHeader
        title={t(language, "requestCreate.title")}
        description={t(language, "requestCreate.description")}
        breadcrumbs={[
          { label: t(language, "common.home") },
          { label: t(language, "requestList.title") },
          { label: t(language, "requestCreate.title") },
        ]}
        actions={
          <Button variant="secondary" onClick={handleCancel}>
            {t(language, "common.back")}
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card
          title={t(language, "requestCreate.formTitle")}
          subtitle={t(language, "requestCreate.formSubtitle")}
        >
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <FormSection label={t(language, "common.requestTypeRequired")}>
              <select
                value={formValues.requestType}
                onChange={(e) =>
                  handleChange("requestType", e.target.value as RequestType)
                }
                style={selectStyle}
              >
                <option value="LEAVE">{t(language, "requestType.LEAVE")}</option>
                <option value="REIMBURSEMENT">
                  {t(language, "requestType.REIMBURSEMENT")}
                </option>
                <option value="OVERTIME">
                  {t(language, "requestType.OVERTIME")}
                </option>
              </select>
            </FormSection>

            <Input
              label={t(language, "common.titleRequired")}
              placeholder={t(language, "requestCreate.titlePlaceholder")}
              value={formValues.title}
              onChange={(e) => handleChange("title", e.target.value)}
              errorMessage={errors.title}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <Input
                label={t(language, "common.startDate")}
                type="date"
                value={formValues.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />

              <Input
                label={t(language, "common.endDate")}
                type="date"
                value={formValues.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                errorMessage={errors.endDate}
              />
            </div>

            <Textarea
              label={t(language, "common.contentRequired")}
              placeholder={t(language, "requestCreate.contentPlaceholder")}
              value={formValues.content}
              onChange={(e) => handleChange("content", e.target.value)}
              errorMessage={errors.content}
              rows={6}
            />

            <FormSection label={t(language, "requestCreate.attachment.title")}>
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                />

                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  {t(language, "requestCreate.attachment.description")
                    .replace("{size}", String(MAX_FILE_SIZE_MB))
                    .replace("{count}", String(MAX_FILE_COUNT))}
                </div>

                {attachmentError ? (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      backgroundColor: "#fef2f2",
                      color: "#b91c1c",
                      fontSize: "14px",
                      border: "1px solid #fecaca",
                    }}
                  >
                    {attachmentError}
                  </div>
                ) : null}

                {attachments.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                    }}
                  >
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#111827",
                              wordBreak: "break-all",
                            }}
                          >
                            {file.name}
                          </div>
                          <div
                            style={{
                              marginTop: "4px",
                              fontSize: "12px",
                              color: "#6b7280",
                            }}
                          >
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          {t(language, "common.remove")}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      border: "1px dashed #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#6b7280",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    {t(language, "requestCreate.attachment.empty")}
                  </div>
                )}
              </div>
            </FormSection>
          </div>
        </Card>

        <div style={{ marginTop: "16px" }}>
          <Card>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t(language, "common.processing")
                  : t(language, "common.saveDraft")}
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t(language, "common.processing")
                  : t(language, "common.submit")}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {t(language, "common.cancel")}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

interface FormSectionProps {
  label: string;
  children: ReactNode;
}

function FormSection({ label, children }: FormSectionProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "6px",
      }}
    >
      <label
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {label}
      </label>
      {children}
    </div>
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