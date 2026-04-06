import { useState, useEffect } from "react";
import { ModalShell } from "../../../components/ui/modal/ModalShell";
import InitialAvatar from "../../../components/ui/avatar/InitialAvatar";
import Input from "../../../components/form/input/InputField";
import Skeleton from "../../../components/ui/skeleton/Skeleton";
import { showSuccess, showError } from "../../../utils/toast";
import {
  assignEmployeeToProject,
  unassignEmployeeFromProject,
  Project,
} from "../projectAPI";
import { getAllEmployees } from "../../users/employeeApi";
import { getAllUsers, User } from "../../users/userApi";
import { EmployeeRecord } from "../../../types/apiTypes";

interface EmployeeWithUser extends EmployeeRecord {
  fullName: string;
}

interface AssignEmployeeModalProps {
  project: Project;
  onClose: () => void;
  onUpdated: () => void;
}

export function AssignEmployeeModal({
  project,
  onClose,
  onUpdated,
}: AssignEmployeeModalProps) {
  const [employees, setEmployees] = useState<EmployeeWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [assigningEmp, setAssigningEmp] = useState<EmployeeWithUser | null>(null);
  const [assignForm, setAssignForm] = useState({ role: "", hourlyRate: 0, isBench: false });

  const [assignedUsers, setAssignedUsers] = useState<any[]>(project.employees ?? []);

  // Also fetch project employees from the new endpoint
  useEffect(() => {
    import("../projectAPI").then(({ getProjectEmployees }) => {
      getProjectEmployees(project.id).then(setAssignedUsers).catch(console.error);
    });
  }, [project.id]);

  const assignedIds = new Set(assignedUsers.map((e: any) => e.employeeId ?? e.id));

  useEffect(() => {
    Promise.all([getAllEmployees(), getAllUsers(1, 1000)])
      .then(([emps, usersRes]) => {
        const users = (usersRes as any).data ?? usersRes;
        const enriched = emps.map((emp) => {
          const user = Array.isArray(users) ? users.find((u: User) => u.id === emp.userId) : null;
          const userNameObj = user ? [user.firstName, user.lastName].filter(n => n && n !== "null").join(" ") : "";
          return {
            ...emp,
            fullName: userNameObj || `Employee #${emp.id}`,
          };
        });
        setEmployees(enriched);
      })
      .catch((err: any) => {
        console.error("Employee load error:", err);
        showError("Failed to load employees: " + (err?.response?.data?.message || err?.message || "Unknown error"));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUnassign = async (emp: EmployeeWithUser) => {
    if (busy !== null) return;
    setBusy(emp.id!);
    try {
      await unassignEmployeeFromProject(project.id, emp.id!);
      setAssignedUsers(prev => prev.filter(a => (a.employeeId ?? a.id) !== emp.id));
      showSuccess(`${emp.fullName} unassigned.`);
      await onUpdated();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Unassign failed.");
    } finally {
      setBusy(null);
    }
  };

  const handleAssignSubmit = async (emp: EmployeeWithUser) => {
    if (!assignForm.role.trim()) { showError("Role is required."); return; }
    setBusy(emp.id!);
    try {
      await assignEmployeeToProject({
        projectId: project.id,
        employeeId: emp.id!,
        role: assignForm.role,
        hourlyRate: Number(assignForm.hourlyRate),
        isBench: assignForm.isBench,
      });
      // @ts-ignore
      setAssignedUsers(prev => [...prev, { employeeId: emp.id, role: assignForm.role, hourlyRate: Number(assignForm.hourlyRate), isBench: assignForm.isBench }]);
      showSuccess(`${emp.fullName} assigned.`);
      setAssigningEmp(null);
      setAssignForm({ role: "", hourlyRate: 0, isBench: false });
      await onUpdated();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Assign failed.");
    } finally {
      setBusy(null);
    }
  };

  const filtered = employees.filter((e) =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (e.employeeCode ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const assignedList = filtered.filter(emp => assignedIds.has(emp.id!));
  const availableList = filtered.filter(emp => !assignedIds.has(emp.id!));

  return (
    <ModalShell
      title="Manage Employees"
      subtitle={project.name}
      onClose={onClose}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="pb-2">
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List content */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-8 space-y-3">
              <Skeleton variant="text" className="h-16 w-full" />
              <Skeleton variant="text" className="h-16 w-full" />
              <Skeleton variant="text" className="h-16 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No employees found.</p>
          ) : (
            <>
              {/* Assigned Section */}
              {assignedList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Assigned Employees ({assignedList.length})
                  </h3>
                  {assignedList.map((emp, i) => {
                    const isBusy = busy === emp.id;
                    return (
                      <div key={emp.id} className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-800 transition-all">
                        <div className="flex items-center justify-between px-4 py-3 bg-blue-50/60 dark:bg-blue-900/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <InitialAvatar name={emp.fullName} index={i} />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{emp.fullName}</p>
                              {emp.employeeCode && (
                                <p className="text-xs text-blue-500/70 dark:text-blue-400/70">{emp.employeeCode} · {emp.department ?? ""}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnassign(emp)}
                            disabled={isBusy}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {isBusy ? (
                              <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                            ) : (
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            Unassign
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Available Section */}
              {availableList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Available to Assign ({availableList.length})
                  </h3>
                  {availableList.map((emp, i) => {
                    const isBusy = busy === emp.id;
                    const isExpanded = assigningEmp?.id === emp.id;
                    return (
                      <div key={emp.id} className="rounded-xl overflow-hidden border border-transparent transition-all">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <InitialAvatar name={emp.fullName} index={assignedList.length + i} />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{emp.fullName}</p>
                              {emp.employeeCode && (
                                <p className="text-xs text-gray-400">{emp.employeeCode} · {emp.department ?? ""}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setAssigningEmp(isExpanded ? null : emp);
                              setAssignForm({ role: "", hourlyRate: 0, isBench: false });
                            }}
                            disabled={isBusy}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                            </svg>
                            {isExpanded ? "Cancel" : "Assign"}
                          </button>
                        </div>

                        {/* Inline assign form */}
                        {isExpanded && (
                          <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-xl px-4 py-3 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Role <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Developer"
                                  value={assignForm.role}
                                  onChange={(e) => setAssignForm((f) => ({ ...f, role: e.target.value }))}
                                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Hourly Rate (₹)
                                </label>
                                <input
                                  type="number"
                                  placeholder="e.g. 500"
                                  value={assignForm.hourlyRate}
                                  onChange={(e) => setAssignForm((f) => ({ ...f, hourlyRate: Number(e.target.value) }))}
                                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={assignForm.isBench}
                                  onChange={(e) => setAssignForm((f) => ({ ...f, isBench: e.target.checked }))}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400">On Bench</span>
                              </label>
                              <button
                                onClick={() => handleAssignSubmit(emp)}
                                disabled={isBusy}
                                className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
                              >
                                {isBusy ? "Assigning..." : "Confirm Assign"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
