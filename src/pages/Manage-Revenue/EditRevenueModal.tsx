import { useState, useEffect } from "react";
import { Revenue } from "../../types/apiTypes";
import { showError, showSuccess } from "../../utils/toast";
import { patchRevenue } from "../../features/revenue/revenueApi";
import { getAllPartners } from "../../features/users/partnerApi";
import { getAllProjects } from "../../features/projects/projectAPI";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";

import { ModalShell } from "../../components/ui/modal/ModalShell";

export function EditRevenueModal({
  revenue,
  onClose,
  onUpdated,
}: {
  revenue: Revenue;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [partnerId, setPartnerId] = useState<number>(revenue.partnerId);
  const [projectId, setProjectId] = useState<number | null>(revenue.projectId);
  const [amount, setAmount] = useState<string>(
    revenue.amount ? revenue.amount.toLocaleString("en-IN") : ""
  );
  const [date, setDate] = useState<string>(revenue.date.split("T")[0]);
  const [revenueFrom, setRevenueFrom] = useState<boolean>(revenue.revenue_From);
  const [notes, setNotes] = useState<string>(revenue.notes || "");
  const [saving, setSaving] = useState(false);

  const [partners, setPartners] = useState<{ value: string; label: string }[]>([]);
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnersRes, projectsRes] = await Promise.all([
          getAllPartners(),
          getAllProjects()
        ]);

        const partnerOpts = (partnersRes || []).map((p: any) => ({
          value: String(p.id),
          label: `${p.user?.firstName} ${p.user?.lastName}`
        }));

        const projectList = (projectsRes as any).data || projectsRes || [];
        const projectOpts = [
          { value: "0", label: "None" },
          ...projectList.map((p: any) => ({
            value: String(p.id),
            label: p.name,
          }))
        ];

        setPartners(partnerOpts);
        setProjects(projectOpts);
      } catch (err) {
        console.error("Failed to load options", err);
      }
    };
    fetchData();
  }, []);

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
    <ModalShell
      title="Edit Revenue"
      subtitle={`Updating Revenue Record #${revenue.id}`}
      onClose={onClose}
      maxWidth="2xl"
      onSave={handleSave}
      saveLabel={saving ? "Saving..." : "Save Changes"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              Partner <span className="text-red-500">*</span>
            </Label>
            <Select
              options={partners}
              value={String(partnerId)}
              onChange={(val) => setPartnerId(Number(val))}
              placeholder="Select Partner"
            />
          </div>
          <div>
            <Label>Project</Label>
            <Select
              options={projects}
              value={String(projectId || "0")}
              onChange={(val) => setProjectId(val === "0" ? null : Number(val))}
              placeholder="Select Project"
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
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="editRevenueFrom"
              checked={revenueFrom}
              onChange={(e) => setRevenueFrom(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-brand-500"
            />
            <Label htmlFor="editRevenueFrom" className="!mb-0">
              External Revenue
            </Label>
          </div>
          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
              placeholder="Enter details..."
              disabled={!revenueFrom}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}