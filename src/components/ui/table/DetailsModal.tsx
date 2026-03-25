import { DetailField } from "./DataTable";

interface DetailsModalProps<T extends { id: number }> {
    row: T;
    fields: DetailField<T>[];
    title?: string;
    onClose: () => void;
}

export function DetailsModal<T extends { id: number }>({
    row,
    fields,
    title,
    onClose,
}: DetailsModalProps<T>) {
    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title ?? "Details"}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Full record details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
                {/* Body */}
                <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        {fields.map(({ label, render }) => (
                            <div
                                key={label}
                                className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/60"
                            >
                                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    {label}
                                </dt>
                                <dd className="mt-1 break-words text-sm font-semibold text-gray-800 dark:text-white">
                                    {String(render(row))}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
