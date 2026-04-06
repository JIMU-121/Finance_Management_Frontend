import { Calendar } from "lucide-react";
import { useState } from "react";
import LineChartOne from "../charts/line/LineChartOne";

export default function MonthlySalesChart() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Expense", "Revenue"];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
              Statistics
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Target you've set for each month
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Pill Switcher */}
            <div className="inline-flex items-center p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm transition-all duration-200 rounded-lg ${activeTab === tab
                    ? "font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800 shadow-sm border border-transparent"
                    : "font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Date Picker Button */}
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-300 shadow-sm transition-all">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Mar 27 - Apr 2</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <LineChartOne activeTab={activeTab} />
      </div>
    </div>
  );
}
