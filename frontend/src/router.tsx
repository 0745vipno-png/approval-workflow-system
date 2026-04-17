import { createBrowserRouter, Navigate } from "react-router-dom";
import { APP_ROUTES } from "./constants/routes";
import { ROLES } from "./constants/roles";

import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import { LoginPage } from "./pages/auth/LoginPage";
import { UnauthorizedPage } from "./pages/common/UnauthorizedPage";

import { RequesterDashboardPage } from "./pages/requester/RequesterDashboardPage";
import { RequestListPage } from "./pages/requester/RequestListPage";
import { RequestCreatePage } from "./pages/requester/RequestCreatePage";
import { RequestDetailPage } from "./pages/requester/RequestDetailPage";
import { RequestEditPage } from "./pages/requester/RequestEditPage";

import { ManagerDashboardPage } from "./pages/manager/ManagerDashboardPage";
import { PendingApprovalPage } from "./pages/manager/PendingApprovalPage";
import { ApprovalDetailPage } from "./pages/manager/ApprovalDetailPage";

import { HrDashboardPage } from "./pages/hr/HrDashboardPage";
import { PendingHrPage } from "./pages/hr/PendingHrPage";
import { HrApprovalDetailPage } from "./pages/hr/HrApprovalDetailPage";

import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { ManagerMappingPage } from "./pages/admin/ManagerMappingPage";
import { RoleAssignmentPage } from "./pages/admin/RoleAssignmentPage";
import { DepartmentManagementPage } from "./pages/admin/DepartmentManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={APP_ROUTES.LOGIN} replace />,
  },
  {
    path: APP_ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: APP_ROUTES.REQUESTER_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequesterDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.REQUEST_LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.REQUEST_CREATE,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.REQUEST_DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.REQUEST_EDIT,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REQUESTER]}>
            <RequestEditPage />
          </ProtectedRoute>
        ),
      },

      {
        path: APP_ROUTES.MANAGER_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ManagerDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.MANAGER_PENDING,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <PendingApprovalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.MANAGER_APPROVAL_DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ApprovalDetailPage />
          </ProtectedRoute>
        ),
      },

      {
        path: APP_ROUTES.HR_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <HrDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.HR_PENDING,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <PendingHrPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.HR_APPROVAL_DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <HrApprovalDetailPage />
          </ProtectedRoute>
        ),
      },

      {
        path: APP_ROUTES.ADMIN_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.ADMIN_USERS,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.ADMIN_MANAGER_MAPPING,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ManagerMappingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.ADMIN_ROLE_ASSIGNMENT,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <RoleAssignmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.ADMIN_DEPARTMENTS,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DepartmentManagementPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: APP_ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <Navigate to={APP_ROUTES.LOGIN} replace />,
  },
]);