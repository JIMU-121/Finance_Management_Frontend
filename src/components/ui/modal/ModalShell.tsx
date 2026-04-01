import { ReactNode } from "react";
import Button from "../button/Button";

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  /** Content of the modal body */
  children: ReactNode;
  /** Footer action buttons. If omitted, a default Cancel + Save is rendered. */
  footer?: ReactNode;
  /** Kept for API compatibility but no longer affects layout (always full-screen). */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  saving?: boolean;
  onSave?: () => void;
  saveLabel?: string;
  hideFooter?: boolean;
}

export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
  saving,
  onSave,
  saveLabel = "Save Changes",
  hideFooter = false,
}: ModalShellProps) {
  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-[100000] flex flex-col bg-white dark:bg-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
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

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
          {children}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      {!hideFooter && (
        <div className="flex flex-shrink-0 justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          {footer ?? (
            <>
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              {onSave && (
                <Button
                  onClick={onSave}
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={saving}
                >
                  {saving ? "Saving..." : saveLabel}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
