// ─── Types ───────────────────────────────────────────────────────────────────

export type StepIndicatorProps = {
    /** Labels for each step, e.g. ["Project Details", "Manager Info", ...] */
    steps: string[];
    /** 1-based index of the currently active step */
    currentStep: number;
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A horizontal (responsive: vertical on mobile) multi-step progress indicator.
 *
 * Usage:
 *   <StepIndicator
 *     steps={["Project Details", "Manager Info", "Client Info", "Additional Details"]}
 *     currentStep={step}
 *   />
 */
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    const total = steps.length;
    // Progress bar fills proportionally between the first and last circle centres
    const progressPercent = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 0;

    return (
        <div className="mb-10 relative">
            {/* Track */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 z-0 hidden sm:block rounded-full" />

            {/* Fill */}
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 hidden sm:block transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
            />

            {/* Step circles + labels */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4 sm:gap-0">
                {steps.map((label, i) => {
                    const stepNumber = i + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep >= stepNumber;
                    const isCurrent = currentStep === stepNumber;

                    return (
                        <div key={i} className="flex items-center sm:flex-col gap-3 sm:gap-2">
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300
                                    ${isActive
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                                    }
                                    ${isCurrent ? "ring-4 ring-blue-600/20" : ""}
                                `}
                            >
                                {isCompleted ? (
                                    /* Check mark for completed steps */
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-sm font-semibold ${isActive
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
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
