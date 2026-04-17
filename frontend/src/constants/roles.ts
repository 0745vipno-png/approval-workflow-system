/**
 * 系統角色常數。
 *
 * 為什麼要抽成 constants？
 * 因為角色名稱如果到處直接寫字串，之後很容易打錯。
 *
 * 例如：
 * "REQUESTER"
 * "Requester"
 * "requester"
 *
 * 只要大小寫不一致，就容易出 bug。
 */
export const ROLES = {
  REQUESTER: "REQUESTER",
  MANAGER: "MANAGER",
  HR: "HR",
  ADMIN: "ADMIN",
} as const;

/**
 * Role 是從 ROLES 物件推導出來的型別。
 *
 * 這是 TypeScript 的一個常見技巧。
 * 它的效果是：
 * Role 只能是以下其中一個值：
 * - "REQUESTER"
 * - "MANAGER"
 * - "HR"
 * - "ADMIN"
 */
export type Role = (typeof ROLES)[keyof typeof ROLES];