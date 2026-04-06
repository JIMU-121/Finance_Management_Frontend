import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllRevenues,
  deleteRevenue,
} from "../../features/revenue/revenueApi";
import { Revenue } from "../../types/apiTypes";
import { DataTable, DetailField } from "../../components/ui/table/DataTable";
import { TableSkeleton } from "../../components/ui/skeleton/TableSkeleton";
import { AddRevenueForm } from "./AddRevenueForm";
import { EditRevenueModal } from "./EditRevenueModal";
import { getRevenueColumns } from "./getRevenueColumns";

const getRevenueDetailFields = (): DetailField<Revenue>[] => [
  { label: "Revenue ID", render: (r) => r.id },
  {
    label: "Partner",
    render: (r) => r.partnerName || `ID: ${r.partnerId}`,
  },
  {
    label: "Project",
    render: (r) => {
      const pId = r.projectId;
      if (
        pId === null ||
        pId === undefined ||
        pId === 0 ||
        String(pId) === "null"
      ) {
        return "N/A";
      }
      return r.projectName || `ID: ${pId}`;
    },
  },
  { label: "Amount", render: (r) => `₹${r.amount.toLocaleString("en-IN")}` },
  { label: "Date", render: (r) => new Date(r.date).toLocaleString() },
  {
    label: "Revenue From",
    render: (r) => (r.revenue_From ? "External" : "Internal"),
  },
  { label: "Notes", render: (r) => r.notes || "None" },
];

export default function ManageRevenue() {
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [editRevenue, setEditRevenue] = useState<Revenue | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const revRes = await getAllRevenues();
      const revData = ((revRes as any).data || revRes) as Revenue[];
      
      const sanitizedRevenues = revData.map((r: Revenue) => ({
        ...r,
        projectId:
          r.projectId === null ||
          r.projectId === undefined ||
          String(r.projectId) === "null" ||
          Number(r.projectId) === 0
            ? null
            : Number(r.projectId),
      }));
      setRevenues(sanitizedRevenues);
    } catch (err) {
      console.error("Failed to fetch revenues", err);
      showError("Failed to load revenues.");
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

  const handleBulkDelete = async (ids: number[]) => {
    try {
      await Promise.all(ids.map((id) => deleteRevenue(id)));
      showSuccess(`${ids.length} records deleted successfully.`);
      fetchData();
    } catch (err: any) {
      showError("Some deletions failed. Refreshing list...");
      fetchData();
    }
  };

  return (
    <div>
      <PageMeta title="Manage Revenue" description="Revenue Management" />
      <PageBreadcrumb pageTitle="Manage Revenue" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("view")}
              className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "view"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              View Revenue
            </button>
          </div>
          <Button onClick={() => setActiveTab("add")} className="m-2">
            + Add Revenue
          </Button>
        </div>

        <div className="p-6">
          {activeTab === "view" ? (
            loading ? (
              <div className="py-8">
                <TableSkeleton columns={4} rows={5} />
              </div>
            ) : (
              <DataTable
                data={revenues}
                columns={getRevenueColumns()}
                detailFields={getRevenueDetailFields()}
                title="Revenue Records"
                searchKeys={["notes", "partnerName", "projectName"]}
                searchPlaceholder="Search notes, partners or projects..."
                onDelete={(id) => handleDelete(id as number)}
                onBulkDelete={handleBulkDelete}
                onEdit={(row) => setEditRevenue(row)}
              />
            )
          ) : (
            <div className="max-w-4xl">
              <AddRevenueForm
                onAdded={() => {
                  fetchData();
                  setActiveTab("view");
                }}
              />
            </div>
          )}
        </div>
      </div>

      {editRevenue && (
        <EditRevenueModal
          revenue={editRevenue}
          onClose={() => setEditRevenue(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}