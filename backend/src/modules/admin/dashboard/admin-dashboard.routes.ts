import { Router } from "express";
import { getAdminDashboard } from "./admin-dashboard.controller.js";

const router = Router();

/**
 * GET /api/admin/dashboard
 * 取得管理首頁摘要
 */
router.get("/dashboard", getAdminDashboard);

export default router;