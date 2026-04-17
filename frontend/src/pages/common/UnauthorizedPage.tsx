import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

/**
 * UnauthorizedPage：
 * 權限不足頁面。
 *
 * 當使用者已登入，但沒有權限進入某頁時，
 * 可以導向這頁，而不是直接空白或報錯。
 */
export function UnauthorizedPage() {
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
            color: "#dc2626",
            lineHeight: 1,
          }}
        >
          403
        </div>

        <h1
          style={{
            marginTop: "12px",
            marginBottom: "8px",
            fontSize: "24px",
            color: "#111827",
          }}
        >
          無權限存取此頁面
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: 1.7,
          }}
        >
          你目前沒有足夠權限查看這個頁面。請返回上一頁，或聯絡系統管理員確認權限設定。
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