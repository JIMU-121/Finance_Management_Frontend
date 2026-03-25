import { ReactNode } from "react";
import Button from "../button/Button";

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  /** Content of the modal body */
  children: ReactNode;
  /** Footer action buttons. If omitted, a default Cancel is rendered. */
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  saving?: boolean;
  onSave?: () => void;
  saveLabel?: string;
}

const MAX_WIDTH: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth = "lg",
  saving,
  onSave,
  saveLabel = "Save Changes",
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`relative z-10 mx-4 w-full ${MAX_WIDTH[maxWidth]} rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        <div className="flex flex-shrink-0 justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          {footer ?? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {onSave && (
                <Button
                  onClick={onSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={saving}
                >
                  {saving ? "Saving..." : saveLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
