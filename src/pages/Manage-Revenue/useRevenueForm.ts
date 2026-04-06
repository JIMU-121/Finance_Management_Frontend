import { useState, useEffect } from "react";
import { getAllPartners } from "../../features/users/partnerApi";
import { getAllProjects } from "../../features/projects/projectAPI";

export type RevenueFormState = {
  partnerId: number;
  projectId: number | null;
  amount: string;
  date: string;
  revenueFrom: boolean;
  notes: string;
};

export function useRevenueForm(initialState?: Partial<RevenueFormState>) {
  const [form, setForm] = useState<RevenueFormState>({
    partnerId: 0,
    projectId: null,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    revenueFrom: false,
    notes: "",
    ...initialState,
  });

  const [partners, setPartners] = useState<{ value: string; label: string }[]>([]);
  const [projects, setProjects] = useState<{ value: string; label: string; originalValue: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnersRes, projectsRes] = await Promise.all([
          getAllPartners(),
          getAllProjects()
        ]);
        const partnerOpts = (partnersRes || []).map((p: any) => ({
          value: String(p.id),
          label: `${p.user?.firstName} ${p.user?.lastName}`
        }));
        const projectList = (projectsRes as any).data || projectsRes || [];
        const projectOpts = [
          { value: "0", label: "None", originalValue: 0 },
          ...projectList.map((p: any) => ({
            value: String(p.id),
            label: p.name,
            originalValue: p.projectValue || 0,
          }))
        ];
        setPartners(partnerOpts);
        setProjects(projectOpts);
      } catch (err) {
        console.error("Failed to load options", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof RevenueFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmountChange = (e: any) => {
    let value = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    const formatted = value ? Number(value).toLocaleString("en-IN") : "";
    handleChange("amount", formatted);
  };

  const handleProjectChange = (val: string) => {
    const selectedId = val === "0" ? null : Number(val);
    handleChange("projectId", selectedId);

    if (!selectedId) {
      handleChange("amount", "");
      return;
    }
    const selectedProject = projects.find(p => p.value === val);
    if (selectedProject) {
      const monthlyAmount = selectedProject.originalValue / 12;
      handleChange("amount", monthlyAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 }));
    }
  };

  return { form, setForm, handleChange, handleAmountChange, handleProjectChange, partners, projects };
}
