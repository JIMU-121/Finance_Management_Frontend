
import { apiService } from "./apiService";


export type ProfileDto = {
  id: number;
  userId: number;
  isPaid: boolean;
  amount: number | null;
  createdAt: string;
};

export type CreateProfileDto = {
  userId: number;
  isPaid: boolean;
  amount: number | null;
};

export type UpdateProfileDto = {
  userId: number;
  isPaid: boolean;
  amount: number | null;
};

// GET all profiles
export const getAllProfiles = async (): Promise<ProfileDto[]> => {
  const res = await apiService.get<any>("/api/Profile");
  // Handle wrapped response
  if (res?.data && Array.isArray(res.data)) {
    return res.data as ProfileDto[];
  }
  // Direct response array
  if (Array.isArray(res)) {
    return res as ProfileDto[];
  }
  return [];
};

// GET profile by id
export const getProfileById = async (id: number): Promise<ProfileDto> => {
  const res = await apiService.get<any>(`/api/Profile/${id}`);
  // Handle wrapped response
  if (res?.data && typeof res.data === 'object') {
    return res.data as ProfileDto;
  }
  // Direct response
  return res as ProfileDto;
};

// POST create profile
export const createProfile = async (dto: CreateProfileDto): Promise<ProfileDto> => {
  const res = await apiService.post<any>("/api/Profile", dto);
  // Handle wrapped response (if backend returns {success: true, data: {...}})
  if (res?.data && typeof res.data === 'object') {
    return res.data as ProfileDto;
  }
  // Direct response
  return res as ProfileDto;
};

// PUT update profile
export const updateProfile = async (id: number, dto: UpdateProfileDto): Promise<ProfileDto> => {
  const res = await apiService.put(`/api/Profile/${id}`, dto);
  return res;
};

// DELETE profile
export const deleteProfile = async (id: number): Promise<void> => {
  await apiService.delete(`/api/Profile/${id}`);
};