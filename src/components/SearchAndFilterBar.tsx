import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterDef {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}

export function SearchAndFilterBar({
  search,
  onSearchChange,
  filters = [],
  view,
  onViewChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  filters?: FilterDef[];
  view?: "table" | "card";
  onViewChange?: (v: "table" | "card") => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-5">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Select key={f.label} value={f.value} onValueChange={f.onChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {onViewChange && (
          <div className="inline-flex rounded-md border bg-background p-0.5">
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8", view === "table" && "bg-muted")}
              onClick={() => onViewChange("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8", view === "card" && "bg-muted")}
              onClick={() => onViewChange("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
