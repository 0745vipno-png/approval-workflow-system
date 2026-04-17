import type { Role } from "../constants/roles.ts";

/**
 * User 是系統登入者的基本型別。
 *
 * 目前先保留前端啟動需要的最小欄位。
 * 之後接後端 API 時，可以再補更多欄位。
 */
export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}