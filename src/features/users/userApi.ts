import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
}

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Number;
}

export const getAllUsers = async () => {
  const res = await apiService.get<{ data: User[] }>(
    API_ENDPOINTS.USERS.GET_ALL
  );
  return res.data;
};

export const registerUser = (data: RegisterUserPayload) =>
  apiService.post(API_ENDPOINTS.AUTH.REGISTER, data);

export const deleteUser = (id: number) =>
  apiService.delete(API_ENDPOINTS.USERS.DELETE(id));

export const getUserById = (id: number) =>
  apiService.get(API_ENDPOINTS.USERS.GET_BY_ID(id));

export const updateUser = (id: number, data: RegisterUserPayload) =>
  apiService.put(API_ENDPOINTS.USERS.UPDATE(id), data);
