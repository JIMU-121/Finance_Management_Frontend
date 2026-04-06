import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import { RevenueFormState } from "./useRevenueForm";

interface RevenueFormFieldsProps {
  form: RevenueFormState;
  handleChange: (field: keyof RevenueFormState, value: any) => void;
  handleAmountChange: (e: any) => void;
  handleProjectChange: (val: string) => void;
  partners: { value: string; label: string }[];
  projects: { value: string; label: string }[];
  isEdit?: boolean;
}

export function RevenueFormFields({
  form,
  handleChange,
  handleAmountChange,
  handleProjectChange,
  partners,
  projects,
  isEdit = false,
}: RevenueFormFieldsProps) {
  const customId = isEdit ? "editRevenueFrom" : "revenueFrom";

  return (
    <>
      <div className={isEdit ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"}>
        <div>
          <Label>
            Partner <span className="text-red-500">*</span>
          </Label>
          <Select
            options={partners}
            value={String(form.partnerId || "")}
            onChange={(val) => handleChange("partnerId", Number(val))}
            placeholder="Select Partner"
          />
        </div>
        <div>
          <Label>Project</Label>
          <Select
            options={projects}
            value={String(form.projectId || "0")}
            onChange={handleProjectChange}
            placeholder="Select Project"
          />
        </div>
        <div>
          <Label>
            Amount (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={form.amount}
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
            value={form.date}
            onChange={(e: any) => handleChange("date", e.target.value)}
          />
        </div>
        <div className={`flex items-center gap-3 ${isEdit ? "pt-6" : "pt-[34px]"}`}>
          <input
            type="checkbox"
            id={customId}
            checked={form.revenueFrom}
            onChange={(e) => handleChange("revenueFrom", e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-brand-500"
          />
          <Label htmlFor={customId} className="!mb-0">
            External Revenue
          </Label>
        </div>
        <div className={isEdit ? "md:col-span-2" : "md:col-span-2 lg:col-span-3"}>
          <Label>Notes</Label>
          <Input
            value={form.notes}
            onChange={(e: any) => handleChange("notes", e.target.value)}
            placeholder={isEdit ? "Enter details..." : "e.g. Monthly project revenue"}
            disabled={!form.revenueFrom}
          />
        </div>
      </div>
    </>
  );
}
