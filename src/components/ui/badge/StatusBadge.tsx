export default function StatusBadge({ status }: { status: string }) {
  const isActive = status?.toLowerCase() === "active";
  const isCompleted = status?.toLowerCase() === "completed";
  const color = isActive
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    : isCompleted
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  const dot = isActive ? "bg-green-500" : isCompleted ? "bg-blue-500" : "bg-amber-500";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status || "Unknown"}
    </span>
  );
}
