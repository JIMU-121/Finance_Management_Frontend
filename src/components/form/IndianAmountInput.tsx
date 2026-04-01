import type React from "react";
import Label from "./Label";

interface IndianAmountInputProps {
  value: number | string;
  onChange: (rawValue: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
  error?: boolean;
  hint?: string;
}

/** Formats a number with Indian number system commas. e.g. 100000 → 1,00,000 */
export function formatIndianNumber(value: number | string): string {
  const numStr = String(value).replace(/,/g, "");
  if (!numStr || isNaN(Number(numStr))) return "";
  return new Intl.NumberFormat("en-IN").format(Number(numStr));
}

/** Strips commas and returns a plain numeric string */
export function parseIndianNumber(value: string): string {
  return value.replace(/,/g, "");
}

/**
 * A text input that stores raw digits internally and displays formatted Indian numbers.
 * Formatting happens in real-time as the user types.
 */
export function IndianAmountInput({
  value,
  onChange,
  label,
  required,
  placeholder = "e.g. 1,50,000",
  id,
  className = "",
  error = false,
  hint,
}: IndianAmountInputProps) {
  // We keep the raw string as the source of truth for the input's current value (with commas)
  const displayValue = formatIndianNumber(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove everything except numbers
    const digits = e.target.value.replace(/[^0-9]/g, "");
    onChange(digits);
  };

  const inputClass = `h-11 w-full appearance-none rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
    error
      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500 dark:focus:border-error-800"
      : "border-gray-300 focus:border-brand-300 dark:border-gray-700 dark:focus:border-brand-800"
  } ${className}`;

  return (
    <div>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export default IndianAmountInput;
