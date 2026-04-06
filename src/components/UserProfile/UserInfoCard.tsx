import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";
import { patchUser, getUserById, genderToEnum, genderFromEnum, GENDER_OPTIONS } from "../../features/users/userApi";
import { showSuccess, showError } from "../../utils/toast";
import { ProfileCard } from "./ProfileCard";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value || <span className="italic text-gray-400 dark:text-gray-600">Not provided</span>}
      </p>
    </div>
  );
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    mobileNumber: user?.mobileNumber ?? "",
    emergencyMobileNumber: user?.emergencyMobileNumber ?? "",
    gender: user?.gender !== undefined ? (genderFromEnum[user.gender] ?? "") : "",
  });
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      mobileNumber: user?.mobileNumber ?? "",
      emergencyMobileNumber: user?.emergencyMobileNumber ?? "",
      gender: user?.gender !== undefined ? (genderFromEnum[user.gender] ?? "") : "",
    });
    openModal();
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await patchUser(Number(user.id), {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        mobileNumber: form.mobileNumber,
        emergencyMobileNumber: form.emergencyMobileNumber,
        ...(form.gender !== "" && { gender: genderToEnum[form.gender] }),
      });
      const fresh = await getUserById(Number(user.id));
      updateUser(fresh as any);
      showSuccess("Profile updated successfully.");
      closeModal();
    } catch {
      showError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileCard
      title="Personal Information"
      onEdit={handleOpen}
      isOpen={isOpen}
      onClose={closeModal}
      onSave={handleSave}
      saving={saving}
      modalTitle="Edit Personal Information"
      modalSubtitle="Update your details to keep your profile up-to-date."
      modalChildren={
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>First Name</Label>
            <Input type="text" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Last Name</Label>
            <Input type="text" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Username</Label>
            <Input type="text" value={form.username} onChange={(e) => handleChange("username", e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Email Address</Label>
            <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Mobile Number</Label>
            <Input type="tel" value={form.mobileNumber} onChange={(e) => handleChange("mobileNumber", e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Emergency Mobile</Label>
            <Input type="tel" value={form.emergencyMobileNumber} onChange={(e) => handleChange("emergencyMobileNumber", e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Gender</Label>
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map(({ label }) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <InfoRow label="First Name" value={user?.firstName} />
        <InfoRow label="Last Name" value={user?.lastName} />
        <InfoRow label="Username" value={user?.username ? `@${user.username}` : null} />
        <InfoRow label="Email Address" value={user?.email} />
        <InfoRow label="Mobile Number" value={user?.mobileNumber} />
        <InfoRow label="Emergency Mobile" value={user?.emergencyMobileNumber} />
        <InfoRow label="Gender" value={user?.gender !== undefined ? (genderFromEnum[user.gender] ?? null) : null} />
      </div>
    </ProfileCard>
  );
}
