import axiosInstance from "./axiosInstance";

export const apiService = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  },

  patch: async<T>(url: string,data? : any): Promise<T> => {
    const response = await axiosInstance.patch<T>(url,data);
    return response.data;
  },
  
};