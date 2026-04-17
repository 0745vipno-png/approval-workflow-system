import type { AppLanguage } from "../store/ui.store";

export type TranslationKey =
  | "systemName"
  | "systemSubtitle"
  | "notLoggedIn"
  | "logout"
  | "language"
  | "userIdentity"

  | "common.home"
  | "common.all"
  | "common.status"
  | "common.requestType"
  | "common.requestNo"
  | "common.title"
  | "common.startDate"
  | "common.endDate"
  | "common.updatedAt"
  | "common.actions"
  | "common.view"
  | "common.edit"
  | "common.loading"
  | "common.back"
  | "common.cancel"
  | "common.submit"
  | "common.saveDraft"
  | "common.processing"
  | "common.remove"
  | "common.requestTypeRequired"
  | "common.titleRequired"
  | "common.contentRequired"
  | "common.notAvailable"
  | "common.invalidResponse"

  | "requestType.LEAVE"
  | "requestType.REIMBURSEMENT"
  | "requestType.OVERTIME"

  | "status.DRAFT"
  | "status.PENDING_MANAGER"
  | "status.RETURNED_BY_MANAGER"
  | "status.REJECTED_BY_MANAGER"
  | "status.PENDING_HR"
  | "status.RETURNED_BY_HR"
  | "status.REJECTED_BY_HR"
  | "status.APPROVED"
  | "status.CANCELLED"

  | "role.REQUESTER"
  | "role.MANAGER"
  | "role.HR"
  | "role.ADMIN"

  | "sidebar.requester"
  | "sidebar.manager"
  | "sidebar.hr"
  | "sidebar.admin"
  | "sidebar.dashboard"
  | "sidebar.myRequests"
  | "sidebar.createRequest"
  | "sidebar.pendingApprovals"
  | "sidebar.pendingHr"
  | "sidebar.userManagement"
  | "sidebar.managerMapping"
  | "sidebar.roleAssignment"
  | "sidebar.departmentManagement"

  | "requesterDashboard.title"
  | "requesterDashboard.description"
  | "requesterDashboard.defaultUserName"
  | "requesterDashboard.viewMyRequests"
  | "requesterDashboard.summary.total.title"
  | "requesterDashboard.summary.total.description"
  | "requesterDashboard.summary.pending.title"
  | "requesterDashboard.summary.pending.description"
  | "requesterDashboard.summary.returned.title"
  | "requesterDashboard.summary.returned.description"
  | "requesterDashboard.summary.approved.title"
  | "requesterDashboard.summary.approved.description"
  | "requesterDashboard.summary.draft.title"
  | "requesterDashboard.summary.draft.description"
  | "requesterDashboard.quickActions.title"
  | "requesterDashboard.quickActions.subtitle"
  | "requesterDashboard.quickActions.create"
  | "requesterDashboard.quickActions.viewAll"
  | "requesterDashboard.recentRequests.title"
  | "requesterDashboard.recentRequests.subtitle"
  | "requesterDashboard.empty"

  | "managerDashboard.title"
  | "managerDashboard.description"
  | "managerDashboard.defaultUserName"
  | "managerDashboard.viewPending"
  | "managerDashboard.summary.pending.title"
  | "managerDashboard.summary.pending.description"
  | "managerDashboard.summary.todaySubmitted.title"
  | "managerDashboard.summary.todaySubmitted.description"
  | "managerDashboard.summary.returned.title"
  | "managerDashboard.summary.returned.description"
  | "managerDashboard.summary.rejected.title"
  | "managerDashboard.summary.rejected.description"
  | "managerDashboard.quickActions.title"
  | "managerDashboard.quickActions.subtitle"
  | "managerDashboard.quickActions.enterPendingList"
  | "managerDashboard.recentRequests.title"
  | "managerDashboard.recentRequests.subtitle"
  | "managerDashboard.empty"
  | "managerDashboard.applicant"
  | "managerDashboard.submittedAt"
  | "managerDashboard.viewDetail"

  | "hrDashboard.title"
  | "hrDashboard.description"
  | "hrDashboard.defaultUserName"
  | "hrDashboard.viewPending"
  | "hrDashboard.summary.pending.title"
  | "hrDashboard.summary.pending.description"
  | "hrDashboard.summary.todaySubmitted.title"
  | "hrDashboard.summary.todaySubmitted.description"
  | "hrDashboard.summary.approved.title"
  | "hrDashboard.summary.approved.description"
  | "hrDashboard.summary.returned.title"
  | "hrDashboard.summary.returned.description"
  | "hrDashboard.quickActions.title"
  | "hrDashboard.quickActions.subtitle"
  | "hrDashboard.quickActions.enterPendingList"
  | "hrDashboard.recentRequests.title"
  | "hrDashboard.recentRequests.subtitle"
  | "hrDashboard.empty"
  | "hrDashboard.applicant"
  | "hrDashboard.submittedAt"
  | "hrDashboard.viewDetail"

  | "requestList.title"
  | "requestList.description"
  | "requestList.createButton"
  | "requestList.filterTitle"
  | "requestList.filterSubtitle"
  | "requestList.keywordLabel"
  | "requestList.keywordPlaceholder"
  | "requestList.tableTitle"
  | "requestList.resultCount"
  | "requestList.currentApprover"
  | "requestList.empty"
  | "requestList.loading"
  | "requestList.loadError"

  | "requestCreate.title"
  | "requestCreate.description"
  | "requestCreate.formTitle"
  | "requestCreate.formSubtitle"
  | "requestCreate.titlePlaceholder"
  | "requestCreate.contentPlaceholder"
  | "requestCreate.validation.titleRequired"
  | "requestCreate.validation.contentRequired"
  | "requestCreate.validation.endDateInvalid"
  | "requestCreate.attachment.title"
  | "requestCreate.attachment.description"
  | "requestCreate.attachment.maxCount"
  | "requestCreate.attachment.maxSize"
  | "requestCreate.attachment.invalidType"
  | "requestCreate.attachment.empty"
  | "requestCreate.toast.draftSaved"
  | "requestCreate.toast.draftFailed"
  | "requestCreate.toast.submitSuccess"
  | "requestCreate.toast.submitFailed"

  | "requestDetail.title"
  | "requestDetail.description"
  | "requestDetail.loadingDescription"
  | "requestDetail.loadFailed"
  | "requestDetail.loadError"
  | "requestDetail.notFoundDescription"
  | "requestDetail.notFound"
  | "requestDetail.loading"
  | "requestDetail.backToList"
  | "requestDetail.edit"
  | "requestDetail.withdraw"
  | "requestDetail.withdrawing"
  | "requestDetail.withdrawConfirm"
  | "requestDetail.withdrawSuccess"
  | "requestDetail.withdrawFailed"
  | "requestDetail.basicInfo"
  | "requestDetail.requestNo"
  | "requestDetail.applicant"
  | "requestDetail.requestTitle"
  | "requestDetail.currentStatus"
  | "requestDetail.currentStep"
  | "requestDetail.createdAt"
  | "requestDetail.submittedAt"
  | "requestDetail.contentTitle"
  | "requestDetail.progressTitle"
  | "requestDetail.progressSubtitle"
  | "requestDetail.timelineTitle"
  | "requestDetail.timelineSubtitle"
  | "requestDetail.statusDescriptionTitle"
  | "requestDetail.stepper.requester"
  | "requestDetail.stepper.manager"
  | "requestDetail.stepper.hr"
  | "requestDetail.timeline.created"
  | "requestDetail.timeline.submitted"
  | "requestDetail.timeline.submittedComment"
  | "requestDetail.timeline.returnedByManager"
  | "requestDetail.timeline.rejectedByManager"
  | "requestDetail.timeline.sentToHr"
  | "requestDetail.timeline.returnedByHr"
  | "requestDetail.timeline.rejectedByHr"
  | "requestDetail.timeline.approved"
  | "requestDetail.timeline.cancelled"
  | "requestDetail.statusDesc.DRAFT"
  | "requestDetail.statusDesc.PENDING_MANAGER"
  | "requestDetail.statusDesc.RETURNED_BY_MANAGER"
  | "requestDetail.statusDesc.REJECTED_BY_MANAGER"
  | "requestDetail.statusDesc.PENDING_HR"
  | "requestDetail.statusDesc.RETURNED_BY_HR"
  | "requestDetail.statusDesc.REJECTED_BY_HR"
  | "requestDetail.statusDesc.APPROVED"
  | "requestDetail.statusDesc.CANCELLED"

  | "managerApproval.title"
  | "managerApproval.pendingTitle"
  | "managerApproval.description"
  | "managerApproval.loadingDescription"
  | "managerApproval.loading"
  | "managerApproval.loadFailed"
  | "managerApproval.loadError"
  | "managerApproval.notFoundDescription"
  | "managerApproval.notFound"
  | "managerApproval.backToList"
  | "managerApproval.basicInfo"
  | "managerApproval.requestNo"
  | "managerApproval.applicant"
  | "managerApproval.currentStatus"
  | "managerApproval.submittedAt"
  | "managerApproval.contentTitle"
  | "managerApproval.progressTitle"
  | "managerApproval.progressSubtitle"
  | "managerApproval.timelineTitle"
  | "managerApproval.timelineSubtitle"
  | "managerApproval.actionTitle"
  | "managerApproval.actionSubtitle"
  | "managerApproval.commentLabel"
  | "managerApproval.commentPlaceholder"
  | "managerApproval.approve"
  | "managerApproval.return"
  | "managerApproval.reject"
  | "managerApproval.notPending"
  | "managerApproval.actionFailed"
  | "managerApproval.stepper.requester"
  | "managerApproval.stepper.manager"
  | "managerApproval.stepper.hr"
  | "managerApproval.timeline.savedDraft"
  | "managerApproval.timeline.submitted"
  | "managerApproval.timeline.approved"
  | "managerApproval.timeline.returned"
  | "managerApproval.timeline.rejected"
  | "managerApproval.timeline.cancelled"
  | "managerApproval.timeline.resubmitted"
  | "managerApproval.timeline.updated"
  | "managerApproval.timeline.managerApproved"
  | "managerApproval.timeline.hrApproved"
  | "managerApproval.timeline.managerReturned"
  | "managerApproval.timeline.hrReturned"
  | "managerApproval.timeline.managerRejected"
  | "managerApproval.timeline.hrRejected"
  | "managerApproval.toast.approveSuccess"
  | "managerApproval.toast.approveFailed"
  | "managerApproval.toast.returnSuccess"
  | "managerApproval.toast.returnFailed"
  | "managerApproval.toast.rejectSuccess"
  | "managerApproval.toast.rejectFailed"

  | "pendingApproval.title"
  | "pendingApproval.description"
  | "pendingApproval.filterTitle"
  | "pendingApproval.filterSubtitle"
  | "pendingApproval.keywordLabel"
  | "pendingApproval.keywordPlaceholder"
  | "pendingApproval.tableTitle"
  | "pendingApproval.resultCount"
  | "pendingApproval.empty"
  | "pendingApproval.loading"
  | "pendingApproval.loadError"
  | "pendingApproval.fetchError"
  | "pendingApproval.invalidResponse"
  | "pendingApproval.viewDetail"
  | "pendingApproval.applicant"
  | "pendingApproval.submittedAt"

  | "pendingHr.title"
  | "pendingHr.description"
  | "pendingHr.filterTitle"
  | "pendingHr.filterSubtitle"
  | "pendingHr.keywordLabel"
  | "pendingHr.keywordPlaceholder"
  | "pendingHr.tableTitle"
  | "pendingHr.resultCount"
  | "pendingHr.empty"
  | "pendingHr.loading"
  | "pendingHr.loadError"
  | "pendingHr.fetchError"
  | "pendingHr.invalidResponse"
  | "pendingHr.viewDetail"
  | "pendingHr.applicant"
  | "pendingHr.submittedAt"

  | "hrApproval.title"
  | "hrApproval.pendingTitle"
  | "hrApproval.description"
  | "hrApproval.loadingDescription"
  | "hrApproval.loading"
  | "hrApproval.loadFailed"
  | "hrApproval.loadError"
  | "hrApproval.logsLoadError"
  | "hrApproval.notFoundDescription"
  | "hrApproval.notFound"
  | "hrApproval.backToList"
  | "hrApproval.basicInfo"
  | "hrApproval.actionTitle"
  | "hrApproval.actionSubtitle"
  | "hrApproval.commentLabel"
  | "hrApproval.commentPlaceholder"
  | "hrApproval.approve"
  | "hrApproval.return"
  | "hrApproval.reject"
  | "hrApproval.notPending"
  | "hrApproval.toast.approveSuccess"
  | "hrApproval.toast.approveFailed"
  | "hrApproval.toast.returnSuccess"
  | "hrApproval.toast.returnFailed"
  | "hrApproval.toast.rejectSuccess"
  | "hrApproval.toast.rejectFailed";

type TranslationParams = Record<string, string | number>;

const messages: Record<AppLanguage, Record<TranslationKey, string>> = {
  "zh-TW": {
    systemName: "Approval System",
    systemSubtitle: "Approval Workflow System",
    notLoggedIn: "未登入",
    logout: "登出",
    language: "語言",
    userIdentity: "使用者身份",

    "common.home": "首頁",
    "common.all": "全部",
    "common.status": "狀態",
    "common.requestType": "申請類型",
    "common.requestNo": "單號",
    "common.title": "標題",
    "common.startDate": "開始日期",
    "common.endDate": "結束日期",
    "common.updatedAt": "最後更新",
    "common.actions": "操作",
    "common.view": "查看",
    "common.edit": "編輯",
    "common.loading": "資料載入中...",
    "common.back": "返回",
    "common.cancel": "取消",
    "common.submit": "送出申請",
    "common.saveDraft": "儲存草稿",
    "common.processing": "處理中...",
    "common.remove": "移除",
    "common.requestTypeRequired": "申請類型 *",
    "common.titleRequired": "申請標題 *",
    "common.contentRequired": "申請內容 *",
    "common.notAvailable": "—",
    "common.invalidResponse": "回傳資料格式錯誤。",

    "requestType.LEAVE": "請假",
    "requestType.REIMBURSEMENT": "報銷",
    "requestType.OVERTIME": "加班",

    "status.DRAFT": "草稿",
    "status.PENDING_MANAGER": "Pending Manager Review",
    "status.RETURNED_BY_MANAGER": "Returned by Manager",
    "status.REJECTED_BY_MANAGER": "Rejected by Manager",
    "status.PENDING_HR": "Pending HR Review",
    "status.RETURNED_BY_HR": "Returned by HR",
    "status.REJECTED_BY_HR": "Rejected by HR",
    "status.APPROVED": "Approved",
    "status.CANCELLED": "Cancelled",

    "role.REQUESTER": "Requester",
    "role.MANAGER": "Manager",
    "role.HR": "HR",
    "role.ADMIN": "Admin",

    "sidebar.requester": "REQUESTER",
    "sidebar.manager": "MANAGER",
    "sidebar.hr": "HR",
    "sidebar.admin": "ADMIN",
    "sidebar.dashboard": "Dashboard",
    "sidebar.myRequests": "My Requests",
    "sidebar.createRequest": "Create Request",
    "sidebar.pendingApprovals": "Pending Approvals",
    "sidebar.pendingHr": "Pending HR Reviews",
    "sidebar.userManagement": "User Management",
    "sidebar.managerMapping": "Manager Mapping",
    "sidebar.roleAssignment": "Role Assignment",
    "sidebar.departmentManagement": "Department Management",

    "requesterDashboard.title": "你好，{name}",
    "requesterDashboard.description": "歡迎回到簽核系統，以下是你目前的申請案件摘要。",
    "requesterDashboard.defaultUserName": "使用者",
    "requesterDashboard.viewMyRequests": "查看我的申請",
    "requesterDashboard.summary.total.title": "案件總數",
    "requesterDashboard.summary.total.description": "目前所有申請案件數量",
    "requesterDashboard.summary.pending.title": "待處理中",
    "requesterDashboard.summary.pending.description": "目前正在簽核流程中的案件",
    "requesterDashboard.summary.returned.title": "被退回",
    "requesterDashboard.summary.returned.description": "需要補件或修改後重送的案件",
    "requesterDashboard.summary.approved.title": "已核准",
    "requesterDashboard.summary.approved.description": "已完成核准的案件",
    "requesterDashboard.summary.draft.title": "草稿",
    "requesterDashboard.summary.draft.description": "尚未正式送出的案件",
    "requesterDashboard.quickActions.title": "快速操作",
    "requesterDashboard.quickActions.subtitle": "你可以從這裡快速進入常用功能。",
    "requesterDashboard.quickActions.create": "新增申請",
    "requesterDashboard.quickActions.viewAll": "查看全部申請",
    "requesterDashboard.recentRequests.title": "最近申請紀錄",
    "requesterDashboard.recentRequests.subtitle": "顯示最近幾筆申請，方便快速查看目前進度。",
    "requesterDashboard.empty": "目前尚無申請紀錄，請先建立第一筆申請。",

    "managerDashboard.title": "你好，{name}",
    "managerDashboard.description": "以下是目前等待你處理的簽核案件概況。",
    "managerDashboard.defaultUserName": "主管",
    "managerDashboard.viewPending": "查看待簽核案件",
    "managerDashboard.summary.pending.title": "待簽核件數",
    "managerDashboard.summary.pending.description": "目前尚待你審核的案件數量",
    "managerDashboard.summary.todaySubmitted.title": "今日新增",
    "managerDashboard.summary.todaySubmitted.description": "今天新送達的案件數量",
    "managerDashboard.summary.returned.title": "已退回",
    "managerDashboard.summary.returned.description": "曾由你退回補件的案件",
    "managerDashboard.summary.rejected.title": "已駁回",
    "managerDashboard.summary.rejected.description": "已由你駁回結案的案件",
    "managerDashboard.quickActions.title": "快速操作",
    "managerDashboard.quickActions.subtitle": "可快速進入主管最常使用的功能。",
    "managerDashboard.quickActions.enterPendingList": "進入待簽核列表",
    "managerDashboard.recentRequests.title": "最近待處理案件",
    "managerDashboard.recentRequests.subtitle": "顯示最近送達、等待你簽核的案件。",
    "managerDashboard.empty": "目前沒有待處理的簽核案件。",
    "managerDashboard.applicant": "申請人",
    "managerDashboard.submittedAt": "送出時間",
    "managerDashboard.viewDetail": "查看詳情",

    "hrDashboard.title": "你好，{name}",
    "hrDashboard.description": "以下是目前等待你最終核定的案件摘要。",
    "hrDashboard.defaultUserName": "HR",
    "hrDashboard.viewPending": "查看待核定案件",
    "hrDashboard.summary.pending.title": "待核定件數",
    "hrDashboard.summary.pending.description": "目前等待 HR 處理的案件數量",
    "hrDashboard.summary.todaySubmitted.title": "今日新增",
    "hrDashboard.summary.todaySubmitted.description": "今天新進入 HR 流程的案件",
    "hrDashboard.summary.approved.title": "已核准",
    "hrDashboard.summary.approved.description": "近期已完成核准的案件",
    "hrDashboard.summary.returned.title": "已退回",
    "hrDashboard.summary.returned.description": "近期由 HR 退回補件的案件",
    "hrDashboard.quickActions.title": "快速操作",
    "hrDashboard.quickActions.subtitle": "可快速進入 HR 最常使用的功能。",
    "hrDashboard.quickActions.enterPendingList": "進入待核定列表",
    "hrDashboard.recentRequests.title": "最近待處理案件",
    "hrDashboard.recentRequests.subtitle": "顯示最近等待 HR 核定的案件。",
    "hrDashboard.empty": "目前沒有待處理的 HR 核定案件。",
    "hrDashboard.applicant": "申請人",
    "hrDashboard.submittedAt": "送出時間",
    "hrDashboard.viewDetail": "查看詳情",

    "requestList.title": "我的申請",
    "requestList.description":
      "查看你的所有申請案件，並可依條件篩選、查看詳情或建立新申請。",
    "requestList.createButton": "+ 新增申請",
    "requestList.filterTitle": "查詢條件",
    "requestList.filterSubtitle": "可依關鍵字、狀態與申請類型進行篩選。",
    "requestList.keywordLabel": "關鍵字搜尋",
    "requestList.keywordPlaceholder": "輸入單號、標題或內容",
    "requestList.tableTitle": "申請列表",
    "requestList.resultCount": "共找到 {count} 筆資料",
    "requestList.currentApprover": "目前簽核人",
    "requestList.empty": "查無符合條件的申請資料。",
    "requestList.loading": "申請資料載入中...",
    "requestList.loadError": "載入申請列表失敗，請稍後再試。",

    "requestCreate.title": "新增申請",
    "requestCreate.description":
      "請填寫申請資料，完成後可先儲存草稿或直接送出。",
    "requestCreate.formTitle": "申請表單",
    "requestCreate.formSubtitle":
      "請依照欄位輸入對應資料。標示 * 的欄位為必填。",
    "requestCreate.titlePlaceholder": "例如：家庭因素請假申請",
    "requestCreate.contentPlaceholder": "請詳細說明申請原因與相關內容",
    "requestCreate.validation.titleRequired": "請輸入申請標題",
    "requestCreate.validation.contentRequired": "請輸入申請內容",
    "requestCreate.validation.endDateInvalid": "結束日期不得早於開始日期",
    "requestCreate.attachment.title": "附件上傳",
    "requestCreate.attachment.description":
      "支援 PDF、JPG、PNG、Word、Excel。單檔上限 {size} MB，最多 {count} 個附件。",
    "requestCreate.attachment.maxCount": "最多只能上傳 {count} 個附件",
    "requestCreate.attachment.maxSize":
      "檔案「{name}」超過 {size} MB 限制",
    "requestCreate.attachment.invalidType":
      "檔案「{name}」格式不支援，請上傳 PDF、圖片或 Office 文件",
    "requestCreate.attachment.empty": "尚未選擇任何附件。",
    "requestCreate.toast.draftSaved": "草稿已成功儲存。",
    "requestCreate.toast.draftFailed": "儲存草稿失敗。",
    "requestCreate.toast.submitSuccess": "申請已成功送出。",
    "requestCreate.toast.submitFailed": "送出申請失敗。",

    "requestDetail.title": "申請詳情",
    "requestDetail.description": "查看案件內容、目前簽核狀態與完整歷程。",
    "requestDetail.loadingDescription": "載入案件資料中...",
    "requestDetail.loadFailed": "載入失敗",
    "requestDetail.loadError": "載入申請詳情失敗。",
    "requestDetail.notFoundDescription": "查無此案件",
    "requestDetail.notFound": "找不到這筆申請資料。",
    "requestDetail.loading": "申請資料載入中...",
    "requestDetail.backToList": "返回列表",
    "requestDetail.edit": "編輯申請",
    "requestDetail.withdraw": "撤回申請",
    "requestDetail.withdrawing": "撤回中...",
    "requestDetail.withdrawConfirm": "確定要撤回案件「{requestNo}」嗎？",
    "requestDetail.withdrawSuccess": "案件已成功撤回。",
    "requestDetail.withdrawFailed": "撤回申請失敗。",
    "requestDetail.basicInfo": "案件基本資訊",
    "requestDetail.requestNo": "案件編號",
    "requestDetail.applicant": "申請人",
    "requestDetail.requestTitle": "申請標題",
    "requestDetail.currentStatus": "當前狀態",
    "requestDetail.currentStep": "目前關卡",
    "requestDetail.createdAt": "建立時間",
    "requestDetail.submittedAt": "送出時間",
    "requestDetail.contentTitle": "申請內容",
    "requestDetail.progressTitle": "簽核進度",
    "requestDetail.progressSubtitle": "以下顯示案件目前流程位置。",
    "requestDetail.timelineTitle": "簽核歷程",
    "requestDetail.timelineSubtitle": "以下顯示從建立到目前為止的所有歷程紀錄。",
    "requestDetail.statusDescriptionTitle": "目前狀態說明",
    "requestDetail.stepper.requester": "提出申請",
    "requestDetail.stepper.manager": "主管審核",
    "requestDetail.stepper.hr": "最終核定",
    "requestDetail.timeline.created": "已建立申請",
    "requestDetail.timeline.submitted": "已送出申請",
    "requestDetail.timeline.submittedComment": "案件已正式送出。",
    "requestDetail.timeline.returnedByManager": "主管退回",
    "requestDetail.timeline.rejectedByManager": "主管駁回",
    "requestDetail.timeline.sentToHr": "主管已同意，送交 HR",
    "requestDetail.timeline.returnedByHr": "HR 退回",
    "requestDetail.timeline.rejectedByHr": "HR 駁回",
    "requestDetail.timeline.approved": "案件已核准",
    "requestDetail.timeline.cancelled": "申請人已撤回",
    "requestDetail.statusDesc.DRAFT":
      "此案件目前仍為草稿，尚未正式送出。你可以繼續編輯或刪除。",
    "requestDetail.statusDesc.PENDING_MANAGER":
      "此案件已送出，目前正等待主管審核。若主管尚未處理，你可視規則撤回申請。",
    "requestDetail.statusDesc.RETURNED_BY_MANAGER":
      "此案件已被主管退回，請依照意見補充內容後重新送出。",
    "requestDetail.statusDesc.REJECTED_BY_MANAGER":
      "此案件已被主管駁回，流程已結束。如需重新申請，請建立新案件。",
    "requestDetail.statusDesc.PENDING_HR":
      "此案件已通過主管審核，目前正等待 HR 最終核定。",
    "requestDetail.statusDesc.RETURNED_BY_HR":
      "此案件已被 HR 退回，請依照意見補充內容後重新送出。",
    "requestDetail.statusDesc.REJECTED_BY_HR":
      "此案件已被 HR 駁回，流程已結束。如需重新申請，請建立新案件。",
    "requestDetail.statusDesc.APPROVED": "此案件已完成核准，流程已結束。",
    "requestDetail.statusDesc.CANCELLED": "此案件已由你撤回，流程已結束。",

    "managerApproval.title": "簽核詳情",
    "managerApproval.pendingTitle": "待簽核案件",
    "managerApproval.description": "查看申請內容、簽核進度與歷程，並執行主管審核。",
    "managerApproval.loadingDescription": "載入案件資料中...",
    "managerApproval.loading": "簽核資料載入中...",
    "managerApproval.loadFailed": "載入失敗",
    "managerApproval.loadError": "載入簽核資料失敗。",
    "managerApproval.notFoundDescription": "查無此案件",
    "managerApproval.notFound": "找不到這筆簽核案件資料。",
    "managerApproval.backToList": "返回列表",
    "managerApproval.basicInfo": "案件基本資訊",
    "managerApproval.requestNo": "案件編號",
    "managerApproval.applicant": "申請人",
    "managerApproval.currentStatus": "當前狀態",
    "managerApproval.submittedAt": "送出時間",
    "managerApproval.contentTitle": "申請內容",
    "managerApproval.progressTitle": "簽核進度",
    "managerApproval.progressSubtitle": "目前流程位置與各節點狀態如下。",
    "managerApproval.timelineTitle": "簽核歷程",
    "managerApproval.timelineSubtitle": "以下顯示案件建立到目前為止的歷程紀錄。",
    "managerApproval.actionTitle": "主管簽核操作",
    "managerApproval.actionSubtitle": "請填寫簽核意見，並選擇同意、退回或駁回。",
    "managerApproval.commentLabel": "簽核意見",
    "managerApproval.commentPlaceholder": "請輸入審核意見，例如：內容完整，同意送 HR 核定。",
    "managerApproval.approve": "同意",
    "managerApproval.return": "退回",
    "managerApproval.reject": "駁回",
    "managerApproval.notPending": "此案件目前狀態為「{status}」，已不屬於主管可簽核狀態。",
    "managerApproval.actionFailed": "簽核操作失敗",
    "managerApproval.stepper.requester": "提出申請",
    "managerApproval.stepper.manager": "主管審核",
    "managerApproval.stepper.hr": "最終核定",
    "managerApproval.timeline.savedDraft": "已儲存草稿",
    "managerApproval.timeline.submitted": "已送出申請",
    "managerApproval.timeline.approved": "已同意",
    "managerApproval.timeline.returned": "已退回",
    "managerApproval.timeline.rejected": "已駁回",
    "managerApproval.timeline.cancelled": "申請人已撤回",
    "managerApproval.timeline.resubmitted": "已重新送出",
    "managerApproval.timeline.updated": "狀態更新",
    "managerApproval.timeline.managerApproved": "主管已同意",
    "managerApproval.timeline.hrApproved": "HR 已核准",
    "managerApproval.timeline.managerReturned": "主管退回",
    "managerApproval.timeline.hrReturned": "HR 退回",
    "managerApproval.timeline.managerRejected": "主管駁回",
    "managerApproval.timeline.hrRejected": "HR 駁回",
    "managerApproval.toast.approveSuccess": "主管已同意此案件，並已送交 HR。",
    "managerApproval.toast.approveFailed": "同意操作失敗",
    "managerApproval.toast.returnSuccess": "主管已退回此案件。",
    "managerApproval.toast.returnFailed": "退回操作失敗",
    "managerApproval.toast.rejectSuccess": "主管已駁回此案件。",
    "managerApproval.toast.rejectFailed": "駁回操作失敗",

    "pendingApproval.title": "待簽核案件",
    "pendingApproval.description":
      "查看目前等待你處理的案件，並可依條件查詢後進入簽核詳情頁。",
    "pendingApproval.filterTitle": "查詢條件",
    "pendingApproval.filterSubtitle": "可依關鍵字、狀態與申請類型篩選案件。",
    "pendingApproval.keywordLabel": "關鍵字搜尋",
    "pendingApproval.keywordPlaceholder": "輸入單號、申請人、標題或內容",
    "pendingApproval.tableTitle": "案件列表",
    "pendingApproval.resultCount": "共找到 {count} 筆資料",
    "pendingApproval.empty": "目前查無符合條件的待簽核案件。",
    "pendingApproval.loading": "待簽核案件載入中...",
    "pendingApproval.loadError": "載入待簽核案件失敗。",
    "pendingApproval.fetchError": "取得待簽核案件失敗。",
    "pendingApproval.invalidResponse": "回傳資料格式錯誤。",
    "pendingApproval.viewDetail": "查看詳情",
    "pendingApproval.applicant": "申請人",
    "pendingApproval.submittedAt": "送出時間",

    "pendingHr.title": "待核定案件",
    "pendingHr.description":
      "查看目前等待 HR 處理的案件，並可依條件查詢後進入核定詳情頁。",
    "pendingHr.filterTitle": "查詢條件",
    "pendingHr.filterSubtitle": "可依關鍵字、狀態與申請類型篩選案件。",
    "pendingHr.keywordLabel": "關鍵字搜尋",
    "pendingHr.keywordPlaceholder": "輸入單號、申請人、標題或內容",
    "pendingHr.tableTitle": "案件列表",
    "pendingHr.resultCount": "共找到 {count} 筆資料",
    "pendingHr.empty": "目前查無符合條件的待核定案件。",
    "pendingHr.loading": "HR 待核定案件載入中...",
    "pendingHr.loadError": "載入 HR 待核定案件失敗。",
    "pendingHr.fetchError": "取得 HR 待核定案件失敗。",
    "pendingHr.invalidResponse": "回傳資料格式錯誤。",
    "pendingHr.viewDetail": "查看詳情",
    "pendingHr.applicant": "申請人",
    "pendingHr.submittedAt": "送出時間",

    "hrApproval.title": "HR 核定詳情",
    "hrApproval.pendingTitle": "待核定案件",
    "hrApproval.description": "查看申請內容、簽核進度與歷程，並執行 HR 最終核定。",
    "hrApproval.loadingDescription": "載入案件資料中...",
    "hrApproval.loading": "核定資料載入中...",
    "hrApproval.loadFailed": "載入失敗",
    "hrApproval.loadError": "載入 HR 核定資料失敗。",
    "hrApproval.logsLoadError": "載入簽核歷程失敗。",
    "hrApproval.notFoundDescription": "查無此案件",
    "hrApproval.notFound": "找不到這筆 HR 核定案件資料。",
    "hrApproval.backToList": "返回列表",
    "hrApproval.basicInfo": "案件基本資訊",
    "hrApproval.actionTitle": "HR 核定操作",
    "hrApproval.actionSubtitle": "請填寫核定意見，並選擇核准、退回或駁回。",
    "hrApproval.commentLabel": "核定意見",
    "hrApproval.commentPlaceholder": "請輸入核定意見，例如：資料完整，核准結案。",
    "hrApproval.approve": "核准",
    "hrApproval.return": "退回",
    "hrApproval.reject": "駁回",
    "hrApproval.notPending": "此案件目前狀態為「{status}」，已不屬於 HR 可核定狀態。",
    "hrApproval.toast.approveSuccess": "HR 已核准此案件。",
    "hrApproval.toast.approveFailed": "HR 核准失敗。",
    "hrApproval.toast.returnSuccess": "HR 已退回此案件。",
    "hrApproval.toast.returnFailed": "HR 退回失敗。",
    "hrApproval.toast.rejectSuccess": "HR 已駁回此案件。",
    "hrApproval.toast.rejectFailed": "HR 駁回失敗。"
  },

  en: {
    systemName: "Approval System",
    systemSubtitle: "Approval Workflow System",
    notLoggedIn: "Not signed in",
    logout: "Logout",
    language: "Language",
    userIdentity: "User Identity",

    "common.home": "Home",
    "common.all": "All",
    "common.status": "Status",
    "common.requestType": "Request Type",
    "common.requestNo": "Request No.",
    "common.title": "Title",
    "common.startDate": "Start Date",
    "common.endDate": "End Date",
    "common.updatedAt": "Last Updated",
    "common.actions": "Actions",
    "common.view": "View",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.submit": "Submit Request",
    "common.saveDraft": "Save Draft",
    "common.processing": "Processing...",
    "common.remove": "Remove",
    "common.requestTypeRequired": "Request Type *",
    "common.titleRequired": "Request Title *",
    "common.contentRequired": "Request Content *",
    "common.notAvailable": "—",
    "common.invalidResponse": "Invalid response format.",

    "requestType.LEAVE": "Leave",
    "requestType.REIMBURSEMENT": "Reimbursement",
    "requestType.OVERTIME": "Overtime",

    "status.DRAFT": "Draft",
    "status.PENDING_MANAGER": "Pending Manager Review",
    "status.RETURNED_BY_MANAGER": "Returned by Manager",
    "status.REJECTED_BY_MANAGER": "Rejected by Manager",
    "status.PENDING_HR": "Pending HR Review",
    "status.RETURNED_BY_HR": "Returned by HR",
    "status.REJECTED_BY_HR": "Rejected by HR",
    "status.APPROVED": "Approved",
    "status.CANCELLED": "Cancelled",

    "role.REQUESTER": "Requester",
    "role.MANAGER": "Manager",
    "role.HR": "HR",
    "role.ADMIN": "Admin",

    "sidebar.requester": "REQUESTER",
    "sidebar.manager": "MANAGER",
    "sidebar.hr": "HR",
    "sidebar.admin": "ADMIN",
    "sidebar.dashboard": "Dashboard",
    "sidebar.myRequests": "My Requests",
    "sidebar.createRequest": "Create Request",
    "sidebar.pendingApprovals": "Pending Approvals",
    "sidebar.pendingHr": "Pending HR Reviews",
    "sidebar.userManagement": "User Management",
    "sidebar.managerMapping": "Manager Mapping",
    "sidebar.roleAssignment": "Role Assignment",
    "sidebar.departmentManagement": "Department Management",

    "requesterDashboard.title": "Hello, {name}",
    "requesterDashboard.description": "Welcome back to the approval system. Here is a summary of your current requests.",
    "requesterDashboard.defaultUserName": "User",
    "requesterDashboard.viewMyRequests": "View My Requests",
    "requesterDashboard.summary.total.title": "Total Requests",
    "requesterDashboard.summary.total.description": "Total number of all your requests",
    "requesterDashboard.summary.pending.title": "In Progress",
    "requesterDashboard.summary.pending.description": "Requests currently in the approval workflow",
    "requesterDashboard.summary.returned.title": "Returned",
    "requesterDashboard.summary.returned.description": "Requests that need revision or resubmission",
    "requesterDashboard.summary.approved.title": "Approved",
    "requesterDashboard.summary.approved.description": "Requests that have been fully approved",
    "requesterDashboard.summary.draft.title": "Drafts",
    "requesterDashboard.summary.draft.description": "Requests that have not been formally submitted",
    "requesterDashboard.quickActions.title": "Quick Actions",
    "requesterDashboard.quickActions.subtitle": "Use these shortcuts to access common features.",
    "requesterDashboard.quickActions.create": "Create Request",
    "requesterDashboard.quickActions.viewAll": "View All Requests",
    "requesterDashboard.recentRequests.title": "Recent Requests",
    "requesterDashboard.recentRequests.subtitle": "Showing your most recent requests for quick progress tracking.",
    "requesterDashboard.empty": "No request records yet. Please create your first request.",

    "managerDashboard.title": "Hello, {name}",
    "managerDashboard.description": "Here is an overview of the approval requests currently waiting for your review.",
    "managerDashboard.defaultUserName": "Manager",
    "managerDashboard.viewPending": "View Pending Approvals",
    "managerDashboard.summary.pending.title": "Pending Approvals",
    "managerDashboard.summary.pending.description": "Number of requests currently waiting for your review",
    "managerDashboard.summary.todaySubmitted.title": "Submitted Today",
    "managerDashboard.summary.todaySubmitted.description": "Number of new requests submitted today",
    "managerDashboard.summary.returned.title": "Returned",
    "managerDashboard.summary.returned.description": "Requests you have returned for revision",
    "managerDashboard.summary.rejected.title": "Rejected",
    "managerDashboard.summary.rejected.description": "Requests you have rejected and closed",
    "managerDashboard.quickActions.title": "Quick Actions",
    "managerDashboard.quickActions.subtitle": "Quickly access the features managers use most often.",
    "managerDashboard.quickActions.enterPendingList": "Open Pending Approval List",
    "managerDashboard.recentRequests.title": "Recent Pending Requests",
    "managerDashboard.recentRequests.subtitle": "Showing the most recent requests waiting for your approval.",
    "managerDashboard.empty": "There are currently no pending approval requests.",
    "managerDashboard.applicant": "Applicant",
    "managerDashboard.submittedAt": "Submitted At",
    "managerDashboard.viewDetail": "View Detail",

    "hrDashboard.title": "Hello, {name}",
    "hrDashboard.description": "Here is a summary of the requests currently waiting for your final HR review.",
    "hrDashboard.defaultUserName": "HR",
    "hrDashboard.viewPending": "View Pending HR Reviews",
    "hrDashboard.summary.pending.title": "Pending HR Reviews",
    "hrDashboard.summary.pending.description": "Number of requests currently waiting for HR processing",
    "hrDashboard.summary.todaySubmitted.title": "Submitted Today",
    "hrDashboard.summary.todaySubmitted.description": "Requests newly entered into the HR workflow today",
    "hrDashboard.summary.approved.title": "Approved",
    "hrDashboard.summary.approved.description": "Requests recently approved",
    "hrDashboard.summary.returned.title": "Returned",
    "hrDashboard.summary.returned.description": "Requests recently returned by HR for revision",
    "hrDashboard.quickActions.title": "Quick Actions",
    "hrDashboard.quickActions.subtitle": "Quickly access the features HR uses most often.",
    "hrDashboard.quickActions.enterPendingList": "Open Pending HR Review List",
    "hrDashboard.recentRequests.title": "Recent Pending Requests",
    "hrDashboard.recentRequests.subtitle": "Showing the most recent requests waiting for HR review.",
    "hrDashboard.empty": "There are currently no pending HR review requests.",
    "hrDashboard.applicant": "Applicant",
    "hrDashboard.submittedAt": "Submitted At",
    "hrDashboard.viewDetail": "View Detail",

    "requestList.title": "My Requests",
    "requestList.description":
      "View all your requests, filter by conditions, open details, or create a new request.",
    "requestList.createButton": "+ Create Request",
    "requestList.filterTitle": "Filters",
    "requestList.filterSubtitle":
      "Filter requests by keyword, status, and request type.",
    "requestList.keywordLabel": "Keyword Search",
    "requestList.keywordPlaceholder": "Enter request number, title, or content",
    "requestList.tableTitle": "Request List",
    "requestList.resultCount": "{count} result(s)",
    "requestList.currentApprover": "Current Approver",
    "requestList.empty": "No matching requests found.",
    "requestList.loading": "Loading requests...",
    "requestList.loadError": "Failed to load requests. Please try again later.",

    "requestCreate.title": "Create Request",
    "requestCreate.description":
      "Fill in the request form, then save as draft or submit directly.",
    "requestCreate.formTitle": "Request Form",
    "requestCreate.formSubtitle":
      "Please fill in the corresponding fields. Fields marked with * are required.",
    "requestCreate.titlePlaceholder": "Example: Family leave request",
    "requestCreate.contentPlaceholder":
      "Please describe the reason and related details of this request",
    "requestCreate.validation.titleRequired": "Please enter a request title",
    "requestCreate.validation.contentRequired": "Please enter request content",
    "requestCreate.validation.endDateInvalid":
      "End date cannot be earlier than start date",
    "requestCreate.attachment.title": "Attachments",
    "requestCreate.attachment.description":
      "Supports PDF, JPG, PNG, Word, and Excel. Max {size} MB per file, up to {count} files.",
    "requestCreate.attachment.maxCount":
      "You can upload up to {count} attachments only",
    "requestCreate.attachment.maxSize":
      "File \"{name}\" exceeds the {size} MB limit",
    "requestCreate.attachment.invalidType":
      "File \"{name}\" is not supported. Please upload PDF, image, or Office documents",
    "requestCreate.attachment.empty": "No attachments selected yet.",
    "requestCreate.toast.draftSaved": "Draft saved successfully.",
    "requestCreate.toast.draftFailed": "Failed to save draft.",
    "requestCreate.toast.submitSuccess": "Request submitted successfully.",
    "requestCreate.toast.submitFailed": "Failed to submit request.",

    "requestDetail.title": "Request Detail",
    "requestDetail.description":
      "View request content, current approval status, and full history.",
    "requestDetail.loadingDescription": "Loading request data...",
    "requestDetail.loadFailed": "Load failed",
    "requestDetail.loadError": "Failed to load request detail.",
    "requestDetail.notFoundDescription": "Request not found",
    "requestDetail.notFound": "Unable to find this request.",
    "requestDetail.loading": "Loading request data...",
    "requestDetail.backToList": "Back to List",
    "requestDetail.edit": "Edit Request",
    "requestDetail.withdraw": "Withdraw Request",
    "requestDetail.withdrawing": "Withdrawing...",
    "requestDetail.withdrawConfirm":
      "Are you sure you want to withdraw request \"{requestNo}\"?",
    "requestDetail.withdrawSuccess":
      "The request has been withdrawn successfully.",
    "requestDetail.withdrawFailed": "Failed to withdraw request.",
    "requestDetail.basicInfo": "Basic Information",
    "requestDetail.requestNo": "Request Number",
    "requestDetail.applicant": "Applicant",
    "requestDetail.requestTitle": "Request Title",
    "requestDetail.currentStatus": "Current Status",
    "requestDetail.currentStep": "Current Step",
    "requestDetail.createdAt": "Created At",
    "requestDetail.submittedAt": "Submitted At",
    "requestDetail.contentTitle": "Request Content",
    "requestDetail.progressTitle": "Approval Progress",
    "requestDetail.progressSubtitle":
      "The current workflow position is shown below.",
    "requestDetail.timelineTitle": "Approval Timeline",
    "requestDetail.timelineSubtitle":
      "Below is the full history from creation until now.",
    "requestDetail.statusDescriptionTitle": "Status Description",
    "requestDetail.stepper.requester": "Submit Request",
    "requestDetail.stepper.manager": "Manager Review",
    "requestDetail.stepper.hr": "Final Approval",
    "requestDetail.timeline.created": "Request Created",
    "requestDetail.timeline.submitted": "Request Submitted",
    "requestDetail.timeline.submittedComment":
      "The request has been officially submitted.",
    "requestDetail.timeline.returnedByManager": "Returned by Manager",
    "requestDetail.timeline.rejectedByManager": "Rejected by Manager",
    "requestDetail.timeline.sentToHr": "Approved by Manager and sent to HR",
    "requestDetail.timeline.returnedByHr": "Returned by HR",
    "requestDetail.timeline.rejectedByHr": "Rejected by HR",
    "requestDetail.timeline.approved": "Request Approved",
    "requestDetail.timeline.cancelled": "Withdrawn by Requester",
    "requestDetail.statusDesc.DRAFT":
      "This request is currently a draft and has not been formally submitted yet. You may continue editing or delete it.",
    "requestDetail.statusDesc.PENDING_MANAGER":
      "This request has been submitted and is currently waiting for manager review. You may be allowed to withdraw it before the manager processes it.",
    "requestDetail.statusDesc.RETURNED_BY_MANAGER":
      "This request has been returned by the manager. Please revise the content and resubmit.",
    "requestDetail.statusDesc.REJECTED_BY_MANAGER":
      "This request has been rejected by the manager and the workflow has ended. Please create a new request if needed.",
    "requestDetail.statusDesc.PENDING_HR":
      "This request has passed manager review and is currently waiting for final HR approval.",
    "requestDetail.statusDesc.RETURNED_BY_HR":
      "This request has been returned by HR. Please revise the content and resubmit.",
    "requestDetail.statusDesc.REJECTED_BY_HR":
      "This request has been rejected by HR and the workflow has ended. Please create a new request if needed.",
    "requestDetail.statusDesc.APPROVED":
      "This request has been fully approved and the workflow has ended.",
    "requestDetail.statusDesc.CANCELLED":
      "This request has been withdrawn by you and the workflow has ended.",

    "managerApproval.title": "Approval Detail",
    "managerApproval.pendingTitle": "Pending Approvals",
    "managerApproval.description":
      "View request content, approval progress, and history, then perform manager review.",
    "managerApproval.loadingDescription": "Loading request data...",
    "managerApproval.loading": "Loading approval data...",
    "managerApproval.loadFailed": "Load failed",
    "managerApproval.loadError": "Failed to load approval data.",
    "managerApproval.notFoundDescription": "Request not found",
    "managerApproval.notFound": "Unable to find this approval request.",
    "managerApproval.backToList": "Back to List",
    "managerApproval.basicInfo": "Basic Information",
    "managerApproval.requestNo": "Request Number",
    "managerApproval.applicant": "Applicant",
    "managerApproval.currentStatus": "Current Status",
    "managerApproval.submittedAt": "Submitted At",
    "managerApproval.contentTitle": "Request Content",
    "managerApproval.progressTitle": "Approval Progress",
    "managerApproval.progressSubtitle":
      "The current workflow position and step status are shown below.",
    "managerApproval.timelineTitle": "Approval Timeline",
    "managerApproval.timelineSubtitle":
      "Below is the history of this request from creation until now.",
    "managerApproval.actionTitle": "Manager Review Actions",
    "managerApproval.actionSubtitle":
      "Please enter your review comment, then approve, return, or reject the request.",
    "managerApproval.commentLabel": "Review Comment",
    "managerApproval.commentPlaceholder":
      "Enter your review comment, for example: The content is complete. Approve and send to HR.",
    "managerApproval.approve": "Approve",
    "managerApproval.return": "Return",
    "managerApproval.reject": "Reject",
    "managerApproval.notPending":
      "This request is currently in status \"{status}\" and is no longer available for manager review.",
    "managerApproval.actionFailed": "Approval action failed",
    "managerApproval.stepper.requester": "Submit Request",
    "managerApproval.stepper.manager": "Manager Review",
    "managerApproval.stepper.hr": "Final Approval",
    "managerApproval.timeline.savedDraft": "Draft Saved",
    "managerApproval.timeline.submitted": "Request Submitted",
    "managerApproval.timeline.approved": "Approved",
    "managerApproval.timeline.returned": "Returned",
    "managerApproval.timeline.rejected": "Rejected",
    "managerApproval.timeline.cancelled": "Withdrawn by Requester",
    "managerApproval.timeline.resubmitted": "Resubmitted",
    "managerApproval.timeline.updated": "Status Updated",
    "managerApproval.timeline.managerApproved": "Approved by Manager",
    "managerApproval.timeline.hrApproved": "Approved by HR",
    "managerApproval.timeline.managerReturned": "Returned by Manager",
    "managerApproval.timeline.hrReturned": "Returned by HR",
    "managerApproval.timeline.managerRejected": "Rejected by Manager",
    "managerApproval.timeline.hrRejected": "Rejected by HR",
    "managerApproval.toast.approveSuccess":
      "The manager approved this request and forwarded it to HR.",
    "managerApproval.toast.approveFailed": "Approve action failed",
    "managerApproval.toast.returnSuccess":
      "The manager returned this request.",
    "managerApproval.toast.returnFailed": "Return action failed",
    "managerApproval.toast.rejectSuccess":
      "The manager rejected this request.",
    "managerApproval.toast.rejectFailed": "Reject action failed",

    "pendingApproval.title": "Pending Approvals",
    "pendingApproval.description":
      "View requests waiting for your review, filter them, and open the approval detail page.",
    "pendingApproval.filterTitle": "Filters",
    "pendingApproval.filterSubtitle":
      "Filter requests by keyword, status, and request type.",
    "pendingApproval.keywordLabel": "Keyword Search",
    "pendingApproval.keywordPlaceholder":
      "Enter request number, applicant, title, or content",
    "pendingApproval.tableTitle": "Request List",
    "pendingApproval.resultCount": "{count} result(s)",
    "pendingApproval.empty": "No pending approval requests match the current filters.",
    "pendingApproval.loading": "Loading pending approval requests...",
    "pendingApproval.loadError": "Failed to load pending approval requests.",
    "pendingApproval.fetchError": "Failed to fetch pending approval requests.",
    "pendingApproval.invalidResponse": "Invalid response format.",
    "pendingApproval.viewDetail": "View Detail",
    "pendingApproval.applicant": "Applicant",
    "pendingApproval.submittedAt": "Submitted At",

    "pendingHr.title": "Pending HR Reviews",
    "pendingHr.description":
      "View requests waiting for HR processing, filter them, and open the review detail page.",
    "pendingHr.filterTitle": "Filters",
    "pendingHr.filterSubtitle":
      "Filter requests by keyword, status, and request type.",
    "pendingHr.keywordLabel": "Keyword Search",
    "pendingHr.keywordPlaceholder":
      "Enter request number, applicant, title, or content",
    "pendingHr.tableTitle": "Request List",
    "pendingHr.resultCount": "{count} result(s)",
    "pendingHr.empty": "No pending HR review requests match the current filters.",
    "pendingHr.loading": "Loading pending HR review requests...",
    "pendingHr.loadError": "Failed to load pending HR review requests.",
    "pendingHr.fetchError": "Failed to fetch pending HR review requests.",
    "pendingHr.invalidResponse": "Invalid response format.",
    "pendingHr.viewDetail": "View Detail",
    "pendingHr.applicant": "Applicant",
    "pendingHr.submittedAt": "Submitted At",

    "hrApproval.title": "HR Review Detail",
    "hrApproval.pendingTitle": "Pending HR Reviews",
    "hrApproval.description":
      "View request content, approval progress, and history, then perform final HR review.",
    "hrApproval.loadingDescription": "Loading request data...",
    "hrApproval.loading": "Loading HR review data...",
    "hrApproval.loadFailed": "Load failed",
    "hrApproval.loadError": "Failed to load HR review data.",
    "hrApproval.logsLoadError": "Failed to load approval timeline.",
    "hrApproval.notFoundDescription": "Request not found",
    "hrApproval.notFound": "Unable to find this HR review request.",
    "hrApproval.backToList": "Back to List",
    "hrApproval.basicInfo": "Basic Information",
    "hrApproval.actionTitle": "HR Review Actions",
    "hrApproval.actionSubtitle":
      "Please enter your review comment, then approve, return, or reject the request.",
    "hrApproval.commentLabel": "Review Comment",
    "hrApproval.commentPlaceholder":
      "Enter your review comment, for example: The documents are complete. Approve and close the request.",
    "hrApproval.approve": "Approve",
    "hrApproval.return": "Return",
    "hrApproval.reject": "Reject",
    "hrApproval.notPending":
      "This request is currently in status \"{status}\" and is no longer available for HR review.",
    "hrApproval.toast.approveSuccess": "HR approved this request.",
    "hrApproval.toast.approveFailed": "HR approve action failed.",
    "hrApproval.toast.returnSuccess": "HR returned this request.",
    "hrApproval.toast.returnFailed": "HR return action failed.",
    "hrApproval.toast.rejectSuccess": "HR rejected this request.",
    "hrApproval.toast.rejectFailed": "HR reject action failed."
  },
};

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

export function t(
  language: AppLanguage,
  key: TranslationKey,
  params?: TranslationParams
): string {
  const message = messages[language]?.[key] ?? messages["zh-TW"][key] ?? key;
  return interpolate(message, params);
}