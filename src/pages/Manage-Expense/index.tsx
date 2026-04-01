import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllExpenses,
  deleteExpense,
  approveExpense,
} from "../../features/expenses/expenseApi";
import { getAllExpenseCategories } from "../../features/expenses/expenseCategoryApi";
import { Expense, Asset, ExpenseCategory } from "../../types/apiTypes";
import { getAllAssets } from "../../features/assets/assetApi";
import { getAllUsers, User } from "../../features/users/userApi";
import { getPartnerByUserId } from "../../features/users/partnerApi";
import { DataTable } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";
import { ModalShell } from "../../components/ui/modal/ModalShell";
import { useAuth } from "../../context/AuthContext";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { AddExpenseForm } from "./AddExpenseForm";
import { EditExpenseModal } from "./EditExpenseModal";
import { getExpenseColumns, getExpenseDetailFields } from "./expenseTableConfig";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageExpense() {
  const [expenses, setExpenses] = useState<(Expense & { id: number })[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [partners, setPartners] = useState<(User & { partnerId: number })[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<(Expense & { id: number }) | null>(null);
  const [currentPartnerId, setCurrentPartnerId] = useState<number | null>(null);

  const { user, role } = useAuth();

  // ── Data fetchers ──────────────────────────────────────────────────────────

  const fetchAssets = async () => {
    try {
      const res = await getAllAssets();
      setAssets(res as Asset[]);
    } catch {
      console.error("Failed to fetch assets");
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await getAllUsers(1, 1000);
      const partnerUsers = (res.data as User[]).filter(
        (u) =>
          String(u.role).trim() === "2" ||
          String(u.role).trim().toLowerCase() === "partner"
      );
      const active: (User & { partnerId: number })[] = [];
      for (const u of partnerUsers) {
        const rec = await getPartnerByUserId(u.id);
        if (rec?.id) active.push({ ...u, partnerId: rec.id });
      }
      setPartners(active);

      // Resolve the current user's partner ID
      if (user?.id) {
        const myRec = await getPartnerByUserId(Number(user.id));
        setCurrentPartnerId(myRec?.id ?? null);
      }
    } catch {
      console.error("Failed to fetch partners");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllExpenseCategories();
      setCategories(data);
    } catch {
      console.error("Failed to fetch categories");
    }
  };

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

  useEffect(() => {
    fetchExpenses();
    fetchAssets();
    fetchPartners();
    fetchCategories();
  }, []);

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
              All Expenses
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review, approve and manage all expense records
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-medium shadow-theme-xs self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Button>
        </div>

        {/* Expense table */}
        <div className="p-6">
          {loading ? (
            <Spinner size="md" label="Loading expenses..." className="py-16" />
          ) : (
            <DataTable
              data={expenses}
              columns={getExpenseColumns(handleApprove, categories, currentPartnerId, role)}
              detailFields={getExpenseDetailFields(categories)}
              title=""
              searchKeys={["description"]}
              searchPlaceholder="Search by notes..."
              onDelete={(id) => handleDelete(id as number)}
              onEdit={(row) => setEditExpense(row)}
            />
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <ModalShell
          title="Add Expense"
          subtitle="Register a new expense into the ledger"
          onClose={() => setIsAddOpen(false)}
          maxWidth="2xl"
          hideFooter
        >
          <AddExpenseForm
            onAdded={() => {
              setIsAddOpen(false);
              fetchExpenses();
            }}
            assets={assets}
            refreshAssets={fetchAssets}
            partners={partners}
            categories={categories}
            allExpenses={expenses}
          />
        </ModalShell>
      )}

      {/* Edit Expense Modal */}
      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onUpdated={fetchExpenses}
          assets={assets}
          refreshAssets={fetchAssets}
          partners={partners}
          categories={categories}
        />
      )}
    </div>
  );
}
