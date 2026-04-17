import { Router } from "express";
import {
  createAdminManagerMapping,
  getAdminManagerMappings,
} from "./manager-mappings.controller.js";

const router = Router();

/**
 * GET /api/admin/manager-mappings
 * 查詢主管關聯列表
 */
router.get("/manager-mappings", getAdminManagerMappings);

/**
 * POST /api/admin/manager-mappings
 * 新增主管關聯
 */
router.post("/manager-mappings", createAdminManagerMapping);

export default router;