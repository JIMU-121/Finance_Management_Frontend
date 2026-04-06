import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { Asset } from "../../types/apiTypes";

export const getAllAssets = async (): Promise<Asset[]> => {
  const response = await apiService.get<any>(API_ENDPOINTS.ASSET.GET_ALL);
  return response?.data || response || [];
};



export const createAsset = async (data: Asset): Promise<Asset> => {
  const response = await apiService.post<any>(API_ENDPOINTS.ASSET.CREATE, data);
  return response?.data || response;
};

export const updateAsset = async (id: number, data: Asset): Promise<Asset> => {
  const response = await apiService.put<any>(API_ENDPOINTS.ASSET.UPDATE(id), data);
  return response?.data || response;
};

export const deleteAsset = async (id: number): Promise<void> => {
  await apiService.delete(API_ENDPOINTS.ASSET.DELETE(id));
};
