import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllRevenues,
  createRevenue,
  deleteRevenue,
  patchRevenue
} from "../../features/revenue/revenueApi";
import { Revenue, Project, User, Partner } from "../../types/apiTypes";
import { getAllProjects } from "../../features/projects/projectAPI";
import { getAllUsers } from "../../features/users/userApi";
import { getAllPartners } from "../../features/users/partnerApi";
import { DataTable, ColumnDef, DetailField } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";

// ─── DataTable config ─────────────────────────────────────────────────────────

const getRevenueColumns = (projects: Project[], partners: (Partner & { firstName: string; lastName: string })[]): ColumnDef<Revenue>[] => [
  {
    header: "Partner",
    render: (row) => {
      const partner = partners.find(p => p.id === row.partnerId);
      return (
        <span className="block font-semibold text-gray-900 dark:text-white">
          {partner ? `${partner.firstName} ${partner.lastName}` : `Partner #${row.partnerId}`}
        </span>
      );
    },
  },
  {
    header: "Project",
    render: (row) => {
      const pId = row.projectId;
      if (pId === null || pId === undefined || pId === 0 || String(pId) === "null") {
        return <span className="text-gray-400">N/A</span>;
      }
      const project = projects.find(p => p.id === pId);
      return (
        <span className="text-gray-600 dark:text-gray-300">
          {project ? project.name : `Project #${row.projectId}`}
        </span>
      );
    },
  },
  {
    header: "Amount",
    render: (row) => (
      <span className="text-gray-600 dark:text-gray-300 font-medium">
        ₹{row.amount.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Date",
    render: (row) => (
      <span className="text-gray-600 dark:text-gray-300">
        {new Date(row.date).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: "Revenue From",
    render: (row) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.revenue_From ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {row.revenue_From ? "External" : "Internal"}
      </span>
    )
  }
];

const getRevenueDetailFields = (projects: Project[], partners: (Partner & { firstName: string; lastName: string })[]): DetailField<Revenue>[] => [
  { label: "Revenue ID", render: (r) => r.id },
  {
    label: "Partner",
    render: (r) => {
      const partner = partners.find(p => p.id === r.partnerId);
      return partner ? `${partner.firstName} ${partner.lastName}` : `ID: ${r.partnerId}`;
    }
  },
  {
    label: "Project",
    render: (r) => {
      const pId = r.projectId;
      if (pId === null || pId === undefined || pId === 0 || String(pId) === "null") {
        return "N/A";
      }
      const project = projects.find(p => p.id === pId);
      return project ? project.name : `ID: ${r.projectId}`;
    }
  },
  { label: "Amount", render: (r) => `₹${r.amount.toLocaleString()}` },
  { label: "Date", render: (r) => new Date(r.date).toLocaleString() },
  { label: "Revenue From", render: (r) => r.revenue_From ? "External" : "Internal" },
  { label: "Notes", render: (r) => r.notes || "None" },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditRevenueModal({
  revenue,
  onClose,
  onUpdated,
  projects,
  partners
}: {
  revenue: Revenue;
  onClose: () => void;
  onUpdated: () => void;
  projects: Project[];
  partners: (Partner & { firstName: string; lastName: string })[];
}) {
  const [partnerId, setPartnerId] = useState<number>(revenue.partnerId);
  const [projectId, setProjectId] = useState<number | null>(revenue.projectId);
  const [amount, setAmount] = useState<number | string>(revenue.amount);
  const [date, setDate] = useState<string>(revenue.date.split('T')[0]);
  const [revenueFrom, setRevenueFrom] = useState<boolean>(revenue.revenue_From);
  const [notes, setNotes] = useState<string>(revenue.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!partnerId || !amount || !date) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSaving(true);
      await patchRevenue(revenue.id, {
        partnerId,
        projectId: projectId,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        revenue_From: revenueFrom,
        notes,
      });
      showSuccess("Revenue updated successfully.");
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
      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit Revenue</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating Revenue Record #{revenue.id}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Partner <span className="text-red-500">*</span></Label>
              <Select
                options={partners.map(p => ({ value: String(p.id), label: `${p.firstName} ${p.lastName}` }))}
                value={String(partnerId)}
                onChange={(val) => setPartnerId(Number(val))}
              />
            </div>
            <div>
              <Label>Project</Label>
              <Select
                options={[{ value: "0", label: "None" }, ...projects.map(p => ({ value: String(p.id), label: p.name }))]}
                value={String(projectId || "0")}
                onChange={(val) => setProjectId(val === "0" ? null : Number(val))}
              />
            </div>
            <div>
              <Label>Amount (₹) <span className="text-red-500">*</span></Label>
              <Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="editRevenueFrom"
                checked={revenueFrom}
                onChange={(e) => setRevenueFrom(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <Label htmlFor="editRevenueFrom" className="!mb-0">Revenue From External Source</Label>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input value={notes} onChange={(e: any) => setNotes(e.target.value)} placeholder="Enter details..." />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 px-6 py-5 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-brand-500 text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Form ────────────────────────────────────────────────────────────

function AddRevenueForm({ onAdded, projects, partners }: { onAdded: () => void; projects: Project[]; partners: (Partner & { firstName: string; lastName: string })[]; }) {
  const [partnerId, setPartnerId] = useState<number>(partners[0]?.id || 0);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [revenueFrom, setRevenueFrom] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId || !amount || !date) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await createRevenue({
        partnerId,
        projectId: projectId,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        revenue_From: revenueFrom,
        notes
      });
      showSuccess("Revenue record created successfully.");
      onAdded();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Information</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new revenue entry.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>Partner <span className="text-red-500">*</span></Label>
            <Select
              options={partners.map(p => ({ value: String(p.id), label: `${p.firstName} ${p.lastName}` }))}
              value={String(partnerId)}
              onChange={(val) => setPartnerId(Number(val))}
            />
          </div>
          <div>
            <Label>Project</Label>
            <Select
              options={[{ value: "0", label: "None" }, ...projects.map(p => ({ value: String(p.id), label: p.name }))]}
              value={String(projectId || "0")}
              onChange={(val) => setProjectId(val === "0" ? null : Number(val))}
            />
          </div>
          <div>
            <Label>Amount (₹) <span className="text-red-500">*</span></Label>
            <Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="e.g. 50000" />
          </div>
          <div>
            <Label>Date <span className="text-red-500">*</span></Label>
            <Input type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 pt-[34px]">
            <input
              type="checkbox"
              id="revenueFrom"
              checked={revenueFrom}
              onChange={(e) => setRevenueFrom(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-brand-500"
            />
            <Label htmlFor="revenueFrom" className="!mb-0">External Revenue</Label>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label>Notes</Label>
            <Input value={notes} onChange={(e: any) => setNotes(e.target.value)} placeholder="e.g. Monthly project revenue" />
          </div>
        </div>

        <div className="mt-8 flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button type="submit" disabled={submitting} className="bg-brand-500 text-white px-6">
            {submitting ? "Registering..." : "Register Revenue"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageRevenue() {
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<(Partner & { firstName: string; lastName: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [editRevenue, setEditRevenue] = useState<Revenue | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [revRes, projRes, userRes, partnerRes] = await Promise.all([
        getAllRevenues(),
        getAllProjects(),
        getAllUsers(1, 1000),
        getAllPartners()
      ]);

      const revData = ((revRes as any).data || revRes) as Revenue[];
      const sanitizedRevenues = revData.map((r: Revenue) => ({
        ...r,
        projectId: (r.projectId === null || r.projectId === undefined || String(r.projectId) === "null" || Number(r.projectId) === 0) ? null : Number(r.projectId)
      }));
      setRevenues(sanitizedRevenues);
      setProjects((projRes as any).data || projRes);

      const allUsers = (userRes as any).data || userRes;
      const allPartners = (partnerRes as any).data || partnerRes;

      // Map partners to include user names
      const mappedPartners = allPartners.map((p: Partner) => {
        const user = allUsers.find((u: User) => u.id === p.userId);
        return {
          ...p,
          firstName: user?.firstName || "Unknown",
          lastName: user?.lastName || "Unknown",
        };
      });
      setPartners(mappedPartners);
    } catch (err) {
      console.error("Failed to fetch data", err);
      showError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRevenue(id);
      showSuccess("Revenue deleted successfully.");
      setRevenues((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const tabs = [
    { key: "view", label: "View Revenue", icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
    { key: "add", label: "Register Revenue", icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
  ];

  return (
    <div>
      <PageMeta title="Manage Revenue" description="Revenue Management" />
      <PageBreadcrumb pageTitle="Manage Revenue" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "view" ? (
            loading ? (
              <Spinner size="md" label="Loading revenue records..." className="py-16" />
            ) : (
              <DataTable
                data={revenues}
                columns={getRevenueColumns(projects, partners)}
                detailFields={getRevenueDetailFields(projects, partners)}
                title="Revenue Records"
                searchKeys={["notes"]}
                searchPlaceholder="Search by notes..."
                onDelete={(id) => handleDelete(id as number)}
                onEdit={(row) => setEditRevenue(row)}
              />
            )
          ) : (
            <div className="max-w-4xl">
              <AddRevenueForm onAdded={() => { fetchData(); setActiveTab("view"); }} projects={projects} partners={partners} />
            </div>
          )}
        </div>
      </div>

      {editRevenue && (
        <EditRevenueModal
          revenue={editRevenue}
          onClose={() => setEditRevenue(null)}
          onUpdated={fetchData}
          projects={projects}
          partners={partners}
        />
      )}
    </div>
  );
}
