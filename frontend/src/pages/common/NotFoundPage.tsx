import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

/**
 * NotFoundPage：
 * 找不到頁面時顯示的 404 頁。
 *
 * 當使用者輸入不存在的網址，或路由沒有匹配到時，可以導到這頁。
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          textAlign: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "32px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#2563eb",
            lineHeight: 1,
          }}
        >
          404
        </div>

        <h1
          style={{
            marginTop: "12px",
            marginBottom: "8px",
            fontSize: "24px",
            color: "#111827",
          }}
        >
          找不到這個頁面
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: 1.7,
          }}
        >
          你要前往的頁面不存在，可能是網址輸入錯誤，或頁面路由尚未建立。
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Button variant="secondary" onClick={() => navigate(-1)}>
            返回上一頁
          </Button>

          <Button onClick={() => navigate("/")}>回到首頁</Button>
        </div>
      </div>
    </div>
  );
}