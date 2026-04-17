import { Router } from "express";
import {
  assignRoleToUser,
  getRoleAssignments,
  removeRoleFromUser,
} from "./role-assignments.controller.js";

const router = Router();

/**
 * GET /api/admin/role-assignments
 */
router.get("/role-assignments", getRoleAssignments);

/**
 * POST /api/admin/role-assignments/:userId/roles
 */
router.post("/role-assignments/:userId/roles", assignRoleToUser);

/**
 * DELETE /api/admin/role-assignments/:userId/roles/:role
 */
router.delete("/role-assignments/:userId/roles/:role", removeRoleFromUser);

export default router;