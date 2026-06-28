import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types/tasks";
import { formatTaskPriority } from "@/types/tasks";

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        priority === "HIGH" && "bg-rose-100 text-rose-700 ring-rose-200",
        priority === "MEDIUM" && "bg-amber-100 text-amber-700 ring-amber-200",
        priority === "LOW" && "bg-emerald-100 text-emerald-700 ring-emerald-200",
      )}
    >
      {formatTaskPriority(priority)}
    </span>
  );
}