import type { RequestStatus } from "../../types/request";
import { useUiStore } from "../../store/ui.store";
import { t, type TranslationKey } from "../../lib/i18n";

const STATUS_STYLE_MAP: Record<
  RequestStatus,
  { backgroundColor: string; color: string }
> = {
  DRAFT: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
  },
  PENDING_MANAGER: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  RETURNED_BY_MANAGER: {
    backgroundColor: "#fed7aa",
    color: "#9a3412",
  },
  REJECTED_BY_MANAGER: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
  },
  PENDING_HR: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  RETURNED_BY_HR: {
    backgroundColor: "#fde68a",
    color: "#92400e",
  },
  REJECTED_BY_HR: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
  },
  APPROVED: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  CANCELLED: {
    backgroundColor: "#e5e7eb",
    color: "#4b5563",
  },
};

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const language = useUiStore((state) => state.language);

  const config = STATUS_STYLE_MAP[status];
  const translationKey = `status.${status}` as TranslationKey;
  const label = t(language, translationKey);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "28px",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        backgroundColor: config.backgroundColor,
        color: config.color,
      }}
    >
      {label}
    </span>
  );
}