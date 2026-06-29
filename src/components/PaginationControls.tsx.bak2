import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1 && total <= limit) return null;

  const safePage = Math.max(page, 1);
  const safeTotalPages = Math.max(totalPages, 1);
  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

  return (
    <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
      <div className="text-muted-foreground">
        Showing {start}-{end} of {total} tasks
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          Previous
        </Button>

        <span className="px-2 text-muted-foreground">
          Page {safePage} of {safeTotalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage >= safeTotalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
