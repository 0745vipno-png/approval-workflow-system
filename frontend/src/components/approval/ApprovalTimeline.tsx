import type { ApprovalTimelineItem } from "../../types/approval";
import { STATUS_LABEL_MAP } from "../../constants/requestStatus";

/**
 * ApprovalTimelineProps：
 * timeline 元件接收的資料。
 *
 * items：
 * - 一串歷程紀錄
 * - 通常會依時間排序後再丟進來
 */
interface ApprovalTimelineProps {
  items: ApprovalTimelineItem[];
}

/**
 * getTimelineDotColor：
 * 根據狀態決定時間軸小圓點顏色。
 *
 * 這樣不同類型事件可以更直覺：
 * - approved -> 綠
 * - rejected -> 紅
 * - returned -> 橘
 * - pending -> 黃/藍
 */
function getTimelineDotColor(status: ApprovalTimelineItem["toStatus"]) {
  switch (status) {
    case "APPROVED":
      return "#16a34a";
    case "REJECTED_BY_MANAGER":
    case "REJECTED_BY_HR":
      return "#dc2626";
    case "RETURNED_BY_MANAGER":
    case "RETURNED_BY_HR":
      return "#ea580c";
    case "PENDING_MANAGER":
    case "PENDING_HR":
      return "#2563eb";
    case "CANCELLED":
      return "#6b7280";
    case "DRAFT":
    default:
      return "#9ca3af";
  }
}

/**
 * ApprovalTimeline：
 * 用垂直時間軸顯示案件歷程。
 *
 * 很適合用在：
 * - 申請詳情頁
 * - 簽核詳情頁
 *
 * 顯示內容通常包含：
 * - 發生什麼事
 * - 誰做的
 * - 何時做的
 * - 簽核意見
 */
export function ApprovalTimeline({ items }: ApprovalTimelineProps) {
  // 若沒有資料，顯示空狀態
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px dashed #d1d5db",
          borderRadius: "8px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        目前尚無簽核歷程。
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
      }}
    >
      {items.map((item, index) => {
        const dotColor = getTimelineDotColor(item.toStatus);
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr",
              gap: "12px",
              alignItems: "start",
            }}
          >
            {/* 左側：點與線 */}
            <div
              style={{
                display: "grid",
                justifyItems: "center",
              }}
            >
              {/* 小圓點 */}
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "999px",
                  backgroundColor: dotColor,
                  marginTop: "6px",
                }}
              />

              {/* 連接線：最後一筆不畫 */}
              {!isLast && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    minHeight: "48px",
                    backgroundColor: "#e5e7eb",
                    marginTop: "6px",
                  }}
                />
              )}
            </div>

            {/* 右側：內容 */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "14px 16px",
              }}
            >
              {/* 第一行：事件標題 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  {item.actionTime}
                </div>
              </div>

              {/* 第二行：操作者資訊 */}
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  color: "#4b5563",
                }}
              >
                {item.actorName}（{item.actorRole}）
              </div>

              {/* 第三行：狀態 */}
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  color: "#374151",
                }}
              >
                狀態：{STATUS_LABEL_MAP[item.toStatus]}
              </div>

              {/* 第四行：簽核意見 */}
              {item.comment && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f3f4f6",
                    fontSize: "13px",
                    color: "#374151",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>意見：</strong>
                  {item.comment}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}