import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate } from "react-router";

import { registerUser } from "../../features/users/userApi";
import { createPartner } from "../../features/users/partnerApi";

function AddPartner() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [partnershipType, setPartnershipType] = useState("");
  const [sharePercentage, setSharePercentage] = useState("");
  const [branchId, setBranchId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      showError("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 1: Create User
      const userRes: any = await registerUser({
        firstName,
        lastName,
        email,
        password,
        role: 2, // 👈 Partner role
      });

      // ⚠️ Adjust based on your API response structure
      const userId =
        userRes?.data?.id ||
        userRes?.id ||
        userRes?.data?.userId;

      if (!userId) {
        throw new Error("User ID not found after registration");
      }

      // ✅ Step 2: Create Partner
      await createPartner({
        userId,
        partnershipType,
        sharePercentage: Number(sharePercentage) || 0,
        branchId: Number(branchId) || 1,
        isMainPartner: false,
      });

      showSuccess("Partner added successfully 🚀");

      navigate("/manage-partner");

    } catch (err: any) {
      console.error(err);
      showError(err?.response?.data?.message || "Failed to add partner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="Add Partner" description="Create new partner" />
      <PageBreadcrumb pageTitle="Add Partner" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Add New Partner
          </h2>

          <Button variant="outline" onClick={() => navigate("/manage-partner")}>
            Back
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <Label>First Name *</Label>
              <Input value={firstName} onChange={(e: any) => setFirstName(e.target.value)} />
            </div>

            <div>
              <Label>Last Name *</Label>
              <Input value={lastName} onChange={(e: any) => setLastName(e.target.value)} />
            </div>

            <div>
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
            </div>

            <div>
              <Label>Password *</Label>
              <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
            </div>

            <div>
              <Label>Partnership Type</Label>
              <Input value={partnershipType} onChange={(e: any) => setPartnershipType(e.target.value)} />
            </div>

            <div>
              <Label>Share %</Label>
              <Input type="number" value={sharePercentage} onChange={(e: any) => setSharePercentage(e.target.value)} />
            </div>

            <div>
              <Label>Branch ID</Label>
              <Input type="number" value={branchId} onChange={(e: any) => setBranchId(e.target.value)} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => navigate("/manage-partner")}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Partner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPartner;