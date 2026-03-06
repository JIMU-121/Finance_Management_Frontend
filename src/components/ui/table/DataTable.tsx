import { useState, ReactNode } from "react";
import { ConfirmModal } from "../modal/ConfirmModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnDef<T> = {
    /** Column header label */
    header: string;
    /** Key of the row object OR a custom render function */
    accessor?: keyof T;
    render?: (row: T) => ReactNode;
    /** Extra td class names */
    className?: string;
};

export type DetailField<T> = {
    label: string;
    render: (row: T) => string | number;
};

export type StatusConfig<T> = {
    /** Return true = "active" (green), false = "inactive" (red) */
    isActive: (row: T) => boolean;
    activeLabel?: string;
    inactiveLabel?: string;
};

export type DataTableProps<T extends { id: number }> = {
    /** Rows to display */
    data: T[];
    /** Column definitions (excluding the Actions column) */
    columns: ColumnDef<T>[];
    /** Fields shown inside the Details modal */
    detailFields?: DetailField<T>[];
    /** Called when Delete is confirmed — receives the row id */
    onDelete?: (id: number) => void;
    /** Called when Edit icon is clicked */
    onEdit?: (row: T) => void;
    /** Search placeholder text */
    searchPlaceholder?: string;
    /** Keys to search across */
    searchKeys?: (keyof T)[];
    /** Table title shown in toolbar */
    title?: string;
    /** Hide the details icon */
    hideDetails?: boolean;
    /** Hide the edit icon */
    hideEdit?: boolean;
    /** Hide the delete icon */
    hideDelete?: boolean;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailsModal<T extends { id: number }>({
    row,
    fields,
    title,
    onClose,
}: {
    row: T;
    fields: DetailField<T>[];
    title?: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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


// ─── Main DataTable ───────────────────────────────────────────────────────────

export function DataTable<T extends { id: number }>({
    data,
    columns,
    detailFields,
    onDelete,
    onEdit,
    searchPlaceholder = "Search...",
    searchKeys = [],
    title = "Records",
    hideDetails = false,
    hideEdit = false,
    hideDelete = false,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [detailRow, setDetailRow] = useState<T | null>(null);
    const [deleteRow, setDeleteRow] = useState<T | null>(null);

    // ── Filter ──────────────────────────────────────────────────────────────────
    const filtered = data.filter((row) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return searchKeys.some((key) =>
            String(row[key] ?? "")
                .toLowerCase()
                .includes(q)
        );
    });

    const handleConfirmDelete = () => {
        if (!deleteRow) return;
        onDelete?.(deleteRow.id);
        setDeleteRow(null);
    };

    const showActions = !hideDetails || !hideEdit || !hideDelete;

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {/* ── Toolbar ── */}
                <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-full rounded-lg border border-gray-300 bg-transparent pl-9 pr-4 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-white/90 dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                                <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    #
                                </th>
                                {columns.map((col) => (
                                    <th
                                        key={col.header}
                                        className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                    >
                                        {col.header}
                                    </th>
                                ))}
                                {showActions && (
                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (showActions ? 2 : 1)}
                                        className="py-12 text-center text-gray-400 dark:text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row, idx) => (
                                    <tr
                                        key={row.id}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                    >
                                        {/* Row number */}
                                        <td className="whitespace-nowrap px-5 py-3.5 text-gray-400 dark:text-gray-500">
                                            {idx + 1}
                                        </td>
                                        {/* Data columns */}
                                        {columns.map((col) => (
                                            <td
                                                key={col.header}
                                                className={`px-5 py-3.5 text-gray-700 dark:text-gray-300 ${col.className ?? ""}`}
                                            >
                                                {col.render
                                                    ? col.render(row)
                                                    : col.accessor
                                                        ? String(row[col.accessor] ?? "—")
                                                        : "—"}
                                            </td>
                                        ))}
                                        {/* Actions */}
                                        {showActions && (
                                            <td className="whitespace-nowrap px-5 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    {/* Details */}
                                                    {!hideDetails && detailFields && (
                                                        <button
                                                            onClick={() => setDetailRow(row)}
                                                            title="View Details"
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                                        >
                                                            <svg
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {/* Edit */}
                                                    {!hideEdit && (
                                                        <button
                                                            onClick={() => onEdit?.(row)}
                                                            title="Edit"
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                                                        >
                                                            <svg
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.586 2.586a2 2 0 012.828 2.828L12 14.828l-4 1 1-4 9.586-9.242z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {/* Delete */}
                                                    {!hideDelete && (
                                                        <button
                                                            onClick={() => setDeleteRow(row)}
                                                            title="Delete"
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                        >
                                                            <svg
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modals ── */}
            {detailRow && detailFields && (
                <DetailsModal
                    row={detailRow}
                    fields={detailFields}
                    onClose={() => setDetailRow(null)}
                />
            )}
            <ConfirmModal
                isOpen={!!deleteRow}
                title="Confirm Delete"
                subtitle="This action cannot be undone."
                message={
                    deleteRow
                        ? <>Are you sure you want to delete <strong>"{String(deleteRow.id)}"</strong>? All data will be permanently removed.</>
                        : undefined
                }
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onClose={() => setDeleteRow(null)}
            />
        </>
    );
}
