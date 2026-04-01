import { useState } from "react";
import { Partner, Project, Revenue } from "../../types/apiTypes";
import { showError, showSuccess } from "../../utils/toast";
import { patchRevenue } from "../../features/revenue/revenueApi";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker.tsx";
export function EditRevenueModal({
  revenue,
  onClose,
  onUpdated,
  projects,
  partners,
}: {
  revenue: Revenue;
  onClose: () => void;
  onUpdated: () => void;
  projects: Project[];
  partners: (Partner & { firstName: string; lastName: string })[];
}) {
  const [partnerId, setPartnerId] = useState<number>(revenue.partnerId);
  const [projectId, setProjectId] = useState<number | null>(revenue.projectId);
  const [amount, setAmount] = useState<string>(
    revenue.amount ? revenue.amount.toLocaleString("en-IN") : ""
  );

  const [date, setDate] = useState<string>(() => {
    if (!revenue?.date) return "";
    const d = new Date(revenue.date);
    if (isNaN(d.getTime())) return "";
    
    // formate as yyyy-mm-dd date input
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }); 

  const [revenueFrom, setRevenueFrom] = useState<boolean>(revenue.revenue_From);
  const [notes, setNotes] = useState<string>(revenue.notes || "");
  const [saving, setSaving] = useState(false);

  const handleAmountChange = (e: any) => {
    let value = e.target.value;
    value = value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    const formatted = value ? Number(value).toLocaleString("en-IN") : "";
    setAmount(formatted);
  };

  const handleSave = async () => {
    if (!partnerId || !amount || !date) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSaving(true);
      await patchRevenue(revenue.id, {
        partnerId,
        projectId: projectId,
        amount: Number(String(amount).replace(/,/g, "")),
        date: new Date(date).toISOString(),
        revenue_From: revenueFrom,
        notes,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Edit Revenue
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating Revenue Record #{revenue.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                Partner <span className="text-red-500">*</span>
              </Label>
              <Select
                options={partners.map((p) => ({
                  value: String(p.id),
                  label: `${p.firstName} ${p.lastName}`,
                }))}
                value={String(partnerId)}
                onChange={(val) => setPartnerId(Number(val))}
              />
            </div>
            <div>
              <Label>Project</Label>
              <Select
                options={[
                  { value: "0", label: "None" },
                  ...projects.map((p) => ({
                    value: String(p.id),
                    label: p.name,
                  })),
                ]}
                value={String(projectId || "0")}
                onChange={(val) =>
                  setProjectId(val === "0" ? null : Number(val))
                }
              />
            </div>
            <div>
              <Label>
                Amount (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="e.g. 50,000"
              />
            </div>
          <div>
          <DatePicker
            id="edit-revenue-date"
            label="Date"
            placeholder="Select date"
            defaultDate={date}
            onChange={(dates) => {
              if (dates && dates.length > 0) {
                const d = dates[0];
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                setDate(`${year}-${month}-${day}`);
              }
            }}
          />
        </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="editRevenueFrom"
                checked={revenueFrom}
                onChange={(e) => setRevenueFrom(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <Label htmlFor="editRevenueFrom" className="!mb-0">
                Revenue From External Source
              </Label>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(e: any) => setNotes(e.target.value)}
                placeholder="Enter details..."
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 px-6 py-5 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-brand-500 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}