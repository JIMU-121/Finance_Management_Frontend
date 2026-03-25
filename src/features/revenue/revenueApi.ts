import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { Revenue, RegisterRevenuePayload, ApiResponse } from "../../types/apiTypes";

export const getAllRevenues = async () => {
  const res = await apiService.get<Revenue[] | ApiResponse<Revenue[]>>(API_ENDPOINTS.REVENUE.GET_ALL);
  return res;
};

export const getRevenueById = (id: number) =>
  apiService.get<Revenue | ApiResponse<Revenue>>(API_ENDPOINTS.REVENUE.GET_BY_ID(id));

export const createRevenue = (payload: RegisterRevenuePayload) =>
  apiService.post<Revenue | ApiResponse<Revenue>>(API_ENDPOINTS.REVENUE.CREATE, payload);

export const updateRevenue = (id: number, payload: RegisterRevenuePayload) =>
  apiService.put<Revenue | ApiResponse<Revenue>>(API_ENDPOINTS.REVENUE.UPDATE(id), payload);

export const patchRevenue = (id: number, payload: Partial<RegisterRevenuePayload>) =>
  apiService.patch<Revenue | ApiResponse<Revenue>>(API_ENDPOINTS.REVENUE.PATCH(id), payload);

export const deleteRevenue = (id: number) =>
  apiService.delete<void | ApiResponse<void>>(API_ENDPOINTS.REVENUE.DELETE(id));
