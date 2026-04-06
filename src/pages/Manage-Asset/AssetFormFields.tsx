import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import { AssetFormState, safeFormatDate } from "./useAssetForm";

interface AssetFormFieldsProps {
  form: AssetFormState;
  handleChange: (field: keyof AssetFormState, value: any) => void;
  handleAmountChange: (e: any) => void;
  isEdit?: boolean;
}

export function AssetFormFields({
  form,
  handleChange,
  handleAmountChange,
  isEdit = false,
}: AssetFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <Label>
          Asset Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={form.name}
          onChange={(e: any) => handleChange("name", e.target.value)}
          placeholder="e.g. MacBook Pro"
        />
      </div>

      <div className="md:col-span-2">
        <Label>
          Description <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={form.description}
          onChange={(e: any) => handleChange("description", e.target.value)}
          placeholder="e.g. Laptop for development"
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
          placeholder="e.g. 2,00,000"
        />
      </div>

      <div>
        <DatePicker
          id={isEdit ? "edit-asset-purchase-date" : "asset-purchase-date"}
          label="Purchase Date *"
          placeholder="Select date"
          defaultDate={form.purchaseDate}
          onChange={(dates) => {
            if (dates && dates.length > 0) {
              handleChange("purchaseDate", safeFormatDate(dates[0]));
            } else {
              handleChange("purchaseDate", "");
            }
          }}
        />
      </div>
    </div>
  );
}
