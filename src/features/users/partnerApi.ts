import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";
import { Partner } from "../../types/apiTypes";

export const getAllPartners = async (): Promise<Partner[]> => {
  const body = await apiService.get<any>(API_ENDPOINTS.PARTNER.GET_ALL);
  if (Array.isArray(body)) return body;
  if (body?.data && Array.isArray(body.data)) return body.data;
  if (body?.items && Array.isArray(body.items)) return body.items;
  return [];
};

export const getPartnerByUserId = async (userId: number): Promise<Partner | null> => {
  try {
    const response = await apiService.get<any>(API_ENDPOINTS.PARTNER.GET_BY_USER_ID(userId));
    if (response && response.data) {
      return response.data;
    }
    if (response && response.userId) {
      return response;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const createPartner = async (data: Partner): Promise<Partner> => {
  return await apiService.post(API_ENDPOINTS.PARTNER.CREATE, data);
};

export const updatePartner = async (id: number, data: Partial<Partner>): Promise<Partner> => {
  return await apiService.patch(API_ENDPOINTS.PARTNER.PATCH(id), data);
};
