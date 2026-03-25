import { useState, useEffect, JSX } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllExpenses,
  createExpense,
  deleteExpense,
  patchExpense,
  approveExpense
} from "../../features/expenses/expenseApi";
import { Expense, Asset } from "../../types/apiTypes";
import { getAllAssets } from "../../features/assets/assetApi";
import { AddAssetForm } from "../Manage-Asset";
import { getAllUsers, User } from "../../features/users/userApi";
import { getPartnerByUserId } from "../../features/users/partnerApi";
import { DataTable, ColumnDef, DetailField } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";

export enum ExpenseCategory {
  Office = 1,
  Tools = 2,
  Marketing = 3,
  Travel = 4,
  Utilities = 5,
  Other = 6
}

export const ExpenseCategoryOptions = [
  { value: "1", label: "Office" },
  { value: "2", label: "Tools" },
  { value: "3", label: "Marketing" },
  { value: "4", label: "Travel" },
  { value: "5", label: "Utilities" },
  { value: "6", label: "Other" },
];

export const getCategoryLabel = (id: number) => {
  const category = ExpenseCategoryOptions.find(c => c.value === String(id));
  return category ? category.label : "Unknown";
};

// ─── DataTable config ─────────────────────────────────────────────────────────

const getExpenseColumns = (onApprove: (id: number) => void): ColumnDef<Expense & { id: number }>[] => [
  {
    header: "Description",
    render: (row) => (
      <span className="block font-semibold text-gray-900 dark:text-white">
        {row.description}
      </span>
    ),
  },
  {
    header: "Amount",
    render: (row) => (
      <span className="text-gray-600 dark:text-gray-300">
        ₹{row.amount}
      </span>
    ),
  },
  {
    header: "Period",
    render: (row) => (
      <span className="text-gray-600 dark:text-gray-300">
        {row.month}/{row.year}
      </span>
    ),
  },
  {
    header: "Recurring",
    render: (row) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.isRecurring ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        {row.isRecurring ? "Yes" : "No"}
      </span>
    ),
  },
  {
    header: "Status",
    render: (row) => {
      const isApproved = row.status === 1 || row.approvedBy;
      return (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isApproved ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {isApproved ? "Approved" : "Pending"}
          </span>
          {!isApproved && (
            <button
              onClick={() => onApprove(row.id)}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Approve
            </button>
          )}
        </div>
      );
    },
  },
];

const expenseDetailFields: DetailField<Expense & { id: number }>[] = [
  { label: "Expense ID", render: (r) => r.id },
  { label: "Description", render: (r) => r.description },
  { label: "Amount", render: (r) => `₹${r.amount}` },
  { label: "Category", render: (r) => getCategoryLabel(r.category) },
  { label: "Asset ID", render: (r) => r.assetId || "N/A" },
  { label: "Partner ID", render: (r) => r.partnerId || "N/A" },
  { label: "Employee ID", render: (r) => r.employeeId || "N/A" },
  { label: "Month", render: (r) => r.month },
  { label: "Year", render: (r) => r.year },
  { label: "Recurring", render: (r) => (r.isRecurring ? "Yes" : "No") },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditExpenseModal({
  expense,
  onClose,
  onUpdated,
  assets,
  refreshAssets,
  partners
}: {
  expense: Expense & { id: number };
  onClose: () => void;
  onUpdated: () => void;
  assets: Asset[];
  refreshAssets: () => void;
  partners: User[];
}) {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [description, setDescription] = useState(expense.description || "");
  const [amount, setAmount] = useState<number | string>(expense.amount || "");
  const [assetId, setAssetId] = useState<number | string>(expense.assetId || 0);
  const [partnerId, setPartnerId] = useState<number | string>(expense.partnerId || 0);
  const [employeeId, setEmployeeId] = useState<number | string>(expense.employeeId || 0);
  const [category, setCategory] = useState<number | string>(expense.category || 1);
  const [month, setMonth] = useState<number | string>(expense.month || "");
  const [year, setYear] = useState<number | string>(expense.year || "");
  const [isRecurring, setIsRecurring] = useState(expense.isRecurring || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!description.trim() || !amount || !category || !month || !year) {
      showError("Please fill in all essential required fields.");
      return;
    }
    try {
      setSaving(true);
      await patchExpense(expense.id, {
        id: expense.id,
        description,
        amount: Number(amount),
        assetId: Number(assetId) || null,
        partnerId: Number(partnerId) || null,
        employeeId: Number(employeeId) || null,
        category: Number(category),
        month: Number(month),
        year: Number(year),
        isRecurring,
      });
      showSuccess("Expense updated successfully.");
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
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit Expense</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating Expense #{expense.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Description <span className="text-red-500">*</span></Label>
              <Input value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Office Supplies" />
            </div>

            <div>
              <Label>Amount (₹) <span className="text-red-500">*</span></Label>
              <Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select
                options={ExpenseCategoryOptions}
                value={String(category)}
                onChange={(val) => setCategory(Number(val))}
              />
            </div>

            <div>
              <Label>Month (1-12) <span className="text-red-500">*</span></Label>
              <Input type="number" value={month} onChange={(e: any) => setMonth(e.target.value)} placeholder="3" min="1" max="12" />
            </div>
            <div>
              <Label>Year <span className="text-red-500">*</span></Label>
              <Input type="number" value={year} onChange={(e: any) => setYear(e.target.value)} placeholder="2026" />
            </div>

            <div>
              <Label>Asset ID</Label>
              <div className="flex items-center gap-2">
                <Select
                  options={[{ value: "0", label: "None" }, ...assets.map(a => ({ value: String(a.id), label: `${a.name} (ID: ${a.id})` }))]}
                  value={String(assetId || "0")}
                  onChange={(val) => setAssetId(Number(val))}
                />
                <Button type="button" onClick={() => setIsAssetModalOpen(true)} className="px-3 py-2 text-xs h-11 whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 shadow-none border border-gray-200 dark:border-gray-700">
                  + Add New
                </Button>
              </div>
            </div>
            <div>
              <Label>Partner ID</Label>
              <Select
                options={[{ value: "0", label: "None" }, ...partners.map((p: User) => ({ value: String(p.id), label: `${p.firstName} ${p.lastName} (ID: ${p.id})` }))]}
                value={String(partnerId || "0")}
                onChange={(val) => setPartnerId(Number(val))}
              />
            </div>
            <div>
              <Label>Employee ID</Label>
              <Input type="number" value={employeeId} onChange={(e: any) => setEmployeeId(e.target.value)} placeholder="0" />
            </div>

            <div className="flex items-center gap-3 pt-6 md:col-span-2">
              <input
                type="checkbox"
                id="editIsRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
              />
              <Label htmlFor="editIsRecurring" className="!mb-0">This is a recurring expense</Label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 px-6 py-5 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
          <Button variant="outline" onClick={onClose} className="px-5 py-2">Cancel</Button>
          <Button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 shadow-theme-xs transition-colors" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {isAssetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAssetModalOpen(false)} />
          <div className="relative z-20 mx-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Register New Asset</h2>
              <button
                onClick={() => setIsAssetModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <AddAssetForm onAdded={(newAssetId) => {
                refreshAssets();
                if (newAssetId) setAssetId(newAssetId);
                setIsAssetModalOpen(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Form ────────────────────────────────────────────────────────────

function AddExpenseForm({ onAdded, assets, refreshAssets, partners }: { onAdded: () => void; assets: Asset[]; refreshAssets: () => void; partners: User[]; }) {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [assetId, setAssetId] = useState<number | string>(0);
  const [partnerId, setPartnerId] = useState<number | string>(0);
  const [employeeId, setEmployeeId] = useState<number | string>(0);
  const [category, setCategory] = useState<number | string>(1);
  const [month, setMonth] = useState<number | string>(currentMonth);
  const [year, setYear] = useState<number | string>(currentYear);
  const [isRecurring, setIsRecurring] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const clearInput = () => {
    setDescription(""); setAmount("");
    setAssetId(0); setPartnerId(0); setEmployeeId(0);
    setCategory(1); setMonth(currentMonth); setYear(currentYear);
    setIsRecurring(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !category || !month || !year) {
      showError("Please fill in all essential required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await createExpense({
        description,
        amount: Number(amount),
        assetId: Number(assetId) || null,
        partnerId: Number(partnerId) || null,
        employeeId: Number(employeeId) || null,
        category: Number(category),
        month: Number(month),
        year: Number(year),
        isRecurring
      });
      showSuccess("Expense registered successfully.");
      clearInput();
      onAdded();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Adding expense failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Expense Information
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Provide the necessary details to register a new expense into the ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-3">
            <Label>Description <span className="text-red-500">*</span></Label>
            <Input type="text" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="e.g. Server Hosting Fees" />
          </div>

          <div>
            <Label>Amount (₹) <span className="text-red-500">*</span></Label>
            <Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="e.g. 1500" />
          </div>

          <div>
            <Label>Category <span className="text-red-500">*</span></Label>
            <Select
              options={ExpenseCategoryOptions}
              value={String(category)}
              onChange={(val) => setCategory(Number(val))}
            />
          </div>

          <div className="flex items-center gap-3 pt-[34px]">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
            />
            <Label htmlFor="isRecurring" className="!mb-0 cursor-pointer">Recurring Expense</Label>
          </div>

          {/* Period Details */}
          <div className="mt-2 md:col-span-2 lg:col-span-3 border-t border-gray-200 pt-6 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Period & References</h4>
          </div>

          <div>
            <Label>Month (1-12) <span className="text-red-500">*</span></Label>
            <Input type="number" value={month} onChange={(e: any) => setMonth(e.target.value)} min="1" max="12" />
          </div>

          <div>
            <Label>Year <span className="text-red-500">*</span></Label>
            <Input type="number" value={year} onChange={(e: any) => setYear(e.target.value)} />
          </div>

          <div>
            <Label>Asset ID (Optional)</Label>
            <div className="flex items-center gap-2">
              <Select
                options={[{ value: "0", label: "None" }, ...assets.map(a => ({ value: String(a.id), label: `${a.name} (ID: ${a.id})` }))]}
                value={String(assetId || "0")}
                onChange={(val) => setAssetId(Number(val))}
              />
              <Button type="button" onClick={() => setIsAssetModalOpen(true)} className="px-3 py-2 text-xs h-11 whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 shadow-none border border-gray-200 dark:border-gray-700">
                + Add New
              </Button>
            </div>
          </div>

          <div>
            <Label>Partner ID (Optional)</Label>
            <Select
              options={[{ value: "0", label: "None" }, ...partners.map((p: User) => ({ value: String(p.id), label: `${p.firstName} ${p.lastName} (ID: ${p.id})` }))]}
              value={String(partnerId || "0")}
              onChange={(val) => setPartnerId(Number(val))}
            />
          </div>

          <div>
            <Label>Employee ID (Optional)</Label>
            <Input type="number" value={employeeId} onChange={(e: any) => setEmployeeId(e.target.value)} placeholder="0" />
          </div>
        </div>

        <div className="mt-8 flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-white shadow-theme-xs transition-colors"
          >
            {submitting ? "Registering..." : "Register Expense"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearInput}
            className="px-6 py-2.5"
          >
            Clear Form
          </Button>
        </div>
      </div>

      {isAssetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAssetModalOpen(false)} />
          <div className="relative z-20 mx-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Register New Asset</h2>
              <button
                type="button"
                onClick={() => setIsAssetModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <AddAssetForm onAdded={(newAssetId) => {
                refreshAssets();
                if (newAssetId) setAssetId(newAssetId);
                setIsAssetModalOpen(false);
              }} />
            </div>
          </div>
        </div>
      )}

    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageExpense() {
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");
  const [expenses, setExpenses] = useState<(Expense & { id: number })[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [partners, setPartners] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editExpense, setEditExpense] = useState<(Expense & { id: number }) | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await getAllAssets();
      setAssets(res as Asset[]);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await getAllUsers(1, 1000);
      const parsedData = res.data as User[];
      const partnerUsers = parsedData.filter(
        u => String(u.role).trim() === "2" || String(u.role).trim().toLowerCase() === "partner"
      );

      const activePartners = [];
      for (const u of partnerUsers) {
        const record = await getPartnerByUserId(u.id);
        if (record) {
          activePartners.push(u);
        }
      }
      setPartners(activePartners);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchPartners();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getAllExpenses();
      const data = res.data || res;
      setExpenses(data as unknown as (Expense & { id: number })[]);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
      showError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchExpenses();
    }
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);
      showSuccess("Expense deleted successfully.");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete expense.");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveExpense(id);
      showSuccess("Expense approved successfully.");
      fetchExpenses(); // Refresh list to get updated status
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to approve expense.");
    }
  };

  const tabs: { key: "view" | "add"; label: string; icon: JSX.Element }[] = [
    {
      key: "view",
      label: "View Expenses",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      key: "add",
      label: "Register Expense",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <PageMeta title="Manage Expenses" description="Expense Ledger Management" />
      <PageBreadcrumb pageTitle="Manage Expenses" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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
          {activeTab === "view" && (
            <>
              {loading ? (
                <Spinner size="md" label="Loading expenses..." className="py-16" />
              ) : (
                <div className="space-y-4">
                  <DataTable
                    data={expenses}
                    columns={getExpenseColumns(handleApprove)}
                    detailFields={expenseDetailFields}
                    title="All Expenses"
                    searchKeys={["description"]}
                    searchPlaceholder="Search by description..."
                    onDelete={(id) => handleDelete(id as number)}
                    onEdit={(row) => setEditExpense(row)}
                  />
                  {/* Implementing a custom bulk/approve action or putting it in columns 
                      Wait, DataTable only has edit, delete, detail. 
                      Let's add an Approve button to the details modal natively? 
                      No, the easiest is to add a custom column for Approve if it's pending.
                  */}
                </div>
              )}
            </>
          )}

          {activeTab === "add" && (
            <div className="max-w-4xl">
              <AddExpenseForm
                onAdded={() => setActiveTab("view")}
                assets={assets} refreshAssets={fetchAssets}
                partners={partners}
              />
            </div>
          )}
        </div>
      </div>

      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onUpdated={fetchExpenses}
          assets={assets}
          refreshAssets={fetchAssets}
          partners={partners}
        />
      )}
    </div>
  );
}
