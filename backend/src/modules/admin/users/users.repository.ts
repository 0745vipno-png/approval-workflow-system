interface AdminUserItem {
  id: number;
  employeeNo: string;
  name: string;
  email: string;
  departmentId: number | null;
  departmentName: string | null;
  roles: string[];
  accountStatus: "ACTIVE" | "INACTIVE" | "LOCKED";
  createdAt: string;
  updatedAt: string;
}

interface FindAdminUsersParams {
  keyword: string;
  status: string;
  role: string;
}

interface CreateAdminUserParams {
  employeeNo: string;
  name: string;
  email: string;
  departmentId?: number | null;
  departmentName?: string | null;
  roles: string[];
  accountStatus?: "ACTIVE" | "INACTIVE" | "LOCKED";
}

const mockUsers: AdminUserItem[] = [
  {
    id: 1,
    employeeNo: "A001",
    name: "王小明",
    email: "wang@example.com",
    departmentId: 1,
    departmentName: "資訊中心",
    roles: ["REQUESTER"],
    accountStatus: "ACTIVE",
    createdAt: "2026-01-05 09:30",
    updatedAt: "2026-04-14 13:20",
  },
  {
    id: 2,
    employeeNo: "M001",
    name: "陳主任",
    email: "chen@example.com",
    departmentId: 1,
    departmentName: "資訊中心",
    roles: ["MANAGER"],
    accountStatus: "ACTIVE",
    createdAt: "2026-01-03 10:00",
    updatedAt: "2026-04-12 11:10",
  },
  {
    id: 3,
    employeeNo: "H001",
    name: "林人資",
    email: "lin.hr@example.com",
    departmentId: 2,
    departmentName: "人事室",
    roles: ["HR"],
    accountStatus: "ACTIVE",
    createdAt: "2026-01-04 08:40",
    updatedAt: "2026-04-11 15:30",
  },
  {
    id: 4,
    employeeNo: "AD01",
    name: "系統管理員",
    email: "admin@example.com",
    departmentId: 1,
    departmentName: "資訊中心",
    roles: ["ADMIN"],
    accountStatus: "ACTIVE",
    createdAt: "2026-01-01 09:00",
    updatedAt: "2026-04-15 08:00",
  },
  {
    id: 5,
    employeeNo: "A002",
    name: "李小華",
    email: "lee@example.com",
    departmentId: 3,
    departmentName: "教務處",
    roles: ["REQUESTER"],
    accountStatus: "INACTIVE",
    createdAt: "2026-02-10 09:20",
    updatedAt: "2026-04-10 16:00",
  },
  {
    id: 6,
    employeeNo: "A003",
    name: "陳美玲",
    email: "mei@example.com",
    departmentId: 2,
    departmentName: "人事室",
    roles: ["REQUESTER", "MANAGER"],
    accountStatus: "LOCKED",
    createdAt: "2026-02-18 14:20",
    updatedAt: "2026-04-09 10:45",
  },
];

let nextUserId = mockUsers.length + 1;

function getMockNow() {
  return "2026-04-17 15:30";
}

export async function findAdminUsers(params: FindAdminUsersParams) {
  const keyword = params.keyword.trim().toLowerCase();
  const status = params.status.trim();
  const role = params.role.trim();

  const filteredUsers = mockUsers.filter((user) => {
    const matchesKeyword =
      !keyword ||
      user.name.toLowerCase().includes(keyword) ||
      user.employeeNo.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      (user.departmentName ?? "").toLowerCase().includes(keyword);

    const matchesStatus = !status || user.accountStatus === status;
    const matchesRole = !role || user.roles.includes(role);

    return matchesKeyword && matchesStatus && matchesRole;
  });

  return filteredUsers;
}

export async function createAdminUser(params: CreateAdminUserParams) {
  const duplicatedEmployeeNo = mockUsers.find(
    (user) =>
      user.employeeNo.trim().toLowerCase() ===
      params.employeeNo.trim().toLowerCase()
  );

  if (duplicatedEmployeeNo) {
    throw new Error("員工編號已存在");
  }

  const duplicatedEmail = mockUsers.find(
    (user) => user.email.trim().toLowerCase() === params.email.trim().toLowerCase()
  );

  if (duplicatedEmail) {
    throw new Error("Email 已存在");
  }

  const now = getMockNow();

  const newUser: AdminUserItem = {
    id: nextUserId++,
    employeeNo: params.employeeNo,
    name: params.name,
    email: params.email,
    departmentId: params.departmentId ?? null,
    departmentName: params.departmentName ?? null,
    roles: params.roles,
    accountStatus: params.accountStatus ?? "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  mockUsers.unshift(newUser);

  return newUser;
}