import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllRevenues,
  deleteRevenue,
} from "../../features/revenue/revenueApi";
import { Revenue, Project, User, Partner } from "../../types/apiTypes";
import { getAllProjects } from "../../features/projects/projectAPI";
import { getAllUsers } from "../../features/users/userApi";
import { getAllPartners } from "../../features/users/partnerApi";
import { DataTable, DetailField } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";
import { AddRevenueForm } from "./AddRevenueForm";
import { EditRevenueModal } from "./EditRevenueModal";
import { getRevenueColumns } from "./getRevenueColumns";

const getRevenueDetailFields = (
  projects: Project[],
  partners: (Partner & { firstName: string; lastName: string })[],
): DetailField<Revenue>[] => [
  { label: "Revenue ID", render: (r) => r.id },
  {
    label: "Partner",
    render: (r) => {
      const partner = partners.find((p) => p.id === r.partnerId);
      return partner
        ? `${partner.firstName} ${partner.lastName}`
        : `ID: ${r.partnerId}`;
    },
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
      const project = projects.find((p) => p.id === pId);
      return project ? project.name : `ID: ${r.projectId}`;
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageRevenue() {
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<
    (Partner & { firstName: string; lastName: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [editRevenue, setEditRevenue] = useState<Revenue | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [revRes, projRes, userRes, partnerRes] = await Promise.all([
        getAllRevenues(),
        getAllProjects(),
        getAllUsers(1, 1000),
        getAllPartners(),
      ]);

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
    {
      key: "view",
      label: "View Revenue",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
  ];

  function handleAddClick() {
    setActiveTab("add");
  }

  return (
    <div>
      <PageMeta title="Manage Revenue" description="Revenue Management" />
      <PageBreadcrumb pageTitle="Manage Revenue" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key !== "add") {
                    setActiveTab(tab.key as any);
                  }
                }}
                disabled={tab.key === "add"}
                className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                } ${tab.key === "add" ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          <Button onClick={handleAddClick} className="m-2">
            {/* {" "} */}+ Add Revenue
          </Button>
        </div>

        <div className="p-6">
          {activeTab === "view" ? (
            loading ? (
              <Spinner
                size="md"
                label="Loading revenue records..."
                className="py-16"
              />
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
              <AddRevenueForm
                onAdded={() => {
                  fetchData();
                  setActiveTab("view");
                }}
                projects={projects}
                partners={partners}
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
          projects={projects}
          partners={partners}
        />
      )}
    </div>
  );
}