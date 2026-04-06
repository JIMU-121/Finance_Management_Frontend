import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../context/DashboardContext";
import { ArrowDownIcon, ArrowUpIcon } from "../../icons";

export default function MonthlyTarget() {
  const { currentMonthlyReport, previousMonthlyReport, loading } = useDashboard();

  // 1. Target is previous month's total expenses
  const expectedExpense = previousMonthlyReport?.totalExpenses || 200000; // Fallback if no report
  const currentExpense = currentMonthlyReport?.totalExpenses || 0;

  // 2. Calculations
  const percentage = expectedExpense > 0
    ? Math.min(100, Math.round((currentExpense / expectedExpense) * 100 * 10) / 10)
    : 0;

  const expenseGrowth = expectedExpense > 0
    ? Math.round(((currentExpense - expectedExpense) / expectedExpense) * 100)
    : 0;

  const isOverBudget = currentExpense > expectedExpense;
  const isSafe = currentExpense < (expectedExpense * 0.9); // Safe if under 90%

  const options: ApexOptions = {
    colors: [isOverBudget ? "#EF4444" : "#465FFF"], // Red if over budget, Blue otherwise
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 280,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -110,
        endAngle: 110,
        hollow: {
          size: "75%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "42px",
            fontWeight: "700",
            offsetY: -15, // Raised up to avoid overlap
            color: "#1D2939",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: {
      type: "solid",
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Budget Usage"],
  };

  const series = [percentage];

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-100 rounded-full w-64 mx-auto mb-6"></div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white/90">
              Budget Usage
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Current vs Previous Month Expenses
            </p>
          </div>
        </div>

        {/* Gauge Chart Section */}
        <div className="relative flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-[280px]">
            <Chart options={options} series={series} type="radialBar" height={280} />
          </div>

          <div className="mt-[-30px] z-10">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${isOverBudget ? "bg-error-50 text-error-600" : "bg-success-50 text-success-600"
              }`}>
              {expenseGrowth >= 0 ? "+" : ""}{expenseGrowth}%
            </span>
          </div>
        </div>

        {/* Narrative Narrative */}
        <div className="mt-10 mb-10 text-center px-4">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
            We have spent ₹{currentExpense.toLocaleString('en-IN')} this month.
            {isOverBudget ? (
              <span className="block mt-1 font-bold text-error-600 italic">
                Warning: You have exceeded last month's budget!
              </span>
            ) : isSafe ? (
              <span className="block mt-1 font-bold text-success-600 italic">
                You are well within last month's budget. Keep it up!
              </span>
            ) : (
              <span className="block mt-1 font-bold text-warning-600 italic">
                Approaching last month's spending limit.
              </span>
            )}
          </p>
        </div>

        {/* Bottom Row Stats */}
        <div className="mt-auto grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          {/* Target (Last Month) */}
          <div className="flex flex-col items-center gap-2 border-r border-gray-200 dark:border-gray-700/50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center">Last Month (Target)</span>
            <div className="flex items-center gap-1 text-gray-800 dark:text-white/90">
              <span className="font-black text-lg">₹{Math.round(expectedExpense / 1000)}K</span>
              <ArrowDownIcon className="text-success-600 size-4 fill-current" />
            </div>
          </div>
          {/* Current Month */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center">Current Spent</span>
            <div className="flex items-center gap-1 text-gray-800 dark:text-white/90">
              <span className="font-black text-lg">₹{Math.round(currentExpense / 1000)}K</span>
              <ArrowUpIcon className={`size-4 fill-current ${isOverBudget ? "text-error-600" : "text-success-600"}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
