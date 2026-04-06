import { useState } from "react";
import { showError, showSuccess } from "../../utils/toast";
import { createRevenue } from "../../features/revenue/revenueApi";
import Button from "../../components/ui/button/Button";
import { useRevenueForm } from "./useRevenueForm";
import { RevenueFormFields } from "./RevenueFormFields";

export function AddRevenueForm({ onAdded }: { onAdded: () => void }) {
  const { form, handleChange, handleAmountChange, handleProjectChange, partners, projects } = useRevenueForm();
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partnerId || !form.amount || !form.date) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await createRevenue({
        partnerId: form.partnerId,
        projectId: form.projectId === 0 ? null : form.projectId,
        amount: Number(String(form.amount).replace(/,/g, "")),
        date: new Date(form.date).toISOString(),
        revenue_From: form.revenueFrom,
        notes: form.notes,
      });
      showSuccess("Revenue record created successfully.");
      onAdded();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Revenue Information
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add a new revenue entry.
          </p>
        </div>

        <RevenueFormFields 
          form={form} 
          handleChange={handleChange} 
          handleAmountChange={handleAmountChange} 
          handleProjectChange={handleProjectChange} 
          partners={partners} 
          projects={projects} 
        />

        <div className="mt-8 flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-brand-500 text-white px-6"
          >
            {submitting ? "Registering..." : "Register Revenue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
