import { ReactNode } from "react";

export type PageTab<T extends string> = {
  key: T;
  label: string;
  icon?: ReactNode;
};

interface PageTabsProps<T extends string> {
  tabs: PageTab<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
}

export function PageTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: PageTabsProps<T>) {
  return (
    <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-1 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
