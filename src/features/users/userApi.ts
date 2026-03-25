import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";

import { User, RegisterUserPayload, PatchUserPayload } from "../../types/apiTypes";
export type { User, RegisterUserPayload, PatchUserPayload };

/** Single source of truth for the UserGender C# enum */
export const genderToEnum: Record<string, number> = {
  Male: 1,
  Female: 2,
  Other: 3,
};

/** Reverse map — derived automatically so it never goes out of sync */
export const genderFromEnum = Object.fromEntries(
  Object.entries(genderToEnum).map(([label, value]) => [value, label])
) as Record<number, string>;

/** Ready-made option list for dropdowns */
export const GENDER_OPTIONS = Object.entries(genderToEnum).map(
  ([label, value]) => ({ label, value })
);


export const getAllUsers = async (pageNumber: number = 1, pageSize: number = 50): Promise<{ data: User[]; total: number }> => {

  const body = await apiService.get<any>(`${API_ENDPOINTS.USERS.GET_ALL}?PageNumber=${pageNumber}&PageSize=${pageSize}`);

  let data: User[] = [];
  let total = 0;

  if (Array.isArray(body)) {
    data = body;
    total = body.length;
  } else if (body && typeof body === 'object') {
    if (Array.isArray(body.items)) data = body.items;
    else if (Array.isArray(body.data)) data = body.data;
    else if (Array.isArray(body.$values)) data = body.$values;
    else data = [];

    total = body.totalCount ?? body.totalRecords ?? body.total ?? data.length;
  }

  return { data, total };
};

export const registerUser = (data: RegisterUserPayload) =>
  apiService.post(API_ENDPOINTS.AUTH.REGISTER, data);

export const deleteUser = (id: number) =>
  apiService.delete(API_ENDPOINTS.USERS.DELETE(id));

export const getUserById = (id: number) =>
  apiService.get(API_ENDPOINTS.USERS.GET_BY_ID(id));

export const updateUser = (id: number, data: RegisterUserPayload) =>
  apiService.put(API_ENDPOINTS.USERS.UPDATE(id), data);

export const patchUser = (id: number, data: PatchUserPayload) =>
  apiService.patch(API_ENDPOINTS.USERS.PATCH(id), data)