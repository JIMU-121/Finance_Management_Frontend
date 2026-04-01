import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  error?: boolean;
  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  error = false,
  hint,
}) => {
  // Use controlled value if provided, else use defaultValue
  const isControlled = value !== undefined;
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const displayValue = isControlled ? value : selectedValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setSelectedValue(newValue);
    }
    onChange(newValue); // Trigger parent handler
  };

  const selectClasses = `h-11 w-full appearance-none rounded-lg border bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
    selectedValue || value
      ? "text-gray-800 dark:text-white/90"
      : "text-gray-400 dark:text-gray-400"
  } ${
    error
      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500 dark:focus:border-error-800"
      : "border-gray-300 focus:border-brand-300 dark:border-gray-700 dark:focus:border-brand-800"
  } ${className}`;

  return (
    <div className="relative w-full">
      <select
        className={selectClasses}
        value={displayValue}
        onChange={handleChange}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow icon */}
      <span className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2 text-gray-500 dark:text-gray-400">
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>

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
};

export default Select;
