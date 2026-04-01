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
        <div className="flex flex-col">
          <span className="block font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">
            {row.description || "—"}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">
            {row.expenseDate ? new Date(row.expenseDate).toLocaleDateString() : "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {row.categoryName || (categories.length > 0 ? resolveCategoryName(row.categoryId ?? 0, categories) : `Category #${row.categoryId}`)}
        </span>
      ),
    },
    {
      header: "Related To",
      render: (row) => {
        const entityName = row.assetName || row.employeeName || "General";
        const subText = row.partnerName ? `via ${row.partnerName}` : "";
        return (
          <div className="flex flex-col border-l-2 border-transparent hover:border-brand-500 pl-2 transition-colors">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {entityName}
            </span>
            {subText && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {subText}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Amount",
      render: (row) => (
        <span className="font-semibold text-brand-500 dark:text-brand-400">
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
      header: "Status",
      render: (row) => {
        const isApproved = row.isApproved ?? (row.status === 1 || !!row.approvedBy);
        
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
    { label: "Description", render: (r) => r.description || "—" },
    { label: "Amount", render: (r) => `₹${formatIndianNumber(r.amount)}` },
    { label: "Category", render: (r) => r.categoryName || (categories.length > 0 ? resolveCategoryName(r.categoryId ?? 0, categories) : `Category #${r.categoryId}`) },
    { label: "Asset", render: (r) => r.assetName || "N/A" },
    { label: "Employee", render: (r) => r.employeeName || "N/A" },
    { label: "Partner (Payer)", render: (r) => r.partnerName || "N/A" },
    { label: "Period", render: (r) => `${r.month}/${r.year}` },
    { label: "Recurring", render: (r) => (r.isRecurring ? "Yes" : "No") },
    { label: "Approval Status", render: (r) => (r.isApproved ? "Approved" : "Pending") },
    { label: "Approved By", render: (r) => r.approvedByName || "N/A" },
    { label: "Expense Date", render: (r) => (r.expenseDate ? new Date(r.expenseDate).toLocaleDateString() : "—") },
  ];
