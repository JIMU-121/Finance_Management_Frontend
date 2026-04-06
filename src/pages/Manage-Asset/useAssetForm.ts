import { useState } from "react";

export type AssetFormState = {
  name: string;
  description: string;
  amount: string;
  purchaseDate: string;
};

export const safeFormatDate = (input: string | Date | undefined | null) => {
  if (!input) return "";
  const date = new Date(input);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function useAssetForm(initialState?: Partial<AssetFormState>) {
  const [form, setForm] = useState<AssetFormState>({
    name: "",
    description: "",
    amount: "",
    purchaseDate: "",
    ...initialState,
  });

  const handleChange = (field: keyof AssetFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmountChange = (e: any) => {
    let value = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    const formatted = value ? Number(value).toLocaleString("en-IN") : "";
    handleChange("amount", formatted);
  };

  const clearForm = () => setForm({ name: "", description: "", amount: "", purchaseDate: "" });

  return { form, setForm, handleChange, handleAmountChange, clearForm };
}
