import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import {
  createExpenseCategory,
} from "../../features/expenses/expenseCategoryApi";

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showError("Category name is required.");
      return;
    }
    try {
      setSaving(true);
      await createExpenseCategory({ categoryName: categoryName.trim(), isRecurring });
      showSuccess("Category created successfully.");
      navigate("/manage-category");
    } catch (err: any) {
      showError(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Add Category | TailAdmin"
        description="Create a new expense category"
      />
      <PageBreadcrumb pageTitle="Add Category" />
      
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Create New Category
          </h2>

          <Button variant="outline" onClick={() => navigate("/manage-category")}>
            Back
          </Button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label>
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={categoryName}
                onChange={(e: any) => setCategoryName(e.target.value)}
                placeholder="e.g. Salary, Asset, Travel"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <input
                type="checkbox"
                id="cat-isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <div>
                <Label htmlFor="cat-isRecurring" className="!mb-0 cursor-pointer">
                  Recurring Expense
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Expenses in this category repeat monthly by default
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-5 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/manage-category")}
                className="px-6 py-2.5 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 font-medium shadow-theme-xs"
              >
                {saving ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
