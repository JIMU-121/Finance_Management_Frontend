import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { Project, RegisterProjectPayload } from "../../types/apiTypes";

export type { Project, RegisterProjectPayload };

export const getAllProjects = async () => {
    const res = await apiService.get<{ data: Project[] }>(
        API_ENDPOINTS.PROJECT.GET_ALL
    );
    return res.data;
};

export const getProjectById = (id: number) =>
    apiService.get<{ data: Project }>(API_ENDPOINTS.PROJECT.GET_BY_ID(id));

export const registerProject = (payload: RegisterProjectPayload) =>
    apiService.post(API_ENDPOINTS.PROJECT.CREATE, payload);

export const updateProject = (id: number, payload: RegisterProjectPayload) =>
    apiService.put(API_ENDPOINTS.PROJECT.UPDATE(id), payload);

export const deleteProject = (id: number) =>
    apiService.delete(API_ENDPOINTS.PROJECT.DELETE(id));

export const patchProject = (id: number, payload: Partial<RegisterProjectPayload>) =>
    apiService.patch(API_ENDPOINTS.PROJECT.PATCH(id), payload);

export interface AssignEmployeePayload {
  projectId: number;
  employeeId: number;
  role: string;
  hourlyRate: number;
  isBench: boolean;
}

export const assignEmployeeToProject = (payload: AssignEmployeePayload) =>
    apiService.post(API_ENDPOINTS.PROJECT.ASSIGN_EMPLOYEE, payload);

export const unassignEmployeeFromProject = (projectId: number, employeeId: number) =>
    apiService.post(API_ENDPOINTS.PROJECT.UNASSIGN_EMPLOYEE(projectId, employeeId), { projectid: projectId, employeeid: employeeId });

export const getProjectEmployees = async (projectId: number) => {
    const res = await apiService.get<any>(API_ENDPOINTS.PROJECT.GET_PROJECT_EMPLOYEES(projectId));
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.items && Array.isArray(res.items)) return res.items;
    return [];
};

