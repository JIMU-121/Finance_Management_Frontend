import React, { useState, useEffect } from "react";
import InitialAvatar from "../../../components/ui/avatar/InitialAvatar";
import { getProjectEmployees } from "../projectAPI";
import { AssignedEmployee } from "../../../types/apiTypes";

export default function EmployeeAvatars({
  projectId,
  initialEmployees,
  employeesMap,
  onManage,
}: {
  projectId: number;
  initialEmployees?: AssignedEmployee[];
  employeesMap: Record<number, string>;
  onManage: () => void;
}) {
  const [list, setList] = useState<any[]>(initialEmployees ?? []);

  useEffect(() => {
    getProjectEmployees(projectId).then(setList).catch(console.error);
  }, [projectId]);

  const shown = list.slice(0, 3);
  const extra = list.length - shown.length;

  return (
    <button
      onClick={onManage}
      className="flex items-center gap-1 group focus:outline-none"
      title="Manage employees"
    >
      <div className="flex -space-x-2">
        {shown.map((emp: any, i) => {
          const reliableName = employeesMap[emp.employeeId ?? emp.id];
          return (
            <InitialAvatar
              key={emp.id ?? emp.employeeId ?? i}
              name={reliableName || "Employee"}
              index={i}
            />
          );
        })}
        {extra > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-900">
            +{extra}
          </span>
        )}
        {list.length === 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
            Assign
          </span>
        )}
      </div>
      {list.length > 0 && (
        <svg className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 ml-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </button>
  );
}
