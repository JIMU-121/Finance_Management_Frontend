import { Asset, ExpenseCategory } from "../../types/apiTypes";

// ─── Date helpers ──────────────────────────────────────────────────────────────

export const safeFormatDate = (input: string | Date | undefined | null): string => {
  if (!input) return "";
  const date = new Date(input);
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const todayStr = safeFormatDate(new Date());

// ─── Category predicates ───────────────────────────────────────────────────────

export const isAssetCat  = (name: string) => name.toLowerCase().trim() === "asset";
export const isSalaryCat = (name: string) => name.toLowerCase().trim() === "salary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UniqueAsset {
  name: string;
  count: number;
  firstId: number;
  amount: number;
}

export interface SalaryEmployeeItem {
  employeeId: number;
  userId: number;
  name: string;
  amount: number;
  selected: boolean;
  alreadyPaid: boolean;
}

// ─── Utility functions ────────────────────────────────────────────────────────

export const getUniqueAssets = (assets: Asset[]): UniqueAsset[] => {
  const map = new Map<string, UniqueAsset>();
  assets.forEach((a) => {
    if (!a.id) return;
    const key = a.name.toLowerCase().trim();
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { name: a.name, count: 1, firstId: a.id, amount: a.amount });
    }
  });
  return Array.from(map.values());
};

export const resolveCategoryName = (
  categoryId: number | string,
  categories: ExpenseCategory[]
): string => {
  const cat = categories.find((c) => c.id === Number(categoryId));
  return cat ? cat.categoryName : `Category #${categoryId}`;
};
