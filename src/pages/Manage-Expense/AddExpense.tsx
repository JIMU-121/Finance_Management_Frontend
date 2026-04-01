import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { AddExpenseForm } from "./AddExpenseForm";
import Button from "../../components/ui/button/Button";

export default function AddExpensePage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageMeta
        title="Add Expense"
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
          />
        </div>
      </div>
    </div>
  );
}
