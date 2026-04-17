import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { APP_ROUTES } from "../../constants/routes";
import { t } from "../../lib/i18n";

export function Navbar() {
  const navigate = useNavigate();

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const language = useUiStore((state) => state.language);
  const toggleLanguage = useUiStore((state) => state.toggleLanguage);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.LOGIN);
  };

  const roleText =
    currentUser?.roles
      .map((role) => t(language, `role.${role}` as const))
      .join(" / ") ?? t(language, "notLoggedIn");

  return (
    <header
      style={{
        height: "64px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "2px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {t(language, "systemName")}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          {t(language, "systemSubtitle")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={toggleLanguage}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {language === "zh-TW" ? "EN" : "中文"}
        </button>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {currentUser?.name ?? t(language, "notLoggedIn")}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            {roleText}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
        >
          {t(language, "logout")}
        </button>
      </div>
    </header>
  );
}