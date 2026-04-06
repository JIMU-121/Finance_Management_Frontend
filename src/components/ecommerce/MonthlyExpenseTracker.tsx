import { useDashboard } from "../../context/DashboardContext";
import { Expense } from "../../types/apiTypes";
import Skeleton from "../ui/skeleton/Skeleton";

/**
 * Formats date into a more human-friendly string (e.g., "12 Oct")
 */
const formatDate = (dateString?: string, month?: number, year?: number) => {
  if (dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }
  if (month && year) {
    const d = new Date(year, month - 1);
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }
  return "N/A";
};

/**
 * Formats amount into Indian Currency (e.g., ₹12,000)
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function MonthlyExpenseTracker() {
  const { rawExpenses, loading } = useDashboard();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Filter for current month's expenses
  const currentMonthExpenses = rawExpenses
    .filter((e) => {
      if (e.year === currentYear && e.month === currentMonth) return true;
      if (e.expenseDate) {
        const d = new Date(e.expenseDate);
        return d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth;
      }
      return false;
    })
    .sort((a, b) => {
      const dateA = a.expenseDate ? new Date(a.expenseDate).getTime() : 0;
      const dateB = b.expenseDate ? new Date(b.expenseDate).getTime() : 0;
      return dateB - dateA; // Newest first
    });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 sm:px-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Monthly Expense Tracker
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Everything you spent this month
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Date
                </th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  What for?
                </th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-right">
                  Amount
                </th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center pl-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="py-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : currentMonthExpenses.length > 0 ? (
                currentMonthExpenses.map((expense: Expense) => (
                  <tr key={expense.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {formatDate(expense.expenseDate, expense.month, expense.year)}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                          {expense.description || "Misc Expense"}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mt-0.5 tracking-tighter">
                          {expense.categoryName || "Uncategorized"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-black text-gray-900 dark:text-white text-right">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-4 text-center pl-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        expense.isApproved 
                          ? "bg-success-50 text-success-700 border-success-100 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20" 
                          : "bg-warning-50 text-warning-700 border-warning-100 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20"
                      }`}>
                        {expense.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-400 dark:text-gray-500 italic">
                    Great! No expenses recorded for this month yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && currentMonthExpenses.length > 0 && (
          <div className="mt-6 flex justify-center">
             <p className="text-xs text-gray-400 dark:text-gray-500">
               Showing {currentMonthExpenses.length} recent transactions
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
