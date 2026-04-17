import type { ReactNode } from "react";
/**
 * 現在先做最簡單版本，不一定會馬上用到。
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * PageHeaderProps：
 * 頁面標題列元件的參數。
 *
 * title：
 * - 頁面主標題
 *
 * description：
 * - 標題下方的補充說明
 *
 * actions：
 * - 右側操作區，例如新增按鈕、返回按鈕
 *
 * breadcrumbs：
 * - 可選
 * - 之後若想做更完整導覽可以用
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * PageHeader：
 * 共用頁面標題區。
 *
 * 很適合用在：
 * - 我的申請
 * - 新增申請
 * - 待簽核案件
 * - 使用者管理
 *
 * 好處：
 * - 每頁標題區長得一致
 * - 後面維護比較方便
 * - 介面看起來更完整
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "24px",
        display: "grid",
        gap: "12px",
      }}
    >
      {/* Breadcrumbs 目前先做簡單文字顯示 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div
          style={{
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`}>
              {item.label}
              {index < breadcrumbs.length - 1 && " / "}
            </span>
          ))}
        </div>
      )}

      {/* 標題主區塊 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* 右上角操作區 */}
        {actions && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}