import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTable, ColumnDef, DetailField } from "../components/ui/table/DataTable";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { TableSkeleton } from "../components/ui/skeleton/TableSkeleton";
import { showError, showSuccess } from "../utils/toast";
import { deleteUser } from "../features/users/userApi";
import { usePagination } from "../hooks/usePagination";
import { getAllEmployees, createEmployee, updateEmployee } from "../features/users/employeeApi";
import { EmployeeRecord } from "../types/apiTypes";
import DatePicker from "../components/form/date-picker";
import UploadDocumentModal from "../components/employees/UploadDocumentModal";
// ─── Types and Constants ────────────────────────────────────────────────────────
type EmployeeUser = EmployeeRecord & {
  id: number; // Required for DataTable
  _isEmployeeCreated?: boolean;
};

import { useEmployeeForm } from "../components/employees/useEmployeeForm";
import { ProfessionalFields, FinancialFields } from "../components/employees/EmployeeFormFields";

// ─── Column definitions ───────────────────────────────────────────────────────

const getColumns = (onUpload: (user: EmployeeUser) => void): ColumnDef<EmployeeUser>[] => [
  {
    header: "Employee Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {row.user?.firstName?.[0]?.toUpperCase() ?? "E"}
          {row.user?.lastName?.[0]?.toUpperCase() ?? ""}
        </div>
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.user?.firstName} {row.user?.lastName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.user?.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Emp Code",
    render: (row) => row.employeeCode ?? "—",
    className: "whitespace-nowrap font-medium",
  },
  {
    header: "Department",
    render: (row) => row.department ?? "—",
    className: "whitespace-nowrap",
  },
  {
    header: "Position",
    render: (row) => row.position ?? "—",
    className: "whitespace-nowrap",
  },
  {
    header: "CTC",
    render: (row) => {
      const val = Number(row.currentCTC || 0);
      return val ? val.toLocaleString("en-IN") : "—";
    },
    className: "whitespace-nowrap font-medium text-gray-800 dark:text-white",
  },
  {
    header: "Joining Date",
    render: (row) => {
      const dt = row.joinDate;
      return (
        <span className="whitespace-nowrap">
          {dt ? new Date(dt).toLocaleDateString() : "—"}
        </span>
      );
    },
  },
  {
    header: "Status",
    render: () => (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Created
      </span>
    ),
  },
  {
    header: "Documents",
    render: (row) => {
      const hasRecord = !!row.id;
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
  { label: "First Name", render: (r) => r.user?.firstName ?? "—" },
  { label: "Last Name", render: (r) => r.user?.lastName ?? "—" },
  { label: "Email", render: (r) => r.user?.email ?? "—" },
  { label: "Employee Code", render: (r) => r.employeeCode ?? "—" },
  { label: "Branch ID", render: (r) => r.branchId ?? "—" },
  { label: "Department", render: (r) => r.department ?? "—" },
  { label: "Position", render: (r) => r.position ?? "—" },
  {
    label: "Monthly Salary", render: (r) => {
      const val = Number(r.monthlySalary || 0);
      return val ? val.toLocaleString("en-IN") : "—";
    }
  },
  {
    label: "Previous CTC", render: (r) => {
      const val = Number(r.previousCTC || 0);
      return val ? val.toLocaleString("en-IN") : "—";
    }
  },
  {
    label: "Current CTC", render: (r) => {
      const val = Number(r.currentCTC || 0);
      return val ? val.toLocaleString("en-IN") : "—";
    }
  },
  { label: "Leaves Taken", render: (r) => r.takenLeave ?? "—" },
  {
    label: "Joining Date",
    render: (r) => {
      const dt = r.joinDate;
      return dt ? new Date(dt).toLocaleString() : "—";
    },
  },
  {
    label: "Relieving Date",
    render: (r) => {
      const dt = r.relievingDate;
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
  const { form, handleChange, formatAmountInput, handleCTCChange } = useEmployeeForm({
    department: employee.department || "",
    position: employee.position || "",
    monthlySalary: employee.monthlySalary ?? "",
    currentCTC: employee.currentCTC ?? "",
    joinDate: employee.joinDate || "",
    relievingDate: employee.relievingDate || "",
    takenLeave: employee.takenLeave ?? 0,
    status: "Active",
    employeeCode: employee.employeeCode || "",
    branchId: employee.branchId ?? "",
    previousCTC: employee.previousCTC ?? "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const employeeData: EmployeeRecord = {
        userId: employee.userId,
        department: form.department,
        position: form.position,
        monthlySalary: Number(String(form.monthlySalary).replace(/,/g, "")) || 0,
        currentCTC: Number(String(form.currentCTC).replace(/,/g, "")) || 0,
        joinDate: form.joinDate,
        relievingDate: form.relievingDate || undefined,
        takenLeave: Number(form.takenLeave) || 0,
        employeeCode: form.employeeCode,
        branchId: Number(form.branchId) || 0,
        previousCTC: Number(String(form.previousCTC).replace(/,/g, "")) || 0,
      };

      if (employee.id) {
        await updateEmployee(employee.id, employeeData);
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
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
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
                {employee.user?.firstName} {employee.user?.lastName}
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
            {employee.user?.firstName?.[0]?.toUpperCase() ?? "E"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{employee.user?.firstName} {employee.user?.lastName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{employee.user?.email}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfessionalFields form={form} handleChange={handleChange} />
          <FinancialFields form={form} handleChange={handleChange} formatAmountInput={formatAmountInput} handleCTCChange={handleCTCChange} isEdit={true} />
          <div>
            <DatePicker
              id="edit-relievingDate"
              label="Relieving Date"
              defaultDate={form.relievingDate || undefined}
              onChange={(_d, str) => handleChange("relievingDate", str)}
            />
          </div>
          <div>
            <Label>Leave Taken</Label>
            <Input type="number" value={form.takenLeave} onChange={(e: any) => handleChange("takenLeave", e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label>Status</Label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
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
  const [activeEmployees, setActiveEmployees] = useState<EmployeeUser[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeUser | null>(null);
  const [uploadEmployee, setUploadEmployee] = useState<EmployeeUser | null>(null);

  const navigate = useNavigate();
  const { pageNumber, pageSize, setTotalItems, paginationProps } = usePagination();

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const empData = await getAllEmployees();

      const employees = (empData || []).map((e: any) => ({
        ...e,
        id: e.id, // Ensure id is mapped
        _isEmployeeCreated: true
      })) as EmployeeUser[];

      setActiveEmployees(employees);
      setTotalItems(employees.length);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      showError("Failed to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      showSuccess("Employee deleted successfully.");
      setActiveEmployees((prev) => prev.filter((u) => u.id !== id));
      setTotalItems((prev) => prev - 1);
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete employee.");
    }
  };

  const tabs = [
    {
      key: "active",
      label: "Active Employees",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
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

      {uploadEmployee && uploadEmployee.id && (
        <UploadDocumentModal
          employeeId={uploadEmployee.id}
          employeeName={`${uploadEmployee.user?.firstName} ${uploadEmployee.user?.lastName}`}
          onClose={() => setUploadEmployee(null)}
          onSuccess={fetchEmployees}
        />
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mt-6">
        {/* ── Tab header ── */}
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Left - Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className="flex items-center gap-2 border-b-2 border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-all dark:text-blue-400"
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right - Add Button */}
            <Button
              onClick={() => navigate("/manage-employees/add")}
              className="bg-brand-500 m-2 hover:bg-brand-600 text-white px-5 py-2 rounded-lg"
            >
              + Add Employee
            </Button>
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="p-6">
          {loadingEmployees ? (
            <div className="py-8">
              <TableSkeleton columns={7} rows={6} />
            </div>
          ) : (
            <DataTable
              data={activeEmployees}
              columns={getColumns((u) => setUploadEmployee(u))}
              detailFields={detailFields}
              onDelete={handleDelete}
              onEdit={(row) => setEditEmployee(row)}
              searchKeys={["employeeCode", "department", "position"]}
              searchPlaceholder="Search active employees..."
              title="Active Employees"
              pagination={paginationProps}
            />
          )}
        </div>
      </div>
    </div>
  );
}