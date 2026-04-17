export const APP_ROUTES = {
  LOGIN: "/login",

  // Requester
  REQUESTER_DASHBOARD: "/requester/dashboard",
  REQUEST_LIST: "/requests",
  REQUEST_CREATE: "/requests/create",
  REQUEST_DETAIL: "/requests/:id",
  REQUEST_EDIT: "/requests/:id/edit",

  // Manager
  MANAGER_DASHBOARD: "/manager/dashboard",
  MANAGER_PENDING: "/manager/pending",
  MANAGER_APPROVAL_DETAIL: "/manager/approvals/:id",

  // HR
  HR_DASHBOARD: "/hr/dashboard",
  HR_PENDING: "/hr/pending",
  HR_APPROVAL_DETAIL: "/hr/approvals/:id",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_MANAGER_MAPPING: "/admin/manager-mapping",
  ADMIN_ROLE_ASSIGNMENT: "/admin/role-assignment",
  ADMIN_DEPARTMENTS: "/admin/departments",

  // Common
  UNAUTHORIZED: "/unauthorized",
} as const;