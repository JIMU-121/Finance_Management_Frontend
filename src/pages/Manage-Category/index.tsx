import { useState, useEffect } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { showError, showSuccess } from "../../utils/toast";
import {
  getAllExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../../features/expenses/expenseCategoryApi";
import { ExpenseCategory } from "../../types/apiTypes";
import { DataTable, ColumnDef, DetailField } from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";
import { ModalShell } from "../../components/ui/modal/ModalShell";

// ─── DataTable config ──────────────────────────────────────────────────────────

const categoryColumns: ColumnDef<ExpenseCategory & { id: number }>[] = [
  {
    header: "Category Name",
    render: (row) => (
      <span className="block font-semibold text-gray-900 dark:text-white">
        {row.categoryName}
      </span>
    ),
  },
  {
    header: "Recurring",
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.isRecurring
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {row.isRecurring ? "Yes" : "No"}
      </span>
    ),
  },
];

const categoryDetailFields: DetailField<ExpenseCategory & { id: number }>[] = [
  { label: "ID", render: (r) => r.id },
  { label: "Category Name", render: (r) => r.categoryName },
  { label: "Is Recurring", render: (r) => (r.isRecurring ? "Yes" : "No") },
];

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────

function CategoryFormModal({
  category,
  onClose,
  onSaved,
}: {
  category?: ExpenseCategory & { id: number };
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;
  const [categoryName, setCategoryName] = useState(category?.categoryName ?? "");
  const [isRecurring, setIsRecurring] = useState(category?.isRecurring ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      showError("Category name is required.");
      return;
    }
    try {
      setSaving(true);
      if (isEdit) {
        await updateExpenseCategory(category.id, { categoryName: categoryName.trim(), isRecurring });
        showSuccess("Category updated.");
      } else {
        await createExpenseCategory({ categoryName: categoryName.trim(), isRecurring });
        showSuccess("Category created.");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Category" : "Add Category"}
      subtitle={isEdit ? `Editing: ${category!.categoryName}` : "Create a new expense category"}
      onClose={onClose}
      maxWidth="md"
      onSave={handleSave}
      saving={saving}
      saveLabel={isEdit ? "Save Changes" : "Create Category"}
    >
      <div className="space-y-5">
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
      </div>
    </ModalShell>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ManageCategory() {
  const [categories, setCategories] = useState<(ExpenseCategory & { id: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [editCategory, setEditCategory] = useState<(ExpenseCategory & { id: number }) | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllExpenseCategories();
      setCategories(data as (ExpenseCategory & { id: number })[]);
    } catch {
      showError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteExpenseCategory(id);
      showSuccess("Category deleted.");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div>
      <PageMeta title="Manage Categories" description="Expense Category Management" />
      <PageBreadcrumb pageTitle="Manage Categories" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Expense Categories
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage categories used to classify expenses
            </p>
          </div>
          <Link
            to="/manage-category/add"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 text-sm font-medium shadow-theme-xs rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </Link>
        </div>

        <div className="p-6">
          {loading ? (
            <Spinner size="md" label="Loading categories..." className="py-16" />
          ) : (
            <DataTable
              data={categories}
              columns={categoryColumns}
              detailFields={categoryDetailFields}
              title="All Categories"
              searchKeys={["categoryName"]}
              searchPlaceholder="Search by name..."
              onDelete={(id) => handleDelete(id as number)}
              onEdit={(row) => setEditCategory(row)}
            />
          )}
        </div>
      </div>


      {editCategory && (
        <CategoryFormModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSaved={fetchCategories}
        />
      )}
    </div>
  );
}
