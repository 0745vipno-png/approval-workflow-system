interface AdminDepartmentItem {
  id: number;
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName?: string | null;
  memberCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

interface FindAdminDepartmentsParams {
  keyword: string;
  status: string;
}

interface CreateAdminDepartmentParams {
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName?: string | null;
  memberCount?: number;
  status?: "ACTIVE" | "INACTIVE";
}

interface UpdateAdminDepartmentParams {
  id: number;
  departmentCode: string;
  departmentName: string;
  managerId?: number | null;
  managerName?: string | null;
  memberCount: number;
  status: "ACTIVE" | "INACTIVE";
}

const mockDepartments: AdminDepartmentItem[] = [
  {
    id: 1,
    departmentCode: "ITC",
    departmentName: "資訊中心",
    managerId: 201,
    managerName: "陳主任",
    memberCount: 18,
    status: "ACTIVE",
    createdAt: "2026-01-01 09:00",
    updatedAt: "2026-04-15 10:00",
  },
  {
    id: 2,
    departmentCode: "ACA",
    departmentName: "教務處",
    managerId: 202,
    managerName: "林主任",
    memberCount: 24,
    status: "ACTIVE",
    createdAt: "2026-01-02 09:00",
    updatedAt: "2026-04-12 14:10",
  },
  {
    id: 3,
    departmentCode: "HRD",
    departmentName: "人事室",
    managerId: 203,
    managerName: "張主任",
    memberCount: 10,
    status: "ACTIVE",
    createdAt: "2026-01-03 09:00",
    updatedAt: "2026-04-10 16:20",
  },
  {
    id: 4,
    departmentCode: "GEN",
    departmentName: "總務處",
    managerId: 204,
    managerName: "黃主任",
    memberCount: 15,
    status: "ACTIVE",
    createdAt: "2026-01-04 09:00",
    updatedAt: "2026-04-08 11:40",
  },
  {
    id: 5,
    departmentCode: "TMP",
    departmentName: "臨時專案辦公室",
    managerId: null,
    managerName: null,
    memberCount: 4,
    status: "INACTIVE",
    createdAt: "2026-02-01 09:00",
    updatedAt: "2026-03-31 18:00",
  },
];

let nextDepartmentId = mockDepartments.length + 1;

function getMockNow() {
  return "2026-04-17 16:20";
}

export async function findAdminDepartments(
  params: FindAdminDepartmentsParams
) {
  const keyword = params.keyword.trim().toLowerCase();
  const status = params.status.trim();

  const filteredDepartments = mockDepartments.filter((department) => {
    const matchesKeyword =
      !keyword ||
      department.departmentCode.toLowerCase().includes(keyword) ||
      department.departmentName.toLowerCase().includes(keyword) ||
      (department.managerName ?? "").toLowerCase().includes(keyword);

    const matchesStatus = !status || department.status === status;

    return matchesKeyword && matchesStatus;
  });

  return filteredDepartments;
}

export async function createAdminDepartment(
  params: CreateAdminDepartmentParams
) {
  const duplicatedDepartmentCode = mockDepartments.find(
    (department) =>
      department.departmentCode.trim().toLowerCase() ===
      params.departmentCode.trim().toLowerCase()
  );

  if (duplicatedDepartmentCode) {
    throw new Error("部門代碼已存在");
  }

  const duplicatedDepartmentName = mockDepartments.find(
    (department) =>
      department.departmentName.trim().toLowerCase() ===
      params.departmentName.trim().toLowerCase()
  );

  if (duplicatedDepartmentName) {
    throw new Error("部門名稱已存在");
  }

  const now = getMockNow();

  const newDepartment: AdminDepartmentItem = {
    id: nextDepartmentId++,
    departmentCode: params.departmentCode,
    departmentName: params.departmentName,
    managerId: params.managerId ?? null,
    managerName: params.managerName ?? null,
    memberCount: params.memberCount ?? 0,
    status: params.status ?? "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  mockDepartments.unshift(newDepartment);

  return newDepartment;
}

export async function updateAdminDepartment(
  params: UpdateAdminDepartmentParams
) {
  const targetDepartment = mockDepartments.find(
    (department) => department.id === params.id
  );

  if (!targetDepartment) {
    throw new Error("找不到指定部門");
  }

  const duplicatedDepartmentCode = mockDepartments.find(
    (department) =>
      department.id !== params.id &&
      department.departmentCode.trim().toLowerCase() ===
        params.departmentCode.trim().toLowerCase()
  );

  if (duplicatedDepartmentCode) {
    throw new Error("部門代碼已存在");
  }

  const duplicatedDepartmentName = mockDepartments.find(
    (department) =>
      department.id !== params.id &&
      department.departmentName.trim().toLowerCase() ===
        params.departmentName.trim().toLowerCase()
  );

  if (duplicatedDepartmentName) {
    throw new Error("部門名稱已存在");
  }

  targetDepartment.departmentCode = params.departmentCode;
  targetDepartment.departmentName = params.departmentName;
  targetDepartment.managerId = params.managerId ?? null;
  targetDepartment.managerName = params.managerName ?? null;
  targetDepartment.memberCount = params.memberCount;
  targetDepartment.status = params.status;
  targetDepartment.updatedAt = getMockNow();

  return targetDepartment;
}