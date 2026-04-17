import { Router } from "express";
import { createAdminUser, getAdminUsers } from "./users.controller.js";

const router = Router();

/**
 * GET /api/admin/users
 * 查詢使用者列表
 */
router.get("/users", getAdminUsers);

/**
 * POST /api/admin/users
 * 新增使用者
 */
router.post("/users", createAdminUser);

export default router;