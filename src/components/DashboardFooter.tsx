import { CheckSquare } from "lucide-react";

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t pt-5 text-xs text-muted-foreground">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          <span>
            © {year} FlowTask. Task Management System.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>CRUD Tasks</span>
          <span>Role Based Access</span>
          <span>Team Workflow</span>
        </div>
      </div>
    </footer>
  );
}
