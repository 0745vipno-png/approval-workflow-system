import type { NextFunction, Request, Response } from "express";
import {
  assignRoleToUserService,
  getRoleAssignmentsService,
  removeRoleFromUserService,
} from "./role-assignments.service.js";

export async function getRoleAssignments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const keyword =
      typeof req.query.keyword === "string" ? req.query.keyword : "";
    const role = typeof req.query.role === "string" ? req.query.role : "";

    const data = await getRoleAssignmentsService({
      keyword,
      role,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function assignRoleToUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);
    const role = String(req.body.role ?? "");

    const data = await assignRoleToUserService(userId, role);

    res.status(200).json({
      success: true,
      message: "角色指派成功",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeRoleFromUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);
    const role = String(req.params.role ?? "");

    const data = await removeRoleFromUserService(userId, role);

    res.status(200).json({
      success: true,
      message: "角色移除成功",
      data,
    });
  } catch (error) {
    next(error);
  }
}