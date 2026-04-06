import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";
import { patchUser, getUserById } from "../../features/users/userApi";
import { showSuccess, showError } from "../../utils/toast";
import { ProfileCard } from "./ProfileCard";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, role, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    username: user?.username ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
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

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const isActive = user?.isActive !== false;

  return (
    <ProfileCard
      onEdit={handleOpen}
      isOpen={isOpen}
      onClose={closeModal}
      onSave={handleSave}
      saving={saving}
      modalTitle="Edit Profile"
      modalSubtitle="Update your display name and username."
      modalMaxWidth="max-w-[700px]"
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
          <div className="col-span-2">
            <Label>Username</Label>
            <Input type="text" value={form.username} onChange={(e) => handleChange("username", e.target.value)} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
        <div className="flex items-center justify-center w-20 h-20 text-xl font-bold text-white rounded-full bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-900 shrink-0">
          {initials}
        </div>
        <div className="order-3 xl:order-2">
          <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
            {displayName}
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-start">
            {role && (
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                {role}
              </span>
            )}
            {user?.username && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                @{user.username}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive
                ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"
                }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success-500" : "bg-error-500"}`} />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </ProfileCard>
  );
}
