import type { Request, Response } from "express";

interface UploadedFile {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
}

type RequestStatus =
  | "DRAFT"
  | "PENDING_MANAGER"
  | "RETURNED_BY_MANAGER"
  | "REJECTED_BY_MANAGER"
  | "PENDING_HR"
  | "RETURNED_BY_HR"
  | "REJECTED_BY_HR"
  | "APPROVED"
  | "CANCELLED";

type RequestType = "LEAVE" | "REIMBURSEMENT" | "OVERTIME";

type RequestStep =
  | "DRAFT_STEP"
  | "MANAGER_REVIEW"
  | "REQUESTER_REVISION"
  | "HR_REVIEW"
  | "COMPLETED";

interface RequestAttachment {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
}

interface RequestRecord {
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
  attachments: RequestAttachment[];
}

type ApprovalActionType =
  | "SAVE_DRAFT"
  | "SUBMIT"
  | "APPROVE"
  | "RETURN"
  | "REJECT"
  | "CANCEL"
  | "RESUBMIT";

interface ApprovalLogRecord {
  id: number;
  requestId: number;
  actionBy: string;
  actionRole: "Requester" | "Manager" | "HR";
  actionType: ApprovalActionType;
  fromStatus?: RequestStatus;
  toStatus: RequestStatus;
  comment?: string;
  actionTime: string;
}

const requests: RequestRecord[] = [
  {
    id: 1,
    requestNo: "REQ202604150001",
    applicantId: 101,
    applicantName: "王小明",
    requestType: "LEAVE",
    title: "家庭因素請假申請",
    content: "因家庭因素需請假兩天，敬請主管核准。",
    startDate: "2026-04-16",
    endDate: "2026-04-17",
    status: "PENDING_MANAGER",
    currentStep: "MANAGER_REVIEW",
    currentApproverId: 2,
    currentApproverName: "陳主任",
    submittedAt: "2026-04-15 09:00",
    createdAt: "2026-04-15 08:30",
    updatedAt: "2026-04-15 09:00",
    attachments: [],
  },
  {
    id: 2,
    requestNo: "REQ202604140002",
    applicantId: 101,
    applicantName: "王小明",
    requestType: "REIMBURSEMENT",
    title: "研討會交通費報銷",
    content: "申請報銷參加研討會之交通費用。",
    startDate: "2026-04-12",
    endDate: "2026-04-12",
    status: "APPROVED",
    currentStep: "COMPLETED",
    submittedAt: "2026-04-14 10:00",
    approvedAt: "2026-04-14 16:30",
    createdAt: "2026-04-14 09:30",
    updatedAt: "2026-04-14 16:30",
    attachments: [],
  },
  {
    id: 3,
    requestNo: "REQ202604130003",
    applicantId: 101,
    applicantName: "王小明",
    requestType: "LEAVE",
    title: "個人事由請假申請",
    content: "因個人事由需請假一天，敬請主管核准。",
    startDate: "2026-04-20",
    endDate: "2026-04-20",
    status: "RETURNED_BY_MANAGER",
    currentStep: "REQUESTER_REVISION",
    submittedAt: "2026-04-13 09:00",
    createdAt: "2026-04-13 08:20",
    updatedAt: "2026-04-13 15:40",
    attachments: [],
  },
  {
    id: 4,
    requestNo: "REQ202604120004",
    applicantId: 101,
    applicantName: "王小明",
    requestType: "OVERTIME",
    title: "專案加班申請",
    content: "因專案進度需求申請加班。",
    startDate: "2026-04-11",
    endDate: "2026-04-11",
    status: "DRAFT",
    currentStep: "DRAFT_STEP",
    createdAt: "2026-04-12 18:30",
    updatedAt: "2026-04-12 18:30",
    attachments: [],
  },
];

const approvalLogs: ApprovalLogRecord[] = [
  {
    id: 1,
    requestId: 1,
    actionBy: "王小明",
    actionRole: "Requester",
    actionType: "SUBMIT",
    fromStatus: "DRAFT",
    toStatus: "PENDING_MANAGER",
    actionTime: "2026-04-15 09:00",
    comment: "請主管協助審核。",
  },
  {
    id: 2,
    requestId: 2,
    actionBy: "王小明",
    actionRole: "Requester",
    actionType: "SUBMIT",
    fromStatus: "DRAFT",
    toStatus: "APPROVED",
    actionTime: "2026-04-14 10:00",
  },
  {
    id: 3,
    requestId: 3,
    actionBy: "陳主任",
    actionRole: "Manager",
    actionType: "RETURN",
    fromStatus: "PENDING_MANAGER",
    toStatus: "RETURNED_BY_MANAGER",
    actionTime: "2026-04-13 15:40",
    comment: "請補充請假事由。",
  },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function generateRequestNo(id: number) {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const serial = String(id).padStart(4, "0");

  return `REQ${year}${month}${day}${serial}`;
}

function getNextApprovalLogId() {
  const maxId = approvalLogs.reduce<number>((max, item) => {
    return Math.max(max, item.id);
  }, 0);

  return maxId + 1;
}

function appendApprovalLog(log: Omit<ApprovalLogRecord, "id">) {
  approvalLogs.push({
    id: getNextApprovalLogId(),
    ...log,
  });
}

function getRequestOr404(requestId: number, res: Response) {
  if (Number.isNaN(requestId)) {
    res.status(400).json({
      message: "Invalid request id",
    });
    return null;
  }

  const requestItem = requests.find((item) => item.id === requestId);

  if (!requestItem) {
    res.status(404).json({
      message: "Request not found",
    });
    return null;
  }

  return requestItem;
}

export async function getRequests(_req: Request, res: Response) {
  try {
    return res.status(200).json({
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    console.error("getRequests error:", error);

    return res.status(500).json({
      message: "Failed to fetch requests",
    });
  }
}

export async function getRequestById(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    return res.status(200).json({
      message: "Request fetched successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("getRequestById error:", error);

    return res.status(500).json({
      message: "Failed to fetch request detail",
    });
  }
}

export async function getRequestApprovalLogs(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    const logs = approvalLogs
      .filter((item) => item.requestId === requestId)
      .sort((a, b) => a.id - b.id);

    return res.status(200).json({
      message: "Approval logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    console.error("getRequestApprovalLogs error:", error);

    return res.status(500).json({
      message: "Failed to fetch approval logs",
    });
  }
}

export async function createRequest(req: Request, res: Response) {
  try {
    const { requestType, title, content, startDate, endDate, mode } = req.body;

    if (!requestType || !title) {
      return res.status(400).json({
        message: "Request type and title are required",
      });
    }

    const files = (req as Request & { files?: UploadedFile[] }).files ?? [];

    const attachments = files.map((file) => ({
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
    }));

    const nowText = formatDateTime(new Date());
    const maxId = requests.reduce<number>((max, item) => {
      return Math.max(max, item.id);
    }, 0);
    const newId = maxId + 1;
    const isDraft = mode === "draft";

    const newRequest: RequestRecord = {
      id: newId,
      requestNo: generateRequestNo(newId),
      applicantId: 101,
      applicantName: "王小明",
      requestType: requestType as RequestType,
      title,
      content,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: isDraft ? "DRAFT" : "PENDING_MANAGER",
      currentStep: isDraft ? "DRAFT_STEP" : "MANAGER_REVIEW",
      currentApproverId: isDraft ? undefined : 2,
      currentApproverName: isDraft ? undefined : "陳主任",
      submittedAt: isDraft ? undefined : nowText,
      createdAt: nowText,
      updatedAt: nowText,
      attachments,
    };

    requests.unshift(newRequest);

    appendApprovalLog({
      requestId: newRequest.id,
      actionBy: newRequest.applicantName,
      actionRole: "Requester",
      actionType: isDraft ? "SAVE_DRAFT" : "SUBMIT",
      fromStatus: isDraft ? undefined : "DRAFT",
      toStatus: newRequest.status,
      comment: isDraft ? "已儲存草稿。" : "案件已正式送出。",
      actionTime: nowText,
    });

    return res.status(201).json({
      message: isDraft ? "Draft saved" : "Request submitted",
      data: newRequest,
    });
  } catch (error) {
    console.error("createRequest error:", error);

    return res.status(500).json({
      message: "Failed to create request",
    });
  }
}

export async function updateRequest(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    const editable =
      requestItem.status === "DRAFT" ||
      requestItem.status === "RETURNED_BY_MANAGER" ||
      requestItem.status === "RETURNED_BY_HR";

    if (!editable) {
      return res.status(400).json({
        message: "Current status cannot be edited",
      });
    }

    const {
      requestType,
      title,
      content,
      startDate,
      endDate,
    } = req.body as {
      requestType?: RequestType;
      title?: string;
      content?: string;
      startDate?: string | null;
      endDate?: string | null;
    };

    if (requestType) {
      requestItem.requestType = requestType;
    }

    if (typeof title === "string") {
      requestItem.title = title;
    }

    if (typeof content === "string") {
      requestItem.content = content;
    }

    requestItem.startDate = startDate || undefined;
    requestItem.endDate = endDate || undefined;
    requestItem.updatedAt = formatDateTime(new Date());

    return res.status(200).json({
      message: "Request updated successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("updateRequest error:", error);

    return res.status(500).json({
      message: "Failed to update request",
    });
  }
}

export async function resubmitRequest(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    const canResubmit =
      requestItem.status === "DRAFT" ||
      requestItem.status === "RETURNED_BY_MANAGER" ||
      requestItem.status === "RETURNED_BY_HR";

    if (!canResubmit) {
      return res.status(400).json({
        message: "Current status cannot be resubmitted",
      });
    }

    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "PENDING_MANAGER";
    requestItem.currentStep = "MANAGER_REVIEW";
    requestItem.currentApproverId = 2;
    requestItem.currentApproverName = "陳主任";
    requestItem.submittedAt = nowText;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: requestItem.applicantName,
      actionRole: "Requester",
      actionType: "RESUBMIT",
      fromStatus,
      toStatus: "PENDING_MANAGER",
      comment: "申請人已重新送出案件。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request resubmitted successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("resubmitRequest error:", error);

    return res.status(500).json({
      message: "Failed to resubmit request",
    });
  }
}

export async function cancelRequest(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    const cancelableStatuses: RequestStatus[] = [
      "DRAFT",
      "PENDING_MANAGER",
      "RETURNED_BY_MANAGER",
      "RETURNED_BY_HR",
    ];

    if (!cancelableStatuses.includes(requestItem.status)) {
      return res.status(400).json({
        message:
          "Current status cannot be cancelled (e.g., already approved or rejected)",
      });
    }

    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "CANCELLED";
    requestItem.currentStep = "COMPLETED";
    requestItem.currentApproverId = undefined;
    requestItem.currentApproverName = undefined;
    requestItem.cancelledAt = nowText;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: requestItem.applicantName,
      actionRole: "Requester",
      actionType: "CANCEL",
      fromStatus,
      toStatus: "CANCELLED",
      comment: "申請人已撤回案件。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request cancelled successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("cancelRequest error:", error);

    return res.status(500).json({
      message: "Failed to cancel request",
    });
  }
}

export async function approveRequestByManager(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    if (requestItem.status !== "PENDING_MANAGER") {
      return res.status(400).json({
        message: "Only requests pending manager review can be approved",
      });
    }

    const { comment } = req.body as { comment?: string };
    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "PENDING_HR";
    requestItem.currentStep = "HR_REVIEW";
    requestItem.currentApproverId = 3;
    requestItem.currentApproverName = "HR";
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: "陳主任",
      actionRole: "Manager",
      actionType: "APPROVE",
      fromStatus,
      toStatus: "PENDING_HR",
      comment: comment?.trim() || "主管已同意。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request approved by manager successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("approveRequestByManager error:", error);

    return res.status(500).json({
      message: "Failed to approve request",
    });
  }
}

export async function returnRequestByManager(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    if (requestItem.status !== "PENDING_MANAGER") {
      return res.status(400).json({
        message: "Only requests pending manager review can be returned",
      });
    }

    const { comment } = req.body as { comment?: string };
    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "RETURNED_BY_MANAGER";
    requestItem.currentStep = "REQUESTER_REVISION";
    requestItem.currentApproverId = undefined;
    requestItem.currentApproverName = undefined;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: "陳主任",
      actionRole: "Manager",
      actionType: "RETURN",
      fromStatus,
      toStatus: "RETURNED_BY_MANAGER",
      comment: comment?.trim() || "主管退回補件。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request returned by manager successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("returnRequestByManager error:", error);

    return res.status(500).json({
      message: "Failed to return request",
    });
  }
}

export async function rejectRequestByManager(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    if (requestItem.status !== "PENDING_MANAGER") {
      return res.status(400).json({
        message: "Only requests pending manager review can be rejected",
      });
    }

    const { comment } = req.body as { comment?: string };
    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "REJECTED_BY_MANAGER";
    requestItem.currentStep = "COMPLETED";
    requestItem.currentApproverId = undefined;
    requestItem.currentApproverName = undefined;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: "陳主任",
      actionRole: "Manager",
      actionType: "REJECT",
      fromStatus,
      toStatus: "REJECTED_BY_MANAGER",
      comment: comment?.trim() || "主管已駁回。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request rejected by manager successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("rejectRequestByManager error:", error);

    return res.status(500).json({
      message: "Failed to reject request",
    });
  }
}

export async function approveRequestByHr(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    if (requestItem.status !== "PENDING_HR") {
      return res.status(400).json({
        message: "Only requests pending HR review can be approved",
      });
    }

    const { comment } = req.body as { comment?: string };
    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "APPROVED";
    requestItem.currentStep = "COMPLETED";
    requestItem.currentApproverId = undefined;
    requestItem.currentApproverName = undefined;
    requestItem.approvedAt = nowText;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: "HR",
      actionRole: "HR",
      actionType: "APPROVE",
      fromStatus,
      toStatus: "APPROVED",
      comment: comment?.trim() || "HR 已核准。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request approved by HR successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("approveRequestByHr error:", error);

    return res.status(500).json({
      message: "Failed to approve request by HR",
    });
  }
}

export async function returnRequestByHr(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    if (requestItem.status !== "PENDING_HR") {
      return res.status(400).json({
        message: "Only requests pending HR review can be returned",
      });
    }

    const { comment } = req.body as { comment?: string };
    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "RETURNED_BY_HR";
    requestItem.currentStep = "REQUESTER_REVISION";
    requestItem.currentApproverId = undefined;
    requestItem.currentApproverName = undefined;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: "HR",
      actionRole: "HR",
      actionType: "RETURN",
      fromStatus,
      toStatus: "RETURNED_BY_HR",
      comment: comment?.trim() || "HR 退回補件。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request returned by HR successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("returnRequestByHr error:", error);

    return res.status(500).json({
      message: "Failed to return request by HR",
    });
  }
}

export async function rejectRequestByHr(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);
    const requestItem = getRequestOr404(requestId, res);

    if (!requestItem) {
      return;
    }

    if (requestItem.status !== "PENDING_HR") {
      return res.status(400).json({
        message: "Only requests pending HR review can be rejected",
      });
    }

    const { comment } = req.body as { comment?: string };
    const nowText = formatDateTime(new Date());
    const fromStatus = requestItem.status;

    requestItem.status = "REJECTED_BY_HR";
    requestItem.currentStep = "COMPLETED";
    requestItem.currentApproverId = undefined;
    requestItem.currentApproverName = undefined;
    requestItem.updatedAt = nowText;

    appendApprovalLog({
      requestId: requestItem.id,
      actionBy: "HR",
      actionRole: "HR",
      actionType: "REJECT",
      fromStatus,
      toStatus: "REJECTED_BY_HR",
      comment: comment?.trim() || "HR 已駁回。",
      actionTime: nowText,
    });

    return res.status(200).json({
      message: "Request rejected by HR successfully",
      data: requestItem,
    });
  } catch (error) {
    console.error("rejectRequestByHr error:", error);

    return res.status(500).json({
      message: "Failed to reject request by HR",
    });
  }
}