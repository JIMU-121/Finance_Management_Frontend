import { useState } from "react";

export default function MyAttendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckInOut = () => {
    if (!isCheckedIn) {
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
      // Logic for storing hours could go here
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">My Attendance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your daily hours</p>
        </div>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${isCheckedIn ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
          {isCheckedIn ? "Checked In" : "Checked Out"}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800 mb-6">
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-mono tracking-tight">
          08<span className="text-gray-400">:</span>42 <span className="text-xl text-gray-500">AM</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check In</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {checkInTime || "--:--"}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check Out</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">--:--</p>
        </div>
      </div>

      <button
        onClick={handleCheckInOut}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex justify-center items-center gap-2 ${
          isCheckedIn 
          ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 ring-1 ring-red-200 dark:ring-red-800"
          : "bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {isCheckedIn ? "Clock Out" : "Clock In"}
      </button>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">This Week</span>
        <span className="font-semibold text-gray-900 dark:text-white">32h 15m <span className="font-normal text-gray-400">/ 40h</span></span>
      </div>
    </div>
  );
}
