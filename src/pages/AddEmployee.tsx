import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import Button from "../components/ui/button/Button";
import { MultiStepForm } from "../components/ui/stepper/MultiStepForm";
import DatePicker from "../components/form/date-picker";
import { showError, showSuccess } from "../utils/toast";
import { registerUser } from "../features/users/userApi";
import { createEmployee } from "../features/users/employeeApi";

// Role 3 is Employee
const EMPLOYEE_ROLE_ID = 3;

const DepartmentType = [
  { value: "1", label: "HR" },
  { value: "2", label: "Accounts" },
  { value: "3", label: "Developer" },
];

export default function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- Step 1 State: Account ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Step 2 State: Professional ---
  const [employeeCode, setEmployeeCode] = useState("");
  const [branchId, setBranchId] = useState("1");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  // --- Step 3 State: Financial & Joining ---
  const [monthlySalary, setMonthlySalary] = useState("");
  const [previousCTC, setPreviousCTC] = useState("");
  const [currentCTC, setCurrentCTC] = useState("");
  const [joinDate, setJoinDate] = useState("");

  const formatAmountInput = (value: string, setter: (val: string) => void) => {
    const rawValue = value.replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;
    const formatted = rawValue ? Number(rawValue).toLocaleString("en-IN") : "";
    setter(formatted);
    return rawValue;
  };

  const handleCTCChange = (value: string) => {
    const rawCTC = formatAmountInput(value, setCurrentCTC);
    if (rawCTC) {
      const monthly = Math.round(Number(rawCTC) / 12);
      setMonthlySalary(monthly.toLocaleString("en-IN"));
    } else {
      setMonthlySalary("");
    }
  };

  const handleValidate = async (index: number): Promise<boolean> => {
    if (index === 0) {
      if (!firstName || !lastName || !email || !password) {
        showError("All account fields are required.");
        return false;
      }
      if (!email.includes("@")) {
        showError("Please enter a valid email.");
        return false;
      }
    } else if (index === 1) {
      if (!employeeCode || !branchId || !department || !position) {
        showError("All professional detail fields are required.");
        return false;
      }
    } else if (index === 2) {
      if (!monthlySalary || !currentCTC || !joinDate) {
        showError("Salary and Joining Date are required.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    
    try {
      setLoading(true);

      // ✅ Step 1: Create User
      const userRes: any = await registerUser({
        firstName,
        lastName,
        email,
        password,
        role: EMPLOYEE_ROLE_ID,
      });

      const userId = userRes?.data?.id || userRes?.id || userRes?.data?.userId;
      if (!userId) {
        throw new Error("User ID not found after registration");
      }

      // ✅ Step 2: Create Employee Record
      await createEmployee({
        userId,
        branchId: Number(branchId),
        employeeCode,
        department,
        position,
        monthlySalary: Number(monthlySalary.replace(/,/g, "")) || 0,
        previousCTC: Number(previousCTC.replace(/,/g, "")) || 0,
        currentCTC: Number(currentCTC.replace(/,/g, "")) || 0,
        joinDate: joinDate,
      });

      showSuccess("Employee registered successfully 🚀");
      navigate("/manage-employees");
    } catch (err: any) {
      console.error(err);
      showError(err?.response?.data?.message || "Failed to register employee");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: "Account",
      title: "Account Details",
      subtitle: "Basic login information for the employee.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
          <div>
            <Label>First Name *</Label>
            <Input value={firstName} onChange={(e: any) => setFirstName(e.target.value)} placeholder="Enter first name" />
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input value={lastName} onChange={(e: any) => setLastName(e.target.value)} placeholder="Enter last name" />
          </div>
          <div className="md:col-span-2">
            <Label>Email *</Label>
            <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="employee@company.com" />
          </div>
          <div className="md:col-span-2">
            <Label>Password *</Label>
            <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
          </div>
        </div>
      )
    },
    {
      label: "Professional",
      title: "Professional Info",
      subtitle: "Employee's role and location details.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
          <div>
            <Label>Employee Code *</Label>
            <Input value={employeeCode} onChange={(e: any) => setEmployeeCode(e.target.value)} placeholder="EMP-2026-001" />
          </div>
          <div>
            <Label>Branch ID *</Label>
            <Input type="number" value={branchId} onChange={(e: any) => setBranchId(e.target.value)} placeholder="1" />
          </div>
          <div>
            <Label>Department *</Label>
            <Select
              options={DepartmentType}
              value={DepartmentType.find((d) => d.label === department)?.value || ""}
              onChange={(val) => setDepartment(DepartmentType.find((d) => d.value === val)?.label ?? val)}
              placeholder="Select Department"
            />
          </div>
          <div>
            <Label>Position *</Label>
            <Input value={position} onChange={(e: any) => setPosition(e.target.value)} placeholder="Senior Developer" />
          </div>
        </div>
      )
    },
    {
      label: "Financial",
      title: "Financial & Joining",
      subtitle: "Salary and start date information.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
          <div>
            <Label>Previous CTC (₹)</Label>
            <Input value={previousCTC} onChange={(e: any) => formatAmountInput(e.target.value, setPreviousCTC)} placeholder="e.g. 6,00,000" />
          </div>
          <div>
            <Label>Current CTC (₹) *</Label>
            <Input value={currentCTC} onChange={(e: any) => handleCTCChange(e.target.value)} placeholder="e.g. 8,00,000" />
          </div>
          <div className="md:col-span-2">
            <Label>Monthly Salary (₹) *</Label>
            <Input value={monthlySalary} onChange={(e: any) => formatAmountInput(e.target.value, setMonthlySalary)} placeholder="e.g. 50,000" />
          </div>
          <div className="md:col-span-2">
            <DatePicker
              id="joining-date"
              label="Joining Date *"
              placeholder="Select Date"
              defaultDate={joinDate}
              onChange={(_selectedDates, dateStr) => setJoinDate(dateStr)}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageMeta title="Add Employee | TailAdmin" description="Create a new employee profile with a guided stepper" />
      <PageBreadcrumb pageTitle="Add Employee" />

      <div>
        <MultiStepForm
          steps={steps}
          onValidate={handleValidate}
          onSubmit={handleSubmit}
          submitLabel={loading ? "Registering..." : "Register Employee"}
        />
      </div>
      
      <div className="mt-6 flex justify-start">
        <Button variant="outline" onClick={() => navigate("/manage-employees")}>
          Back to List
        </Button>
      </div>
    </div>
  );
}
