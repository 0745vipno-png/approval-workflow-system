import {
  addRoleToUser,
  findRoleAssignments,
  removeRoleFromUser,
} from "./role-assignments.repository.js";

const ALLOWED_ROLES = ["REQUESTER", "MANAGER", "HR", "ADMIN"] as const;

interface GetRoleAssignmentsParams {
  keyword: string;
  role: string;
}

export async function getRoleAssignmentsService(
  params: GetRoleAssignmentsParams
) {
  return findRoleAssignments(params);
}

export async function assignRoleToUserService(userId: number, role: string) {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("使用者 ID 不正確");
  }

  if (!ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
    throw new Error("角色代碼不正確");
  }

  return addRoleToUser(userId, role);
}

export async function removeRoleFromUserService(userId: number, role: string) {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("使用者 ID 不正確");
  }

  if (!ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
    throw new Error("角色代碼不正確");
  }

  return removeRoleFromUser(userId, role);
}