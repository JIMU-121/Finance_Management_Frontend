import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { showError, showSuccess } from "../utils/toast";
import { DocType } from "../types/apiTypes";
import { getAllDocTypes, createDocType, updateDocType, deleteDocType } from "../features/docTypes/docTypeApi";
import { DataTable, ColumnDef, DetailField } from "../components/ui/table/DataTable";
import Spinner from "../components/ui/spinner/Spinner";
import { PageTabs, PageTab } from "../components/ui/tabs/PageTabs";
import { ModalShell } from "../components/ui/modal/ModalShell";

// ─── DataTable config ─────────────────────────────────────────────────────────

const docTypeColumns: ColumnDef<DocType & { id: number }>[] = [
  // {
  //   header: "ID",
  //   render: (row) => (
  //     <span className="text-gray-600 dark:text-gray-300">{row.id}</span>
  //   ),
  // },
  {
    header: "Document Type",
    render: (row) => <span className="block font-semibold text-gray-900 dark:text-white">{row.typeName}</span>,
  },
];

const docTypeDetailFields: DetailField<DocType & { id: number }>[] = [
  { label: "ID", render: (r) => r.id },
  { label: "Document Type", render: (r) => r.typeName },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditDocTypeModal({ docType, onClose, onUpdated }: {
  docType: DocType & { id: number };
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [typeName, setTypeName] = useState(docType.typeName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!typeName.trim()) {
      showError("Document type name is required.");
      return;
    }
    try {
      setSaving(true);
      await updateDocType(docType.id, { typeName });
      showSuccess("Document Type updated successfully.");
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
      title="Edit Document Type"
      subtitle={`Updating: ${docType.typeName}`}
      onClose={onClose}
      maxWidth="lg"
      saving={saving}
      onSave={handleSave}
    >
      <div>
        <Label>Document Type Name</Label>
        <Input value={typeName} onChange={(e: any) => setTypeName(e.target.value)} placeholder="e.g. Aadhar" />
      </div>
    </ModalShell>
  );
}

// ─── Add Form ─────────────────────────────────────────────────────────────────

export function AddDocTypeForm({ onAdded }: { onAdded: () => void }) {
  const [typeName, setTypeName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clearInput = () => setTypeName("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) {
      showError("Document type name is required.");
      return;
    }
    try {
      setSubmitting(true);
      await createDocType({ typeName });
      showSuccess("Document Type added successfully.");
      clearInput();
      onAdded();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Adding document type failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Document Type Information</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Provide the necessary details to register a new document type.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Document Type Name <span className="text-red-500">*</span></Label>
            <Input type="text" value={typeName} onChange={(e: any) => setTypeName(e.target.value)} placeholder="e.g. Aadhar" />
          </div>
        </div>
        <div className="mt-8 flex gap-4 pt-4">
          <Button type="submit" disabled={submitting} className="bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-white shadow-theme-xs transition-colors">
            {submitting ? "Registering..." : "Register Document Type"}
          </Button>
          <Button type="button" variant="outline" onClick={clearInput} className="px-6 py-2.5">
            Clear Form
          </Button>
        </div>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: PageTab<"add" | "view">[] = [
  {
    key: "view",
    label: "View DocTypes",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  // {
  //   key: "add",
  //   label: "Add DocType",
  //   icon: (
  //     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  //     </svg>
  //   ),
  // },
];

export default function ManageDocumentType() {
  const [activeTab, setActiveTab] = useState<"add" | "view">("view");
  const [docTypes, setDocTypes] = useState<(DocType & { id: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDocType, setEditDocType] = useState<(DocType & { id: number }) | null>(null);

  const fetchDocTypes = async () => {
    try {
      setLoading(true);
      const res = await getAllDocTypes();
      setDocTypes((res?.data || res || []) as (DocType & { id: number })[]);
    } catch (err) {
      console.error("Failed to fetch doc types", err);
      showError("Failed to load document types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") fetchDocTypes();
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    try {
      await deleteDocType(id);
      showSuccess("Document type deleted successfully.");
      setDocTypes((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete document type.");
    }
  };

  return (
    <div>
      <PageMeta title="Manage DocTypes" description="Document Type Management" />
      <PageBreadcrumb pageTitle="Manage DocTypes" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Left - Tab */}
            <div className="flex items-center gap-1">
              {TABS.map((tab) => (
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

            {/* Right - Add Button */}
            <Button
              onClick={() => setActiveTab("add")}
              className="bg-brand-500 m-2 hover:bg-brand-600 text-white px-5 py-2"
            >
              + Add Document Type
            </Button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "add" && (
            <div className="max-w-3xl">
              <AddDocTypeForm onAdded={() => setActiveTab("view")} />
            </div>
          )}

          {activeTab === "view" && (
            <>
              {loading ? (
                <Spinner size="md" label="Loading DocTypes..." className="py-16" />
              ) : (
                <DataTable
                  data={docTypes}
                  columns={docTypeColumns}
                  detailFields={docTypeDetailFields}
                  onDelete={(id) => handleDelete(id as number)}
                  onEdit={(row) => setEditDocType(row)}
                  searchKeys={["typeName"]}
                  searchPlaceholder="Search by document type..."
                  title="Document Types"
                />
              )}
            </>
          )}
        </div>
      </div>

      {editDocType && (
        <EditDocTypeModal
          docType={editDocType}
          onClose={() => setEditDocType(null)}
          onUpdated={fetchDocTypes}
        />
      )}
    </div>
  );
}
