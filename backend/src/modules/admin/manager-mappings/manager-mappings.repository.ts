interface AdminManagerMappingItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeNo: string;
  departmentId: number;
  departmentName: string;
  managerId: number;
  managerName: string;
  managerNo: string;
  effectiveStart: string;
  effectiveEnd?: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface FindAdminManagerMappingsParams {
  keyword: string;
  status: string;
}

interface CreateAdminManagerMappingParams {
  employeeId: number;
  employeeName: string;
  employeeNo: string;
  departmentId: number;
  departmentName: string;
  managerId: number;
  managerName: string;
  managerNo: string;
  effectiveStart: string;
  effectiveEnd?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

const mockManagerMappings: AdminManagerMappingItem[] = [
  {
    id: 1,
    employeeId: 101,
    employeeName: "王小明",
    employeeNo: "T001",
    departmentId: 1,
    departmentName: "資訊中心",
    managerId: 201,
    managerName: "陳主任",
    managerNo: "M001",
    effectiveStart: "2026-01-01",
    effectiveEnd: null,
    status: "ACTIVE",
  },
  {
    id: 2,
    employeeId: 102,
    employeeName: "李小華",
    employeeNo: "T002",
    departmentId: 2,
    departmentName: "教務處",
    managerId: 202,
    managerName: "林主任",
    managerNo: "M002",
    effectiveStart: "2026-01-01",
    effectiveEnd: null,
    status: "ACTIVE",
  },
  {
    id: 3,
    employeeId: 103,
    employeeName: "陳美玲",
    employeeNo: "T003",
    departmentId: 3,
    departmentName: "人事室",
    managerId: 203,
    managerName: "張主任",
    managerNo: "M003",
    effectiveStart: "2025-09-01",
    effectiveEnd: "2026-03-31",
    status: "INACTIVE",
  },
  {
    id: 4,
    employeeId: 104,
    employeeName: "周佩珊",
    employeeNo: "T004",
    departmentId: 4,
    departmentName: "總務處",
    managerId: 204,
    managerName: "黃主任",
    managerNo: "M004",
    effectiveStart: "2026-02-01",
    effectiveEnd: null,
    status: "ACTIVE",
  },
];

let nextManagerMappingId = mockManagerMappings.length + 1;

export async function findAdminManagerMappings(
  params: FindAdminManagerMappingsParams
) {
  const keyword = params.keyword.trim().toLowerCase();
  const status = params.status.trim();

  const filteredMappings = mockManagerMappings.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.employeeName.toLowerCase().includes(keyword) ||
      item.employeeNo.toLowerCase().includes(keyword) ||
      item.managerName.toLowerCase().includes(keyword) ||
      item.managerNo.toLowerCase().includes(keyword) ||
      item.departmentName.toLowerCase().includes(keyword);

    const matchesStatus = !status || item.status === status;

    return matchesKeyword && matchesStatus;
  });

  return filteredMappings;
}

export async function createAdminManagerMapping(
  params: CreateAdminManagerMappingParams
) {
  const duplicatedMapping = mockManagerMappings.find(
    (item) =>
      item.employeeNo.trim().toLowerCase() ===
        params.employeeNo.trim().toLowerCase() &&
      item.managerNo.trim().toLowerCase() ===
        params.managerNo.trim().toLowerCase() &&
      item.status === "ACTIVE"
  );

  if (duplicatedMapping) {
    throw new Error("此員工與主管的啟用中關聯已存在");
  }

  const newItem: AdminManagerMappingItem = {
    id: nextManagerMappingId++,
    employeeId: params.employeeId,
    employeeName: params.employeeName,
    employeeNo: params.employeeNo,
    departmentId: params.departmentId,
    departmentName: params.departmentName,
    managerId: params.managerId,
    managerName: params.managerName,
    managerNo: params.managerNo,
    effectiveStart: params.effectiveStart,
    effectiveEnd: params.effectiveEnd ?? null,
    status: params.status ?? "ACTIVE",
  };

  mockManagerMappings.unshift(newItem);

  return newItem;
}