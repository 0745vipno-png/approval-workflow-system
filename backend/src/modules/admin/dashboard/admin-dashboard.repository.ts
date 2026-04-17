interface AdminDashboardSummary {
  usersCount: number;
  departmentsCount: number;
  managerMappingsCount: number;
  activeRequestsCount: number;
  pendingManagerCount: number;
  pendingHrCount: number;
  approvedCount: number;
  returnedCount: number;
}

interface AdminRecentRequestItem {
  id: number;
  requestNo: string;
  applicantId: number;
  applicantName: string;
  requestType: "LEAVE" | "REIMBURSEMENT" | "OVERTIME";
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status:
    | "DRAFT"
    | "PENDING_MANAGER"
    | "RETURNED_BY_MANAGER"
    | "REJECTED_BY_MANAGER"
    | "PENDING_HR"
    | "RETURNED_BY_HR"
    | "REJECTED_BY_HR"
    | "APPROVED"
    | "CANCELLED";
  currentStep: string;
  currentApproverId?: number;
  currentApproverName?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

interface AdminDashboardData {
  summary: AdminDashboardSummary;
  recentRequests: AdminRecentRequestItem[];
}

const mockRecentRequests: AdminRecentRequestItem[] = [
  {
    id: 101,
    requestNo: "REQ202604150101",
    applicantId: 201,
    applicantName: "王小明",
    requestType: "LEAVE",
    title: "家庭因素請假申請",
    content: "因家庭因素需請假兩天。",
    startDate: "2026-04-16",
    endDate: "2026-04-17",
    status: "PENDING_MANAGER",
    currentStep: "MANAGER_REVIEW",
    currentApproverId: 2,
    currentApproverName: "陳主任",
    submittedAt: "2026-04-15 09:00",
    createdAt: "2026-04-15 08:30",
    updatedAt: "2026-04-15 09:00",
  },
  {
    id: 102,
    requestNo: "REQ202604150102",
    applicantId: 202,
    applicantName: "李小華",
    requestType: "REIMBURSEMENT",
    title: "交通費報銷申請",
    content: "申請報銷外出會議之交通費。",
    startDate: "2026-04-14",
    endDate: "2026-04-14",
    status: "PENDING_HR",
    currentStep: "HR_REVIEW",
    currentApproverName: "人資部門",
    submittedAt: "2026-04-15 10:20",
    createdAt: "2026-04-15 10:00",
    updatedAt: "2026-04-15 11:10",
  },
  {
    id: 103,
    requestNo: "REQ202604150103",
    applicantId: 203,
    applicantName: "陳美玲",
    requestType: "OVERTIME",
    title: "專案加班申請",
    content: "因系統上線前測試需求申請加班。",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    status: "APPROVED",
    currentStep: "COMPLETED",
    approvedAt: "2026-04-15 13:40",
    createdAt: "2026-04-15 10:50",
    updatedAt: "2026-04-15 13:40",
  },
  {
    id: 104,
    requestNo: "REQ202604150104",
    applicantId: 204,
    applicantName: "周佩珊",
    requestType: "LEAVE",
    title: "病假申請",
    content: "因身體不適申請病假。",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    status: "RETURNED_BY_MANAGER",
    currentStep: "REQUESTER_REVISION",
    createdAt: "2026-04-15 09:40",
    updatedAt: "2026-04-15 12:10",
  },
];

export async function findAdminDashboard(): Promise<AdminDashboardData> {
  const summary: AdminDashboardSummary = {
    usersCount: 128,
    departmentsCount: 12,
    managerMappingsCount: 104,
    activeRequestsCount: 27,
    pendingManagerCount: mockRecentRequests.filter(
      (item) => item.status === "PENDING_MANAGER"
    ).length,
    pendingHrCount: mockRecentRequests.filter(
      (item) => item.status === "PENDING_HR"
    ).length,
    approvedCount: mockRecentRequests.filter(
      (item) => item.status === "APPROVED"
    ).length,
    returnedCount: mockRecentRequests.filter(
      (item) =>
        item.status === "RETURNED_BY_MANAGER" ||
        item.status === "RETURNED_BY_HR"
    ).length,
  };

  return {
    summary,
    recentRequests: mockRecentRequests,
  };
}