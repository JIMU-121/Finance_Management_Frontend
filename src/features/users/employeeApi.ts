import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { EmployeeRecord } from "../../types/apiTypes";

export const getAllEmployees = async (): Promise<EmployeeRecord[]> => {
  const body = await apiService.get<any>(API_ENDPOINTS.EMPLOYEE.GET_ALL);
  if (Array.isArray(body)) return body;
  if (body?.data && Array.isArray(body.data)) return body.data;
  if (body?.items && Array.isArray(body.items)) return body.items;
  return [];
};

export const getEmployeeByUserId = async (userId: number): Promise<EmployeeRecord | null> => {
  try {
    const response = await apiService.get<any>(API_ENDPOINTS.EMPLOYEE.GET_BY_USER_ID(userId));
    if (response && response.data) {
      return response.data;
    }
    if (response && response.userId) {
      return response;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const createEmployee = async (data: EmployeeRecord): Promise<EmployeeRecord> => {
  return await apiService.post(API_ENDPOINTS.EMPLOYEE.CREATE, data);
};

export const updateEmployee = async (id: number, data: Partial<EmployeeRecord>): Promise<EmployeeRecord> => {
  return await apiService.patch(API_ENDPOINTS.EMPLOYEE.PATCH(id), data);
};
