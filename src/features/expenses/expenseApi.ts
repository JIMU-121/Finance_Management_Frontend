import axiosInstance from "../../api/axiosInstance";
import { API_ENDPOINTS } from "../../api/endpoints";
import { Expense, RegisterExpensePayload, ApiResponse } from "../../types/apiTypes";

export const getAllExpenses = async () => {
  const response = await axiosInstance.get<ApiResponse<Expense[]>>(API_ENDPOINTS.EXPENSE.GET_ALL);
  return response.data;
};

export const getExpenseById = async (id: number) => {
  const response = await axiosInstance.get<ApiResponse<Expense>>(API_ENDPOINTS.EXPENSE.GET_BY_ID(id));
  return response.data;
};

export const createExpense = async (payload: RegisterExpensePayload) => {
  const response = await axiosInstance.post<ApiResponse<Expense>>(API_ENDPOINTS.EXPENSE.CREATE, payload);
  return response.data;
};
export const updateExpense = async (id: number, payload: Partial<Expense>) => {
  const response = await axiosInstance.put<ApiResponse<Expense>>(API_ENDPOINTS.EXPENSE.UPDATE(id), payload);
  return response.data;
};
export const patchExpense = async (id: number, payload: Partial<Expense>) => {
  const response = await axiosInstance.patch<ApiResponse<Expense>>(API_ENDPOINTS.EXPENSE.PATCH(id), payload);
  return response.data;
};
export const deleteExpense = async (id: number) => {
  const response = await axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.EXPENSE.DELETE(id));
  return response.data;
};
export const approveExpense = async (id: number) => {
  const response = await axiosInstance.patch<ApiResponse<null>>(API_ENDPOINTS.EXPENSE.APPROVE(id));
  return response.data;
};
