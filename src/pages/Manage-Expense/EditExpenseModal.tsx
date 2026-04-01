import { useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker";
import { IndianAmountInput } from "../../components/form/IndianAmountInput";
import { showError, showSuccess } from "../../utils/toast";
import { patchExpense } from "../../features/expenses/expenseApi";
import { Expense, Asset, ExpenseCategory } from "../../types/apiTypes";
import { AddAssetForm } from "../Manage-Asset";
import { User } from "../../features/users/userApi";
import { ModalShell } from "../../components/ui/modal/ModalShell";
import { safeFormatDate, getUniqueAssets } from "./helpers";

interface EditExpenseModalProps {
  expense: Expense & { id: number };
  onClose: () => void;
  onUpdated: () => void;
  assets: Asset[];
  refreshAssets: () => Promise<void>;
  partners: (User & { partnerId: number })[];
  categories: ExpenseCategory[];
}

export function EditExpenseModal({
  expense,
  onClose,
  onUpdated,
  assets,
  refreshAssets,
  partners,
  categories,
}: EditExpenseModalProps) {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  const initDate = `${expense.year}-${String(expense.month).padStart(2, "0")}-01`;

  const [description, setDescription] = useState(expense.description || "");
  const [amountRaw, setAmountRaw]     = useState(String(expense.amount || ""));
  const [assetId, setAssetId]         = useState<number | "">(expense.assetId || "");
  const [partnerId, setPartnerId]     = useState<number | "">(expense.partnerId || "");
  const [categoryId, setCategoryId]   = useState<number | "">(
    expense.categoryId != null ? Number(expense.categoryId) : ""
  );
  const [selectedDate, setSelectedDate] = useState(initDate);
  const [isRecurring, setIsRecurring] = useState(expense.isRecurring || false);
  const [saving, setSaving]             = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const uniqueAssets = getUniqueAssets(assets);
  const parsedDate   = new Date(selectedDate || initDate);
  const editMonth    = parsedDate.getMonth() + 1;
  const editYear     = parsedDate.getFullYear();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!categoryId) newErrors.categoryId = "Category is required.";
    if (!selectedDate) newErrors.date = "Date is required.";
    if (!partnerId) newErrors.partner = "Partner is required.";
    if (!amountRaw || Number(amountRaw) <= 0) newErrors.amount = "Valid amount is required.";
    if (!description.trim()) newErrors.description = "Notes/Description are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await patchExpense(expense.id, {
        id:          expense.id,
        description,
        amount:      Number(amountRaw),
        assetId:     Number(assetId) || null,
        partnerId:   Number(partnerId),
        employeeId:  expense.employeeId,
        categoryId:  typeof categoryId === "number" ? categoryId : null,
        month:       editMonth,
        year:        editYear,
        isRecurring,
      });
      showSuccess("Expense updated.");
      onUpdated();
      onClose();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Edit Expense"
      subtitle={`Updating Expense #${expense.id}`}
      onClose={onClose}
      maxWidth="2xl"
      onSave={handleSave}
      saving={saving}
      saveLabel="Save Changes"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Notes */}
        <div className="md:col-span-2">
          <Label>
            Notes <span className="text-red-500">*</span>
          </Label>
          <Input
            value={description}
            error={!!errors.description}
            hint={errors.description}
            onChange={(e: any) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="Describe this expense"
          />
        </div>

        {/* Amount */}
        <div>
          <IndianAmountInput
            label="Amount (₹) *"
            value={amountRaw}
            error={!!errors.amount}
            hint={errors.amount}
            onChange={(v) => {
              setAmountRaw(v);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
          />
        </div>

        {/* Category */}
        <div>
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            options={categories.map((c) => ({ value: String(c.id), label: c.categoryName }))}
            value={String(categoryId)}
            error={!!errors.categoryId}
            hint={errors.categoryId}
            onChange={(val) => {
              setCategoryId(Number(val));
              setErrors((prev) => ({ ...prev, categoryId: "" }));
            }}
            placeholder="Select Category"
          />
        </div>

        {/* Date */}
        <div className="md:col-span-2">
          <DatePicker
            id={`edit-expense-date-${expense.id}`}
            label="Date *"
            placeholder="Select date"
            defaultDate={initDate}
            error={!!errors.date}
            hint={errors.date}
            onChange={(dates) => {
              if (dates && dates.length > 0) {
                setSelectedDate(safeFormatDate(dates[0]));
                setErrors((prev) => ({ ...prev, date: "" }));
              }
            }}
          />
        </div>

        {/* Asset */}
        <div>
          <Label>Asset (Optional)</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                options={[
                  { value: "0", label: "None" },
                  ...uniqueAssets.map((a) => ({
                    value: String(a.firstId),
                    label: `${a.name} (${a.count})`,
                  })),
                ]}
                value={String(assetId || "0")}
                onChange={(val) => setAssetId(Number(val))}
              />
            </div>
            <Button
              type="button"
              onClick={() => setIsAssetModalOpen(true)}
              className="h-11 px-3 text-xs whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            >
              + New
            </Button>
          </div>
        </div>

        {/* Partner */}
        <div>
          <Label>
            Partner <span className="text-red-500">*</span>
          </Label>
          <Select
            options={partners.map((p) => ({
              value: String(p.partnerId),
              label: `${p.firstName} ${p.lastName}`,
            }))}
            value={String(partnerId)}
            error={!!errors.partner}
            hint={errors.partner}
            onChange={(val) => {
              setPartnerId(Number(val));
              setErrors((prev) => ({ ...prev, partner: "" }));
            }}
            placeholder="Select Partner"
          />
        </div>

        {/* Recurring */}
        <div className="flex items-center gap-3 pt-6 md:col-span-2">
          <input
            type="checkbox"
            id="editIsRecurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
          />
          <Label htmlFor="editIsRecurring" className="!mb-0">
            Recurring Expense
          </Label>
        </div>
      </div>

      {isAssetModalOpen && (
        <ModalShell
          title="Register New Asset"
          onClose={() => setIsAssetModalOpen(false)}
          maxWidth="3xl"
          hideFooter
        >
          <AddAssetForm
            onAdded={async (newAssetId?: number) => {
              await refreshAssets();
              if (newAssetId) setAssetId(newAssetId);
              setIsAssetModalOpen(false);
            }}
          />
        </ModalShell>
      )}
    </ModalShell>
  );
}
