import { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ConfirmModalVariant = "danger" | "warning" | "info";

export type ConfirmModalProps = {
    /** Whether the modal is visible */
    isOpen: boolean;
    /** Modal heading */
    title?: string;
    /** Sub-heading under the title */
    subtitle?: string;
    /** Main body message — supports a ReactNode for rich content */
    message?: ReactNode;
    /** Confirm button label (default: "Confirm") */
    confirmLabel?: string;
    /** Cancel button label (default: "Cancel") */
    cancelLabel?: string;
    /** Controls icon & confirm button colour scheme */
    variant?: ConfirmModalVariant;
    /** Called when the user clicks the confirm button */
    onConfirm: () => void;
    /** Called when the user cancels / closes the modal */
    onClose: () => void;
};

// ─── Variant helpers ─────────────────────────────────────────────────────────

type VariantStyle = {
    iconBg: string;
    iconColor: string;
    btnClass: string;
    icon: ReactNode;
};

function getVariantStyle(variant: ConfirmModalVariant): VariantStyle {
    switch (variant) {
        case "warning":
            return {
                iconBg: "bg-amber-100 dark:bg-amber-900/30",
                iconColor: "text-amber-500 dark:text-amber-400",
                btnClass:
                    "bg-amber-500 hover:bg-amber-600 text-white",
                icon: (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                    </svg>
                ),
            };
        case "info":
            return {
                iconBg: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600 dark:text-blue-400",
                btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
                icon: (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                        />
                    </svg>
                ),
            };
        // "danger" is the default
        default:
            return {
                iconBg: "bg-red-100 dark:bg-red-900/30",
                iconColor: "text-red-600 dark:text-red-400",
                btnClass: "bg-red-600 hover:bg-red-700 text-white",
                icon: (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                    </svg>
                ),
            };
    }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Generic confirmation modal.
 *
 * Usage examples:
 *
 * // Delete confirmation
 * <ConfirmModal
 *   isOpen={!!deleteTarget}
 *   title="Confirm Delete"
 *   subtitle="This action cannot be undone."
 *   message={<>Are you sure you want to delete <strong>"{name}"</strong>?</>}
 *   confirmLabel="Delete"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onClose={() => setDeleteTarget(null)}
 * />
 *
 * // Logout confirmation
 * <ConfirmModal
 *   isOpen={showLogout}
 *   title="Sign Out"
 *   subtitle="You will be returned to the login screen."
 *   message="Are you sure you want to sign out of your account?"
 *   confirmLabel="Sign Out"
 *   variant="warning"
 *   onConfirm={handleLogout}
 *   onClose={() => setShowLogout(false)}
 * />
 */
export function ConfirmModal({
    isOpen,
    title = "Are you sure?",
    subtitle = "This action cannot be undone.",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const { iconBg, iconColor, btnClass, icon } = getVariantStyle(variant);

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                {/* Icon + Title */}
                <div className="mb-4 flex items-center gap-4">
                    <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
                    >
                        <span className={iconColor}>{icon}</span>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Body message */}
                {message && (
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                        {message}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${btnClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
