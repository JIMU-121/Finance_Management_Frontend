import { useState, useEffect, JSX } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { showError, showSuccess } from "../../utils/toast";
import { getAllUsers, deleteUser, User } from "../../features/users/userApi";
import {
  DataTable,
  ColumnDef,
  DetailField,
} from "../../components/ui/table/DataTable";
import Spinner from "../../components/ui/spinner/Spinner";
import { usePagination } from "../../hooks/usePagination";
import {
  getPartnerByUserId,
  createPartner,
  updatePartner,
} from "../../features/users/partnerApi";
import { Partner } from "../../types/apiTypes";
import { useNavigate } from "react-router";

// ─── Types and Constants ──────────────────────────────────────────────────────

type PartnerUser = User & {
  id: number;
  partnerRecord?: Partner;
  _isPartnerCreated?: boolean;
};

// The backend role ID for Partner is "2"
const PARTNER_ROLE_ID = 2;

// ─── DataTable config ─────────────────────────────────────────────────────────

const partnerColumns: ColumnDef<PartnerUser>[] = [
  {
    header: "Partner Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {row.firstName?.[0]?.toUpperCase() ?? "P"}
          {row.lastName?.[0]?.toUpperCase() ?? ""}
        </div>
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.firstName} {row.lastName}
          </span>
          {row.isMainPartner && (
            <span className="text-[10px] uppercase font-bold text-brand-500">
              Main Partner
            </span>
          )}
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
    header: "Partnership Type",
    render: (row) => (
      <span className="whitespace-nowrap text-gray-600 dark:text-gray-300 capitalize">
        {row.partnerRecord?.partnershipType || row.partnershipType || "—"}
      </span>
    ),
  },
  {
    header: "Share (%)",
    render: (row) => (
      <span className="whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
        {(row.partnerRecord?.sharePercentage ?? row.sharePercentage)
          ? `${row.partnerRecord?.sharePercentage ?? row.sharePercentage}%`
          : "—"}
      </span>
    ),
  },
  {
    header: "Branch",
    render: (row) => (
      <span className="whitespace-nowrap text-gray-600 dark:text-gray-300">
        {(row.partnerRecord?.branchId ?? row.branchId)
          ? `Branch #${row.partnerRecord?.branchId ?? row.branchId}`
          : "—"}
      </span>
    ),
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row._isPartnerCreated
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}
      >
        {row._isPartnerCreated ? "Created" : "Not Created"}
      </span>
    ),
  },
];

const partnerDetailFields: DetailField<PartnerUser>[] = [
  { label: "First Name", render: (r) => r.firstName },
  { label: "Last Name", render: (r) => r.lastName },
  { label: "Email", render: (r) => r.email },
  {
    label: "Partnership Type",
    render: (r) => r.partnerRecord?.partnershipType || r.partnershipType || "—",
  },
  {
    label: "Share Percentage",
    render: (r) =>
      (r.partnerRecord?.sharePercentage ?? r.sharePercentage)
        ? `${r.partnerRecord?.sharePercentage ?? r.sharePercentage}%`
        : "—",
  },
  {
    label: "Branch ID",
    render: (r) => (r.partnerRecord?.branchId ?? r.branchId) || "—",
  },
  {
    label: "Is Main Partner",
    render: (r) =>
      (r.partnerRecord?.isMainPartner ?? r.isMainPartner) ? "Yes" : "No",
  },
  {
    label: "Status",
    render: (r) => (r._isPartnerCreated ? "Created" : "Not Created"),
  },
  { label: "User ID", render: (r) => r.id },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditPartnerModal({
  partner,
  onClose,
  onUpdated,
}: {
  partner: PartnerUser;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [firstName, setFirstName] = useState(partner.firstName || "");
  const [lastName, setLastName] = useState(partner.lastName || "");
  const [email, setEmail] = useState(partner.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Partner fields
  const [partnershipType, setPartnershipType] = useState(
    partner.partnerRecord?.partnershipType || partner.partnershipType || "",
  );
  const [sharePercentage, setSharePercentage] = useState<number | string>(
    (partner.partnerRecord?.sharePercentage ?? partner.sharePercentage) || "",
  );
  const [branchId, setBranchId] = useState<number | string>(
    (partner.partnerRecord?.branchId ?? partner.branchId) || "",
  );
  const [isMainPartner, setIsMainPartner] = useState(
    (partner.partnerRecord?.isMainPartner ?? partner.isMainPartner) || false,
  );

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showError("First name, last name and email are required.");
      return;
    }
    try {
      setSaving(true);

      // We only update the Partner details as requested
      const partnerData: Partner = {
        userId: partner.id,
        partnershipType,
        sharePercentage: Number(sharePercentage) || 0,
        branchId: branchId ? Number(branchId) : 1,
        isMainPartner,
      };

      if (partner._isPartnerCreated && partner.partnerRecord?.id) {
        await updatePartner(partner.partnerRecord.id, partnerData);
      } else {
        await createPartner(partnerData);
      }

      showSuccess("Partner updated successfully.");
      onUpdated();
      onClose();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Edit Partner
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updating: {partner.firstName} {partner.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label>
              New Password{" "}
              <span className="text-gray-400 text-xs font-normal">
                (leave blank to keep current)
              </span>
            </Label>
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
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeCloseIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            Partnership Details
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Partnership Type</Label>
              <Input
                value={partnershipType}
                onChange={(e: any) => setPartnershipType(e.target.value)}
                placeholder="e.g. LLC, General"
              />
            </div>
            <div>
              <Label>Share Percentage (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={sharePercentage}
                onChange={(e: any) => setSharePercentage(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Branch ID</Label>
              <Input
                type="number"
                value={branchId}
                onChange={(e: any) => setBranchId(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center cursor-pointer select-none text-gray-700 dark:text-gray-300">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isMainPartner}
                    onChange={(e) => setIsMainPartner(e.target.checked)}
                  />
                  <div
                    className={`box block h-6 w-10 rounded-full ${isMainPartner ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${isMainPartner ? "translate-x-full" : ""}`}
                  ></div>
                </div>
                <span className="ml-3 font-medium text-sm">Main Partner</span>
              </label>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
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

export default function ManagePartners() {
  const [activeTab, setActiveTab] = useState<"registered" | "inactive">(
    "registered",
  );
  const [registeredPartners, setRegisteredPartners] = useState<PartnerUser[]>(
    [],
  );
  const [inactivePartners, setInactivePartners] = useState<PartnerUser[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [editPartner, setEditPartner] = useState<PartnerUser | null>(null);
  const navigate = useNavigate();

  // Pagination hook
  const { pageNumber, pageSize, setTotalItems, paginationProps } =
    usePagination();

  // ── Fetch partners ──────────────────────────────────────────────────────────────
  const fetchPartners = async () => {
    try {
      setLoadingPartners(true);
      // Fetch all users - we need to fetch a large number because we are filtering down to partners on the client
      // Without this, partners on page 2 (if page size is 10) won't show up.
      // Alternatively, the backend should expose an endpoint like `/api/user?role=Partner`
      const res = await getAllUsers(1, 1000);

      const parsedData = res.data as PartnerUser[];

      // Filter the data to ONLY include users who have the partner role (2 or "Partner")
      // Ensure we trim any whitespace to be safe
      const partnerUsers = parsedData.filter(
        (u) =>
          String(u.role).trim() === String(PARTNER_ROLE_ID) ||
          String(u.role).trim().toLowerCase() === "partner",
      );

      // Fetch partner details for each user
      const enrichedPartners = await Promise.all(
        partnerUsers.map(async (u) => {
          const partnerReq = await getPartnerByUserId(u.id);
          return {
            ...u,
            partnerRecord: partnerReq || undefined,
            _isPartnerCreated: !!partnerReq,
          };
        }),
      );

      const registered = enrichedPartners.filter((p) => p._isPartnerCreated);
      const inactive = enrichedPartners.filter((p) => !p._isPartnerCreated);

      setRegisteredPartners(registered);
      setInactivePartners(inactive);

      // If server pagination is needed, we technically have to update how pagination works here
      // when splitting into two tabs, but we'll reflect the count of the active tab.
      setTotalItems(
        activeTab === "registered" ? registered.length : inactive.length,
      );
    } catch (err) {
      console.error("Failed to fetch partners", err);
      showError("Failed to load partners.");
    } finally {
      setLoadingPartners(false);
    }
  };

  useEffect(() => {
    // Reset page to 1 when tab changes to ensure we see the first page of results
    if (pageNumber !== 1) {
      paginationProps.onPageChange(1);
    } else {
      fetchPartners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]);

  // ── Delete partner ──────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      showSuccess("Partner deleted successfully.");

      if (activeTab === "registered") {
        setRegisteredPartners((prev) => prev.filter((u) => u.id !== id));
      } else {
        setInactivePartners((prev) => prev.filter((u) => u.id !== id));
      }
      setTotalItems((prev) => prev - 1);
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete partner.");
    }
  };

  // ── Tab switch ───────────────────────────────────────────────────────────────
  const tabs: {
    key: "registered" | "inactive";
    label: string;
    icon: JSX.Element;
  }[] = [
      {
        key: "registered",
        label: "Registered Partners",
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
            />
          </svg>
        ),
      },
      // {
      //   key: "inactive",
      //   label: "Inactive Partners",
      //   icon: (
      //     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      //     </svg>
      //   ),
      // },
    ];

  function handleRegisterUser() {
    // setActiveTab("registered");
    navigate("/manage-partner/register");
  }

  return (
    <div>
      <PageMeta
        title="Manage Partners"
        description="Partner Management Dashboard"
      />
      <PageBreadcrumb pageTitle="Manage Partners" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* ── Tab header ── */}
        <div className="border-b border-gray-200 px-5 pt-5 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Left - Tabs */}
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

            {/* Right - Add Button */}
            <button
              onClick={handleRegisterUser}
              className="bg-brand-500 m-2 hover:bg-brand-600 text-white px-5 py-2 rounded-lg"
            >
              + Add Partner
            </button>
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="p-6">
          {/* ── Registered Partners Table ── */}
          {activeTab === "registered" && (
            <>
              {loadingPartners ? (
                <Spinner
                  size="md"
                  label="Loading partners..."
                  className="py-16"
                />
              ) : (
                <DataTable
                  data={registeredPartners}
                  columns={partnerColumns}
                  detailFields={partnerDetailFields}
                  onDelete={handleDelete}
                  onEdit={(row) => setEditPartner(row)}
                  searchKeys={[
                    "firstName",
                    "lastName",
                    "email",
                    "partnershipType",
                    "branchId",
                  ]}
                  searchPlaceholder="Search registered partners..."
                  title="Registered Firm Partners"
                  pagination={paginationProps}
                />
              )}
            </>
          )}

          {/* ── Inactive Partners Table ── */}
          {activeTab === "inactive" && (
            <>
              {loadingPartners ? (
                <Spinner
                  size="md"
                  label="Loading inactive partners..."
                  className="py-16"
                />
              ) : (
                <DataTable
                  data={inactivePartners}
                  columns={partnerColumns}
                  detailFields={partnerDetailFields}
                  onDelete={handleDelete}
                  onEdit={(row) => setEditPartner(row)}
                  searchKeys={["firstName", "lastName", "email"]}
                  searchPlaceholder="Search inactive partners..."
                  title="Inactive Partners (Missing Partner Details)"
                  pagination={paginationProps}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editPartner && (
        <EditPartnerModal
          partner={editPartner}
          onClose={() => setEditPartner(null)}
          onUpdated={fetchPartners}
        />
      )}
    </div>
  );
}