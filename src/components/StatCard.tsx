import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "bg-primary/10 text-primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tint?: string;
}) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl grid place-items-center ${tint}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
      </div>
    </Card>
  );
}
