import type { NextFunction, Request, Response } from "express";
import {
  createAdminManagerMappingService,
  getAdminManagerMappingsService,
} from "./manager-mappings.service.js";

export async function getAdminManagerMappings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const keyword =
      typeof req.query.keyword === "string" ? req.query.keyword : "";
    const status =
      typeof req.query.status === "string" ? req.query.status : "";

    const data = await getAdminManagerMappingsService({
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

export async function createAdminManagerMapping(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await createAdminManagerMappingService({
      employeeId: Number(req.body.employeeId),
      employeeName: String(req.body.employeeName ?? ""),
      employeeNo: String(req.body.employeeNo ?? ""),
      departmentId: Number(req.body.departmentId),
      departmentName: String(req.body.departmentName ?? ""),
      managerId: Number(req.body.managerId),
      managerName: String(req.body.managerName ?? ""),
      managerNo: String(req.body.managerNo ?? ""),
      effectiveStart: String(req.body.effectiveStart ?? ""),
      effectiveEnd: req.body.effectiveEnd
        ? String(req.body.effectiveEnd)
        : null,
      status:
        req.body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    });

    res.status(201).json({
      success: true,
      message: "主管關聯新增成功",
      data,
    });
  } catch (error) {
    next(error);
  }
}