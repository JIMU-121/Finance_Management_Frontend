import { useState, useEffect, JSX } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllAssets,
  createAsset,
  deleteAsset,
  updateAsset,
} from "../../features/assets/assetApi";
import { Asset } from "../../types/apiTypes";
import { DataTable, ColumnDef, DetailField } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const safeFormatDate = (input: string | Date | undefined | null) => {
  if (!input) return "";

  const date = new Date(input);

  if (isNaN(date.getTime())) {
    console.log("Invalid date:", input);
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ─── DataTable config ─────────────────────────────────────────────────────────

const assetColumns: ColumnDef<Asset & { id: number }>[] = [
  {
    header: "Name",
    render: (row) => (
      <span className="block font-semibold text-gray-900 dark:text-white">
        {row.name}
      </span>
    ),
  },
  {
    header: "Description",
    render: (row) => (
      <span className="text-gray-600 dark:text-gray-300">
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
    header: "Purchase Date",
    render: (row) => {
      const datePart = safeFormatDate(row.purchase_Date as unknown as string);
      return (
        <span className="text-gray-600 dark:text-gray-300">
          {datePart || "-"}
        </span>
      );
    },
  },
];

const assetDetailFields: DetailField<Asset & { id: number }>[] = [
  { label: "Asset ID", render: (r) => r.id },
  { label: "Name", render: (r) => r.name },
  { label: "Description", render: (r) => r.description },
  { label: "Amount", render: (r) => `₹${r.amount}` },
  {
    label: "Purchase Date", render: (r) => {
      const datePart = safeFormatDate(r.purchase_Date as unknown as string);

      return datePart || "-";

    }
  },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditAssetModal({
  asset,
  onClose,
  onUpdated,
}: {
  asset: Asset & { id: number };
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(asset.name);
  const [description, setDescription] = useState(asset.description);
  const [amount, setAmount] = useState<number | string>(asset.amount ?? "");
  const [purchaseDate, setPurchaseDate] = useState(() => safeFormatDate(asset.purchase_Date as unknown as string));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !amount || !purchaseDate) {
      showError("All fields are required.");
      return;
    }
    try {
      setSaving(true);
      await updateAsset(asset.id!, {
        id: asset.id,
        name,
        description,
        amount: Number(amount),
        purchase_Date: purchaseDate,
      });
      showSuccess("Asset updated successfully.");
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
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit Asset</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating: {asset.name}
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
          <div>
            <Label>Asset Name</Label>
            <Input value={name} onChange={(e: any) => setName(e.target.value)} placeholder="MacBook Pro" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Laptop for development" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount</Label>
              <Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="2000" />
            </div>
            <div>
              <DatePicker
                id={`edit-asset-purchase-date-${asset.id}`}
                label="Purchase Date"
                placeholder="Select date"
                defaultDate={purchaseDate}
                onChange={(dates) => {
                  if (dates && dates.length > 0) {
                    setPurchaseDate(safeFormatDate(dates[0]));
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 px-6 py-5 dark:border-gray-800">
          <Button variant="outline" onClick={onClose} className="px-5 py-2">Cancel</Button>
          <Button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 shadow-theme-xs transition-colors" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Form ────────────────────────────────────────────────────────────

export function AddAssetForm({ onAdded }: { onAdded: (assetId?: number) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clearInput = () => {
    setName(""); setDescription(""); setAmount(""); setPurchaseDate("");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !amount || !purchaseDate) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      const createdAsset = await createAsset({
        name,
        description,
        amount: Number(amount),
        purchase_Date: purchaseDate
      });

      showSuccess("Asset added successfully.");
      clearInput();
      onAdded(createdAsset.id);
    } catch (err: any) {
      showError(err?.response?.data?.message || "Adding asset failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Asset Information
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Provide the necessary details to register a new asset into the system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Asset Name <span className="text-red-500">*</span></Label>
            <Input type="text" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="e.g. Dell UltraSharp 27-inch Monitor" />
          </div>

          <div className="md:col-span-2">
            <Label>Description <span className="text-red-500">*</span></Label>
            <Input type="text" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="e.g. 4K USB-C Hub Monitor for design team" />
          </div>

          <div>
            <Label>Amount (₹) <span className="text-red-500">*</span></Label>
            <Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="e.g. 500" />
          </div>

          <div>
            <DatePicker
              id="asset-purchase-date"
              label="Purchase Date *"
              placeholder="Select date"
              onChange={(dates) => {
                if (dates && dates.length > 0) {
                  setPurchaseDate(safeFormatDate(dates[0]));
                } else {
                  setPurchaseDate("");
                }
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-white shadow-theme-xs transition-colors"
          >
            {submitting ? "Registering..." : "Register Asset"}
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
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageAsset() {
  const [activeTab, setActiveTab] = useState<"add" | "view">("view");
  const [assets, setAssets] = useState<(Asset & { id: number })[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [editAsset, setEditAsset] = useState<(Asset & { id: number }) | null>(null);

  const fetchAssets = async () => {
    try {
      setLoadingAssets(true);
      const res = await getAllAssets();
      setAssets(res as (Asset & { id: number })[]);
    } catch (err) {
      console.error("Failed to fetch assets", err);
      showError("Failed to load assets.");
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchAssets();
    }
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    try {
      await deleteAsset(id);
      showSuccess("Asset deleted successfully.");
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete asset.");
    }
  };

  const tabs: { key: "add" | "view"; label: string; icon: JSX.Element }[] = [
    {
      key: "view",
      label: "View Assets",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
    },
    // {
    //   key: "add",
    //   label: "Add Asset",
    //   icon: (
    //     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    //     </svg>
    //   ),
    // },
  ];

  return (
    <div>
      <PageMeta title="Manage Assets" description="Asset Management" />
      <PageBreadcrumb pageTitle="Manage Assets" />

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
          {activeTab === "add" && (
            <div className="max-w-3xl">
              <AddAssetForm onAdded={() => setActiveTab("view")} />
            </div>
          )}

          {activeTab === "view" && (
            <>
              {loadingAssets ? (
                <Spinner size="md" label="Loading assets..." className="py-16" />
              ) : (
                <DataTable
                  data={assets}
                  columns={assetColumns}
                  detailFields={assetDetailFields}
                  onDelete={(id) => handleDelete(id as number)}
                  onEdit={(row) => setEditAsset(row)}
                  searchKeys={["name", "description"]}
                  searchPlaceholder="Search by name or description..."
                  title="All Assets"
                // Pagination not added strictly yet since API might just return all, but we could hook it up if needed.
                />
              )}
            </>
          )}
        </div>
      </div>

      {editAsset && (
        <EditAssetModal
          asset={editAsset}
          onClose={() => setEditAsset(null)}
          onUpdated={fetchAssets}
        />
      )}
    </div>
  );
}
