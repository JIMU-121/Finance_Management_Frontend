import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { AddExpenseForm } from "./AddExpenseForm";
import {
  getAllExpenses,
} from "../../features/expenses/expenseApi";
import { getAllExpenseCategories } from "../../features/expenses/expenseCategoryApi";
import { Expense, Asset, ExpenseCategory } from "../../types/apiTypes";
import { getAllAssets } from "../../features/assets/assetApi";
import { getAllUsers, User } from "../../features/users/userApi";
import { getPartnerByUserId } from "../../features/users/partnerApi";
import Spinner from "../../components/ui/spinner/Spinner";
import Button from "../../components/ui/button/Button";

export default function AddExpensePage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<(Expense & { id: number })[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [partners, setPartners] = useState<(User & { partnerId: number })[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);

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
      const res = await getAllExpenses();
      const data = res.data || res;
      setExpenses(data as unknown as (Expense & { id: number })[]);
    } catch {
      console.error("Failed to load expenses.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchExpenses(),
        fetchAssets(),
        fetchPartners(),
        fetchCategories(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading required data..." />
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Add Expense | TailAdmin"
        description="Register a new expense into the ledger"
      />
      <PageBreadcrumb pageTitle="Add Expense" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Register New Expense
          </h2>

          <Button variant="outline" onClick={() => navigate("/manage-expense")}>
            Back
          </Button>
        </div>

        <div className="p-6">
          <AddExpenseForm
            onAdded={() => navigate("/manage-expense")}
            assets={assets}
            refreshAssets={fetchAssets}
            partners={partners}
            categories={categories}
            allExpenses={expenses}
          />
        </div>
      </div>
    </div>
  );
}
