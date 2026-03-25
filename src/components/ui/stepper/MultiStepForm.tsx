import { useState, FormEvent, ReactNode } from "react";

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
     * Called when the user clicks "Next" AND on last step before submit.
     * Return `true` to allow advancing, `false` to block (e.g. validation failed).
     * If omitted, navigation always proceeds.
     */
    onValidate?: (stepIndex: number) => Promise<boolean>;
    /**
     * Called after last-step validation passes.
     * Wrap your react-hook-form handleSubmit here.
     */
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    /** Label for the final submit button (default: "Submit") */
    submitLabel?: string;
    /** Extra class names for the outer wrapper */
    className?: string;
};

// ─── StepIndicator ───────────────────────────────────────────────────────────

type StepIndicatorProps = {
    steps: string[];
    currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    const total = steps.length;
    const progressPercent = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 0;

    return (
        <div className="mb-10 relative px-1">
            {/* Track */}
            <div className="absolute left-5 right-5 top-5 h-[2px] bg-gray-100 dark:bg-gray-800 z-0 hidden sm:block" />
            {/* Fill */}
            <div
                className="absolute left-5 top-5 h-[2px] bg-blue-600 z-0 hidden sm:block transition-all duration-500 ease-out"
                style={{ width: `calc(${progressPercent}% - ${progressPercent > 0 ? 2.5 : 0}rem)` }}
            />

            {/* Circles + Labels */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start relative z-10 gap-4 sm:gap-0">
                {steps.map((label, i) => {
                    const stepNumber = i + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep >= stepNumber;
                    const isCurrent = currentStep === stepNumber;

                    return (
                        <div key={i} className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:items-center">
                            {/* Circle */}
                            <div
                                className={`
                  w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
                  transition-all duration-300 select-none
                  ${isCompleted
                                        ? "bg-blue-600 text-white border-2 border-blue-600"
                                        : isActive
                                            ? "bg-white dark:bg-gray-900 text-blue-600 border-2 border-blue-600"
                                            : "bg-white dark:bg-gray-900 text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                                    }
                  ${isCurrent ? "shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" : ""}
                `}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-xs font-medium sm:text-center sm:max-w-[80px] transition-colors duration-300
                  ${isActive
                                        ? "text-gray-800 dark:text-gray-100"
                                        : "text-gray-400 dark:text-gray-500"
                                    }
                `}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── MultiStepForm ────────────────────────────────────────────────────────────

/**
 * Generic multi-step form shell.
 *
 * ✅ Fixes vs original:
 * 1. onValidate is also called on the last step BEFORE submit fires
 * 2. All steps stay mounted (hidden via CSS) — preserves RHF field state on Back navigation.
 *    Pass only the current step's field names to trigger() inside onValidate to avoid
 *    cross-step validation bleed.
 * 3. isAdvancing state disables Next/Submit during async validation to prevent
 *    double-click race conditions
 * 4. Consistent 0-based index passed to onValidate (currentStep - 1)
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
 *   ]}
 *   onValidate={async (index) => {
 *     const fieldMap = [["name", "email"], ["address"]];
 *     return await trigger(fieldMap[index]);
 *   }}
 *   onSubmit={handleSubmit(onFormSubmit)}
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
    const [isAdvancing, setIsAdvancing] = useState(false);
    const totalSteps = steps.length;
    const isLastStep = currentStep === totalSteps;

    // ── Next handler ─────────────────────────────────────────────────────────
    const handleNext = async () => {
        if (isAdvancing) return;
        setIsAdvancing(true);
        try {
            if (onValidate) {
                const valid = await onValidate(currentStep - 1); // 0-based index
                if (!valid) return;
            }
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        } finally {
            setIsAdvancing(false);
        }
    };

    // ── Back handler ─────────────────────────────────────────────────────────
    const handleBack = () => {
        if (isAdvancing) return;
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // ── Submit handler — validates last step THEN delegates to onSubmit ──────
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isAdvancing) return;
        setIsAdvancing(true);
        try {
            if (onValidate) {
                const valid = await onValidate(currentStep - 1); // validate last step
                if (!valid) return;
            }
            onSubmit(e); // delegate to caller (e.g. RHF handleSubmit)
        } finally {
            setIsAdvancing(false);
        }
    };

    const { title, subtitle } = steps[currentStep - 1];

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className={`
        rounded-2xl border border-gray-200 bg-white
        dark:border-gray-800 dark:bg-gray-950
        p-6 md:p-10 shadow-sm
        ${className}
      `}
        >
            {/* Step indicator */}
            <StepIndicator
                steps={steps.map((s) => s.label)}
                currentStep={currentStep}
            />

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800 mb-8" />

            {/* Step heading */}
            <div className="mb-7">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                )}
            </div>

            {/* Mount all steps, show only current — preserves RHF field state on back navigation */}
            {steps.map((step, i) => (
                <div
                    key={i}
                    className={currentStep === i + 1 ? "block space-y-5 min-h-[160px]" : "hidden"}
                >
                    {step.content}
                </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={isAdvancing}
                    className={`
            inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
            border border-gray-200 dark:border-gray-700
            text-gray-600 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-150
            ${currentStep === 1 ? "invisible pointer-events-none" : ""}
          `}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="flex items-center gap-3">
                    {/* Step counter pill */}
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tabular-nums">
                        {currentStep} / {totalSteps}
                    </span>

                    {isLastStep ? (
                        <button
                            type="submit"
                            disabled={isAdvancing}
                            className="
                inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium
                bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150
                shadow-sm shadow-blue-200 dark:shadow-none
              "
                        >
                            {isAdvancing ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    {submitLabel}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isAdvancing}
                            className="
                inline-flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium
                bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150
                shadow-sm shadow-blue-200 dark:shadow-none
              "
                        >
                            {isAdvancing ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Validating…
                                </>
                            ) : (
                                <>
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
