import type { RequestStatus } from "../constants/requestStatus";

/**
 * ApprovalStepState：
 * 表示「流程節點」目前的視覺狀態。
 *
 * 這不是資料庫狀態，而是給前端畫面元件用的。
 *
 * 例如在流程條上，會看到：
 * - completed：已完成
 * - current：目前所在步驟
 * - pending：尚未開始
 * - rejected：此步驟被駁回 / 終止
 * - returned：此步驟有退回情況
 */
export type ApprovalStepState =
  | "completed"
  | "current"
  | "pending"
  | "rejected"
  | "returned";

/**
 * ApprovalStepItem：
 * 單一流程步驟的前端型別。
 *
 * 例如：
 * - 申請人送出
 * - 主管審核
 * - HR 核定
 */
export interface ApprovalStepItem {
  /**
   * 前端顯示或 React key 用的唯一值
   */
  key: string;

  /**
   * 流程步驟名稱
   * 例如：Requester / Manager / HR
   */
  label: string;

  /**
   * 步驟說明，可選
   * 例如：申請人送出申請、主管審核中
   */
  description?: string;

  /**
   * 步驟目前狀態
   */
  state: ApprovalStepState;
}

/**
 * ApprovalTimelineItem：
 * 時間軸上的單筆紀錄。
 *
 * 這和 approval_logs 很接近，
 * 但這裡是偏前端顯示用途，所以欄位稍微整理過。
 */
export interface ApprovalTimelineItem {
  id: number;

  /**
   * 顯示在時間軸上的標題
   * 例如：
   * - 已送出申請
   * - 主管已同意
   * - HR 退回補件
   */
  title: string;

  /**
   * 執行動作的人
   * 例如：王小明 / 陳主任 / 人資人員
   */
  actorName: string;

  /**
   * 執行者角色
   * 例如：Requester / Manager / HR
   */
  actorRole: string;

  /**
   * 時間字串
   * 目前先直接用 string，之後可以是 ISO datetime
   */
  actionTime: string;

  /**
   * 額外說明，例如簽核意見
   */
  comment?: string;

  /**
   * 對應操作後的狀態
   * 例如：PENDING_MANAGER / APPROVED
   */
  toStatus: RequestStatus;
}