import type { RouteObject } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { LoginPage } from "../pages/auth/LoginPage";
import { RoleBasedHomeRedirect } from "../pages/common/RoleBasedHomeRedirect";
import { UnauthorizedPage } from "../pages/common/UnauthorizedPage";
import { NotFoundPage } from "../pages/common/NotFoundPage";
import { RequesterDashboardPage } from "../pages/requester/RequesterDashboardPage";
import { RequestListPage } from "../pages/requester/RequestListPage";
import { RequestCreatePage } from "../pages/requester/RequestCreatePage";
import { RequestDetailPage } from "../pages/requester/RequestDetailPage";
import { ManagerDashboardPage } from "../pages/manager/ManagerDashboardPage";
import { PendingApprovalPage } from "../pages/manager/PendingApprovalPage";
import { ApprovalDetailPage } from "../pages/manager/ApprovalDetailPage";
import { HrDashboardPage } from "../pages/hr/HrDashboardPage";
import { PendingHrPage } from "../pages/hr/PendingHrPage";
import { HrApprovalDetailPage } from "../pages/hr/HrApprovalDetailPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { UserManagementPage } from "../pages/admin/UserManagementPage";
import { ManagerMappingPage } from "../pages/admin/ManagerMappingPage";
import { RoleAssignmentPage } from "../pages/admin/RoleAssignmentPage";
import { DepartmentManagementPage } from "../pages/admin/DepartmentManagementPage";
import { APP_ROUTES } from "../constants/routes";
import { ROLES } from "../constants/roles";

/**
 * appRoutes：
 * 全站路由設定。
 *
 * 結構分成三層：
 *
 * 1. /login
 *    - 使用 AuthLayout
 *
 * 2. /
 *    - 登入後系統主區域
 *    - 使用 DashboardLayout
 *
 * 3. *
 *    - 所有未匹配到的頁面進 404
 */
export const appRoutes: RouteObject[] = [
  /**
   * 登入頁
   */
  {
    path: APP_ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },

  /**
   * 系統主區域
   */
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      /**
       * 根路徑 "/" 依角色自動導頁
       */
      {
        index: true,
        element: <RoleBasedHomeRedirect />,
      },

      /**
       * -----------------------------
       * Requester 頁面
       * -----------------------------
       */
      {
        path: "requester/dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequesterDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "requests",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "requests/create",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "requests/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestDetailPage />
          </ProtectedRoute>
        ),
      },

      /**
       * -----------------------------
       * Manager 頁面
       * -----------------------------
       */
      {
        path: "manager/dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ManagerDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "manager/pending",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <PendingApprovalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "manager/approvals/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ApprovalDetailPage />
          </ProtectedRoute>
        ),
      },

      /**
       * -----------------------------
       * HR 頁面
       * -----------------------------
       */
      {
        path: "hr/dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <HrDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "hr/pending",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <PendingHrPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "hr/approvals/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <HrApprovalDetailPage />
          </ProtectedRoute>
        ),
      },

      /**
       * -----------------------------
       * Admin 頁面
       * -----------------------------
       */
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manager-mapping",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ManagerMappingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/role-assignment",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <RoleAssignmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/departments",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DepartmentManagementPage />
          </ProtectedRoute>
        ),
      },

      /**
       * -----------------------------
       * 共用頁面
       * -----------------------------
       */
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },

  /**
   * 404
   */
  {
    path: "*",
    element: <NotFoundPage />,
  },
];