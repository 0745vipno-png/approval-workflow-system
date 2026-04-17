import { useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { APP_ROUTES } from "../../constants/routes";
import { ROLES } from "../../constants/roles";
import type { User } from "../../types/user";
import { t } from "../../lib/i18n";

type AppRole = User["roles"][number];

interface LoginApiResponse {
  message?: string;
  data?: {
    id?: number;
    name?: string;
    email?: string;
    roles?: unknown;
    role?: unknown;
    token?: string;
  };
}

function normalizeRoles(data: LoginApiResponse["data"]): AppRole[] {
  const roleValues = Object.values(ROLES) as AppRole[];

  if (Array.isArray(data?.roles)) {
    return data.roles.filter((role): role is AppRole =>
      roleValues.includes(role as AppRole)
    );
  }

  if (
    typeof data?.role === "string" &&
    roleValues.includes(data.role as AppRole)
  ) {
    return [data.role as AppRole];
  }

  return [];
}

function buildUserFromResponse(data: LoginApiResponse["data"]): User {
  const roles = normalizeRoles(data);

  if (!data?.id || !data?.name || !data?.email || roles.length === 0) {
    throw new Error("登入回傳資料格式不正確");
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    roles,
  };
}

export function LoginPage() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const language = useUiStore((state) => state.language);
  const setLanguage = useUiStore((state) => state.setLanguage);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isZh = language === "zh-TW";

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account,
          password,
        }),
      });

      const rawText = await response.text();

      let result: LoginApiResponse;

      try {
        result = JSON.parse(rawText) as LoginApiResponse;
      } catch {
        throw new Error(
          isZh
            ? "登入 API 沒有回傳有效的 JSON"
            : "Login API did not return valid JSON"
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || (isZh ? "登入失敗" : "Login failed")
        );
      }

      const user = buildUserFromResponse(result.data);

      login(user);

      const primaryRole = user.roles[0];

      if (primaryRole === ROLES.REQUESTER) {
        navigate(APP_ROUTES.REQUEST_LIST);
      } else if (primaryRole === ROLES.MANAGER) {
        navigate(APP_ROUTES.MANAGER_PENDING);
      } else if (primaryRole === ROLES.HR) {
        navigate(APP_ROUTES.HR_PENDING);
      } else if (primaryRole === ROLES.ADMIN) {
        navigate(APP_ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : isZh
          ? "登入失敗"
          : "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={topBarStyle}>
          <div>
            <div style={brandMiniStyle}>{t(language, "systemSubtitle")}</div>
            <div style={brandTitleStyle}>{t(language, "systemName")}</div>
          </div>

          <button
            onClick={() => setLanguage(language === "zh-TW" ? "en" : "zh-TW")}
            style={langButtonStyle}
            type="button"
          >
            {language === "zh-TW" ? "EN" : "中文"}
          </button>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={headingStyle}>
            {isZh ? "登入你的帳號" : "Sign in to your account"}
          </h1>

          <p style={descStyle}>
            {isZh
              ? "進入申請、簽核與系統管理流程。"
              : "Access requests, approvals, and administration workflows."}
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "grid", gap: "6px" }}>
            <label style={labelStyle}>{isZh ? "帳號" : "Account"}</label>

            <input
              value={account}
              placeholder={isZh ? "請輸入帳號" : "Enter account"}
              onChange={(e) => setAccount(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gap: "6px" }}>
            <label style={labelStyle}>{isZh ? "密碼" : "Password"}</label>

            <input
              type="password"
              value={password}
              placeholder={isZh ? "請輸入密碼" : "Enter password"}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              ...loginButtonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            type="button"
          >
            {isLoading
              ? isZh
                ? "登入中..."
                : "Signing in..."
              : isZh
              ? "登入"
              : "Sign In"}
          </button>
        </div>

        <div style={demoBoxStyle}>
          <div style={demoTitleStyle}>{isZh ? "測試帳號" : "Demo Accounts"}</div>

          <div>requester / 1234</div>
          <div>manager / 1234</div>
          <div>hr / 1234</div>
          <div>admin / 1234</div>
        </div>
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "460px",
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "32px",
  boxShadow: "0 20px 50px rgba(15,23,42,0.10)",
};

const topBarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "28px",
};

const brandMiniStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#64748b",
  textTransform: "uppercase",
};

const brandTitleStyle: CSSProperties = {
  marginTop: "6px",
  fontSize: "20px",
  fontWeight: 800,
  color: "#0f172a",
};

const langButtonStyle: CSSProperties = {
  border: "1px solid #dbeafe",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: "30px",
  lineHeight: 1.2,
  color: "#0f172a",
};

const descStyle: CSSProperties = {
  marginTop: "10px",
  marginBottom: 0,
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.7,
};

const labelStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  padding: "0 14px",
  fontSize: "14px",
  color: "#111827",
  backgroundColor: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const loginButtonStyle: CSSProperties = {
  marginTop: "6px",
  height: "46px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
};

const errorBoxStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: "10px",
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  fontSize: "14px",
  border: "1px solid #fecaca",
};

const demoBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "14px 16px",
  borderRadius: "14px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: "13px",
  lineHeight: 1.7,
};

const demoTitleStyle: CSSProperties = {
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "6px",
};