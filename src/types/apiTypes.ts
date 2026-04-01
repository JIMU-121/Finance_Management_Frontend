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

// DocType Model
export interface DocType {
  id?: number;
  typeName: string;
  documents?: any[];
  createdAt?: string;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted?: boolean;
}

// User Models
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;

  // Optional Partner Fields
  partnershipType?: string;
  sharePercentage?: number;
  branchId?: number;
  isMainPartner?: boolean;
}

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Number;

  // Optional Partner Fields
  partnershipType?: string;
  sharePercentage?: number;
  branchId?: number;
  isMainPartner?: boolean;
}

export interface PatchUserPayload {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  emergencyMobileNumber?: string;
  gender?: number;
  password?: string;
  role?: Number;

  // Optional Partner Fields
  partnershipType?: string;
  sharePercentage?: number;
  branchId?: number;
  isMainPartner?: boolean;

  // Optional Employee Fields
  department?: string;
  position?: string;
  monthlySalary?: number;
  previousCTC?: number;
  currentCTC?: number;
  joinDate?: string;
  relievingDate?: string | null;
  takenLeave?: number;
}

// Partner Models
export interface Partner {
  id?: number;
  userId: number;
  partnershipType: string;
  sharePercentage: number;
  branchId?: number;
  isMainPartner: boolean;
}

// Employee Models
export interface EmployeeRecord {
  id?: number;
  userId: number;
  branchId: number;
  employeeCode: string;
  department: string;
  position: string;
  monthlySalary: number;
  previousCTC?: number;
  currentCTC?: number;
  joinDate: string;
  relievingDate?: string | null;
  takenLeave?: number;
}

// Project Models
export interface AssignedEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  employeeCode?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  clientName: string;
  projectValue: number;
  startDate: string;
  endDate: string;
  status: string;
  managedByPartnerId: number;
  profileId: number | null;
  technologyStack: string;
  managerName: string;
  managerEmail: string;
  managerContact: string;
  leaveApplyWay: string;
  clientManagerName: string;
  clientManagerEmail: string;
  clientManagerContact: string;
  isSmooth: boolean;
  mobileNumberUsed: string;
  interviewingUserId: number | null;
  isToolUsed: boolean;
  managedByPartner?: string | null;
  employees?: AssignedEmployee[];
}

export interface RegisterProjectPayload {
  name: string;
  description: string;
  clientName: string;
  projectValue: number;
  startDate: string;
  endDate: string;
  status: string;
  managedByPartnerId: number;
  profileId: number | null;
  technologyStack: string;
  managerName: string;
  managerEmail: string;
  managerContact: string;
  leaveApplyWay: string;
  clientManagerName: string;
  clientManagerEmail: string;
  clientManagerContact: string;
  isSmooth: boolean;
  mobileNumberUsed: string;
  interviewingUserId: number | null;
  isToolUsed: boolean;
}

// Asset Models
export interface Asset {
  id?: number;
  name: string;
  description: string;
  amount: number;
  purchase_Date: string;
}

// Expense Category Model
export interface ExpenseCategory {
  id: number;
  categoryName: string;
  isRecurring: boolean;
}

// Expense Models
export interface Expense {
  id?: number;
  assetId: number | null;
  partnerId: number | null;
  employeeId: number | null;
  description: string;
  amount: number;
  categoryId: number | null;
  month: number;
  year: number;
  isRecurring: boolean;
  status?: number;
  approvedBy?: number;
  approvedDate?: string;
}

export interface RegisterExpensePayload {
  assetId: number | null;
  partnerId: number | null;
  employeeId: number | null;
  description: string;
  amount: number;
  categoryId: number | null;
  month: number;
  year: number;
  isRecurring: boolean;
}

// Revenue Models
export interface Revenue {
  id: number;
  partnerId: number;
  projectId: number | null;
  amount: number;
  date: string;
  revenue_From: boolean;
  notes: string;
}

export interface RegisterRevenuePayload {
  partnerId: number;
  projectId: number | null;
  amount: number;
  date: string;
  revenue_From: boolean;
  notes: string;
}

// Employee Document Models
export interface EmployeeDocument {
  id: number;
  employeeId: number;
  docType_Id: number;
  fileName: string;
  filePath: string;
  uploadDate: string;
}

export interface UploadDocumentPayload {
  employeeId: number;
  docType_Id: number;
  file: File;
}