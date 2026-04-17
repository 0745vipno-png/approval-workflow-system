/**
 * REQUEST_STATUS：
 * 集中管理系統所有案件狀態常數。
 *
 * 好處：
 * - 不用到處手寫字串
 * - 比較不容易打錯
 * - 之後改名時只要改一處
 */
export const REQUEST_STATUS = {
  DRAFT: "DRAFT",
  PENDING_MANAGER: "PENDING_MANAGER",
  RETURNED_BY_MANAGER: "RETURNED_BY_MANAGER",
  REJECTED_BY_MANAGER: "REJECTED_BY_MANAGER",
  PENDING_HR: "PENDING_HR",
  RETURNED_BY_HR: "RETURNED_BY_HR",
  REJECTED_BY_HR: "REJECTED_BY_HR",
  APPROVED: "APPROVED",
  CANCELLED: "CANCELLED",
} as const;

/**
 * RequestStatus：
 * 從 REQUEST_STATUS 物件推導出來的型別。
 *
 * 它的意思是：
 * request.status 只能是這些固定值之一。
 */
export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

/**
 * STATUS_LABEL_MAP：
 * 提供畫面顯示用的中文名稱。
 *
 * 如果你之後不想每個元件自己翻譯狀態，
 * 可以統一從這裡取。
 */
export const STATUS_LABEL_MAP: Record<RequestStatus, string> = {
  DRAFT: "草稿",
  PENDING_MANAGER: "待主管簽核",
  RETURNED_BY_MANAGER: "主管退回",
  REJECTED_BY_MANAGER: "主管駁回",
  PENDING_HR: "待 HR 核定",
  RETURNED_BY_HR: "HR 退回",
  REJECTED_BY_HR: "HR 駁回",
  APPROVED: "已核准",
  CANCELLED: "已撤回",
};