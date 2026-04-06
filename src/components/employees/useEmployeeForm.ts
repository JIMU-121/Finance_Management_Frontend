import { useState } from "react";

export type EmployeeFormState = {
  employeeCode: string;
  branchId: string | number;
  department: string;
  position: string;
  previousCTC: string | number;
  currentCTC: string | number;
  monthlySalary: string | number;
  joinDate: string;
  relievingDate?: string;
  takenLeave?: string | number;
  status?: string;
};

export function useEmployeeForm(initialState?: Partial<EmployeeFormState>) {
  const [form, setForm] = useState<EmployeeFormState>({
    employeeCode: "",
    branchId: "1",
    department: "",
    position: "",
    previousCTC: "",
    currentCTC: "",
    monthlySalary: "",
    joinDate: "",
    relievingDate: "",
    takenLeave: 0,
    status: "Active",
    ...initialState,
  });

  const handleChange = (field: keyof EmployeeFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatAmountInput = (value: string, setterField: keyof EmployeeFormState) => {
    const rawValue = String(value).replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;
    const formatted = rawValue ? Number(rawValue).toLocaleString("en-IN") : "";
    handleChange(setterField, formatted);
    return rawValue;
  };

  const handleCTCChange = (value: string) => {
    const rawCTC = formatAmountInput(value, "currentCTC");
    if (rawCTC) {
      const monthly = Math.round(Number(rawCTC) / 12);
      handleChange("monthlySalary", monthly.toLocaleString("en-IN"));
    } else {
      handleChange("monthlySalary", "");
    }
  };

  return { form, setForm, handleChange, formatAmountInput, handleCTCChange };
}

export const DepartmentTypeOptions = [
  { value: "1", label: "HR" },
  { value: "2", label: "Accounts" },
  { value: "3", label: "Developer" },
];
