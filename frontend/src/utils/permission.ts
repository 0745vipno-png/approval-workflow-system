import { ROLES } from "../constants/roles.ts";
import type { Role } from "../constants/roles.ts";
import type { RequestItem, RequestStatus } from "../types/request.ts";
import type { User } from "../types/user.ts";

/**
 * hasRole：
 * 檢查某位使用者是否擁有特定角色。
 *
 * 這是一個最基本、最常用的權限判斷工具函式。
 */
export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false;

  return user.roles.includes(role);
}

/**
 * isRequester：
 * 判斷目前使用者是不是申請人角色。
 */
export function isRequester(user: User | null): boolean {
  return hasRole(user, ROLES.REQUESTER);
}

/**
 * isManager：
 * 判斷目前使用者是不是主管角色。
 */
export function isManager(user: User | null): boolean {
  return hasRole(user, ROLES.MANAGER);
}

/**
 * isHr：
 * 判斷目前使用者是不是 HR 角色。
 */
export function isHr(user: User | null): boolean {
  return hasRole(user, ROLES.HR);
}

/**
 * isAdmin：
 * 判斷目前使用者是不是 Admin 角色。
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ROLES.ADMIN);
}

/**
 * canViewRequest：
 * 判斷某位使用者能不能查看某張申請單。
 *
 * 目前先做前端版本的簡化規則：
 * 1. Admin 可以看全部
 * 2. 申請人可以看自己的案件
 * 3. 主管可以看目前指派給自己的案件
 * 4. HR 可以看進到 HR 流程的案件
 *
 * 注意：
 * 這只是前端顯示層的輔助判斷。
 * 真正安全性仍然要由後端 API 驗證。
 */
export function canViewRequest(
  user: User | null,
  request: RequestItem
): boolean {
  if (!user) return false;

  if (isAdmin(user)) return true;

  if (isRequester(user) && request.applicantId === user.id) {
    return true;
  }

  if (isManager(user) && request.currentApproverId === user.id) {
    return true;
  }

  if (
    isHr(user) &&
    [
      "PENDING_HR",
      "RETURNED_BY_HR",
      "REJECTED_BY_HR",
      "APPROVED",
    ].includes(request.status)
  ) {
    return true;
  }

  return false;
}

/**
 * canEditRequest：
 * 判斷申請人是否可編輯案件。
 *
 * 可編輯狀態：
 * - DRAFT
 * - RETURNED_BY_MANAGER
 * - RETURNED_BY_HR
 */
export function canEditRequest(
  user: User | null,
  request: RequestItem
): boolean {
  if (!user) return false;

  const editableStatuses: RequestStatus[] = [
    "DRAFT",
    "RETURNED_BY_MANAGER",
    "RETURNED_BY_HR",
  ];

  return isRequester(user) &&
    request.applicantId === user.id &&
    editableStatuses.includes(request.status)
    ? true
    : false;
}

/**
 * canWithdrawRequest：
 * 判斷申請人是否可撤回案件。
 *
 * 目前採用前端簡化規則：
 * - 本人
 * - 且狀態為 PENDING_MANAGER / RETURNED_BY_MANAGER / RETURNED_BY_HR
 *
 * 若之後你要更嚴格，
 * 可再加：
 * - 主管尚未處理
 * - HR 尚未接手
 */
export function canWithdrawRequest(
  user: User | null,
  request: RequestItem
): boolean {
  if (!user) return false;

  const withdrawableStatuses: RequestStatus[] = [
    "PENDING_MANAGER",
    "RETURNED_BY_MANAGER",
    "RETURNED_BY_HR",
  ];

  return isRequester(user) &&
    request.applicantId === user.id &&
    withdrawableStatuses.includes(request.status)
    ? true
    : false;
}

/**
 * canApproveByManager：
 * 判斷主管能不能簽核這張案件。
 *
 * 規則：
 * - 使用者具有 Manager 角色
 * - 當前狀態是 PENDING_MANAGER
 * - currentApproverId 等於自己
 */
export function canApproveByManager(
  user: User | null,
  request: RequestItem
): boolean {
  if (!user) return false;

  return isManager(user) &&
    request.status === "PENDING_MANAGER" &&
    request.currentApproverId === user.id
    ? true
    : false;
}

/**
 * canApproveByHr：
 * 判斷 HR 能不能核定案件。
 *
 * 規則：
 * - 使用者具有 HR 角色
 * - 當前狀態是 PENDING_HR
 *
 * 若未來你的系統要限定特定 HR 才能處理，
 * 這裡可以再加 request.currentApproverId === user.id。
 */
export function canApproveByHr(
  user: User | null,
  request: RequestItem
): boolean {
  if (!user) return false;

  return isHr(user) && request.status === "PENDING_HR";
}