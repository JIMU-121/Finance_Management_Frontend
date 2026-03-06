import { useState } from "react";
import { DataTable, ColumnDef, DetailField } from "../components/ui/table/DataTable";
import Badge from "../components/ui/badge/Badge";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import Button from "../components/ui/button/Button";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  name: string;
  role: string;
  image: string;
  department: string;
  employeeCode: string;
  position: string;
  monthlySalary: string;
  currentCTC: string;
  joiningDate: string;
  relievingDate: string;
  leaveTaken: number;
  mobileNumber: string;
  status: "Active" | "Pending" | "Inactive";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Lindsey Curtis",
    role: "Web Designer",
    image: "/images/user/user-17.jpg",
    department: "Developer",
    employeeCode: "EMP-001",
    position: "Senior Designer",
    monthlySalary: "₹85,000",
    currentCTC: "₹10,20,000",
    joiningDate: "2021-06-01T09:00",
    relievingDate: "",
    leaveTaken: 5,
    mobileNumber: "+91 9876543210",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    role: "Backend Developer",
    image: "/images/user/user-17.jpg",
    department: "Developer",
    employeeCode: "EMP-002",
    position: "Tech Lead",
    monthlySalary: "₹1,10,000",
    currentCTC: "₹13,20,000",
    joiningDate: "2020-03-15T09:00",
    relievingDate: "",
    leaveTaken: 3,
    mobileNumber: "+91 9123456789",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "HR Executive",
    image: "/images/user/user-17.jpg",
    department: "HR",
    employeeCode: "EMP-003",
    position: "HR Manager",
    monthlySalary: "₹65,000",
    currentCTC: "₹7,80,000",
    joiningDate: "2022-01-10T09:00",
    relievingDate: "2025-12-31T18:00",
    leaveTaken: 8,
    mobileNumber: "+91 9988776655",
    status: "Pending",
  },
];

const DepartmentType = [
  { value: "1", label: "HR" },
  { value: "2", label: "Accounts" },
  { value: "3", label: "Developer" },
];

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Employee>[] = [
  {
    header: "Employee",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
          <img
            src={row.image}
            alt={row.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.name}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.role}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Emp Code",
    accessor: "employeeCode",
    className: "whitespace-nowrap font-medium",
  },
  {
    header: "Department",
    accessor: "department",
    className: "whitespace-nowrap",
  },
  {
    header: "Position",
    accessor: "position",
    className: "whitespace-nowrap",
  },
  {
    header: "CTC",
    accessor: "currentCTC",
    className: "whitespace-nowrap font-medium text-gray-800 dark:text-white",
  },
  {
    header: "Joining Date",
    render: (row) => (
      <span className="whitespace-nowrap">
        {row.joiningDate
          ? new Date(row.joiningDate).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
  {
    header: "Status",
    render: (row) => (
      <Badge
        size="sm"
        color={
          row.status === "Active"
            ? "success"
            : row.status === "Pending"
              ? "warning"
              : "error"
        }
      >
        {row.status}
      </Badge>
    ),
  },
];

// ─── Detail fields for modal ──────────────────────────────────────────────────

const detailFields: DetailField<Employee>[] = [
  { label: "Full Name", render: (r) => r.name },
  { label: "Role", render: (r) => r.role },
  { label: "Employee Code", render: (r) => r.employeeCode },
  { label: "Department", render: (r) => r.department },
  { label: "Position", render: (r) => r.position },
  { label: "Monthly Salary", render: (r) => r.monthlySalary },
  { label: "Current CTC", render: (r) => r.currentCTC },
  { label: "Mobile Number", render: (r) => r.mobileNumber },
  { label: "Leaves Taken", render: (r) => r.leaveTaken },
  { label: "Status", render: (r) => r.status },
  {
    label: "Joining Date",
    render: (r) =>
      r.joiningDate ? new Date(r.joiningDate).toLocaleString() : "—",
  },
  {
    label: "Relieving Date",
    render: (r) =>
      r.relievingDate ? new Date(r.relievingDate).toLocaleString() : "Still Employed",
  },
];

// ─── Edit Form ────────────────────────────────────────────────────────────────

function EditForm({
  employee,
  onUpdate,
  onCancel,
}: {
  employee: Employee;
  onUpdate: (updated: Partial<Employee>) => void;
  onCancel: () => void;
}) {
  const [department, setDepartment] = useState(employee.department);
  const [position, setPosition] = useState(employee.position);
  const [monthlySalary, setMonthlySalary] = useState(employee.monthlySalary);
  const [currentCTC, setCurrentCTC] = useState(employee.currentCTC);
  const [joiningDate, setJoiningDate] = useState(employee.joiningDate);
  const [relievingDate, setRelievingDate] = useState(employee.relievingDate);
  const [leaveTaken, setLeaveTaken] = useState(String(employee.leaveTaken));
  const [status, setStatus] = useState(employee.status);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Edit Employee
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Updating details for{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {employee.name}
            </span>
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Employee Info (read-only) */}
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
          <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{employee.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{employee.role} · {employee.employeeCode}</p>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Department</Label>
          <Select
            options={DepartmentType}
            onChange={(val) => setDepartment(DepartmentType.find((d) => d.value === val)?.label ?? val)}
          />
        </div>
        <div>
          <Label>Position</Label>
          <Input value={position} onChange={(e: any) => setPosition(e.target.value)} placeholder="Enter position" />
        </div>
        <div>
          <Label>Monthly Salary</Label>
          <Input value={monthlySalary} onChange={(e: any) => setMonthlySalary(e.target.value)} placeholder="e.g. ₹85,000" />
        </div>
        <div>
          <Label>Current CTC</Label>
          <Input value={currentCTC} onChange={(e: any) => setCurrentCTC(e.target.value)} placeholder="e.g. ₹10,20,000" />
        </div>
        <div>
          <Label>Joining Date</Label>
          <Input type="datetime-local" value={joiningDate} onChange={(e: any) => setJoiningDate(e.target.value)} />
        </div>
        <div>
          <Label>Relieving Date</Label>
          <Input type="datetime-local" value={relievingDate} onChange={(e: any) => setRelievingDate(e.target.value)} />
        </div>
        <div>
          <Label>Leave Taken</Label>
          <Input type="number" value={leaveTaken} onChange={(e: any) => setLeaveTaken(e.target.value)} placeholder="Number of leaves" />
        </div>
        <div>
          <Label>Status</Label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Employee["status"])}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onUpdate({ department, position, monthlySalary, currentCTC, joiningDate, relievingDate, leaveTaken: Number(leaveTaken), status })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdate = (updated: Partial<Employee>) => {
    if (!editEmployee) return;
    setEmployees((prev) =>
      prev.map((e) => (e.id === editEmployee.id ? { ...e, ...updated } : e))
    );
    setEditEmployee(null);
  };

  return (
    <div>
      <PageMeta title="Manage Employees" description="View and manage all employees" />
      <PageBreadcrumb pageTitle="Manage Employees" />

      {/* Edit form slides in above the table */}
      {editEmployee && (
        <EditForm
          employee={editEmployee}
          onUpdate={handleUpdate}
          onCancel={() => setEditEmployee(null)}
        />
      )}

      <DataTable
        data={employees}
        columns={columns}
        detailFields={detailFields}
        onDelete={handleDelete}
        onEdit={(row) => setEditEmployee(row)}
        searchKeys={["name", "employeeCode", "department", "position", "role"]}
        searchPlaceholder="Search employees..."
        title="All Employees"
      />
    </div>
  );
}