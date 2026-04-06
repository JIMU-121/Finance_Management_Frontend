import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { PlusIcon } from "../../icons";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

const COLORS = ["primary", "success", "error", "warning", "info", "light", "dark"] as const;

const BADGE_SECTIONS = [
  { title: "With Light Background", variant: "light" },
  { title: "With Solid Background", variant: "solid" },
  { title: "Light Background with Left Icon", variant: "light", iconPos: "start" },
  { title: "Solid Background with Left Icon", variant: "solid", iconPos: "start" },
  { title: "Light Background with Right Icon", variant: "light", iconPos: "end" },
  { title: "Solid Background with Right Icon", variant: "solid", iconPos: "end" },
] as const;

export default function Badges() {
  return (
    <div>
      <PageMeta
        title="React.js Badges Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Badges Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        {BADGE_SECTIONS.map((section, idx) => (
          <ComponentCard key={idx} title={section.title}>
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              {COLORS.map((color) => (
                <Badge
                  key={color}
                  variant={section.variant}
                  color={color}
                  startIcon={section.iconPos === "start" ? <PlusIcon /> : undefined}
                  endIcon={section.iconPos === "end" ? <PlusIcon /> : undefined}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Badge>
              ))}
            </div>
          </ComponentCard>
        ))}
      </div>
    </div>
  );
}
