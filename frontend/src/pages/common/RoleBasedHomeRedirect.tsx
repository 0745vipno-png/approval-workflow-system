import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { APP_ROUTES } from "../../constants/routes";
import { ROLES } from "../../constants/roles";

/**
 * RoleBasedHomeRedirect：
 * 當使用者進入根路徑 "/" 時，
 * 依照登入者角色，自動導向對應的 dashboard。
 *
 * 設計目的：
 * 1. 使用者不用自己記網址
 * 2. 登入後進到 "/" 也能正常導頁
 * 3. 未來擴充 HR / Admin 很方便
 *
 * 導向優先順序：
 * - ADMIN
 * - HR
 * - MANAGER
 * - REQUESTER
 *
 * 你可以依需求調整優先順序。
 */
export function RoleBasedHomeRedirect() {
  const currentUser = useAuthStore((state) => state.currentUser);

  /**
   * 沒登入就導到 login。
   *
   * 正常來說這頁已經在 ProtectedRoute 裡面，
   * 但這裡多一道保護更穩。
   */
  if (!currentUser) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  const roles = currentUser.roles;

  if (roles.includes(ROLES.ADMIN)) {
    return <Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />;
  }

  if (roles.includes(ROLES.HR)) {
    return <Navigate to={APP_ROUTES.HR_DASHBOARD} replace />;
  }

  if (roles.includes(ROLES.MANAGER)) {
    return <Navigate to={APP_ROUTES.MANAGER_DASHBOARD} replace />;
  }

  if (roles.includes(ROLES.REQUESTER)) {
    return <Navigate to={APP_ROUTES.REQUESTER_DASHBOARD} replace />;
  }

  /**
   * 如果登入者沒有任何已知角色，
   * 就送去 unauthorized。
   */
  return <Navigate to={APP_ROUTES.UNAUTHORIZED} replace />;
}