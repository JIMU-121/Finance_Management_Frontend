import { useState, useEffect } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllExpenses,
  deleteExpense,
  approveExpense,
} from "../../features/expenses/expenseApi";
import { Expense } from "../../types/apiTypes";
import { getPartnerByUserId } from "../../features/users/partnerApi";
import { DataTable } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";
import { useAuth } from "../../context/AuthContext";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { EditExpenseModal } from "./EditExpenseModal";
import { getExpenseColumns, getExpenseDetailFields } from "./expenseTableConfig";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageExpense() {
  const [expenses, setExpenses] = useState<(Expense & { id: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [editExpense, setEditExpense] = useState<(Expense & { id: number }) | null>(null);
  const [currentPartnerId, setCurrentPartnerId] = useState<number | null>(null);

  const { user, role } = useAuth();

  // ── Data fetchers ──────────────────────────────────────────────────────────

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getAllExpenses();
      const data = res.data || res;
      setExpenses(data as unknown as (Expense & { id: number })[]);
    } catch {
      showError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const resolveCurrentPartnerId = async () => {
    if (!user?.id) return;
    const roleStr = String(role || "").trim().toLowerCase();
    if (roleStr === "2" || roleStr === "partner") {
      try {
        const partner = await getPartnerByUserId(Number(user.id));
        if (partner?.id) setCurrentPartnerId(partner.id);
      } catch {
        console.error("Failed to resolve partner ID");
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
    resolveCurrentPartnerId();
  }, [user?.id, role]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);
      showSuccess("Expense deleted.");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleApprove = async (id: number) => {
    if (!user?.id) {
      showError("User session not found. Please log in again.");
      return;
    }
    try {
      await approveExpense(id, Number(user.id));
      showSuccess("Expense approved successfully.");
      fetchExpenses();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Approval failed.");
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    try {
      await Promise.all(ids.map((id) => deleteExpense(id)));
      showSuccess(`${ids.length} expenses deleted.`);
      fetchExpenses();
    } catch (err: any) {
      showError("Some deletions failed. Refreshing list...");
      fetchExpenses();
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageMeta title="Manage Expenses" description="Expense Ledger Management" />
      <PageBreadcrumb pageTitle="Manage Expenses" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Page header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Expenses ledger
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review, approve and manage all expense records
            </p>
          </div>
          <Link
            to="/manage-expense/add"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-medium shadow-theme-xs self-start sm:self-auto rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Link>
        </div>

        {/* Expense table */}
        <div className="p-6">
          {loading ? (
            <Spinner size="md" label="Loading expenses..." className="py-16" />
          ) : (
            <DataTable
              data={expenses}
              columns={getExpenseColumns(handleApprove, [], currentPartnerId, role)}
              detailFields={getExpenseDetailFields([])}
              title=""
              searchKeys={["description", "categoryName", "partnerName", "employeeName", "assetName"]}
              searchPlaceholder="Search list..."
              onDelete={(id) => handleDelete(id as number)}
              onBulkDelete={handleBulkDelete}
              onEdit={(row) => setEditExpense(row)}
            />
          )}
        </div>
      </div>


      {/* Edit Expense Modal */}
      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onUpdated={fetchExpenses}
        />
      )}
    </div>
  );
}