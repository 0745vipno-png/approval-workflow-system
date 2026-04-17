import type { RequestStatus } from "../constants/requestStatus";
export type { RequestStatus };

/**
 * RequestType：
 * 申請單類型。
 *
 * 目前先列出常見幾種，可依系統再擴充。
 */
export type RequestType = "LEAVE" | "REIMBURSEMENT" | "OVERTIME";

/**
 * RequestStep：
 * 表示流程目前所在階段。
 *
 * 這和 status 不完全一樣。
 * - status 比較細
 * - currentStep 比較偏流程位置
 */
export type RequestStep =
  | "DRAFT_STEP"
  | "MANAGER_REVIEW"
  | "REQUESTER_REVISION"
  | "HR_REVIEW"
  | "COMPLETED";

/**
 * ApprovalActionType：
 * 簽核或狀態操作的動作種類。
 */
export type ApprovalActionType =
  | "SAVE_DRAFT"
  | "SUBMIT"
  | "APPROVE"
  | "RETURN"
  | "REJECT"
  | "CANCEL"
  | "RESUBMIT";

/**
 * ApprovalLogItem：
 * 簽核歷程中的單筆紀錄。
 *
 * 例如：
 * - 2026-04-15 09:00 申請人送出
 * - 2026-04-15 11:00 主管同意
 */
export interface ApprovalLogItem {
  id: number;
  requestId: number;
  actionBy: string;
  actionRole: string;
  actionType: ApprovalActionType;
  fromStatus?: RequestStatus;
  toStatus: RequestStatus;
  comment?: string;
  actionTime: string;
}

/**
 * RequestItem：
 * 系統中「一張申請單」的主要型別。
 *
 * 這會是非常核心的型別，很多頁面都會用到。
 */
export interface RequestItem {
  id: number;
  requestNo: string;
  applicantId: number;
  applicantName: string;
  requestType: RequestType;
  title: string;
  content: string;
  startDate?: string;
  endDate?: string;
  status: RequestStatus;
  currentStep: RequestStep;
  currentApproverId?: number;
  currentApproverName?: string;
  submittedAt?: string;
  approvedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * RequestFormValues：
 * 新增 / 編輯申請表單時使用的資料型別。
 *
 * 和 RequestItem 的差異：
 * - RequestItem 比較像「資料庫完整資料」
 * - RequestFormValues 比較像「畫面表單輸入資料」
 */
export interface RequestFormValues {
  requestType: RequestType;
  title: string;
  content: string;
  startDate?: string;
  endDate?: string;
}

/**
 * RequestListQueryParams：
 * 列表查詢條件的型別。
 *
 * 之後你做搜尋列或 API query string 會用到。
 */
export interface RequestListQueryParams {
  keyword?: string;
  status?: RequestStatus;
  requestType?: RequestType;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 為相容性提供的別名。
 * 有些檔案可能使用 `Request` 作為型別名稱，將其指向 `RequestItem`。
 */
export type Request = RequestItem;