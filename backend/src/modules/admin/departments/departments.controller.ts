import type { NextFunction, Request, Response } from "express";
import {
  createAdminDepartmentService,
  getAdminDepartmentsService,
  updateAdminDepartmentService,
} from "./departments.service.js";

export async function getAdminDepartments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const keyword =
      typeof req.query.keyword === "string" ? req.query.keyword : "";
    const status =
      typeof req.query.status === "string" ? req.query.status : "";

    const data = await getAdminDepartmentsService({
      keyword,
      status,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAdminDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await createAdminDepartmentService({
      departmentCode: String(req.body.departmentCode ?? ""),
      departmentName: String(req.body.departmentName ?? ""),
      managerId: req.body.managerId ? Number(req.body.managerId) : null,
      managerName: req.body.managerName ? String(req.body.managerName) : null,
      memberCount: req.body.memberCount ? Number(req.body.memberCount) : 0,
      status: req.body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    });

    res.status(201).json({
      success: true,
      message: "部門新增成功",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const departmentId = Number(req.params.id);

    const data = await updateAdminDepartmentService({
      id: departmentId,
      departmentCode: String(req.body.departmentCode ?? ""),
      departmentName: String(req.body.departmentName ?? ""),
      managerId: req.body.managerId ? Number(req.body.managerId) : null,
      managerName: req.body.managerName ? String(req.body.managerName) : null,
      memberCount: Number(req.body.memberCount ?? 0),
      status: req.body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    });

    res.json({
      success: true,
      message: "部門更新成功",
      data,
    });
  } catch (error) {
    next(error);
  }
}