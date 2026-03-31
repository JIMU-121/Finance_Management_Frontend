import { useState } from "react";
import { Partner, Project } from "../../types/apiTypes";
import { showError, showSuccess } from "../../utils/toast";
import { createRevenue } from "../../features/revenue/revenueApi";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export function AddRevenueForm({
  onAdded,
  projects,
  partners,
}: {
  onAdded: () => void;
  projects: Project[];
  partners: (Partner & { firstName: string; lastName: string })[];
}) {
  const [partnerId, setPartnerId] = useState<number>(partners[0]?.id || 0);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [revenueFrom, setRevenueFrom] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleAmountChange = (e: any) => {
    let value = e.target.value;
    value = value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    const formatted = value ? Number(value).toLocaleString("en-IN") : "";
    setAmount(formatted);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId || !amount || !date) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await createRevenue({
        partnerId,
        projectId: projectId === 0 ? null : projectId,
        amount: Number(String(amount).replace(/,/g, "")),
        date: new Date(date).toISOString(),
        revenue_From: revenueFrom,
        notes,
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              onChange={(val) => setProjectId(val === "0" ? null : Number(val))}
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
            <Label>
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e: any) => setDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 pt-[34px]">
            <input
              type="checkbox"
              id="revenueFrom"
              checked={revenueFrom}
              onChange={(e) => setRevenueFrom(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-brand-500"
            />
            <Label htmlFor="revenueFrom" className="!mb-0">
              External Revenue
            </Label>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
              placeholder="e.g. Monthly project revenue"
              disabled={!revenueFrom}
            />
          </div>
        </div>

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
