import { ColumnDef } from "../../components/ui/table/DataTable";
import { Revenue } from "../../types/apiTypes";

export const getRevenueColumns = (): ColumnDef<Revenue>[] => [
  {
    header: "Partner",
    render: (row) => (
      <span className="block font-semibold text-gray-900 dark:text-white">
        {row.partnerName || `Partner #${row.partnerId}`}
      </span>
    ),
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
      return (
        <span className="text-gray-600 dark:text-gray-300">
          {row.projectName || `Project #${pId}`}
        </span>
      );
    },
  },
  {
    header: "Amount",
    render: (row) => (
      <span className="text-gray-600 dark:text-gray-300 font-medium">
        ₹{row.amount.toLocaleString("en-IN")}
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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.revenue_From
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.revenue_From ? "External" : "Internal"}
      </span>
    ),
  },
];