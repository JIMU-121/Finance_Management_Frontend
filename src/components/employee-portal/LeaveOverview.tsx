import React from "react";

const leaveBalances = [
  { type: "Casual Leave", available: 8, total: 12, color: "bg-blue-500", lightBg: "bg-blue-50 dark:bg-blue-900/20", textColor: "text-blue-600 dark:text-blue-400" },
  { type: "Sick Leave", available: 4, total: 6, color: "bg-orange-500", lightBg: "bg-orange-50 dark:bg-orange-900/20", textColor: "text-orange-600 dark:text-orange-400" },
  { type: "Annual Leave", available: 12, total: 15, color: "bg-green-500", lightBg: "bg-green-50 dark:bg-green-900/20", textColor: "text-green-600 dark:text-green-400" },
];

export default function LeaveOverview() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Leave Balance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your available time off</p>
        </div>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
          History
        </button>
      </div>

      <div className="space-y-5">
        {leaveBalances.map((leave) => {
          const percentage = (leave.available / leave.total) * 100;
          return (
            <div key={leave.type}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${leave.color}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{leave.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{leave.available}</div>
                  <div className="text-sm text-gray-400 font-normal">/ {leave.total}</div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${leave.color} rounded-full transition-all duration-500`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between gap-3">
        <div className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">2</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">5</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Approved (YTD)</p>
        </div>
      </div>
    </div>
  );
}
