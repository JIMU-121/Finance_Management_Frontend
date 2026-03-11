import { useState, useEffect, JSX } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import Button from "../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../icons";
import { showError, showSuccess } from "../utils/toast";
import {
  getAllUsers,
  registerUser,
  deleteUser,
  User,
  patchUser,
} from "../features/users/userApi";
import { DataTable, ColumnDef, DetailField } from "../components/ui/table/DataTable";
import Spinner from "../components/ui/spinner/Spinner";
import { usePagination } from "../hooks/usePagination";

// ─── Role helpers ─────────────────────────────────────────────────────────────

const roleOptions = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Partner" },
  { value: "3", label: "Employee" },
];

// Maps both numeric IDs from the backend (1,2,3) and string names to display info
const ROLE_MAP: Record<string, { label: string; color: string }> = {
  // Numeric keys — what the backend sends
  "1": { label: "Admin", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "2": { label: "Partner", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "3": { label: "Employee", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },

  Admin: { label: "Admin", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  Partner: { label: "Partner", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  Employee: { label: "Employee", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

const roleLabel = (role: string | number) => {
  return ROLE_MAP[String(role)] ?? { label: String(role), color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" };
};

// ─── DataTable config ─────────────────────────────────────────────────────────

const userColumns: ColumnDef<User & { id: number }>[] = [
  {
    header: "Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        {/* Avatar initials */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {row.firstName?.[0]?.toUpperCase() ?? "U"}
          {row.lastName?.[0]?.toUpperCase() ?? ""}
        </div>
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.firstName} {row.lastName}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Email",
    render: (row) => (
      <span className="whitespace-nowrap text-gray-600 dark:text-gray-300">
        {row.email}
      </span>
    ),
  },
  {
    header: "Role",
    render: (row) => {
      const { label, color } = roleLabel(row.role);
      return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
          {label}
        </span>
      );
    },
  },
];

const userDetailFields: DetailField<User & { id: number }>[] = [
  { label: "First Name", render: (r) => r.firstName },
  { label: "Last Name", render: (r) => r.lastName },
  { label: "Email", render: (r) => r.email },
  { label: "Role", render: (r) => r.role },
  { label: "User ID", render: (r) => r.id },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditUserModal({
  user,
  onClose,
  onUpdated,
}: {
  user: User & { id: number };
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>(String(user.role));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showError("First name, last name and email are required.");
      return;
    }
    try {
      setSaving(true);
      await patchUser(user.id, {
        firstName,
        lastName,
        email,
        password: password || (user as any).password || "",
        role: Number(role) || Number(user.role),
      });
      showSuccess("User updated successfully.");
      onUpdated();
      onClose();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit User</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating: {user.firstName} {user.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e: any) => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e: any) => setLastName(e.target.value)} placeholder="Last name" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div>
            <Label>New Password <span className="text-gray-400 text-xs font-normal">(leave blank to keep current)</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeCloseIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <Label>Role</Label>
            <Select
              options={roleOptions}
              defaultValue={String(user.role)}
              placeholder="Select role"
              onChange={(v) => setRole(v)}
            />
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const clearInput = () => {
    setFirstName(""); setLastName(""); setEmail(""); setPassword(""); setRole(0);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !role) {
      showError("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await registerUser({ firstName, lastName, email, password, role: Number(role) });
      showSuccess("User registered successfully.");
      clearInput();
      onRegistered();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label>First Name <span className="text-red-500">*</span></Label>
          <Input type="text" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} placeholder="John" />
        </div>
        <div>
          <Label>Last Name <span className="text-red-500">*</span></Label>
          <Input type="text" value={lastName} onChange={(e: any) => setLastName(e.target.value)} placeholder="Doe" />
        </div>
      </div>

      <div>
        <Label>Email Address <span className="text-red-500">*</span></Label>
        <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="john@example.com" />
      </div>

      <div>
        <Label>Password <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeCloseIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <Label>Role <span className="text-red-500">*</span></Label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(Number(e.target.value))}
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-white/90"
          >
            <option value={0} disabled className="text-gray-500 dark:bg-gray-900">Select a role</option>
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? "Registering..." : "Register User"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={clearInput}
          className="flex-1"
        >
          Clear Form
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageUser() {
  const [activeTab, setActiveTab] = useState<"register" | "view">("register");
  const [users, setUsers] = useState<(User & { id: number })[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editUser, setEditUser] = useState<(User & { id: number }) | null>(null);

  // Pagination hook
  const { pageNumber, pageSize, setTotalItems, paginationProps } = usePagination();

  // ── Fetch users ──────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await getAllUsers(pageNumber, pageSize);
      setUsers(res.data as (User & { id: number })[]);
      setTotalItems(res.total);
    } catch (err) {
      console.error("Failed to fetch users", err);
      showError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchUsers();
    }
  }, [activeTab, pageNumber, pageSize]);

  // ── Delete user ──────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      showSuccess("User deleted successfully.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete user.");
    }
  };

  // ── Tab switch ───────────────────────────────────────────────────────────────
  const tabs: { key: "register" | "view"; label: string; icon: JSX.Element }[] = [
    {
      key: "register",
      label: "Register User",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      key: "view",
      label: "View Users",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <PageMeta title="Manage Users" description="User Management" />
      <PageBreadcrumb pageTitle="Manage Users" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* ── Tab header ── */}
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="p-6">
          {/* ── Register Form ── */}
          {activeTab === "register" && (
            <div className="mx-auto max-w-xl">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Register New User
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in the details below to create a new user account.
                </p>
              </div>
              <RegisterForm onRegistered={() => setActiveTab("view")} />
            </div>
          )}

          {/* ── Users Table ── */}
          {activeTab === "view" && (
            <>
              {loadingUsers ? (
                <Spinner size="md" label="Loading users..." className="py-16" />
              ) : (
                <DataTable
                  data={users}
                  columns={userColumns}
                  detailFields={userDetailFields}
                  onDelete={handleDelete}
                  onEdit={(row) => setEditUser(row)}
                  searchKeys={["firstName", "lastName", "email", "role"]}
                  searchPlaceholder="Search by name, email or role..."
                  title="All Users"
                  pagination={paginationProps}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={fetchUsers}
        />
      )}
    </div>
  );
}