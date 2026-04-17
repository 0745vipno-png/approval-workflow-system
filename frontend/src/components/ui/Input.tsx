import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * InputProps：
 * 繼承原生 HTML input 的所有常見屬性，
 * 例如：
 * - value
 * - onChange
 * - placeholder
 * - type
 * - disabled
 *
 * 然後額外補一個 label：
 * - 讓這個元件可以順便顯示標籤文字
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

/**
 * forwardRef：
 * 讓父元件可以直接拿到這個 input 的 DOM 參考。
 *
 * 這對於之後做：
 * - 自動 focus
 * - 表單驗證
 * - 搭配 react-hook-form
 * 很有幫助。
 *
 * 你現在即使還不熟 ref，也可以先知道：
 * 它是 React 提供的一種「直接指向畫面元素」的方法。
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMessage, disabled = false, ...restProps }, ref) => {
    return (
      <div style={{ display: "grid", gap: "6px" }}>
        {/* 如果有傳 label，就顯示 */}
        {label && (
          <label
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: errorMessage ? "1px solid #dc2626" : "1px solid #d1d5db",
            backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
            color: "#111827",
            outline: "none",
          }}
          {...restProps}
        />

        {/* 如果有錯誤訊息，就顯示在下方 */}
        {errorMessage && (
          <span
            style={{
              fontSize: "12px",
              color: "#dc2626",
            }}
          >
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

/**
 * 給 React DevTools 顯示比較友善的名稱。
 */
Input.displayName = "Input";