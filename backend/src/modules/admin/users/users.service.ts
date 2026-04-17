import { createAdminUser, findAdminUsers } from "./users.repository.js";

interface GetAdminUsersParams {
  keyword: string;
  status: string;
  role: string;
}

interface CreateAdminUserInput {
  employeeNo: string;
  name: string;
  email: string;
  departmentId?: number | null;
  departmentName?: string | null;
  roles: string[];
  accountStatus?: "ACTIVE" | "INACTIVE" | "LOCKED";
}

export async function getAdminUsersService(params: GetAdminUsersParams) {
  const users = await findAdminUsers(params);
  return users;
}

export async function createAdminUserService(input: CreateAdminUserInput) {
  if (!input.employeeNo.trim()) {
    throw new Error("員工編號不可為空");
  }

  if (!input.name.trim()) {
    throw new Error("姓名不可為空");
  }

  if (!input.email.trim()) {
    throw new Error("Email 不可為空");
  }

  if (!input.email.includes("@")) {
    throw new Error("Email 格式不正確");
  }

  if (!Array.isArray(input.roles) || input.roles.length === 0) {
    throw new Error("至少要指定一個角色");
  }

  const created = await createAdminUser(input);
  return created;
}