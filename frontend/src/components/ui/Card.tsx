import type { CSSProperties, ReactNode } from "react";

/**
 * CardProps：
 * Card 元件接收的參數。
 *
 * children：
 * - 卡片裡真正要顯示的內容
 *
 * title：
 * - 可選
 * - 如果有傳，就顯示卡片標題
 *
 * subtitle：
 * - 可選
 * - 顯示在標題下方的補充文字
 *
 * action：
 * - 可選
 * - 通常放右上角按鈕，例如「查看更多」
 *
 * style：
 * - 可選
 * - 讓你可以從外部再補一些自訂樣式
 */
interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

/**
 * Card：
 * 共用卡片元件。
 *
 * 很適合用在：
 * - Dashboard 統計區塊
 * - 表單外框
 * - 詳情頁資訊區塊
 * - 歷程區塊
 *
 * 設計想法：
 * - 預設有白底、圓角、淡陰影
 * - 讓頁面看起來比較像正式系統
 */
export function Card({
  children,
  title,
  subtitle,
  action,
  style,
}: CardProps) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
        ...style,
      }}
    >
      {/* 如果有 title / subtitle / action，才顯示 Header 區塊 */}
      {(title || subtitle || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* 右上角操作區，例如按鈕 */}
          {action && <div>{action}</div>}
        </div>
      )}

      {/* 卡片主要內容 */}
      <div>{children}</div>
    </section>
  );
}