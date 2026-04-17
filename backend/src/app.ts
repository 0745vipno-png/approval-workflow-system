import express from "express";
import cors from "cors";
import path from "path";
import requestRoutes from "./routes/request.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminUsersRoutes from "./modules/admin/users/users.routes.js";
import adminDepartmentsRoutes from "./modules/admin/departments/departments.routes.js";
import adminManagerMappingsRoutes from "./modules/admin/manager-mappings/manager-mappings.routes.js";
import adminDashboardRoutes from "./modules/admin/dashboard/admin-dashboard.routes.js";
import adminRoleAssignmentsRoutes from "./modules/admin/role-assignments/role-assignments.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api", authRoutes);
app.use("/api", requestRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/admin", adminDepartmentsRoutes);
app.use("/api/admin", adminManagerMappingsRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminRoleAssignmentsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Backend is running",
  });
});