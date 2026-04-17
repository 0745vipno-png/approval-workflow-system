import { Router } from "express";
import {
  createAdminDepartment,
  getAdminDepartments,
  updateAdminDepartment,
} from "./departments.controller.js";

const router = Router();

/**
 * GET /api/admin/departments
 * 查詢部門列表
 */
router.get("/departments", getAdminDepartments);

/**
 * POST /api/admin/departments
 * 新增部門
 */
router.post("/departments", createAdminDepartment);

/**
 * PATCH /api/admin/departments/:id
 * 編輯部門
 */
router.patch("/departments/:id", updateAdminDepartment);

export default router;