import { useState } from "react";
import { Revenue } from "../../types/apiTypes";
import { showError, showSuccess } from "../../utils/toast";
import { patchRevenue } from "../../features/revenue/revenueApi";
import { ModalShell } from "../../components/ui/modal/ModalShell";
import { useRevenueForm } from "./useRevenueForm";
import { RevenueFormFields } from "./RevenueFormFields";

export function EditRevenueModal({
  revenue,
  onClose,
  onUpdated,
}: {
  revenue: Revenue;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { form, handleChange, handleAmountChange, handleProjectChange, partners, projects } = useRevenueForm({
    partnerId: revenue.partnerId,
    projectId: revenue.projectId,
    amount: revenue.amount ? revenue.amount.toLocaleString("en-IN") : "",
    date: revenue.date.split("T")[0],
    revenueFrom: revenue.revenue_From,
    notes: revenue.notes || "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.partnerId || !form.amount || !form.date) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSaving(true);
      await patchRevenue(revenue.id, {
        partnerId: form.partnerId,
        projectId: form.projectId,
        amount: Number(String(form.amount).replace(/,/g, "")),
        date: new Date(form.date).toISOString(),
        revenue_From: form.revenueFrom,
        notes: form.notes,
      });
      showSuccess("Revenue updated successfully.");
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
      title="Edit Revenue"
      subtitle={`Updating Revenue Record #${revenue.id}`}
      onClose={onClose}
      maxWidth="2xl"
      onSave={handleSave}
      saveLabel={saving ? "Saving..." : "Save Changes"}
    >
      <div className="space-y-4">
        <RevenueFormFields 
          form={form} 
          handleChange={handleChange} 
          handleAmountChange={handleAmountChange} 
          handleProjectChange={handleProjectChange} 
          partners={partners} 
          projects={projects} 
          isEdit={true}
        />
      </div>
    </ModalShell>
  );
}