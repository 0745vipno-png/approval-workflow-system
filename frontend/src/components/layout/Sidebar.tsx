import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { APP_ROUTES } from "../../constants/routes";
import { ROLES } from "../../constants/roles";
import { t } from "../../lib/i18n";

/**
 * Sidebar：
 * 左側主選單。
 *
 * 根據登入者角色顯示不同區塊，
 * 並支援最基礎的中英文切換。
 */
export function Sidebar() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const language = useUiStore((state) => state.language);
  const roles = currentUser?.roles ?? [];

  const isRequester = roles.includes(ROLES.REQUESTER);
  const isManager = roles.includes(ROLES.MANAGER);
  const isHr = roles.includes(ROLES.HR);
  const isAdmin = roles.includes(ROLES.ADMIN);

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "calc(100vh - 64px)",
        borderRight: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        padding: "20px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {isRequester ? (
          <SidebarSection title={t(language, "sidebar.requester")}>
            <SidebarLink to={APP_ROUTES.REQUESTER_DASHBOARD}>
              {t(language, "sidebar.dashboard")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.REQUEST_LIST}>
              {t(language, "sidebar.myRequests")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.REQUEST_CREATE}>
              {t(language, "sidebar.createRequest")}
            </SidebarLink>
          </SidebarSection>
        ) : null}

        {isManager ? (
          <SidebarSection title={t(language, "sidebar.manager")}>
            <SidebarLink to={APP_ROUTES.MANAGER_DASHBOARD}>
              {t(language, "sidebar.dashboard")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.MANAGER_PENDING}>
              {t(language, "sidebar.pendingApprovals")}
            </SidebarLink>
          </SidebarSection>
        ) : null}

        {isHr ? (
          <SidebarSection title={t(language, "sidebar.hr")}>
            <SidebarLink to={APP_ROUTES.HR_DASHBOARD}>
              {t(language, "sidebar.dashboard")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.HR_PENDING}>
              {t(language, "sidebar.pendingHr")}
            </SidebarLink>
          </SidebarSection>
        ) : null}

        {isAdmin ? (
          <SidebarSection title={t(language, "sidebar.admin")}>
            <SidebarLink to={APP_ROUTES.ADMIN_DASHBOARD}>
              {t(language, "sidebar.dashboard")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.ADMIN_USERS}>
              {t(language, "sidebar.userManagement")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.ADMIN_MANAGER_MAPPING}>
              {t(language, "sidebar.managerMapping")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.ADMIN_ROLE_ASSIGNMENT}>
              {t(language, "sidebar.roleAssignment")}
            </SidebarLink>
            <SidebarLink to={APP_ROUTES.ADMIN_DEPARTMENTS}>
              {t(language, "sidebar.departmentManagement")}
            </SidebarLink>
          </SidebarSection>
        ) : null}
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section
      style={{
        display: "grid",
        gap: "10px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gap: "6px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

interface SidebarLinkProps {
  to: string;
  children: ReactNode;
}

function SidebarLink({ to, children }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        borderRadius: "10px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 600,
        color: isActive ? "#1d4ed8" : "#374151",
        backgroundColor: isActive ? "#eff6ff" : "transparent",
        border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
        transition: "all 0.2s ease",
      })}
    >
      {children}
    </NavLink>
  );
}