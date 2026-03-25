import { useState, useEffect, JSX } from "react";
import { DataTable, ColumnDef, DetailField } from "../components/ui/table/DataTable";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import Button from "../components/ui/button/Button";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Spinner from "../components/ui/spinner/Spinner";
import { showError, showSuccess } from "../utils/toast";
import { getAllUsers, deleteUser } from "../features/users/userApi";
import { usePagination } from "../hooks/usePagination";
import { getEmployeeByUserId, createEmployee, updateEmployee } from "../features/users/employeeApi";
import { EmployeeRecord, DocType, User } from "../types/apiTypes";
import { getAllDocTypes } from "../features/docTypes/docTypeApi";
import UploadDocumentModal from "../components/employees/UploadDocumentModal";
// ─── Types and Constants ────────────────────────────────────────────────────────
interface EmployeeUser extends User {
  employeeRecord?: EmployeeRecord;
  _isEmployeeCreated?: boolean;
}

// Assuming Employee Role is 3 or 'Employee'
const EMPLOYEE_ROLE_ID = 3;

const DepartmentType = [
  { value: "1", label: "HR" },
  { value: "2", label: "Accounts" },
  { value: "3", label: "Developer" },
];

// ─── Column definitions ───────────────────────────────────────────────────────

const getColumns = (onUpload: (user: EmployeeUser) => void): ColumnDef<EmployeeUser>[] => [
  {
    header: "Employee Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {row.firstName?.[0]?.toUpperCase() ?? "E"}
          {row.lastName?.[0]?.toUpperCase() ?? ""}
        </div>
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.firstName} {row.lastName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Emp Code",
    render: (row) => row.employeeRecord?.employeeCode ?? "—",
    className: "whitespace-nowrap font-medium",
  },
  {
    header: "Department",
    render: (row) => row.employeeRecord?.department ?? "—",
    className: "whitespace-nowrap",
  },
  {
    header: "Position",
    render: (row) => row.employeeRecord?.position ?? "—",
    className: "whitespace-nowrap",
  },
  {
    header: "CTC",
    render: (row) => row.employeeRecord?.currentCTC ?? "—",
    className: "whitespace-nowrap font-medium text-gray-800 dark:text-white",
  },
  {
    header: "Joining Date",
    render: (row) => {
      const dt = row.employeeRecord?.joinDate;
      return (
        <span className="whitespace-nowrap">
          {dt ? new Date(dt).toLocaleDateString() : "—"}
        </span>
      );
    },
  },
  {
    header: "Status",
    render: (row) => {
      const isCreated = row._isEmployeeCreated;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isCreated
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
        >
          {isCreated ? "Created" : "Not Created"}
        </span>
      );
    },
  },
  {
    header: "Documents",
    render: (row) => {
      const hasRecord = !!row.employeeRecord?.id;
      return (
        <button
          onClick={() => onUpload(row)}
          disabled={!hasRecord}
          title={hasRecord ? "Upload Document" : "Employee record not created yet"}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-theme-xs transition-colors ${hasRecord
              ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600"
            }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload
        </button>
      );
    },
  },
];

// ─── Detail fields for modal ──────────────────────────────────────────────────

const detailFields: DetailField<EmployeeUser>[] = [
  { label: "First Name", render: (r) => r.firstName },
  { label: "Last Name", render: (r) => r.lastName },
  { label: "Email", render: (r) => r.email },
  { label: "Employee Code", render: (r) => r.employeeRecord?.employeeCode ?? "—" },
  { label: "Branch ID", render: (r) => r.employeeRecord?.branchId ?? "—" },
  { label: "Department", render: (r) => r.employeeRecord?.department ?? "—" },
  { label: "Position", render: (r) => r.employeeRecord?.position ?? "—" },
  { label: "Monthly Salary", render: (r) => r.employeeRecord?.monthlySalary ?? "—" },
  { label: "Previous CTC", render: (r) => r.employeeRecord?.previousCTC ?? "—" },
  { label: "Current CTC", render: (r) => r.employeeRecord?.currentCTC ?? "—" },
  { label: "Leaves Taken", render: (r) => r.employeeRecord?.takenLeave ?? "—" },
  { label: "Status", render: (r) => r._isEmployeeCreated ? "Created" : "Not Created" },
  {
    label: "Joining Date",
    render: (r) => {
      const dt = r.employeeRecord?.joinDate;
      return dt ? new Date(dt).toLocaleString() : "—";
    },
  },
  {
    label: "Relieving Date",
    render: (r) => {
      const dt = r.employeeRecord?.relievingDate;
      return dt ? new Date(dt).toLocaleString() : "Still Employed";
    },
  },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditEmployeeModal({
  employee,
  onClose,
  onUpdated,
}: {
  employee: EmployeeUser;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const empRec = employee.employeeRecord || ({} as Partial<EmployeeRecord>);
  const [department, setDepartment] = useState(empRec.department || "");
  const [position, setPosition] = useState(empRec.position || "");
  const [monthlySalary, setMonthlySalary] = useState<string | number>(empRec.monthlySalary ?? "");
  const [currentCTC, setCurrentCTC] = useState<string | number>(empRec.currentCTC ?? "");
  const [joinDate, setJoinDate] = useState(empRec.joinDate || "");
  const [relievingDate, setRelievingDate] = useState(empRec.relievingDate || "");
  const [takenLeave, setTakenLeave] = useState<string | number>(empRec.takenLeave ?? 0);
  const [status, setStatus] = useState("Active");
  const [employeeCode, setEmployeeCode] = useState(empRec.employeeCode || "");
  const [branchId, setBranchId] = useState<string | number>(empRec.branchId ?? "");
  const [previousCTC, setPreviousCTC] = useState<string | number>(empRec.previousCTC ?? "");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const employeeData: EmployeeRecord = {
        userId: employee.id,
        department,
        position,
        monthlySalary: Number(monthlySalary) || 0,
        currentCTC: Number(currentCTC) || 0,
        joinDate,
        relievingDate: relievingDate || undefined,
        takenLeave: Number(takenLeave) || 0,
        employeeCode,
        branchId: Number(branchId) || 0,
        previousCTC: Number(previousCTC) || 0,
      };

      if (employee._isEmployeeCreated && employee.employeeRecord?.id) {
        await updateEmployee(employee.employeeRecord.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }

      showSuccess("Employee updated successfully.");
      onUpdated();
      onClose();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Edit Employee
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating details for{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {employee.firstName} {employee.lastName}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Employee Info (read-only) */}
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
          <div className="flex h-10 w-10 overflow-hidden flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {employee.firstName?.[0]?.toUpperCase() ?? "E"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{employee.firstName} {employee.lastName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{employee.email}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Employee Code</Label>
            <Input value={employeeCode} onChange={(e: any) => setEmployeeCode(e.target.value)} placeholder="EMP-2026-001" />
          </div>
          <div>
            <Label>Branch ID</Label>
            <Input type="number" value={branchId} onChange={(e: any) => setBranchId(e.target.value)} placeholder="2" />
          </div>
          <div>
            <Label>Department</Label>
            <Select
              options={DepartmentType}
              onChange={(val) => setDepartment(DepartmentType.find((d) => d.value === val)?.label ?? val)}
            />
          </div>
          <div>
            <Label>Position</Label>
            <Input value={position} onChange={(e: any) => setPosition(e.target.value)} placeholder="Backend Developer" />
          </div>
          <div>
            <Label>Monthly Salary</Label>
            <Input type="number" value={monthlySalary} onChange={(e: any) => setMonthlySalary(e.target.value)} placeholder="55000" />
          </div>
          <div>
            <Label>Previous CTC</Label>
            <Input type="number" value={previousCTC} onChange={(e: any) => setPreviousCTC(e.target.value)} placeholder="500000" />
          </div>
          <div>
            <Label>Current CTC</Label>
            <Input type="number" value={currentCTC} onChange={(e: any) => setCurrentCTC(e.target.value)} placeholder="660000" />
          </div>
          <div>
            <Label>Joining Date</Label>
            <Input type="datetime-local" value={joinDate} onChange={(e: any) => setJoinDate(e.target.value)} />
          </div>
          <div>
            <Label>Relieving Date</Label>
            <Input type="datetime-local" value={relievingDate} onChange={(e: any) => setRelievingDate(e.target.value)} />
          </div>
          <div>
            <Label>Leave Taken</Label>
            <Input type="number" value={takenLeave} onChange={(e: any) => setTakenLeave(e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label>Status</Label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageEmployees() {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [activeEmployees, setActiveEmployees] = useState<EmployeeUser[]>([]);
  const [inactiveEmployees, setInactiveEmployees] = useState<EmployeeUser[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeUser | null>(null);
  const [uploadEmployee, setUploadEmployee] = useState<EmployeeUser | null>(null);
  const [docTypes, setDocTypes] = useState<DocType[]>([]);

  const { pageNumber, pageSize, setTotalItems, paginationProps } = usePagination();

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const [userRes, docRes] = await Promise.all([
        getAllUsers(1, 1000),
        getAllDocTypes()
      ]);
      const res = userRes;
      setDocTypes((docRes?.data || docRes || []) as DocType[]);
      const parsedData = res.data as EmployeeUser[];

      const employeeUsers = parsedData.filter(
        u => String(u.role).trim() === String(EMPLOYEE_ROLE_ID) || String(u.role).trim().toLowerCase() === "employee"
      );

      const enrichedEmployees = await Promise.all(
        employeeUsers.map(async (u) => {
          const empReq = await getEmployeeByUserId(u.id);
          return {
            ...u,
            employeeRecord: empReq || undefined,
            _isEmployeeCreated: !!empReq
          };
        })
      );

      const active = enrichedEmployees.filter(e => e._isEmployeeCreated);
      const inactive = enrichedEmployees.filter(e => !e._isEmployeeCreated);

      setActiveEmployees(active);
      setInactiveEmployees(inactive);

      setTotalItems(activeTab === "active" ? active.length : inactive.length);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      showError("Failed to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (pageNumber !== 1) {
      paginationProps.onPageChange(1);
    } else {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      showSuccess("Employee deleted successfully.");
      if (activeTab === "active") {
        setActiveEmployees((prev) => prev.filter((u) => u.id !== id));
      } else {
        setInactiveEmployees((prev) => prev.filter((u) => u.id !== id));
      }
      setTotalItems((prev) => prev - 1);
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete employee.");
    }
  };

  const tabs: { key: "active" | "inactive"; label: string; icon: JSX.Element }[] = [
    {
      key: "active",
      label: "Active Employees",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
    },
    {
      key: "inactive",
      label: "Inactive Employees",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <PageMeta title="Manage Employees" description="View and manage all employees" />
      <PageBreadcrumb pageTitle="Manage Employees" />

      {/* Edit form modal */}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onUpdated={fetchEmployees}
        />
      )}

      {uploadEmployee && uploadEmployee.employeeRecord?.id && (
        <UploadDocumentModal
          employeeId={uploadEmployee.employeeRecord.id}
          employeeName={`${uploadEmployee.firstName} ${uploadEmployee.lastName}`}
          docTypes={docTypes}
          onClose={() => setUploadEmployee(null)}
          onSuccess={fetchEmployees}
        />
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mt-6">
        {/* ── Tab header ── */}
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="p-6">
          {activeTab === "active" && (
            <>
              {loadingEmployees ? (
                <Spinner size="md" label="Loading employees..." className="py-16" />
              ) : (
                <DataTable
                  data={activeEmployees}
                  columns={getColumns((u) => setUploadEmployee(u))}
                  detailFields={detailFields}
                  onDelete={handleDelete}
                  onEdit={(row) => setEditEmployee(row)}
                  searchKeys={["firstName", "lastName", "email"]}
                  searchPlaceholder="Search active employees..."
                  title="Active Employees"
                  pagination={paginationProps}
                />
              )}
            </>
          )}

          {activeTab === "inactive" && (
            <>
              {loadingEmployees ? (
                <Spinner size="md" label="Loading inactive employees..." className="py-16" />
              ) : (
                <DataTable
                  data={inactiveEmployees}
                  columns={getColumns((u) => setUploadEmployee(u))}
                  detailFields={detailFields}
                  onDelete={handleDelete}
                  onEdit={(row) => setEditEmployee(row)}
                  searchKeys={["firstName", "lastName", "email"]}
                  searchPlaceholder="Search inactive employees..."
                  title="Inactive Employees (Missing Details)"
                  pagination={paginationProps}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}