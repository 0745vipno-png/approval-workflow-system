import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * ButtonVariant：
 * 定義按鈕的視覺風格種類。
 *
 * primary   -> 主要操作，例如「送出」「儲存」
 * secondary -> 次要操作，例如「返回」
 * danger    -> 危險操作，例如「駁回」「刪除」
 */
type ButtonVariant = "primary" | "secondary" | "danger";

/**
 * ButtonProps：
 * 這是這個元件會接收的參數型別定義。
 *
 * ButtonHTMLAttributes<HTMLButtonElement>
 * - 這一段的意思是：
 *   讓這個自訂 Button 也能吃原生 <button> 的常見屬性，
 *   例如：
 *   - onClick
 *   - disabled
 *   - type
 *   - className
 *
 * 我們再額外加上：
 * - children：按鈕裡面要顯示的內容
 * - variant：按鈕風格
 * - fullWidth：是否撐滿整個父容器寬度
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

/**
 * getButtonStyles：
 * 根據不同 variant 回傳不同的 inline style。
 *
 * 這裡先用最直觀的寫法，不引入 classnames 或樣式工具。
 * 之後如果你改用 Tailwind，也可以很容易重構。
 */
function getButtonStyles(
  variant: ButtonVariant,
  fullWidth: boolean,
  disabled: boolean
) {
  const baseStyle = {
    width: fullWidth ? "100%" : "auto",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid transparent",
    fontSize: "14px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s ease",
  };

  switch (variant) {
    case "secondary":
      return {
        ...baseStyle,
        backgroundColor: "#ffffff",
        color: "#111827",
        border: "1px solid #d1d5db",
      };

    case "danger":
      return {
        ...baseStyle,
        backgroundColor: "#dc2626",
        color: "#ffffff",
      };

    case "primary":
    default:
      return {
        ...baseStyle,
        backgroundColor: "#2563eb",
        color: "#ffffff",
      };
  }
}

/**
 * Button：
 * 共用按鈕元件。
 *
 * 使用範例：
 * <Button onClick={handleSave}>儲存</Button>
 *
 * <Button variant="secondary">返回</Button>
 *
 * <Button variant="danger">刪除</Button>
 */
export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  ...restProps
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={getButtonStyles(variant, fullWidth, disabled)}
      {...restProps}
    >
      {children}
    </button>
  );
}