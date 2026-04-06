import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";
import { patchUser, getUserById } from "../../features/users/userApi";
import { showSuccess, showError } from "../../utils/toast";
import { ProfileCard } from "./ProfileCard";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, role, updateUser } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    openModal();
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!form.newPassword) {
      showError("New password cannot be empty.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await patchUser(Number(user.id), { password: form.newPassword });
      const fresh = await getUserById(Number(user.id));
      updateUser(fresh as any);
      showSuccess("Password updated successfully.");
      closeModal();
    } catch {
      showError("Failed to update password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isActive = user?.isActive !== false;

  return (
    <ProfileCard
      title="Account &amp; Security"
      onEdit={handleOpen}
      isOpen={isOpen}
      onClose={closeModal}
      onSave={handleSave}
      saving={saving}
      modalTitle="Change Password"
      modalSubtitle="For your security, use a strong password."
      modalMaxWidth="max-w-[500px]"
      saveLabel="Update Password"
      modalChildren={
        <div className="space-y-5">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
            />
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
            />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Re-enter new password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {role || <span className="italic text-gray-400">Not assigned</span>}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Account Status</p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${isActive
              ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
              : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"
              }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success-500" : "bg-error-500"}`} />
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.email || <span className="italic text-gray-400">Not provided</span>}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Password</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">••••••••</p>
        </div>
      </div>
    </ProfileCard>
  );
}
