import type { ApprovalStepItem } from "../../types/approval";

/**
 * ApprovalStepperProps：
 * stepper 元件需要的資料。
 *
 * steps：
 * - 流程節點陣列
 * - 例如：
 *   申請人 -> 主管 -> HR
 */
interface ApprovalStepperProps {
  steps: ApprovalStepItem[];
}

/**
 * getStepColors：
 * 根據不同 step state 回傳顏色設定。
 *
 * 這裡先做最直觀版本：
 * - completed：綠色
 * - current：藍色
 * - pending：灰色
 * - rejected：紅色
 * - returned：橘色
 */
function getStepColors(state: ApprovalStepItem["state"]) {
  switch (state) {
    case "completed":
      return {
        circleBg: "#16a34a",
        circleText: "#ffffff",
        labelColor: "#111827",
        lineColor: "#16a34a",
      };

    case "current":
      return {
        circleBg: "#2563eb",
        circleText: "#ffffff",
        labelColor: "#111827",
        lineColor: "#d1d5db",
      };

    case "rejected":
      return {
        circleBg: "#dc2626",
        circleText: "#ffffff",
        labelColor: "#991b1b",
        lineColor: "#d1d5db",
      };

    case "returned":
      return {
        circleBg: "#ea580c",
        circleText: "#ffffff",
        labelColor: "#9a3412",
        lineColor: "#d1d5db",
      };

    case "pending":
    default:
      return {
        circleBg: "#e5e7eb",
        circleText: "#6b7280",
        labelColor: "#6b7280",
        lineColor: "#d1d5db",
      };
  }
}

/**
 * ApprovalStepper：
 * 用來顯示簽核流程目前走到哪一步。
 *
 * 類似：
 * [申請人] --- [主管] --- [HR]
 *
 * 你可以把它放在：
 * - 申請詳情頁
 * - 簽核詳情頁
 */
export function ApprovalStepper({ steps }: ApprovalStepperProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0,
        width: "100%",
        overflowX: "auto",
      }}
    >
      {steps.map((step, index) => {
        const colors = getStepColors(step.state);
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.key}
            style={{
              display: "flex",
              alignItems: "center",
              flex: isLast ? "0 0 auto" : 1,
              minWidth: "160px",
            }}
          >
            {/* 左側：節點本體 */}
            <div
              style={{
                display: "grid",
                justifyItems: "center",
                gap: "8px",
                minWidth: "96px",
              }}
            >
              {/* 圓點 / 節點 */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  backgroundColor: colors.circleBg,
                  color: colors.circleText,
                  display: "grid",
                  placeItems: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 0 1px #d1d5db",
                }}
              >
                {index + 1}
              </div>

              {/* 步驟名稱 */}
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: colors.labelColor,
                  }}
                >
                  {step.label}
                </div>

                {step.description && (
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "12px",
                      color: "#6b7280",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* 右側：連接線 */}
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: colors.lineColor,
                  margin: "0 12px",
                  marginTop: "18px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}