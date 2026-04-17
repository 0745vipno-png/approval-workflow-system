import type { NextFunction, Request, Response } from "express";
import { getAdminDashboardService } from "./admin-dashboard.service.js";

export async function getAdminDashboard(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await getAdminDashboardService();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}