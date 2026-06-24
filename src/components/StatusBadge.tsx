import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/data/sampleData";

const styles: Record<TaskStatus, string> = {
  Open: "bg-sky-100 text-sky-700 ring-sky-200",
  "In Progress": "bg-amber-100 text-amber-700 ring-amber-200",
  Testing: "bg-violet-100 text-violet-700 ring-violet-200",
  Done: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
