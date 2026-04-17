import {
  createAdminDepartment,
  findAdminDepartments,
  updateAdminDepartment,
} from "./departments.repository.js";

interface GetAdminDepartmentsParams {
  keyword: string;
  status: string;
}

interface CreateAdminDepartmentInput {
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName?: string | null;
  memberCount?: number;
  status?: "ACTIVE" | "INACTIVE";
}

interface UpdateAdminDepartmentInput {
  id: number;
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName?: string | null;
  memberCount: number;
  status: "ACTIVE" | "INACTIVE";
}

export async function getAdminDepartmentsService(
  params: GetAdminDepartmentsParams
) {
  const departments = await findAdminDepartments(params);
  return departments;
}

export async function createAdminDepartmentService(
  input: CreateAdminDepartmentInput
) {
  if (!input.departmentCode.trim()) {
    throw new Error("部門代碼不可為空");
  }

  if (!input.departmentName.trim()) {
    throw new Error("部門名稱不可為空");
  }

  if ((input.memberCount ?? 0) < 0) {
    throw new Error("部門人數不可小於 0");
  }

  const created = await createAdminDepartment(input);
  return created;
}

export async function updateAdminDepartmentService(
  input: UpdateAdminDepartmentInput
) {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new Error("部門 ID 不正確");
  }

  if (!input.departmentCode.trim()) {
    throw new Error("部門代碼不可為空");
  }

  if (!input.departmentName.trim()) {
    throw new Error("部門名稱不可為空");
  }

  if (input.memberCount < 0) {
    throw new Error("部門人數不可小於 0");
  }

  return updateAdminDepartment(input);
}