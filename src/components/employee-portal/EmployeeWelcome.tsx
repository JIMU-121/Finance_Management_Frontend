import React from "react";

export default function EmployeeWelcome() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* Welcome Banner */}
      <div className="col-span-1 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:col-span-2 md:col-span-4 rounded-2xl md:p-6 lg:col-span-2 lg:row-span-2 flex flex-col justify-center bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Good Morning, Lindsey!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Here is what's happening with your projects and tasks today.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium">
            View My Tasks
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Quick Stats: Pending Tasks */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tasks</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">due this week</span>
        </div>
      </div>

      {/* Quick Stats: Unread Messages */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Unread Notices</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">new from HR</span>
        </div>
      </div>

      {/* Quick Stats: Upcoming Deadline */}
      <div className="sm:col-span-2 lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Closest Deadline</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Q2 Frontend Dashboard Update
          </h3>
          <p className="text-sm text-red-500 font-medium">Due Tomorrow at 5:00 PM</p>
        </div>
      </div>
    </div>
  );
}
