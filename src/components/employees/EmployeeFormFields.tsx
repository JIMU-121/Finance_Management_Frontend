import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import { EmployeeFormState, DepartmentTypeOptions } from "./useEmployeeForm";

interface Props {
  form: EmployeeFormState;
  handleChange: (field: keyof EmployeeFormState, value: any) => void;
  formatAmountInput: (value: string, field: keyof EmployeeFormState) => void;
  handleCTCChange: (value: string) => void;
  isEdit?: boolean;
}

export function ProfessionalFields({ form, handleChange }: Pick<Props, "form" | "handleChange">) {
  return (
    <>
      <div>
        <Label>Employee Code *</Label>
        <Input value={form.employeeCode} onChange={(e: any) => handleChange("employeeCode", e.target.value)} placeholder="EMP-2026-001" />
      </div>
      <div>
        <Label>Branch ID *</Label>
        <Input type="number" value={form.branchId} onChange={(e: any) => handleChange("branchId", e.target.value)} placeholder="1" />
      </div>
      <div>
        <Label>Department *</Label>
        <Select
          options={DepartmentTypeOptions}
          value={DepartmentTypeOptions.find((d) => d.label === form.department)?.value || ""}
          onChange={(val) => handleChange("department", DepartmentTypeOptions.find((d) => d.value === val)?.label ?? val)}
          placeholder="Select Department"
        />
      </div>
      <div>
        <Label>Position *</Label>
        <Input value={form.position} onChange={(e: any) => handleChange("position", e.target.value)} placeholder="Senior Developer" />
      </div>
    </>
  );
}

export function FinancialFields({ form, handleChange, formatAmountInput, handleCTCChange, isEdit }: Props) {
  return (
    <>
      <div>
        <Label>Previous CTC (₹)</Label>
        <Input type="text" value={form.previousCTC} onChange={(e: any) => formatAmountInput(e.target.value, "previousCTC")} placeholder="e.g. 6,00,000" />
      </div>
      <div>
        <Label>Current CTC (₹) *</Label>
        <Input type="text" value={form.currentCTC} onChange={(e: any) => handleCTCChange(e.target.value)} placeholder="e.g. 8,00,000" />
      </div>
      <div className={isEdit ? "" : "md:col-span-2"}>
        <Label>Monthly Salary (₹) *</Label>
        <Input type="text" value={form.monthlySalary} onChange={(e: any) => formatAmountInput(e.target.value, "monthlySalary")} placeholder="e.g. 50,000" />
      </div>
      <div className={isEdit ? "" : "md:col-span-2"}>
        <DatePicker
          id={isEdit ? "edit-joinDate" : "joining-date"}
          label={isEdit ? "Joining Date" : "Joining Date *"}
          placeholder="Select Date"
          defaultDate={form.joinDate}
          onChange={(_selectedDates, dateStr) => handleChange("joinDate", dateStr)}
        />
      </div>
    </>
  );
}
