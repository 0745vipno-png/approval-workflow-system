interface RoleAssignmentItem {
  id: number;
  employeeNo: string;
  name: string;
  email: string;
  departmentName: string;
  roles: string[];
  accountStatus: "ACTIVE" | "INACTIVE" | "LOCKED";
  updatedAt: string;
}

interface FindRoleAssignmentsParams {
  keyword: string;
  role: string;
}

const mockRoleAssignments: RoleAssignmentItem[] = [
  {
    id: 1,
    employeeNo: "A001",
    name: "王小明",
    email: "wang@example.com",
    departmentName: "資訊中心",
    roles: ["REQUESTER"],
    accountStatus: "ACTIVE",
    updatedAt: "2026-04-14 13:20",
  },
  {
    id: 2,
    employeeNo: "M001",
    name: "陳主任",
    email: "chen@example.com",
    departmentName: "資訊中心",
    roles: ["MANAGER"],
    accountStatus: "ACTIVE",
    updatedAt: "2026-04-12 11:10",
  },
  {
    id: 3,
    employeeNo: "H001",
    name: "林人資",
    email: "lin.hr@example.com",
    departmentName: "人事室",
    roles: ["HR"],
    accountStatus: "ACTIVE",
    updatedAt: "2026-04-11 15:30",
  },
  {
    id: 4,
    employeeNo: "AD01",
    name: "系統管理員",
    email: "admin@example.com",
    departmentName: "資訊中心",
    roles: ["ADMIN"],
    accountStatus: "ACTIVE",
    updatedAt: "2026-04-15 08:00",
  },
  {
    id: 5,
    employeeNo: "A002",
    name: "李小華",
    email: "lee@example.com",
    departmentName: "教務處",
    roles: ["REQUESTER", "MANAGER"],
    accountStatus: "ACTIVE",
    updatedAt: "2026-04-10 16:00",
  },
];

function getMockNow() {
  return "2026-04-17 17:30";
}

export async function findRoleAssignments(params: FindRoleAssignmentsParams) {
  const keyword = params.keyword.trim().toLowerCase();
  const role = params.role.trim();

  return mockRoleAssignments.filter((user) => {
    const matchesKeyword =
      !keyword ||
      user.name.toLowerCase().includes(keyword) ||
      user.employeeNo.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.departmentName.toLowerCase().includes(keyword);

    const matchesRole = !role || user.roles.includes(role);

    return matchesKeyword && matchesRole;
  });
}

export async function addRoleToUser(userId: number, role: string) {
  const user = mockRoleAssignments.find((item) => item.id === userId);

  if (!user) {
    throw new Error("找不到指定使用者");
  }

  if (user.roles.includes(role)) {
    throw new Error(`${user.name} 已經擁有角色：${role}`);
  }

  user.roles = [...user.roles, role];
  user.updatedAt = getMockNow();

  return user;
}

export async function removeRoleFromUser(userId: number, role: string) {
  const user = mockRoleAssignments.find((item) => item.id === userId);

  if (!user) {
    throw new Error("找不到指定使用者");
  }

  if (!user.roles.includes(role)) {
    throw new Error(`${user.name} 目前沒有角色：${role}`);
  }

  if (user.roles.length === 1) {
    throw new Error("至少要保留一個角色，不能把最後一個角色移除。");
  }

  user.roles = user.roles.filter((item) => item !== role);
  user.updatedAt = getMockNow();

  return user;
}