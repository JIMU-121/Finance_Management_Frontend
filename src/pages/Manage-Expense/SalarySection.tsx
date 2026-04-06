import { useState } from "react";
import Label from "../../components/form/Label";
import Spinner from "../../components/ui/spinner/Spinner";
import { formatIndianNumber } from "../../components/form/IndianAmountInput";
import { SalaryEmployeeItem } from "./helpers";

interface SalarySectionProps {
  employees: SalaryEmployeeItem[];
  setEmployees: React.Dispatch<React.SetStateAction<SalaryEmployeeItem[]>>;
  loading: boolean;
  onNextMonth: () => void;
}

export function SalarySection({ employees, setEmployees, loading, onNextMonth }: SalarySectionProps) {

  const [showPaid, setShowPaid] = useState(false);

  if (loading) {
    return <Spinner size="sm" label="Loading unbilled employees..." className="py-4" />;
  }


  const unpaidEmployees   = employees.filter((e) => !e.alreadyPaid);
  const paidEmployees     = employees.filter((e) => e.alreadyPaid);
  const allUnpaidPaid     = employees.length > 0 && unpaidEmployees.length === 0;
  const selectedEmployees = employees.filter((e) => e.selected && !e.alreadyPaid);
  const totalAmount       = selectedEmployees.reduce((sum, e) => sum + (e.amount || 0), 0);
  const allUnpaidSelected = unpaidEmployees.length > 0 && unpaidEmployees.every((e) => e.selected);

  const employeesToDisplay = showPaid ? employees : unpaidEmployees;


  const toggleAll = () => {
    const newState = !allUnpaidSelected;
    setEmployees((prev) =>
      prev.map((e) => (e.alreadyPaid ? e : { ...e, selected: newState }))
    );
  };

  const toggleOne = (i: number) => {
    setEmployees((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, selected: !e.selected } : e))
    );
  };

  const updateAmount = (i: number, raw: string) => {
    setEmployees((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], amount: raw ? Number(raw) : 0 };
      return updated;
    });
  };

  return (
    <div>
      {/* Header: label + select-all */}
      <div className="mb-2 flex items-center justify-between">
        <Label className="flex items-center gap-2">
          Select Employees <span className="text-red-500">*</span>
          {paidEmployees.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPaid(!showPaid)}
              className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {showPaid ? "Hide Paid" : `Show Paid (${paidEmployees.length})`}
            </button>
          )}
        </Label>
        {unpaidEmployees.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
          >
            {allUnpaidSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>


      {/* All-paid banner */}
      {allUnpaidPaid && (
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800/50 dark:bg-green-900/20 animate-in zoom-in-95 duration-200">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            ✓ All employees paid for this month.
          </p>
          <button
            type="button"
            onClick={onNextMonth}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-all active:scale-95"
          >
            Move to Next Month
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}


      {/* Employee list — based on toggle */}
      {employeesToDisplay.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
          {allUnpaidPaid && !showPaid 
            ? "No more employees available for this month." 
            : "No employees found."}
        </p>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="max-h-80 sm:max-h-96 overflow-y-auto overflow-x-auto custom-scrollbar shadow-sm no-scrollbar">

            <div className="min-w-[450px] divide-y divide-gray-100 dark:divide-gray-700/50">
              {employeesToDisplay.map((emp) => {

            const indexInOrig = employees.findIndex(e => e.employeeId === emp.employeeId);
            return (
              <div
                key={emp.employeeId}
                onClick={() => { if (!emp.alreadyPaid) toggleOne(indexInOrig); }}

              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                emp.alreadyPaid
                  ? "opacity-50 cursor-not-allowed"
                  : emp.selected
                  ? "bg-brand-50/60 cursor-pointer dark:bg-brand-900/20"
                  : "hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-800/40"
              }`}
            >
              <input
                type="checkbox"
                checked={emp.selected}
                disabled={emp.alreadyPaid}
                onChange={() => { if (!emp.alreadyPaid) toggleOne(indexInOrig); }}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 disabled:cursor-not-allowed"
              />
              <span
                className={`flex-1 text-sm font-medium ${
                  emp.alreadyPaid
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {emp.name}
              </span>

              {emp.alreadyPaid ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✓ Paid
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={emp.amount ? formatIndianNumber(emp.amount) : ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateAmount(indexInOrig, e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-32 h-8 rounded-lg border border-gray-300 px-2 text-sm text-right dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
            );
          })}
            </div>
          </div>
        </div>
      )}


      {/* Bulk summary bar */}
      {selectedEmployees.length > 0 ? (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 dark:border-brand-800/50 dark:bg-brand-900/20">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
              {selectedEmployees.length}
            </span>
            <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
              {selectedEmployees.length === 1
                ? `${selectedEmployees[0].name} selected`
                : `${selectedEmployees.length} employees selected`}
            </span>
          </div>
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
            Total: ₹{formatIndianNumber(totalAmount)}
          </span>
        </div>
      ) : (
        !allUnpaidPaid && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            No employees selected — tap to select
          </p>
        )
      )}
    </div>
  );
}
