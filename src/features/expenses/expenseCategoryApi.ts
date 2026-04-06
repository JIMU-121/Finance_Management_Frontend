import axiosInstance from "../../api/axiosInstance";
import { API_ENDPOINTS } from "../../api/endpoints";
import { ExpenseCategory, ApiResponse } from "../../types/apiTypes";

export const getAllExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  const response = await axiosInstance.get<any>(API_ENDPOINTS.CATEGORY.GET_ALL);
  const body = response.data;
  if (Array.isArray(body)) return body;
  if (body?.data && Array.isArray(body.data)) return body.data;
  return [];
};



export const createExpenseCategory = async (payload: Omit<ExpenseCategory, "id">): Promise<ExpenseCategory> => {
  const response = await axiosInstance.post<any>(API_ENDPOINTS.CATEGORY.CREATE, payload);
  const body = response.data;
  return body?.data ?? body;
};

export const updateExpenseCategory = async (id: number, payload: Omit<ExpenseCategory, "id">): Promise<ExpenseCategory> => {
  const response = await axiosInstance.put<any>(API_ENDPOINTS.CATEGORY.UPDATE(id), payload);
  const body = response.data;
  return body?.data ?? body;
};

export const deleteExpenseCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.CATEGORY.DELETE(id));
};
