import type { Request, Response, NextFunction } from "express";
import {
  createAdminUserService,
  getAdminUsersService,
} from "./users.service.js";

export async function getAdminUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const keyword =
      typeof req.query.keyword === "string" ? req.query.keyword : "";
    const status =
      typeof req.query.status === "string" ? req.query.status : "";
    const role =
      typeof req.query.role === "string" ? req.query.role : "";

    const data = await getAdminUsersService({
      keyword,
      status,
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

export async function createAdminUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roles = Array.isArray(req.body.roles)
    ? req.body.roles.map((role: unknown) => String(role))
    : typeof req.body.roles === "string" && req.body.roles.trim()
    ? [req.body.roles.trim()]
    : [];
    const data = await createAdminUserService({
      employeeNo: String(req.body.employeeNo ?? ""),
      name: String(req.body.name ?? ""),
      email: String(req.body.email ?? ""),
      departmentId: req.body.departmentId ? Number(req.body.departmentId) : null,
      departmentName: req.body.departmentName
        ? String(req.body.departmentName)
        : null,
      roles,
      accountStatus:
        req.body.accountStatus === "INACTIVE"
          ? "INACTIVE"
          : req.body.accountStatus === "LOCKED"
          ? "LOCKED"
          : "ACTIVE",
    });

    res.status(201).json({
      success: true,
      message: "使用者新增成功",
      data,
    });
  } catch (error) {
    next(error);
  }
}