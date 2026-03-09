import { useForm, Controller } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Switch from "../../components/form/switch/Switch";
import { MultiStepForm } from "../../components/ui/stepper/MultiStepForm";

// ─── Form types ───────────────────────────────────────────────────────────────

type FormValues = {
  Name: string;
  TechnologyStack: string;
  Description: string;

  ManagerName: string;
  ManagerEmail: string;
  Contact: string;

  LeaveApply: number;
  IsSmooth: boolean;

  ClientName: string;
  ClientManagerEmail: string;
  ClientManagerContact: string;
  ClientManagerName: string;

  ProjectValue: number;
  StartDate: string;
  EndDate: string;

  PartnerID: number;
  ProfileID: number;
  InterviewingUserID: number;

  MobileNumberUsed: number;
  IsToolUsed: boolean;
};

// ─── Shared select styling ────────────────────────────────────────────────────

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90";

const ChevronIcon = () => (
  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
    <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </span>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddProject() {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: false,
    mode: "onChange",
    defaultValues: { IsSmooth: false, IsToolUsed: false },
  });

  // Per-step field lists for validation (0-based index matches onValidate param)
  const stepFields: (keyof FormValues)[][] = [
    ["Name", "TechnologyStack", "Description"],
    ["ManagerName", "ManagerEmail", "Contact"],
    ["ClientName", "ClientManagerName", "ClientManagerEmail", "ClientManagerContact"],
    ["ProjectValue", "LeaveApply", "StartDate", "EndDate", "PartnerID", "ProfileID", "InterviewingUserID", "MobileNumberUsed"],
  ];

  const handleValidate = async (stepIndex: number) => trigger(stepFields[stepIndex]);

  const onSubmit = (data: FormValues) => {
    console.log("Project Data:", data);
  };

  // ─── Step content ───────────────────────────────────────────────────────────

  const step1 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Label>Project Name <span className="text-red-500">*</span></Label>
        <Input {...register("Name", { required: "Project name is required" })} />
        {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name.message}</p>}
      </div>

      <div>
        <Label>Technology Stack <span className="text-red-500">*</span></Label>
        <Input {...register("TechnologyStack", { required: "Technology stack is required" })} placeholder="e.g. React, Node.js, MongoDB" />
        {errors.TechnologyStack && <p className="text-red-500 text-sm mt-1">{errors.TechnologyStack.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Label>Description <span className="text-red-500">*</span></Label>
        <textarea
          {...register("Description", {
            required: "Project description is required",
            minLength: { value: 20, message: "Description must be at least 20 characters long" },
          })}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90"
          rows={4}
          placeholder="Describe the project..."
        />
        {errors.Description && <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>}
      </div>
    </div>
  );

  const step2 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Label>Manager Name <span className="text-red-500">*</span></Label>
        <Input {...register("ManagerName", { required: "Manager name is required" })} />
        {errors.ManagerName && <p className="text-red-500 text-sm mt-1">{errors.ManagerName.message}</p>}
      </div>

      <div>
        <Label>Manager Email <span className="text-red-500">*</span></Label>
        <Input
          type="email"
          {...register("ManagerEmail", {
            required: "Manager email is required",
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
          })}
          placeholder="manager@example.com"
        />
        {errors.ManagerEmail && <p className="text-red-500 text-sm mt-1">{errors.ManagerEmail.message}</p>}
      </div>

      <div>
        <Label>Manager Contact <span className="text-red-500">*</span></Label>
        <Input
          {...register("Contact", {
            required: "Contact number is required",
            pattern: { value: /^[0-9+\-()\s]+$/, message: "Invalid contact number format" },
          })}
          placeholder="+1 (555) 000-0000"
        />
        {errors.Contact && <p className="text-red-500 text-sm mt-1">{errors.Contact.message}</p>}
      </div>
    </div>
  );

  const step3 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Label>Client Name <span className="text-red-500">*</span></Label>
        <Input {...register("ClientName", { required: "Client name is required" })} />
        {errors.ClientName && <p className="text-red-500 text-sm mt-1">{errors.ClientName.message}</p>}
      </div>

      <div>
        <Label>Client Manager Name <span className="text-red-500">*</span></Label>
        <Input {...register("ClientManagerName", { required: "Client manager name is required" })} />
        {errors.ClientManagerName && <p className="text-red-500 text-sm mt-1">{errors.ClientManagerName.message}</p>}
      </div>

      <div>
        <Label>Client Manager Email <span className="text-red-500">*</span></Label>
        <Input
          type="email"
          {...register("ClientManagerEmail", {
            required: "Client manager email is required",
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
          })}
        />
        {errors.ClientManagerEmail && <p className="text-red-500 text-sm mt-1">{errors.ClientManagerEmail.message}</p>}
      </div>

      <div>
        <Label>Client Manager Contact <span className="text-red-500">*</span></Label>
        <Input
          {...register("ClientManagerContact", {
            required: "Client manager contact is required",
            pattern: { value: /^[0-9+\-()\s]+$/, message: "Invalid contact number format" },
          })}
        />
        {errors.ClientManagerContact && <p className="text-red-500 text-sm mt-1">{errors.ClientManagerContact.message}</p>}
      </div>
    </div>
  );

  const step4 = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Label>Project Value ($) <span className="text-red-500">*</span></Label>
        <Input
          type="number"
          {...register("ProjectValue", {
            required: "Project value is required",
            min: { value: 0, message: "Project value cannot be negative" },
          })}
        />
        {errors.ProjectValue && <p className="text-red-500 text-sm mt-1">{errors.ProjectValue.message}</p>}
      </div>

      <div className="md:row-span-2">
        <Label>Leave Apply <span className="text-red-500">*</span></Label>
        <textarea
          {...register("LeaveApply", { required: "Leave apply details are required" })}
          className="w-full h-[calc(100%-2rem)] min-h-[110px] rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90"
          placeholder="Enter leave apply instructions or details..."
        />
        {errors.LeaveApply && <p className="text-red-500 text-sm mt-1">{errors.LeaveApply.message}</p>}
      </div>

      <div>
        <Label>Start Date <span className="text-red-500">*</span></Label>
        <Input type="datetime-local" {...register("StartDate", { required: "Start date is required" })} />
        {errors.StartDate && <p className="text-red-500 text-sm mt-1">{errors.StartDate.message}</p>}
      </div>

      <div>
        <Label>End Date <span className="text-red-500">*</span></Label>
        <Input type="datetime-local" {...register("EndDate", { required: "End date is required" })} />
        {errors.EndDate && <p className="text-red-500 text-sm mt-1">{errors.EndDate.message}</p>}
      </div>

      <div>
        <Label>Partner ID <span className="text-red-500">*</span></Label>
        <div className="relative">
          <select defaultValue="" {...register("PartnerID", { required: "Partner ID is required" })} className={selectClass}>
            <option value="" disabled className="text-gray-500 dark:bg-gray-900">Select Partner</option>
            <option value="1" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Partner A</option>
            <option value="2" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Partner B</option>
          </select>
          <ChevronIcon />
        </div>
        {errors.PartnerID && <p className="text-red-500 text-sm mt-1">{errors.PartnerID.message}</p>}
      </div>

      <div>
        <Label>Profile ID <span className="text-red-500">*</span></Label>
        <div className="relative">
          <select defaultValue="" {...register("ProfileID", { required: "Profile ID is required" })} className={selectClass}>
            <option value="" disabled className="text-gray-500 dark:bg-gray-900">Select Profile</option>
            <option value="1" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Profile X</option>
            <option value="2" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Profile Y</option>
          </select>
          <ChevronIcon />
        </div>
        {errors.ProfileID && <p className="text-red-500 text-sm mt-1">{errors.ProfileID.message}</p>}
      </div>

      <div>
        <Label>Interviewing User ID <span className="text-red-500">*</span></Label>
        <div className="relative">
          <select defaultValue="" {...register("InterviewingUserID", { required: "Interviewing User is required" })} className={selectClass}>
            <option value="" disabled className="text-gray-500 dark:bg-gray-900">Select Interviewer</option>
            <option value="1" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Interviewer 1</option>
            <option value="2" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Interviewer 2</option>
          </select>
          <ChevronIcon />
        </div>
        {errors.InterviewingUserID && <p className="text-red-500 text-sm mt-1">{errors.InterviewingUserID.message}</p>}
      </div>

      <div>
        <Label>Mobile Number Used <span className="text-red-500">*</span></Label>
        <Input
          type="number"
          {...register("MobileNumberUsed", {
            required: "Mobile number is required",
            pattern: { value: /^[0-9]+$/, message: "Invalid mobile number" },
          })}
        />
        {errors.MobileNumberUsed && <p className="text-red-500 text-sm mt-1">{errors.MobileNumberUsed.message}</p>}
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <Controller
          name="IsToolUsed"
          control={control}
          render={({ field }) => (
            <Switch label="Is Tool Used?" defaultChecked={field.value} onChange={field.onChange} />
          )}
        />
        <Controller
          name="IsSmooth"
          control={control}
          render={({ field }) => (
            <Switch label="Is Setup Smooth?" defaultChecked={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );

  // ─── Step definitions passed to MultiStepForm ───────────────────────────────

  const steps = [
    {
      label: "Project Details",
      title: "Project Details",
      subtitle: "Fill out the required information to proceed to the next step.",
      content: step1,
    },
    {
      label: "Manager Information",
      title: "Manager Information",
      subtitle: "Fill out the required information to proceed to the next step.",
      content: step2,
    },
    {
      label: "Client Information",
      title: "Client Information",
      subtitle: "Fill out the required information to proceed to the next step.",
      content: step3,
    },
    {
      label: "Additional Details",
      title: "Additional Details",
      subtitle: "Fill out the required information to proceed to the next step.",
      content: step4,
    },
  ];

  return (
    <div>
      <PageMeta title="Add Project" description="Add Project" />
      <PageBreadcrumb pageTitle="Add Project" />

      <div className="max-w-4xl mx-auto">
        <MultiStepForm
          steps={steps} 
          onValidate={handleValidate}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel="Save Project"
        />
      </div>
    </div>
  );
}