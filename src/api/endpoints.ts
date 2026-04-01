const API_PREFIX = "/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_PREFIX}/Auth/login`,
    REGISTER: `${API_PREFIX}/Auth/register`,
  },
  
  PROFILE: {
  GET_ALL: `${API_PREFIX}/Profile`,
  GET_BY_ID: (id: number) => `${API_PREFIX}/Profile/${id}`,
  CREATE: `${API_PREFIX}/Profile`,
  UPDATE: (id: number) => `${API_PREFIX}/Profile/${id}`,
  DELETE: (id: number) => `${API_PREFIX}/Profile/${id}`,
},
  USERS: {
    BASE: `${API_PREFIX}/user`,
    GET_ALL: `${API_PREFIX}/user`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/user/${id}`,
    CREATE: `${API_PREFIX}/user`,
    UPDATE: (id: number) => `${API_PREFIX}/user/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/user/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/user/${id}`
  },
  PARTNER: {
    GET_ALL: `${API_PREFIX}/Partner`,
    GET_BY_USER_ID: (userId: number) => `${API_PREFIX}/getUser-Partner/${userId}`,
    CREATE: `${API_PREFIX}/partner`,
    PATCH: (id: number) => `${API_PREFIX}/partner/${id}`,
  },
  PROJECT: {
    BASE: `${API_PREFIX}/projects`,
    GET_ALL: `${API_PREFIX}/projects`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/project/${id}`,
    CREATE: `${API_PREFIX}/projects`,
    UPDATE: (id: number) => `${API_PREFIX}/projects/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/projects/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/projects/${id}`,
    ASSIGN_EMPLOYEE: `${API_PREFIX}/Projects/assign-employee`,
    UNASSIGN_EMPLOYEE: (projectId: number, employeeId: number) => 
      `${API_PREFIX}/Projects/unassign-employee?projectId=${projectId}&employeeId=${employeeId}`,
    GET_PROJECT_EMPLOYEES: (projectId: number) =>
      `${API_PREFIX}/Projects/${projectId}/employees`,
  },
  EMPLOYEE: {
    BASE: `${API_PREFIX}/employee`,
    GET_ALL: `${API_PREFIX}/employee`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/employee/${id}`,
    GET_BY_USER_ID: (userId: number) => `${API_PREFIX}/employee/user/${userId}`,
    CREATE: `${API_PREFIX}/employee`,
    UPDATE: (id: number) => `${API_PREFIX}/employee/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/employee/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/employee/${id}`,
  },
  ASSET: {
    BASE: `${API_PREFIX}/Asset`,
    GET_ALL: `${API_PREFIX}/Asset`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/Asset/${id}`,
    CREATE: `${API_PREFIX}/Asset`,
    UPDATE: (id: number) => `${API_PREFIX}/Asset/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/Asset/${id}`,
  },
  EXPENSE: {
    BASE: `${API_PREFIX}/Expense`,
    GET_ALL: `${API_PREFIX}/Expense`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/Expense/${id}`,
    CREATE: `${API_PREFIX}/Expense`,
    UPDATE: (id: number) => `${API_PREFIX}/Expense/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/Expense/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/Expense/${id}`,
    APPROVE: (id: number) => `${API_PREFIX}/Expense/${id}/approve`,
  },
  DOCTYPE: {
    BASE: `${API_PREFIX}/DocType`,
    GET_ALL: `${API_PREFIX}/DocType`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/DocType/${id}`,
    CREATE: `${API_PREFIX}/DocType`,
    UPDATE: (id: number) => `${API_PREFIX}/DocType/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/DocType/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/DocType/${id}`,
  },
  REVENUE: {
    BASE: `${API_PREFIX}/Revenue`,
    GET_ALL: `${API_PREFIX}/Revenue`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/Revenue/${id}`,
    CREATE: `${API_PREFIX}/Revenue`,
    UPDATE: (id: number) => `${API_PREFIX}/Revenue/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/Revenue/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/Revenue/${id}`,
  },
  EMPLOYEE_DOCUMENT: {
    UPLOAD: `${API_PREFIX}/EmployeeDocument/upload`,
  },
  CATEGORY: {
    GET_ALL: `${API_PREFIX}/Category`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/Category/${id}`,
    CREATE: `${API_PREFIX}/Category`,
    UPDATE: (id: number) => `${API_PREFIX}/Category/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/Category/${id}`,
  },
} as const;