import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/data/sampleData";

const styles: Record<TaskPriority, string> = {
  Low: "bg-slate-100 text-slate-700 ring-slate-200",
  Medium: "bg-blue-100 text-blue-700 ring-blue-200",
  High: "bg-rose-100 text-rose-700 ring-rose-200",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
}
