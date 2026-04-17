import { findAdminDashboard } from "./admin-dashboard.repository.js";

export async function getAdminDashboardService() {
  const dashboard = await findAdminDashboard();
  return dashboard;
}