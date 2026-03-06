import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { ApiResponse, LoginResponse } from "../../types/apiTypes";

export const loginApi = (email: string, password: string) => {
  return apiService.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    { email, password }
  );
};