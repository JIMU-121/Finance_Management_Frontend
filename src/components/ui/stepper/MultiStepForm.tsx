import { useState, FormEvent, ReactNode } from "react";
import Button from "../button/Button";
import { StepIndicator } from "./StepIndicator";

// ─── Types ───────────────────────────────────────────────────────────────────

export type StepDef = {
    /** Short label shown in the step indicator bar */
    label: string;
    /** Heading displayed above the step content */
    title: string;
    /** Optional sub-heading below the title */
    subtitle?: string;
    /** The form fields / content for this step */
    content: ReactNode;
};

export type MultiStepFormProps = {
    /** Step definitions — label, title, subtitle, content */
    steps: StepDef[];
    /**
     * Called when the user clicks "Next".
     * Return `true` to allow advancing, `false` to block (e.g. validation failed).
     * If omitted, navigation always proceeds.
     */
    onValidate?: (stepIndex: number) => Promise<boolean>;
    /**
     * Called via the native `<form onSubmit>` on the last step.
     * Wrap your react-hook-form handleSubmit here, e.g.:
     *   onSubmit={handleSubmit(yourHandler)}
     */
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    /** Label for the final submit button (default: "Submit") */
    submitLabel?: string;
    /** Extra class names for the outer form element */
    className?: string;
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Generic multi-step form shell.
 *
 * Manages step state, renders the StepIndicator, step title / subtitle,
 * step content, and Back / Next / Submit navigation.
 *
 * Usage:
 * ```tsx
 * <MultiStepForm
 *   steps={[
 *     {
 *       label: "Basics",
 *       title: "Basic Information",
 *       subtitle: "Tell us about the project.",
 *       content: <Step1 register={register} errors={errors} />,
 *     },
 *     // …more steps
 *   ]}
 *   onValidate={async (index) => {
 *     const fieldMap = [["Name", "Email"], ["Address"]];
 *     return await trigger(fieldMap[index]);
 *   }}
 *   onSubmit={handleSubmit(onSubmit)}
 *   submitLabel="Save"
 * />
 * ```
 */
export function MultiStepForm({
    steps,
    onValidate,
    onSubmit,
    submitLabel = "Submit",
    className = "",
}: MultiStepFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = steps.length;
    const isLastStep = currentStep === totalSteps;

    const handleNext = async () => {
        if (onValidate) {
            const valid = await onValidate(currentStep - 1); // 0-based index
            if (!valid) return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const { title, subtitle } = steps[currentStep - 1];

    return (
        <form
            onSubmit={onSubmit}
            className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-10 ${className}`}
        >
            {/* Step indicator */}
            <StepIndicator
                steps={steps.map((s) => s.label)}
                currentStep={currentStep}
            />

            {/* Step heading */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                )}
            </div>

            {/* Step content — mount all, show only current (preserves form state) */}
            {steps.map((step, i) => (
                <div
                    key={i}
                    className={currentStep === i + 1 ? "block space-y-5" : "hidden"}
                >
                    {step.content}
                </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className={currentStep === 1 ? "invisible" : ""}
                >
                    Back
                </Button>

                {isLastStep ? (
                    <Button type="submit" className="px-8 hover:bg-green-700 text-white">
                        {submitLabel}
                    </Button>
                ) : (
                    <Button type="button" onClick={handleNext} className="px-8">
                        Next Step
                    </Button>
                )}
            </div>
        </form>
    );
}
