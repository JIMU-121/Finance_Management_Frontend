import { Expense, ExpenseCategory } from "../../types/apiTypes";
import { formatIndianNumber } from "../../components/form/IndianAmountInput";
import { ColumnDef, DetailField } from "../../components/ui/table/DataTable";
import { resolveCategoryName } from "./helpers";

export const getExpenseColumns = (
  onApprove: (id: number) => void,
  categories: ExpenseCategory[],
  currentPartnerId: number | null,
  userRole: string | null
): ColumnDef<Expense & { id: number }>[] => [
    {
      header: "Notes / Description",
      render: (row) => (
        <span className="block font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">
          {row.description || "—"}
        </span>
      ),
    },
    {
      header: "Category",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {resolveCategoryName(row.categoryId ?? 0, categories)}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">
          ₹{formatIndianNumber(row.amount)}
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
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.isRecurring
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            }`}
        >
          {row.isRecurring ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const isApproved = row.status === 1 || row.approvedBy;
        
        // Hide approve button for:
        // 1. Those who aren't partners (and also admins)
        // 2. The partner who submitted this expense
        const roleStr = String(userRole || "").trim().toLowerCase();
        const isPartner = roleStr === "2" || roleStr === "partner";
        const canApprove = isPartner && currentPartnerId !== row.partnerId;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isApproved
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
            >
              {isApproved ? "Approved" : "Pending"}
            </span>
            {!isApproved && canApprove && (
              <button
                onClick={() => onApprove(row.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-all border border-emerald-200 dark:border-emerald-500/20 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
            )}
          </div>
        );
      },
    },
  ];

export const getExpenseDetailFields = (
  categories: ExpenseCategory[]
): DetailField<Expense & { id: number }>[] => [
    { label: "Expense ID", render: (r) => r.id },
    { label: "Notes", render: (r) => r.description || "—" },
    { label: "Amount", render: (r) => `₹${formatIndianNumber(r.amount)}` },
    { label: "Category", render: (r) => resolveCategoryName(r.categoryId ?? 0, categories) },
    { label: "Asset ID", render: (r) => r.assetId || "N/A" },
    { label: "Partner ID", render: (r) => r.partnerId || "N/A" },
    { label: "Employee ID", render: (r) => r.employeeId || "N/A" },
    { label: "Month", render: (r) => r.month },
    { label: "Year", render: (r) => r.year },
    { label: "Recurring", render: (r) => (r.isRecurring ? "Yes" : "No") },
  ];
