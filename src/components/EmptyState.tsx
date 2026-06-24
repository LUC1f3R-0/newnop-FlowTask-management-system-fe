import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or create something new.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="text-center py-16 border border-dashed rounded-xl">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted grid place-items-center">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
