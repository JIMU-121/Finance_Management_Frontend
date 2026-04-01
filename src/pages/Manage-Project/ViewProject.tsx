import { useState, useEffect } from "react";
import { DataTable, ColumnDef, DetailField } from "../../components/ui/table/DataTable";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { showSuccess, showError } from "../../utils/toast";
import Spinner from "../../components/ui/spinner/Spinner";
import { ModalShell } from "../../components/ui/modal/ModalShell";
import StatusBadge from "../../components/ui/badge/StatusBadge";
import InitialAvatar from "../../components/ui/avatar/InitialAvatar";
import { AssignEmployeeModal } from "../../features/projects/components/AssignEmployeeModal";
import {
  getAllProjects,
  deleteProject,
  updateProject,
  Project,
} from "../../features/projects/projectAPI";
import { getAllProfiles } from "../../api/ProfileApi";
import { RegisterProjectPayload, AssignedEmployee } from "../../types/apiTypes";

function EmployeeAvatars({
  initialEmployees,
  onManage,
}: {
  initialEmployees?: AssignedEmployee[];
  onManage: () => void;
}) {
  const list = (initialEmployees ?? []).filter(e => e.isActive);

  const shown = list.slice(0, 3);
  const extra = list.length - shown.length;

  return (
    <button
      onClick={onManage}
      className="flex items-center gap-1 group focus:outline-none"
      title="Manage employees"
    >
      <div className="flex -space-x-2">
        {shown.map((emp, i) => {
          return (
            <InitialAvatar
              key={emp.id ?? emp.employeeId ?? i}
              name={emp.employeeName || "Employee"}
              index={i}
            />
          );
        })}
        {extra > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-900">
            +{extra}
          </span>
        )}
        {list.length === 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
            Assign
          </span>
        )}
      </div>
      {list.length > 0 && (
        <svg className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 ml-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </button>
  );
}


// ─── Edit Modal ───────────────────────────────────────────────────────────────

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90";

function EditProjectModal({
  project,
  onClose,
  onUpdated,
}: {
  project: Project;
  onClose: () => void;
  onUpdated: () => void;
}) {

  const [formData, setFormData] = useState<any>({
    ...project,
    projectValue: project.projectValue
      ? Number(project.projectValue).toLocaleString("en-IN")
      : "",
  });

  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    getAllProfiles()
      .then(setProfiles)
      .catch(() => console.error("Failed to load profiles"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleToggle = (name: keyof Project) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const handleAmountChange = (e: any) => {
    let value = e.target.value;

    value = value.replace(/,/g, "");

    if (!/^\d*$/.test(value)) return;

    const formatted = value
      ? Number(value).toLocaleString("en-IN")
      : "";

    setFormData((prev: any) => ({
      ...prev,
      projectValue: formatted,
    }));
  };


  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: RegisterProjectPayload = {
        name: formData.name,
        description: formData.description,
        clientName: formData.clientName,
        projectValue: Number(String(formData.projectValue).replace(/,/g, "")),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        managedByPartnerId: Number(formData.managedByPartnerId),
        profileId: formData.profileId ? Number(formData.profileId) : null,
        technologyStack: formData.technologyStack,
        managerName: formData.managerName,
        managerEmail: formData.managerEmail,
        managerContact: formData.managerContact,
        leaveApplyWay: formData.leaveApplyWay,
        clientManagerName: formData.clientManagerName,
        clientManagerEmail: formData.clientManagerEmail,
        clientManagerContact: formData.clientManagerContact,
        isSmooth: formData.isSmooth,
        mobileNumberUsed: formData.mobileNumberUsed,
        interviewingUserId: formData.interviewingUserId ? Number(formData.interviewingUserId) : null,
        isToolUsed: formData.isToolUsed,
      };
      await updateProject(formData.id, payload);
      showSuccess("Project updated successfully.");
      onUpdated();
      onClose();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Edit Project"
      subtitle={`Updating: ${project.name}`}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Project Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Project Name" />
          </div>
          <div>
            <Label>Status</Label>
            <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div>
            <Label>Client Name</Label>
            <Input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client Name" />
          </div>
          <div>
            <Label>Manager Name</Label>
            <Input name="managerName" value={formData.managerName} onChange={handleChange} placeholder="Manager Name" />
          </div>
          <div>
            <Label>Manager Email</Label>
            <Input name="managerEmail" value={formData.managerEmail} onChange={handleChange} placeholder="manager@company.com" />
          </div>
          <div>
            <Label>Manager Contact</Label>
            <Input name="managerContact" value={formData.managerContact} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div>
            <Label>Technology Stack</Label>
            <Input name="technologyStack" value={formData.technologyStack} onChange={handleChange} placeholder="React, .NET Core..." />
          </div>
          <div>
            <Label>Project Profile</Label>
            <select 
              name="profileId" 
              value={formData.profileId ?? ""} 
              onChange={handleChange} 
              className={selectClass}
            >
              <option value="">Select Profile</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  Profile #{profile.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Project Value (₹)</Label>
            <Input
              type="text"
              value={formData.projectValue || ""}
              onChange={handleAmountChange}
              placeholder="e.g. 2,00,000"
            />         
             </div>
          <div>
            <Label>Start Date</Label>
            <Input name="startDate" type="datetime-local" value={formData.startDate?.slice(0, 16)} onChange={handleChange} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input name="endDate" type="datetime-local" value={formData.endDate?.slice(0, 16)} onChange={handleChange} />
          </div>
          <div>
            <Label>Client Manager Name</Label>
            <Input name="clientManagerName" value={formData.clientManagerName} onChange={handleChange} placeholder="Client Manager Name" />
          </div>
          <div>
            <Label>Client Manager Email</Label>
            <Input name="clientManagerEmail" value={formData.clientManagerEmail} onChange={handleChange} placeholder="clientmanager@company.com" />
          </div>
          <div>
            <Label>Client Manager Contact</Label>
            <Input name="clientManagerContact" value={formData.clientManagerContact} onChange={handleChange} placeholder="9123456780" />
          </div>
          <div>
            <Label>Leave Apply Way</Label>
            <Input name="leaveApplyWay" value={formData.leaveApplyWay} onChange={handleChange} placeholder="e.g. Portal" />
          </div>
          <div>
            <Label>Mobile Number Used</Label>
            <Input name="mobileNumberUsed" value={formData.mobileNumberUsed} onChange={handleChange} placeholder="e.g. Company Device" />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90"
            placeholder="Project description..."
          />
        </div>

        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Setup Smooth?</span>
            <button
              type="button"
              onClick={() => handleToggle("isSmooth")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.isSmooth ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isSmooth ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Tool Used?</span>
            <button
              type="button"
              onClick={() => handleToggle("isToolUsed")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.isToolUsed ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isToolUsed ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Detail Fields ────────────────────────────────────────────────────────────

const detailFields: DetailField<Project>[] = [
  { label: "Project Name", render: (r) => r.name },
  { label: "Technology Stack", render: (r) => r.technologyStack },
  { label: "Description", render: (r) => r.description },
  { label: "Status", render: (r) => r.status },
  { label: "Manager Name", render: (r) => r.managerName },
  { label: "Manager Email", render: (r) => r.managerEmail },
  { label: "Manager Contact", render: (r) => r.managerContact },
  { label: "Client Name", render: (r) => r.clientName },
  { label: "Client Manager Name", render: (r) => r.clientManagerName },
  { label: "Client Manager Email", render: (r) => r.clientManagerEmail },
  { label: "Client Manager Contact", render: (r) => r.clientManagerContact },
  { label: "Project Value", render: (r) => `₹${(r.projectValue ?? 0).toLocaleString("en-IN")}` },
  { label: "Start Date", render: (r) => (r.startDate ? new Date(r.startDate).toLocaleString("en-IN") : "—") },
  { label: "End Date", render: (r) => (r.endDate ? new Date(r.endDate).toLocaleString("en-IN") : "—") },
  { label: "Is Setup Smooth", render: (r) => (r.isSmooth ? "Yes" : "No") },
  { label: "Is Tool Used", render: (r) => (r.isToolUsed ? "Yes" : "No") },
  { label: "Leave Apply Way", render: (r) => r.leaveApplyWay },
  { label: "Mobile Number Used", render: (r) => r.mobileNumberUsed },
  { label: "Partner", render: (r) => r.managedByPartner ?? "—" },
  { label: "Profile ID", render: (r) => r.profileId ?? "—" },
  { label: "Interviewing User ID", render: (r) => r.interviewingUserId ?? "—" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewProjectTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [assignProject, setAssignProject] = useState<Project | null>(null);


  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getAllProjects();
      const data = (res as any)?.data ?? res ?? [];
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      showError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      showSuccess("Project deleted successfully.");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete project.");
    }
  };

 const columns: ColumnDef<Project>[] = [
  {
    header: "Project Name",
    render: (row) => (
      <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
        {row.name}
      </span>
    ),
  },
  {
    header: "Manager",
    render: (row) => (
      <span className="whitespace-nowrap">{row.managerName}</span>
    ),
  },
  {
    header: "Client",
    render: (row) => (
      <span className="whitespace-nowrap">{row.clientName}</span>
    ),
  },


  {
    header: "Value",
    render: (row) => {
      const val = Number(row.projectValue || 0);
      return (
        <span className="whitespace-nowrap font-medium text-gray-800 dark:text-white">
          ₹{val ? val.toLocaleString("en-IN") : "-"}
        </span>
      );
    },
  },

  {
    header: "Start Date",
    render: (row) => (
      <span className="whitespace-nowrap">
        {row.startDate ? new Date(row.startDate).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    header: "End Date",
    render: (row) => (
      <span className="whitespace-nowrap">
        {row.endDate ? new Date(row.endDate).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    header: "Managing Partner",
    render: (row) => (
      <span className="whitespace-nowrap">
        {row.managedByPartner ?? "—"}
      </span>
    ),
  },
  {
    header: "Employees",
    render: (row) => (
      <EmployeeAvatars
        initialEmployees={row.employees}
        onManage={() => setAssignProject(row)}
      />
    ),
  },
  {
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

  const handleBulkDelete = async (ids: number[]) => {
    try {
      await Promise.all(ids.map((id) => deleteProject(id)));
      showSuccess(`${ids.length} projects deleted successfully.`);
      fetchProjects();
    } catch (err: any) {
      showError("Some deletions failed. Refreshing list...");
      fetchProjects();
    }
  };

  return (
    <>
      {loading ? (
        <Spinner size="md" label="Loading projects..." className="py-16" />
      ) : (
        <DataTable
          data={projects}
          columns={columns}
          detailFields={detailFields}
          onDelete={(id) => handleDelete(id as number)}
          onBulkDelete={handleBulkDelete}
          onEdit={(row) => setEditProject(row)}
          searchKeys={["name", "clientName", "managerName", "technologyStack"]}
          searchPlaceholder="Search projects..."
          title="All Projects"
        />
      )}

      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onUpdated={fetchProjects}
        />
      )}

      {assignProject && (
        <AssignEmployeeModal
          project={assignProject}
          onClose={() => setAssignProject(null)}
          onUpdated={async () => {
            await fetchProjects();
            // Sync the open modal's project reference with freshly fetched data
            setAssignProject((prev) =>
              prev ? (projects.find((p) => p.id === prev.id) ?? prev) : null
            );
          }}
        />
      )}
    </>
  );
}
