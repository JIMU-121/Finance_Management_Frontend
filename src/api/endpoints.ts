const API_PREFIX = "/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_PREFIX}/Auth/login`,
    REGISTER: `${API_PREFIX}/Auth/register`,
  },

  USERS: {
    BASE: `${API_PREFIX}/user`,
    GET_ALL: `${API_PREFIX}/user`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/user/${id}`,
    CREATE: `${API_PREFIX}/user`,
    UPDATE: (id: number) => `${API_PREFIX}/user/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/user/${id}`,
    PATCH : (id: number) => `${API_PREFIX}/user/${id}`
  },
  PROJECT: {
    BASE: `${API_PREFIX}/projects`,
    GET_ALL: `${API_PREFIX}/projects`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/project/${id}`,
    CREATE: `${API_PREFIX}/projects`,
    UPDATE: (id: number) => `${API_PREFIX}/projects/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/projects/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/projects/${id}`,
  },
  EMPLOYEE: {
    BASE: `${API_PREFIX}/employees`,
    GET_ALL: `${API_PREFIX}/employees`,
    GET_BY_ID: (id: number) => `${API_PREFIX}/employee/${id}`,
    CREATE: `${API_PREFIX}/employees`,
    UPDATE: (id: number) => `${API_PREFIX}/employees/${id}`,
    DELETE: (id: number) => `${API_PREFIX}/employees/${id}`,
    PATCH: (id: number) => `${API_PREFIX}/employees/${id}`,
  }
} as const;