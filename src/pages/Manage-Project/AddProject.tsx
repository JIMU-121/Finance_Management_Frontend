import { useForm, Controller } from "react-hook-form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Switch from "../../components/form/switch/Switch";
import { MultiStepForm } from "../../components/ui/stepper/MultiStepForm";
import { ModalShell } from "../../components/ui/modal/ModalShell";
import { registerProject } from "../../features/projects/projectAPI";
import { getAllUsers, User } from "../../features/users/userApi";
import { getAllPartners } from "../../features/users/partnerApi";
import { Partner } from "../../types/apiTypes";
import { showSuccess, showError } from "../../utils/toast";
import { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import { createProfile, CreateProfileDto, getAllProfiles } from "../../api/ProfileApi";
// ─── Form types ───────────────────────────────────────────────────────────────

type FormValues = {
  name: string;
  technologyStack: string;
  description: string;

  managerName: string;
  managerEmail: string;
  managerContact: string;

  clientName: string;
  clientManagerName: string;
  clientManagerEmail: string;
  clientManagerContact: string;

  projectValue: number;
  startDate: string;
  endDate: string;
  status: string;

  managedByPartnerId: number;
  profileId: number | null;
  interviewingUserId: number | null;

  mobileNumberUsed: string;
  leaveApplyWay: string;
  isSmooth: boolean;
  isToolUsed: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────


/** Inline error message under a field */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddProjectForm({ onAdded }: { onAdded?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [partnerList, setPartnerList] = useState<Partner[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]); // Users without profiles
  const [profilesLoaded, setProfilesLoaded] = useState(false); // Track if profiles are loaded

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileIsPaid, setProfileIsPaid] = useState("");
  const [profileAmount, setProfileAmount] = useState("");
  const [profileUserId, setProfileUserId] = useState("");

  const handleProfileRegister = async () => {
    if (!profileUserId || profileUserId === "0") {
      showError("Invalid user selected.");
      return;
    }

    if (!profileIsPaid) {
      showError("Please select Is Paid.");
      return;
    }

    if (!profilesLoaded) {
      showError("Still loading user data. Please wait a moment and try again.");
      return;
    }

    try {
      const userId = Number(profileUserId);
      const isPaid = profileIsPaid === "true";
      const amount = profileAmount ? Number(profileAmount) : null;

      // Validation
      if (isNaN(userId) || userId <= 0) {
        showError("Invalid user ID.");
        return;
      }

      if (amount !== null && (isNaN(amount) || amount < 0)) {
        showError("Amount must be a positive number.");
        return;
      }

      const payload: CreateProfileDto = {
        userId,
        isPaid,
        amount,
      };

      const res = await createProfile(payload);

      showSuccess("Profile registered successfully!");

      // Update the form with the new profile ID
      if (res?.id) {
        setValue('profileId', res.id);
      }

      setProfileDialogOpen(false);
      setProfileIsPaid("");
      setProfileAmount("");
      setProfileUserId("");

    } catch (err: any) {


      let errorMsg = "Failed to create profile.";

      // Handle different error scenarios
      if (err?.response?.status === 500) {
        // Try to extract error message from different response formats
        const responseData = err?.response?.data;
        const errorText = typeof responseData === 'string' ? responseData : responseData?.message;

        if (errorText) {
          errorMsg = "Backend error: " + errorText;
        } else {
          errorMsg = "Backend error: Check server logs (500 Internal Server Error)";
        }
      } else if (err?.response?.status === 400) {
        errorMsg = err?.response?.data?.message || "Invalid profile data";
      } else if (err?.response?.status === 409) {
        errorMsg = "This user (ID: " + profileUserId + ") already has a profile. Each user can only have one profile.";
      } else {
        errorMsg = err?.response?.data?.message || err?.message || "Failed to create profile.";
      }

      showError(errorMsg);
    }
  };

  useEffect(() => {
    // Fetch users, partners, and profiles in parallel
    Promise.all([getAllUsers(1, 1000), getAllPartners(), getAllProfiles()])
      .then(([usersRes, partners, profiles]) => {
        setAllUsers(usersRes.data);
        setPartnerList(partners);

        // Filter users who don't have profiles yet
        const userIdsWithProfiles = new Set(profiles.map(p => p.userId));
        const usersWithoutProfiles = usersRes.data.filter(u => !userIdsWithProfiles.has(u.id));
        setAvailableUsers(usersWithoutProfiles);
        setProfilesLoaded(true); // Mark as loaded


      })
      .catch(() => {
        setProfilesLoaded(true);
      });
  }, []);

  // Build partner options: show user's full name, send partner.id
  const partnerOptions = [
    { value: "", label: "Select partner" },
    ...partnerList.map((p) => {
      const user = allUsers.find((u) => u.id === p.userId);
      const label = user ? `${user.firstName} ${user.lastName}` : `Partner #${p.id}`;
      return { value: String(p.id), label };
    }),
  ];

  // Users without profiles - for creating new profiles
  const availableUserOptions = [
    { value: "", label: availableUsers.length > 0 ? "Select user" : "No users available" },
    ...availableUsers.map((u) => ({ value: String(u.id), label: `${u.firstName} ${u.lastName}` })),
  ];

  // All users - for other selections (interviewing user, etc)
  const userOptions = [
    { value: "", label: "Select user (optional)" },
    ...allUsers.map((u) => ({ value: String(u.id), label: `${u.firstName} ${u.lastName}` })),
  ];

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: false,
    defaultValues: { isSmooth: false, isToolUsed: false, status: "Active" },
  });

  // Per-step field lists for validation (0-based index matches onValidate param)
  const stepFields: (keyof FormValues)[][] = [
    ["name", "technologyStack", "description"],
    ["managerName", "managerEmail", "managerContact"],
    ["clientName", "clientManagerName", "clientManagerEmail", "clientManagerContact"],
    ["projectValue", "leaveApplyWay", "startDate", "endDate", "managedByPartnerId", "mobileNumberUsed", "status"],
  ];

  const handleValidate = async (stepIndex: number) => {
    let isValid = true;
    for (const field of stepFields[stepIndex]) {
      const fieldValid = await trigger(field);
      if (!fieldValid) isValid = false;
    }
    return isValid;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);

      // Format dates to include seconds
      const formatDateTime = (dateStr: string) => {
        if (!dateStr) return dateStr;
        // Convert "2026-03-11T10:28" to "2026-03-11T10:28:00"
        if (dateStr.includes("T") && dateStr.split("T")[1]?.split(":").length === 2) {
          return dateStr + ":00";
        }
        return dateStr;
      };

      const payload = {
        name: data.name,
        description: data.description,
        clientName: data.clientName,
        projectValue: Number(data.projectValue),
        startDate: formatDateTime(data.startDate),
        endDate: formatDateTime(data.endDate),
        status: data.status,
        managedByPartnerId: Number(data.managedByPartnerId),
        profileId: data.profileId ? Number(data.profileId) : null,
        technologyStack: data.technologyStack,
        managerName: data.managerName,
        managerEmail: data.managerEmail,
        managerContact: data.managerContact,
        leaveApplyWay: data.leaveApplyWay,
        clientManagerName: data.clientManagerName,
        clientManagerEmail: data.clientManagerEmail,
        clientManagerContact: data.clientManagerContact,
        isSmooth: data.isSmooth,
        mobileNumberUsed: data.mobileNumberUsed,
        interviewingUserId: data.interviewingUserId ? Number(data.interviewingUserId) : null,
        isToolUsed: data.isToolUsed,
      };



      await registerProject(payload);
      showSuccess("Project registered successfully!");
      reset();
      onAdded?.();
    } catch (err: any) {

      showError(err?.response?.data?.message || "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step 1: Project Details ─────────────────────────────────────────────────

  const step1 = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>
            Project Name <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("name", { required: "Project name is required" })}
            placeholder="e.g. Inventory Management System"
            error={!!errors.name}
          />
          <FieldError msg={errors.name?.message} />
        </div>

        <div>
          <Label>
            Technology Stack <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("technologyStack", { required: "Technology stack is required" })}
            placeholder="e.g. React, .NET Core, SQL Server"
            error={!!errors.technologyStack}
          />
          <FieldError msg={errors.technologyStack?.message} />
        </div>

        <div className="md:col-span-2">
          <Label>
            Description <span className="text-error-500">*</span>
          </Label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 20, message: "At least 20 characters required" },
            })}
            rows={4}
            placeholder="Describe the project scope and goals..."
            className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-colors dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-600
              ${errors.description
                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700"
              }`}
          />
          <FieldError msg={errors.description?.message} />
        </div>
      </div>
    </div>
  );

  // ─── Step 2: Manager Information ─────────────────────────────────────────────

  const step2 = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>
            Manager Name <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("managerName", { required: "Manager name is required" })}
            placeholder="e.g. Amit Patel"
            error={!!errors.managerName}
          />
          <FieldError msg={errors.managerName?.message} />
        </div>

        <div>
          <Label>
            Manager Email <span className="text-error-500">*</span>
          </Label>
          <Input
            type="email"
            {...register("managerEmail", {
              required: "Manager email is required",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
            })}
            placeholder="manager@company.com"
            error={!!errors.managerEmail}
          />
          <FieldError msg={errors.managerEmail?.message} />
        </div>

        <div>
          <Label>
            Manager Contact <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("managerContact", {
              required: "Contact number is required",
              pattern: { value: /^[0-9+\-()\s]+$/, message: "Invalid contact number" },
            })}
            placeholder="9876543210"
            error={!!errors.managerContact}
          />
          <FieldError msg={errors.managerContact?.message} />
        </div>
      </div>
    </div>
  );

  // ─── Step 3: Client Information ──────────────────────────────────────────────

  const step3 = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>
            Client Name <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("clientName", { required: "Client name is required" })}
            placeholder="e.g. Tata Industries"
            error={!!errors.clientName}
          />
          <FieldError msg={errors.clientName?.message} />
        </div>

        <div>
          <Label>
            Client Manager Name <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("clientManagerName", { required: "Client manager name is required" })}
            placeholder="e.g. Rohit Shah"
            error={!!errors.clientManagerName}
          />
          <FieldError msg={errors.clientManagerName?.message} />
        </div>

        <div>
          <Label>
            Client Manager Email <span className="text-error-500">*</span>
          </Label>
          <Input
            type="email"
            {...register("clientManagerEmail", {
              required: "Client manager email is required",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
            })}
            placeholder="rohit.shah@tata.com"
            error={!!errors.clientManagerEmail}
          />
          <FieldError msg={errors.clientManagerEmail?.message} />
        </div>

        <div>
          <Label>
            Client Manager Contact <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("clientManagerContact", {
              required: "Client manager contact is required",
              pattern: { value: /^[0-9+\-()\s]+$/, message: "Invalid contact number" },
            })}
            placeholder="9123456780"
            error={!!errors.clientManagerContact}
          />
          <FieldError msg={errors.clientManagerContact?.message} />
        </div>
      </div>
    </div>
  );

  // ─── Step 4: Additional Details ──────────────────────────────────────────────

  const step4 = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Financials & Timeline ── */}
        <div>
          <Label>
            Project Value (₹) <span className="text-error-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("projectValue", {
              required: "Project value is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
            placeholder="e.g. 2000000"
            error={!!errors.projectValue}
          />
          <FieldError msg={errors.projectValue?.message} />
        </div>

        <div>
          <Label>
            Status <span className="text-error-500">*</span>
          </Label>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Select
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Completed", label: "Completed" },
                  { value: "On Hold", label: "On Hold" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <FieldError msg={errors.status?.message} />
        </div>

        <div>
          <Label>
            Start Date <span className="text-error-500">*</span>
          </Label>
          <Input
            type="datetime-local"
            {...register("startDate", { required: "Start date is required" })}
            error={!!errors.startDate}
          />
          <FieldError msg={errors.startDate?.message} />
        </div>

        <div>
          <Label>
            End Date <span className="text-error-500">*</span>
          </Label>
          <Input
            type="datetime-local"
            {...register("endDate", { required: "End date is required" })}
            error={!!errors.endDate}
          />
          <FieldError msg={errors.endDate?.message} />
        </div>

        {/* ── Operational Settings ── */}
        <div className="md:col-span-2 mt-2 pt-5 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Operational Settings
          </p>
        </div>

        <div className="md:col-span-2">
          <Label>
            Leave Apply Way <span className="text-error-500">*</span>
          </Label>
          <textarea
            {...register("leaveApplyWay", { required: "Leave apply way is required" })}
            rows={3}
            placeholder="e.g. Submit leaves via HR portal at least 3 days in advance..."
            className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-colors dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-600
              ${errors.leaveApplyWay
                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700"
              }`}
          />
          <FieldError msg={errors.leaveApplyWay?.message} />
        </div>

        <div>
          <Label>
            Mobile Number Used <span className="text-error-500">*</span>
          </Label>
          <Input
            {...register("mobileNumberUsed", { required: "Mobile number used is required" })}
            placeholder="e.g. Company Device / Personal Device / 9876543210"
            error={!!errors.mobileNumberUsed}
          />
          <FieldError msg={errors.mobileNumberUsed?.message} />
        </div>

        {/* ── References ── */}
        <div className="md:col-span-2 mt-2 pt-5 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Reference IDs
          </p>
        </div>

        <div>
          <Label>
            Managed By Partner <span className="text-error-500">*</span>
          </Label>
          <Controller
            name="managedByPartnerId"
            control={control}
            rules={{ required: "Partner is required" }}
            render={({ field }) => (
              <Select
                options={partnerOptions}
                value={field.value ? String(field.value) : ""}
                onChange={(val) => field.onChange(val ? Number(val) : null)}
              />
            )}
          />
          <FieldError msg={errors.managedByPartnerId?.message} />
        </div>

        <div className="md:col-span-2">
          <Label>Project Profile</Label>
          {availableUsers.length === 0 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">All users already have profiles assigned.</p>
          )}

          <div className="mt-2 flex items-center gap-3">

            {/* User Dropdown - Only show users without profiles */}
            <div className="flex-1">
              <Controller
                name="profileId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={availableUserOptions}
                    value={field.value ? String(field.value) : ""}
                    onChange={(val) => {
                      const userId = val ? Number(val) : null;
                      field.onChange(userId);
                      setProfileUserId(val); // sync with modal
                    }}
                  />
                )}
              />
            </div>

            {/* Add New Button */}
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!profileUserId) {
                  showError("Please select a user first");
                  return;
                }
                if (availableUsers.length === 0) {
                  showError("All users already have profiles. No users available for new profiles.");
                  return;
                }
                setProfileDialogOpen(true);
              }}
            >
              + Add New
            </Button>
          </div>

          {profileDialogOpen && (
            <ModalShell
              title="Add Project Profile"
              onClose={() => {
                setProfileDialogOpen(false);
                setProfileIsPaid("");
                setProfileAmount("");
              }}
              maxWidth="md"
              onSave={() => handleProfileRegister()}
              saveLabel="Register"
            >
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                {/* Is Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Is Paid <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={[
                      { value: "", label: "Select..." },
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                    value={profileIsPaid}
                    onChange={(val) => setProfileIsPaid(val)}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={profileAmount}
                    onChange={(e) => setProfileAmount(e.target.value)}
                  />
                </div>
              </div>
            </ModalShell>
          )}
        </div>


        <div>
          <Label>Interviewing User (Optional)</Label>
          <Controller
            name="interviewingUserId"
            control={control}
            render={({ field }) => (
              <Select
                options={userOptions}
                value={field.value ? String(field.value) : ""}
                onChange={(val) => field.onChange(val ? Number(val) : null)}
              />
            )}
          />
        </div>

        {/* ── Toggles ── */}
        <div className="md:col-span-2 mt-2 pt-5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-8">
            <Controller
              name="isToolUsed"
              control={control}
              render={({ field }) => (
                <Switch
                  label="Is Tool Used?"
                  defaultChecked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="isSmooth"
              control={control}
              render={({ field }) => (
                <Switch
                  label="Is Setup Smooth?"
                  defaultChecked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Step definitions ─────────────────────────────────────────────────────────

  const steps = [
    {
      label: "Project Details",
      title: "Project Details",
      subtitle: "Provide the core project information.",
      content: step1,
    },
    {
      label: "Manager Info",
      title: "Manager Information",
      subtitle: "Who is managing this project?",
      content: step2,
    },
    {
      label: "Client Info",
      title: "Client Information",
      subtitle: "Who is the client and their point of contact?",
      content: step3,
    },
    {
      label: "Project Configuration",
      title: "Project Configuration",
      subtitle: "Set the timeline, budget, and operational details.",
      content: step4,
    },
  ];

  return (
    <MultiStepForm
      steps={steps}
      onValidate={handleValidate}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={submitting ? "Saving..." : "Save Project"}
    />
  );
}