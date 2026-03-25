export const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-pink-500",
];

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-10 w-10 text-sm",
};

// ─── Variant 1: firstName + lastName props (used in manage pages) ──────────────
interface FirstLastProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Color class override. Defaults to bg-blue-600. */
  colorClass?: string;
}

export function InitialAvatar({
  firstName,
  lastName,
  size = "md",
  className = "",
  colorClass = "bg-blue-600",
}: FirstLastProps) {
  const first = firstName?.[0]?.toUpperCase() ?? "?";
  const last = lastName?.[0]?.toUpperCase() ?? "";

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white ${SIZE_CLASSES[size]} ${colorClass} ${className}`}
    >
      {first}
      {last}
    </div>
  );
}

// ─── Variant 2: Legacy full-name + index (used in ViewProject employee lists) ──
export default function InitialAvatarNamed({
  name,
  index,
}: {
  name?: string | null;
  index: number;
}) {
  let safeName = (name ?? "Unknown Employee").trim();
  safeName = safeName.replace(/(^|\s)null(\s|$)/gi, " ").trim();
  if (!safeName) safeName = "Unknown Employee";

  const parts = safeName.split(" ").filter(Boolean);
  const initials = (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <span
      title={safeName}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white dark:ring-gray-900 ${color}`}
    >
      {initials.toUpperCase()}
    </span>
  );
}
