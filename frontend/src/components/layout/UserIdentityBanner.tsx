import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { ROLES } from "../../constants/roles";
import { t } from "../../lib/i18n";
import type { User } from "../../types/user";

function getPrimaryRole(user: User | null) {
  return user?.roles?.[0] ?? null;
}

function getRoleTheme(role: string | null) {
  switch (role) {
    case ROLES.MANAGER:
      return {
        background: "linear-gradient(135deg, #1e3a8a 0%, #5b21b6 100%)",
        border: "1px solid #312e81",
        badgeBackground: "rgba(255,255,255,0.18)",
        text: "#ffffff",
        subText: "rgba(255,255,255,0.88)",
      };
    case ROLES.HR:
      return {
        background: "linear-gradient(135deg, #047857 0%, #0f766e 100%)",
        border: "1px solid #115e59",
        badgeBackground: "rgba(255,255,255,0.18)",
        text: "#ffffff",
        subText: "rgba(255,255,255,0.88)",
      };
    case ROLES.REQUESTER:
      return {
        background: "linear-gradient(135deg, #475569 0%, #2563eb 100%)",
        border: "1px solid #334155",
        badgeBackground: "rgba(255,255,255,0.18)",
        text: "#ffffff",
        subText: "rgba(255,255,255,0.88)",
      };
    case ROLES.ADMIN:
      return {
        background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
        border: "1px solid #7f1d1d",
        badgeBackground: "rgba(255,255,255,0.18)",
        text: "#ffffff",
        subText: "rgba(255,255,255,0.88)",
      };
    default:
      return {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        badgeBackground: "#e2e8f0",
        text: "#0f172a",
        subText: "#475569",
      };
  }
}

export function UserIdentityBanner() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const language = useUiStore((state) => state.language);

  if (!currentUser) {
    return null;
  }

  const primaryRole = getPrimaryRole(currentUser);
  const theme = getRoleTheme(primaryRole);

  const roleText = primaryRole
    ? t(language, `role.${primaryRole}` as const)
    : t(language, "notLoggedIn");

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: "16px",
        background: theme.background,
        border: theme.border,
        color: theme.text,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: "4px" }}>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.08em",
              fontWeight: 700,
              textTransform: "uppercase",
              color: theme.subText,
            }}
          >
            {t(language, "userIdentity")}
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: theme.text,
            }}
          >
            {currentUser.name}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: theme.subText,
            }}
          >
            {currentUser.email}
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: "999px",
            backgroundColor: theme.badgeBackground,
            fontSize: "13px",
            fontWeight: 700,
            color: theme.text,
            whiteSpace: "nowrap",
          }}
        >
          {roleText} · {primaryRole}
        </div>
      </div>
    </div>
  );
}