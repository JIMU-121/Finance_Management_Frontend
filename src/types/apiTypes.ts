export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  role: string;
  email: string;
  user: {
    role: string;
    email: string;
    firstName: string;
    lastName: string;
    id: string;
  }
}

export interface RegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}