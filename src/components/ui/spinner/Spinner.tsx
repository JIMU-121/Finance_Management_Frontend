type SpinnerSize = "sm" | "md" | "lg";
type SpinnerColor = "blue" | "white" | "gray";

interface SpinnerProps {
    size?: SpinnerSize;
    color?: SpinnerColor;
    label?: string;
    className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
};

const colorMap: Record<SpinnerColor, string> = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-400",
};

export default function Spinner({
    size = "md",
    color = "blue",
    label,
    className = "",
}: SpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <svg
                className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`}
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                />
            </svg>

            {label && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            )}
        </div>
    );
}
