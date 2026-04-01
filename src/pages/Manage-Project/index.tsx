import { useState, JSX } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddProjectForm from "./AddProject";
import ViewProjectTable from "./ViewProject";

type Tab = "view" | "add";

const tabs: { key: Tab; label: string; icon: JSX.Element }[] = [
  {
    key: "view",
    label: "View Projects",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
  },
  // {
  //   key: "add",
  //   label: "Add Project",
  //   icon: (
  //     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  //     </svg>
  //   ),
  // },
];

export default function ManageProject() {
  const [activeTab, setActiveTab] = useState<Tab>("view");

  return (
    <div>
      <PageMeta title="Manage Projects" description="Project Management" />
      <PageBreadcrumb pageTitle="Manage Projects" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Left - Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right - Add Button */}
            <button
              onClick={() => setActiveTab("add")}
              className="bg-brand-500 m-2 hover:bg-brand-600 text-white px-5 py-2 rounded-lg"
            >
              + Add Project
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "view" && <ViewProjectTable />}
          {activeTab === "add" && (
            <AddProjectForm onAdded={() => setActiveTab("view")} />
          )}
        </div>
      </div>
    </div>
  );
}
