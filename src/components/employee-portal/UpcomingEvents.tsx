import React from "react";

const upcomingEvents = [
  {
    id: 1,
    title: "Company Townhall",
    date: "Oct 24",
    time: "10:00 AM",
    type: "event",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Diwali Holiday",
    date: "Nov 12",
    time: "All Day",
    type: "holiday",
    color: "bg-orange-500",
  },
  {
    id: 3,
    title: "Sarah's Work Anniversary",
    date: "Nov 15",
    time: "5 Years",
    type: "celebration",
    color: "bg-purple-500",
  },
];

export default function UpcomingEvents() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Upcoming Events</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Holidays and team events</p>
        </div>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
          View Calendar
        </button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
            <div className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${event.color}`}></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                {event.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {event.date} • {event.time}
              </p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        See All Events
      </button>
    </div>
  );
}
