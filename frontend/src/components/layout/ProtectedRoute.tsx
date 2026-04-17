import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { APP_ROUTES } from "../../constants/routes";
import type { Role } from "../../constants/roles";

/**
 * ProtectedRoute：
 * 路由保護元件。
 *
 * 用途：
 * 1. 防止未登入者進入受保護頁面
 * 2. 若頁面有限定角色，檢查目前使用者是否符合
 * 3. 不符合時導到 unauthorized
 *
 * children：
 * - 真正要顯示的頁面內容
 *
 * allowedRoles：
 * - 可選
 * - 若有提供，代表此頁面只能由特定角色進入
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const currentUser = useAuthStore((state) => state.currentUser);

  /**
   * 沒登入，直接導回登入頁
   */
  if (!currentUser) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  /**
   * 如果這個頁面有角色限制，就檢查是否具備至少一個允許角色
   */
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = currentUser.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return <Navigate to={APP_ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return <>{children}</>;
}