import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/tasks";
import { formatTaskStatus } from "@/types/tasks";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        status === "TODO" && "bg-sky-100 text-sky-700 ring-sky-200",
        status === "IN_PROGRESS" && "bg-amber-100 text-amber-700 ring-amber-200",
        status === "COMPLETED" && "bg-emerald-100 text-emerald-700 ring-emerald-200",
      )}
    >
      {formatTaskStatus(status)}
    </span>
  );
}