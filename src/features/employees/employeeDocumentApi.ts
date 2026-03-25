import axiosInstance from "../../api/axiosInstance";
import { API_ENDPOINTS } from "../../api/endpoints";
import { ApiResponse } from "../../types/apiTypes";

export const uploadEmployeeDocument = async (employeeId: number, docTypeId: number, file: File) => {
  const formData = new FormData();
  formData.append("EmployeeId", String(employeeId));
  formData.append("DocType_Id", String(docTypeId));
  formData.append("File", file);

  const res = await axiosInstance.post<ApiResponse<any>>(
    API_ENDPOINTS.EMPLOYEE_DOCUMENT.UPLOAD,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};
