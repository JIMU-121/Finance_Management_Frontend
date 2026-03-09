import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { DataTable, ColumnDef, DetailField } from "../../components/ui/table/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: number;
  Name: string;
  TechnologyStack: string;
  ManagerName: string;
  ManagerEmail: string;
  Contact: string;
  ClientName: string;
  ClientManagerName: string;
  ClientManagerEmail: string;
  ClientManagerContact: string;
  ProjectValue: number;
  StartDate: string;
  EndDate: string;
  IsSmooth: boolean;
  IsToolUsed: boolean;
  Description: string;
  LeaveApply: string;
  PartnerID: number;
  ProfileID: number;
  InterviewingUserID: number;
  MobileNumberUsed: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockProjects: Project[] = [
  {
    id: 1,
    Name: "Alpha Portal",
    TechnologyStack: "React, Node.js, MongoDB",
    ManagerName: "John Smith",
    ManagerEmail: "john@example.com",
    Contact: "+1 (555) 100-2000",
    ClientName: "Acme Corp",
    ClientManagerName: "Lisa Ray",
    ClientManagerEmail: "lisa@acme.com",
    ClientManagerContact: "+1 (555) 300-4000",
    ProjectValue: 85000,
    StartDate: "2024-01-10T09:00",
    EndDate: "2024-08-31T18:00",
    IsSmooth: true,
    IsToolUsed: true,
    Description: "End-to-end customer portal for Acme Corp with real-time dashboards.",
    LeaveApply: "Submit leaves via HR portal at least 3 days in advance.",
    PartnerID: 1,
    ProfileID: 2,
    InterviewingUserID: 1,
    MobileNumberUsed: 9876543210,
  },
  {
    id: 2,
    Name: "Beta Analytics",
    TechnologyStack: "Vue.js, Python, PostgreSQL",
    ManagerName: "Sarah Lee",
    ManagerEmail: "sarah@example.com",
    Contact: "+1 (555) 200-3000",
    ClientName: "TechVision Ltd",
    ClientManagerName: "Mike Chen",
    ClientManagerEmail: "mike@techvision.com",
    ClientManagerContact: "+1 (555) 400-5000",
    ProjectValue: 120000,
    StartDate: "2024-03-01T09:00",
    EndDate: "2024-12-15T18:00",
    IsSmooth: false,
    IsToolUsed: true,
    Description: "Advanced analytics platform with AI-powered insights for TechVision.",
    LeaveApply: "Annual leaves require manager approval 5 days before.",
    PartnerID: 2,
    ProfileID: 1,
    InterviewingUserID: 2,
    MobileNumberUsed: 9123456780,
  },
  {
    id: 3,
    Name: "Gamma ERP",
    TechnologyStack: "Angular, Java, Oracle",
    ManagerName: "David Park",
    ManagerEmail: "david@example.com",
    Contact: "+1 (555) 500-6000",
    ClientName: "GlobalTrade Inc",
    ClientManagerName: "Anna White",
    ClientManagerEmail: "anna@globaltrade.com",
    ClientManagerContact: "+1 (555) 600-7000",
    ProjectValue: 250000,
    StartDate: "2023-06-01T09:00",
    EndDate: "2025-05-31T18:00",
    IsSmooth: true,
    IsToolUsed: false,
    Description: "Enterprise resource planning system covering finance, HR, and supply chain.",
    LeaveApply: "Leaves tracked via Jira. Plan 1 week in advance.",
    PartnerID: 1,
    ProfileID: 2,
    InterviewingUserID: 1,
    MobileNumberUsed: 9988776655,
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${active
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`} />
      {active ? "Smooth" : "Needs Attention"}
    </span>
  );
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Project>[] = [
  {
    header: "Project Name",
    render: (row) => (
      <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
        {row.Name}
      </span>
    ),
  },

  {
    header: "Manager",
    accessor: "ManagerName",
    className: "whitespace-nowrap",
  },
  {
    header: "Client",
    accessor: "ClientName",
    className: "whitespace-nowrap",
  },
  {
    header: "Value",
    render: (row) => (
      <span className="whitespace-nowrap font-medium text-gray-800 dark:text-white">
        ₹{row.ProjectValue.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Start Date",
    render: (row) => (
      <span className="whitespace-nowrap">
        {new Date(row.StartDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: "End Date",
    render: (row) => (
      <span className="whitespace-nowrap">
        {new Date(row.EndDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: "Status",
    render: (row) => <StatusBadge active={row.IsSmooth} />,
  },
];

// ─── Detail Fields ────────────────────────────────────────────────────────────

const detailFields: DetailField<Project>[] = [
  { label: "Project Name", render: (r) => r.Name },
  { label: "Technology Stack", render: (r) => r.TechnologyStack },
  { label: "Description", render: (r) => r.Description },
  { label: "Manager Name", render: (r) => r.ManagerName },
  { label: "Manager Email", render: (r) => r.ManagerEmail },
  { label: "Manager Contact", render: (r) => r.Contact },
  { label: "Client Name", render: (r) => r.ClientName },
  { label: "Client Manager Name", render: (r) => r.ClientManagerName },
  { label: "Client Manager Email", render: (r) => r.ClientManagerEmail },
  { label: "Client Manager Contact", render: (r) => r.ClientManagerContact },
  { label: "Project Value", render: (r) => `₹${r.ProjectValue.toLocaleString()}` },
  { label: "Start Date", render: (r) => new Date(r.StartDate).toLocaleString() },
  { label: "End Date", render: (r) => new Date(r.EndDate).toLocaleString() },
  { label: "Is Setup Smooth", render: (r) => (r.IsSmooth ? "Yes" : "No") },
  { label: "Is Tool Used", render: (r) => (r.IsToolUsed ? "Yes" : "No") },
  { label: "Leave Apply Info", render: (r) => r.LeaveApply },
  { label: "Partner", render: (r) => `Partner ${r.PartnerID === 1 ? "A" : "B"}` },
  { label: "Profile", render: (r) => `Profile ${r.ProfileID === 1 ? "X" : "Y"}` },
  { label: "Interviewing User", render: (r) => `Interviewer ${r.InterviewingUserID}` },
  { label: "Mobile Number Used", render: (r) => r.MobileNumberUsed },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewProject() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <PageMeta title="View Projects" description="View and manage all projects" />
      <PageBreadcrumb pageTitle="View Projects" />

      <DataTable
        data={projects}
        columns={columns}
        detailFields={detailFields}
        onDelete={handleDelete}
        searchKeys={["Name", "ClientName", "ManagerName", "TechnologyStack"]}
        searchPlaceholder="Search projects..."
        title="All Projects"
      />
    </div>
  );
}
