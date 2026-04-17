import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

/**
 * TextareaProps：
 * 這個元件會接收的參數型別。
 *
 * TextareaHTMLAttributes<HTMLTextAreaElement>
 * - 讓這個元件支援原生 <textarea> 常見屬性
 * - 例如：
 *   - value
 *   - onChange
 *   - rows
 *   - placeholder
 *   - disabled
 *
 * 額外補上：
 * - label：欄位標題
 * - errorMessage：錯誤訊息
 */
interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
}

/**
 * Textarea：
 * 共用多行文字輸入框元件。
 *
 * 很適合用在：
 * - 申請內容
 * - 簽核意見
 * - 備註
 *
 * forwardRef 的用途：
 * - 讓父元件有機會直接操作 textarea DOM
 * - 例如未來你要做 focus、表單套件整合時會有用
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, errorMessage, disabled = false, rows = 5, ...restProps }, ref) => {
    return (
      <div style={{ display: "grid", gap: "6px" }}>
        {/* 有傳 label 才顯示標題 */}
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

        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: errorMessage ? "1px solid #dc2626" : "1px solid #d1d5db",
            backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
            color: "#111827",
            outline: "none",
            resize: "vertical", // 允許使用者上下拉高，但不左右改寬
            fontFamily: "inherit",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
          {...restProps}
        />

        {/* 錯誤訊息顯示區 */}
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
 * 幫 React DevTools 顯示友善名稱。
 */
Textarea.displayName = "Textarea";