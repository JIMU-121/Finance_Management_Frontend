const departments = [
  { name: "Engineering", count: 82, color: "bg-blue-500", pct: 33 },
  { name: "HR", count: 24, color: "bg-purple-500", pct: 10 },
  { name: "Finance", count: 31, color: "bg-green-500", pct: 12 },
  { name: "Sales & Marketing", count: 55, color: "bg-orange-500", pct: 22 },
  { name: "Operations", count: 38, color: "bg-pink-500", pct: 15 },
  { name: "Admin", count: 18, color: "bg-teal-500", pct: 8 },
];

export default function DepartmentOverview() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Department Overview
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Employee distribution by department
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          248 Total
        </span>
      </div>

      <div className="space-y-4">
        {departments.map((dept) => (
          <div key={dept.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {dept.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {dept.count} employees
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-full rounded-full ${dept.color} transition-all duration-700`}
                style={{ width: `${dept.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
