import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { MonthlyReport, ApiResponse } from "../../types/apiTypes";

export const getMonthlyReport = async (month: number, year: number) => {
  const res = await apiService.get<MonthlyReport | ApiResponse<MonthlyReport>>(
    API_ENDPOINTS.FINANCIAL.MONTHLY_REPORT(month, year)
  );
  return res;
};
