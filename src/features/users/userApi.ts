import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Number;
}

export interface PatchUserPayload {
  firstName?: string ;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Number;
}

export const getAllUsers = async (): Promise<User[]> => {
  // apiService.get already unwraps axios response.data
  const body = await apiService.get<any>(API_ENDPOINTS.USERS.GET_ALL);

  // Handle different possible API response shapes:
  if (Array.isArray(body)) return body;               // direct array
  if (Array.isArray(body?.data)) return body.data;    // { data: [...] }
  if (Array.isArray(body?.$values)) return body.$values; // ASP.NET style
  return [];
};

export const registerUser = (data: RegisterUserPayload) =>
  apiService.post(API_ENDPOINTS.AUTH.REGISTER, data);

export const deleteUser = (id: number) =>
  apiService.delete(API_ENDPOINTS.USERS.DELETE(id));

export const getUserById = (id: number) =>
  apiService.get(API_ENDPOINTS.USERS.GET_BY_ID(id));

export const updateUser = (id: number, data: RegisterUserPayload) =>
  apiService.put(API_ENDPOINTS.USERS.UPDATE(id), data);

export const patchUser = (id: number, data:PatchUserPayload) =>
  apiService.patch(API_ENDPOINTS.USERS.PATCH(id),data)