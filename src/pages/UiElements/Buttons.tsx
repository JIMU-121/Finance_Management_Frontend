import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "../../icons";

const BUTTON_SECTIONS = [
  { title: "Primary Button", variant: "primary" },
  { title: "Primary Button with Left Icon", variant: "primary", iconPos: "start" },
  { title: "Primary Button with Right Icon", variant: "primary", iconPos: "end" },
  { title: "Secondary Button", variant: "outline" },
  { title: "Outline Button with Left Icon", variant: "outline", iconPos: "start" },
  { title: "Outline Button with Right Icon", variant: "outline", iconPos: "end" },
] as const;

export default function Buttons() {
  return (
    <div>
      <PageMeta
        title="React.js Buttons Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Buttons Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Buttons" />
      <div className="space-y-5 sm:space-y-6">
        {BUTTON_SECTIONS.map((section, idx) => (
          <ComponentCard key={idx} title={section.title}>
            <div className="flex items-center gap-5">
              {(["sm", "md"] as const).map((size) => (
                <Button
                  key={size}
                  size={size}
                  variant={section.variant}
                  startIcon={section.iconPos === "start" ? <BoxIcon className="size-5" /> : undefined}
                  endIcon={section.iconPos === "end" ? <BoxIcon className="size-5" /> : undefined}
                >
                  Button Text
                </Button>
              ))}
            </div>
          </ComponentCard>
        ))}
      </div>
    </div>
  );
}
