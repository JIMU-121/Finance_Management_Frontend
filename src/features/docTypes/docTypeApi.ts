import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { DocType } from "../../types/apiTypes";

export const getAllDocTypes = async (page: number = 1, limit: number = 1000) => {
  return await apiService.get<any>(`${API_ENDPOINTS.DOCTYPE.GET_ALL}?page=${page}&limit=${limit}`);
};

export const getDocTypeById = async (id: number): Promise<DocType> => {
  return await apiService.get<DocType>(API_ENDPOINTS.DOCTYPE.GET_BY_ID(id));
};

export const createDocType = async (data: DocType): Promise<DocType> => {
  return await apiService.post<DocType>(API_ENDPOINTS.DOCTYPE.CREATE, data);
};

export const updateDocType = async (id: number, data: Partial<DocType>): Promise<DocType> => {
  return await apiService.put<DocType>(API_ENDPOINTS.DOCTYPE.UPDATE(id), data);
};

export const patchDocType = async (id: number, data: Partial<DocType>): Promise<DocType> => {
  return await apiService.patch<DocType>(API_ENDPOINTS.DOCTYPE.PATCH(id), data);
};

export const deleteDocType = async (id: number): Promise<void> => {
  return await apiService.delete(API_ENDPOINTS.DOCTYPE.DELETE(id));
};
