import { useState, useEffect, useCallback } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import LazySelect from "../../components/form/LazySelect";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker";
import { IndianAmountInput } from "../../components/form/IndianAmountInput";
import { showError, showSuccess } from "../../utils/toast";
import { createExpense, getAllExpenses } from "../../features/expenses/expenseApi";
import { Expense, Asset, ExpenseCategory } from "../../types/apiTypes";
import { getAllAssets } from "../../features/assets/assetApi";
import { AddAssetForm } from "../Manage-Asset";
import { getAllUsers } from "../../features/users/userApi";
import { getAllEmployees } from "../../features/users/employeeApi";
import { getAllPartners } from "../../features/users/partnerApi";
import { getAllExpenseCategories } from "../../features/expenses/expenseCategoryApi";
import { ModalShell } from "../../components/ui/modal/ModalShell";
import {
  safeFormatDate,
  todayStr,
  isAssetCat,
  isSalaryCat,
  getUniqueAssets,
  SalaryEmployeeItem,
} from "./helpers";
import { SalarySection } from "./SalarySection";

interface AddExpenseFormProps {
  onAdded: () => void;
}

export function AddExpenseForm({
  onAdded,
}: AddExpenseFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [amountRaw, setAmountRaw] = useState("");
  const [partnerId, setPartnerId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Lazy Select Cache ──
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [uniqueAssets, setUniqueAssets] = useState<{name:string, firstId:number, amount:number, count:number}[]>([]);
  const [allExpensesCache, setAllExpensesCache] = useState<(Expense & { id: number })[]>([]);

  const loadCategories = useCallback(async () => {
    const data = await getAllExpenseCategories();
    setCategories(data);
    return data.map((c) => ({ value: String(c.id), label: c.categoryName }));
  }, []);

  const loadPartners = useCallback(async () => {
    const partnersRes = await getAllPartners();
    return (partnersRes || []).map(p => ({
      value: String(p.id),
      label: `${p.user?.firstName} ${p.user?.lastName}`
    }));
  }, []);

  const loadAssets = useCallback(async () => {
    const res = await getAllAssets();
    const unique = getUniqueAssets(res as Asset[]);
    setUniqueAssets(unique);
    return [
      { value: "", label: "— Select Asset —" },
      ...unique.map((a) => ({
        value: a.name,
        label: `${a.name} (${a.count})`,
      }))
    ];
  }, []);

  const [selectedAssetName, setSelectedAssetName] = useState("");
  const [salaryEmployees, setSalaryEmployees] = useState<SalaryEmployeeItem[]>([]);
  const [loadingSalary, setLoadingSalary] = useState(false);

  const parsedDate = new Date(selectedDate || todayStr);
  const selectedMonth = parsedDate.getMonth() + 1;
  const selectedYear = parsedDate.getFullYear();

  useEffect(() => {
    if (selectedCategory) setIsRecurring(selectedCategory.isRecurring);
  }, [selectedCategory?.id]);

  useEffect(() => {
    if (selectedCategory && isSalaryCat(selectedCategory.categoryName)) {
      loadSalaryEmployees();
    } else {
      setSalaryEmployees([]);
    }
  }, [selectedCategory?.id, selectedMonth, selectedYear]);

  const loadSalaryEmployees = async () => {
    setLoadingSalary(true);
    try {
      // ── Lazy Fetch Data ────────────────────────────────────────────────────
      const [empRes, userRes, expRes] = await Promise.all([
        getAllEmployees(),
        getAllUsers(1, 1000),
        allExpensesCache.length === 0 ? getAllExpenses() : Promise.resolve(allExpensesCache)
      ]);
      
      const employees = empRes || [];
      const users = userRes.data || [];
      const historicalExpenses = ((expRes as any).data || expRes) as (Expense & { id: number })[];
      
      // Update cache
      if (allExpensesCache.length === 0) setAllExpensesCache(historicalExpenses);

      const salaryCatId = categories.find((c) => isSalaryCat(c.categoryName))?.id;
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

      const paidIds = new Set(
        historicalExpenses
          .filter(
            (e) =>
              e.month === selectedMonth &&
              e.year === selectedYear &&
              (e.categoryName === "Salary" || Number(e.categoryId) === salaryCatId) &&
              e.employeeId
          )
          .map((e) => e.employeeId)
      );

      const prevExpensesList = historicalExpenses.filter(
        (e) =>
          e.month === prevMonth &&
          e.year === prevYear &&
          (e.categoryName === "Salary" || Number(e.categoryId) === salaryCatId) &&
          e.employeeId
      );

      const items: SalaryEmployeeItem[] = employees
        .filter((emp) => emp.id !== undefined)
        .map((emp) => {
          const user = users.find((u) => u.id === emp.userId);
          const paid = paidIds.has(emp.id!);
          const prevExp = prevExpensesList.find((e) => e.employeeId === emp.id);
          const prefilledAmount = prevExp?.amount ?? emp.monthlySalary ?? 0;
          return {
            employeeId: emp.id!,
            userId: emp.userId,
            name: user ? `${user.firstName} ${user.lastName}` : `Employee #${emp.id}`,
            amount: prefilledAmount,
            selected: false,
            alreadyPaid: paid,
          };
        });

      items.sort((a, b) => Number(a.alreadyPaid) - Number(b.alreadyPaid));
      setSalaryEmployees(items);
    } catch (err) {
      console.error(err);
      showError("Failed to load employees for salary.");
    } finally {
      setLoadingSalary(false);
    }
  };

  const goToNextMonth = () => {
    const d = new Date(selectedDate || todayStr);
    d.setMonth(d.getMonth() + 1);
    d.setDate(1); // Set to 1st of next month
    const newDateStr = safeFormatDate(d);
    setSelectedDate(newDateStr);
    
    // We also need to trigger any components that rely on the date directly
    // If the DatePicker is controlled, it should update.
  };

  const clearForm = () => {

    setSelectedCategory(null);
    setSelectedDate(todayStr);
    setAmountRaw("");
    setPartnerId("");
    setNotes("");
    setIsRecurring(false);
    setSelectedAssetName("");
    setSalaryEmployees([]);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedCategory) newErrors.category = "Category is required.";
    if (!selectedDate) newErrors.date = "Date is required.";
    if (!partnerId) newErrors.partner = "Partner is required.";

    const isSalary = selectedCategory && isSalaryCat(selectedCategory.categoryName);
    const isAsset = selectedCategory && isAssetCat(selectedCategory.categoryName);

    if (isSalary) {
      const selected = salaryEmployees.filter((e) => e.selected);
      if (selected.length === 0) newErrors.salaryEmployees = "Please select at least one employee.";
      else {
        const invalid = selected.filter((e) => !e.amount || e.amount <= 0);
        if (invalid.length > 0) newErrors.salaryEmployees = "All selected employees must have a positive salary.";
      }
    } else {
      if (!amountRaw || Number(amountRaw) <= 0) newErrors.amount = "Valid amount is required.";
      if (isAsset && !selectedAssetName) newErrors.asset = "Please select an asset.";
      if (!isAsset && !notes.trim()) newErrors.notes = "Notes are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isSalaryCat(selectedCategory!.categoryName)) {
      const selected = salaryEmployees.filter((e) => e.selected);
      try {
        setSubmitting(true);
        await Promise.all(
          selected.map((emp) =>
            createExpense({
              description: notes.trim() || `Salary: ${emp.name}`,
              amount: emp.amount,
              assetId: null,
              partnerId: Number(partnerId),
              employeeId: emp.employeeId,
              categoryId: selectedCategory!.id ?? null,
              month: selectedMonth,
              year: selectedYear,
              isRecurring,
            })
          )
        );
        showSuccess(`Salary recorded successfully.`);
        clearForm();
        onAdded();
      } catch (err: any) {
        showError(err?.response?.data?.message || "Failed to record salary.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const assetRecord = uniqueAssets.find((a) => a.name === selectedAssetName);
    try {
      setSubmitting(true);
      await createExpense({
        description: notes.trim() || (isAssetCat(selectedCategory!.categoryName) ? `Asset: ${selectedAssetName}` : selectedCategory!.categoryName),
        amount: Number(amountRaw),
        assetId: isAssetCat(selectedCategory!.categoryName) ? (assetRecord?.firstId ?? null) : null,
        partnerId: Number(partnerId),
        employeeId: null,
        categoryId: selectedCategory!.id ?? null,
        month: selectedMonth,
        year: selectedYear,
        isRecurring,
      });
      showSuccess("Expense registered successfully.");
      clearForm();
      onAdded();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to register expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const notesRequired =
    selectedCategory &&
    !isAssetCat(selectedCategory.categoryName) &&
    !isSalaryCat(selectedCategory.categoryName);
  const showAmount = !selectedCategory || !isSalaryCat(selectedCategory.categoryName);

  return (
    <>
      <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Category *</Label>
          <LazySelect
            loadOptions={loadCategories}
            value={selectedCategory ? String(selectedCategory.id) : ""}
            error={!!errors.category}
            hint={errors.category}
            onChange={(val) => {
              const cat = categories.find((c) => String(c.id) === val) || null;
              setSelectedCategory(cat);
              setSelectedAssetName("");
              setSalaryEmployees([]);
              setErrors((prev) => ({ ...prev, category: "" }));
            }}
            placeholder="Select Category"
          />
        </div>

        <div>
          <DatePicker
            id="add-expense-date"
            key={selectedDate} // Forced re-render when date changes programmatically
            label="Date *"
            placeholder="Select date"
            defaultDate={selectedDate}
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


        <div>
          <Label>Partner *</Label>
          <LazySelect
            loadOptions={loadPartners}
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

        {selectedCategory && isAssetCat(selectedCategory.categoryName) && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <Label>Select Asset *</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <LazySelect
                  loadOptions={loadAssets}
                  value={selectedAssetName}
                  error={!!errors.asset}
                  hint={errors.asset}
                  onChange={(val) => {
                    setSelectedAssetName(val);
                    setErrors((prev) => ({ ...prev, asset: "" }));
                    const asset = uniqueAssets.find((a) => a.name === val);
                    if (asset) {
                      setAmountRaw(String(asset.amount));
                      setErrors((prev) => ({ ...prev, amount: "" }));
                    }
                  }}
                  placeholder="Select Asset"
                />
              </div>
              <Button
                type="button"
                onClick={() => setIsAssetModalOpen(true)}
                className="h-11 px-3 py-2 text-xs whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                + New
              </Button>
            </div>
          </div>
        )}

        {showAmount && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <IndianAmountInput
              id="add-expense-amount"
              label="Amount (₹) *"
              value={amountRaw}
              error={!!errors.amount}
              hint={errors.amount}
              onChange={(v) => {
                setAmountRaw(v);
                setErrors((prev) => ({ ...prev, amount: "" }));
              }}
              placeholder="e.g. 1,50,000"
            />
          </div>
        )}

        {selectedCategory && isSalaryCat(selectedCategory.categoryName) && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <SalarySection
              employees={salaryEmployees}
              setEmployees={setSalaryEmployees}
              loading={loadingSalary}
              onNextMonth={goToNextMonth}
            />
            {errors.salaryEmployees && (
              <p className="mt-1.5 text-xs text-error-500">{errors.salaryEmployees}</p>
            )}
          </div>
        )}


        <div>
          <Label>
            Notes{notesRequired && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Input
            type="text"
            value={notes}
            error={!!errors.notes}
            hint={errors.notes}
            onChange={(e: any) => {
              setNotes(e.target.value);
              setErrors((prev) => ({ ...prev, notes: "" }));
            }}
            placeholder={notesRequired ? "Required — describe this expense" : "Optional notes..."}
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-700 dark:bg-gray-800/40">
          <input
            type="checkbox"
            id="add-expense-recurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
          />
          <Label htmlFor="add-expense-recurring" className="!mb-0 cursor-pointer">Recurring Expense</Label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-brand-500 hover:bg-brand-600 px-8 py-2.5 text-white"
          >
            {submitting ? "Saving..." : "Add Expense"}
          </Button>
          <Button type="button" variant="outline" onClick={clearForm} className="px-8 py-2.5">
            Clear
          </Button>
        </div>
      </form>

      {isAssetModalOpen && (
        <ModalShell
          title="Register New Asset"
          onClose={() => setIsAssetModalOpen(false)}
          maxWidth="3xl"
          hideFooter
        >
          <AddAssetForm
            onAdded={async () => {
              setIsAssetModalOpen(false);
            }}
          />
        </ModalShell>
      )}
    </>
  );
}
