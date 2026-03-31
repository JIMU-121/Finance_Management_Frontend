import { ColumnDef } from "../../components/ui/table/DataTable";
import { Partner, Project, Revenue } from "../../types/apiTypes";

export const getRevenueColumns = (
  projects: Project[],
  partners: (Partner & { firstName: string; lastName: string })[],
): ColumnDef<Revenue>[] => [
  {
    header: "Partner",
    render: (row) => {
      const partner = partners.find((p) => p.id === row.partnerId);
      return (
        <span className="block font-semibold text-gray-900 dark:text-white">
          {partner
            ? `${partner.firstName} ${partner.lastName}`
            : `Partner #${row.partnerId}`}
        </span>
      );
    },
  },
  {
    header: "Project",
    render: (row) => {
      const pId = row.projectId;
      if (
        pId === null ||
        pId === undefined ||
        pId === 0 ||
        String(pId) === "null"
      ) {
        return <span className="text-gray-400">N/A</span>;
      }
      const project = projects.find((p) => p.id === pId);
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
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.revenue_From ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
      >
        {row.revenue_From ? "External" : "Internal"}
      </span>
    ),
  },
];  