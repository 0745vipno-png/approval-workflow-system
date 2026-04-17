import {
  createAdminManagerMapping,
  findAdminManagerMappings,
} from "./manager-mappings.repository.js";

interface GetAdminManagerMappingsParams {
  keyword: string;
  status: string;
}

interface CreateAdminManagerMappingInput {
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

export async function getAdminManagerMappingsService(
  params: GetAdminManagerMappingsParams
) {
  const mappings = await findAdminManagerMappings(params);
  return mappings;
}

export async function createAdminManagerMappingService(
  input: CreateAdminManagerMappingInput
) {
  if (!input.employeeName.trim()) {
    throw new Error("員工姓名不可為空");
  }

  if (!input.employeeNo.trim()) {
    throw new Error("員工編號不可為空");
  }

  if (!input.departmentName.trim()) {
    throw new Error("部門名稱不可為空");
  }

  if (!input.managerName.trim()) {
    throw new Error("主管姓名不可為空");
  }

  if (!input.managerNo.trim()) {
    throw new Error("主管編號不可為空");
  }

  if (!input.effectiveStart.trim()) {
    throw new Error("生效起日不可為空");
  }

  if (input.effectiveEnd && input.effectiveEnd < input.effectiveStart) {
    throw new Error("生效迄日不得早於生效起日");
  }

  const created = await createAdminManagerMapping(input);
  return created;
}