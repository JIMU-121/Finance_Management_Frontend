import { useForm, Controller } from "react-hook-form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import LazySelect from "../../components/form/LazySelect";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import IndianAmountInput from "../../components/form/IndianAmountInput";
import { MultiStepForm } from "../../components/ui/stepper/MultiStepForm";
import { registerProject } from "../../features/projects/projectAPI";
import { getAllUsers } from "../../features/users/userApi";
import { getAllPartners } from "../../features/users/partnerApi";
import { showSuccess, showError } from "../../utils/toast";
import { useState, useCallback } from "react";
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

  projectValue: string; // Changed to string to handle commas in UI and digits in state
  startDate: string;
  endDate: string;
  status: string;

  managedByPartnerId: number;

  // Profile integration
  profileUserId: number | null;
  profileIsPaid: string;
  profileAmount: string; // Changed to string for IndianAmountInput

  profileId: number | null;
  interviewingUserId: number | null;

  mobileNumberUsed: string;
  leaveApplyWay: string;
  isSmooth: boolean;
  isToolUsed: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddProjectForm({ onAdded }: { onAdded?: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  // ── Lazy Load Fetchers ───────────────────────────────────────────────────
  const loadPartners = useCallback(async () => {
    try {
      const [usersRes, partnersRes] = await Promise.all([
        getAllUsers(1, 1000),
        getAllPartners()
      ]);

      return [
        { value: "", label: "Select partner" },
        ...(partnersRes || []).map((p: any) => {
          const u = usersRes.data.find((usr: any) => usr.id === p.userId);
          return {
            value: String(p.id),
            label: u ? `${u.firstName} ${u.lastName}` : `Partner #${p.id}`
          };
        })
      ];
    } catch {
      return [{ value: "", label: "Failed to load partners" }];
    }
  }, []);

  const loadAvailableUsers = useCallback(async () => {
    try {
      const [usersRes, profilesRes] = await Promise.all([
        getAllUsers(1, 1000),
        getAllProfiles()
      ]);
      const userIdsWithProfiles = new Set(profilesRes.map((p: any) => p.userId));
      const list = usersRes.data.filter((u: any) => !userIdsWithProfiles.has(u.id));

      return [
        { value: "", label: list.length > 0 ? "Select user" : "No users available" },
        ...list.map((u: any) => ({ value: String(u.id), label: `${u.firstName} ${u.lastName}` }))
      ];
    } catch {
      return [{ value: "", label: "Failed to load users" }];
    }
  }, []);

  const loadAllUsers = useCallback(async () => {
    try {
      const res = await getAllUsers(1, 1000);
      return [
        { value: "", label: "Select user (optional)" },
        ...res.data.map((u: any) => ({ value: String(u.id), label: `${u.firstName} ${u.lastName}` }))
      ];
    } catch {
      return [{ value: "", label: "Failed to load users" }];
    }
  }, []);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: false,
    defaultValues: {
      isSmooth: false,
      isToolUsed: false,
      status: "Active",
      profileIsPaid: "true",
      profileAmount: "",
      projectValue: ""
    },
  });

  const selectedProfileUserId = watch("profileUserId");

  const stepFields: (keyof FormValues)[][] = [
    ["name", "technologyStack", "description"],
    ["managerName", "managerEmail", "managerContact"],
    ["clientName", "clientManagerName", "clientManagerEmail", "clientManagerContact"],
    ["projectValue", "startDate", "endDate", "managedByPartnerId", "mobileNumberUsed", "status", "profileUserId"],
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

      let finalProfileId = data.profileId;

      // ─── Automatic Profile Creation ──────────────────────────────────────
      if (data.profileUserId) {
        try {
          const profilePayload: CreateProfileDto = {
            userId: Number(data.profileUserId),
            isPaid: data.profileIsPaid === "true",
            amount: data.profileAmount ? Number(data.profileAmount.replace(/,/g, "")) : null,
          };
          const res = await createProfile(profilePayload);
          finalProfileId = res?.id || null;
        } catch (profileErr: any) {
          showError(profileErr?.response?.data?.message || "Failed to create profile first.");
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        ...data,
        projectValue: Number(data.projectValue.replace(/,/g, "")),
        startDate: data.startDate ? `${data.startDate}T00:00:00` : "",
        endDate: data.endDate ? `${data.endDate}T00:00:00` : "",
        managedByPartnerId: Number(data.managedByPartnerId),
        profileId: finalProfileId ? Number(finalProfileId) : null,
        interviewingUserId: data.interviewingUserId ? Number(data.interviewingUserId) : null,
      };

      await registerProject(payload);
      showSuccess("Project and Profile registered successfully!");
      reset();
      onAdded?.();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Steps implementation ───────────────────────────────────────────────────

  const step1 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Label>Project Name <span className="text-error-500">*</span></Label>
        <Input {...register("name", { required: "Required" })} placeholder="e.g. Inventory System" error={!!errors.name} />
        <FieldError msg={errors.name?.message} />
      </div>
      <div>
        <Label>Technology Stack <span className="text-error-500">*</span></Label>
        <Input {...register("technologyStack", { required: "Required" })} placeholder="e.g. React, .NET" error={!!errors.technologyStack} />
        <FieldError msg={errors.technologyStack?.message} />
      </div>
      <div className="md:col-span-2">
        <Label>Description <span className="text-error-500">*</span></Label>
        <textarea
          {...register("description", { required: "Required", minLength: { value: 20, message: "Min 20 chars" } })}
          rows={4}
          placeholder="Scope and goals..."
          className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none transition-colors border-gray-300 focus:border-brand-500 dark:border-gray-700 ${errors.description ? "border-red-400" : ""}`}
        />
        <FieldError msg={errors.description?.message} />
      </div>
    </div>
  );

  const step2 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Label>Manager Name <span className="text-error-500">*</span></Label>
        <Input {...register("managerName", { required: "Required" })} />
      </div>
      <div>
        <Label>Manager Email <span className="text-error-500">*</span></Label>
        <Input type="email" {...register("managerEmail", { required: "Required" })} />
      </div>
      <div>
        <Label>Manager Contact <span className="text-error-500">*</span></Label>
        <Input {...register("managerContact", { required: "Required" })} />
      </div>
      <div>
        <Label>Manager Email <span className="text-error-500">*</span></Label>
        <Input type="email" {...register("managerEmail", { required: "Required" })} />
      </div>
      <div>
          <Label>Manager Contact <span className="text-error-500">*</span></Label>
          <Input {...register("managerContact", { required: "Required" })} />
        </div>
    </div>
  );

  const step3 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div><Label>Client Name *</Label><Input {...register("clientName", { required: "Required" })} /></div>
      <div><Label>Client Manager Name *</Label><Input {...register("clientManagerName", { required: "Required" })} /></div>
      <div><Label>Client Manager Email *</Label><Input type="email" {...register("clientManagerEmail", { required: "Required" })} /></div>
      <div><Label>Client Manager Contact *</Label><Input {...register("clientManagerContact", { required: "Required" })} /></div>
    </div>
  );

  const step4 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Controller name="projectValue" control={control} rules={{ required: "Required" }} render={({ field }) => (
          <IndianAmountInput label="Project Value (₹) *" value={field.value} onChange={field.onChange} error={!!errors.projectValue} hint={errors.projectValue?.message} />
        )} />
      </div>
      <div><Label>Status *</Label>
        <Controller name="status" control={control} render={({ field }) => (
          <Select options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={field.value} onChange={field.onChange} />
        )} />
      </div>
      <div>
        <Controller name="startDate" control={control} rules={{ required: "Required" }} render={({ field }) => (
          <DatePicker id="start-date" label="Start Date *" value={field.value} onChange={(dates) => field.onChange(dates[0]?.toISOString().split("T")[0])} error={!!errors.startDate} hint={errors.startDate?.message} />
        )} />
      </div>
      <div>
        <Controller name="endDate" control={control} rules={{ required: "Required" }} render={({ field }) => (
          <DatePicker id="end-date" label="End Date *" value={field.value} onChange={(dates) => field.onChange(dates[0]?.toISOString().split("T")[0])} error={!!errors.endDate} hint={errors.endDate?.message} />
        )} />
      </div>

      <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Label>Managed By Partner *</Label>
        <Controller name="managedByPartnerId" control={control} render={({ field }) => (
          <LazySelect loadOptions={loadPartners} value={field.value ? String(field.value) : ""} onChange={(val) => field.onChange(Number(val))} />
        )} />
      </div>

      <div className="md:col-span-2 rounded-xl bg-gray-50 p-5 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-5">
          <div>
            <Label>Project Profile (Select User) <span className="text-error-500">*</span></Label>
            <Controller name="profileUserId" control={control} rules={{ required: "Selecting a profile user is mandatory" }} render={({ field }) => (
              <LazySelect loadOptions={loadAvailableUsers} value={field.value ? String(field.value) : ""} onChange={(val) => field.onChange(val ? Number(val) : null)} />
            )} />
            <FieldError msg={errors.profileUserId?.message} />
          </div>

          {selectedProfileUserId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-1 duration-200">
              <div>
                <Label>Is Profile Paid? *</Label>
                <Controller name="profileIsPaid" control={control} render={({ field }) => (
                  <Select options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} value={field.value} onChange={field.onChange} />
                )} />
              </div>
              <div>
                <Controller name="profileAmount" control={control} render={({ field }) => (
                  <IndianAmountInput label="Profile Amount (₹)" value={field.value} onChange={field.onChange} placeholder="Leave empty if not applicable" />
                )} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div><Label>Interviewing User (Opt)</Label>
        <Controller name="interviewingUserId" control={control} render={({ field }) => (
          <LazySelect loadOptions={loadAllUsers} value={field.value ? String(field.value) : ""} onChange={(val) => field.onChange(val || null)} />
        )} />
      </div>
    </div>
  );

  const steps = [
    { label: "Details", title: "Project Details", content: step1 },
    { label: "Manager", title: "Manager Info", content: step2 },
    { label: "Client", title: "Client Info", content: step3 },
    { label: "Config", title: "Configuration", content: step4 },
  ];

  return <MultiStepForm steps={steps} onValidate={handleValidate} onSubmit={handleSubmit(onSubmit)} submitLabel={submitting ? "Saving..." : "Save Project"} />;
}