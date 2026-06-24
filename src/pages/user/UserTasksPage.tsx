import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { TaskTable } from "@/components/TaskTable";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { sampleTasks, type Task } from "@/data/sampleData";
import { PlusCircle } from "lucide-react";

export function UserTasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [view, setView] = useState<"card" | "table">("card");
  const [toDelete, setToDelete] = useState<Task | null>(null);

  const mine = sampleTasks.filter(
    (t) => t.assignedTo === "Normal User" || t.createdBy === "Normal User",
  );
  const filtered = useMemo(
    () =>
      mine.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) &&
          (status === "all" || t.status === status) &&
          (priority === "all" || t.priority === priority),
      ),
    [mine, search, status, priority],
  );

  return (
    <DashboardLayout role="user">
      <PageHeader
        title="My Tasks"
        description="Tasks assigned to or created by you."
        actions={
          <Button asChild>
            <Link to="/tasks/create">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Create Task
            </Link>
          </Button>
        }
      />
      <SearchAndFilterBar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        filters={[
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "All Status", value: "all" },
              { label: "Open", value: "Open" },
              { label: "In Progress", value: "In Progress" },
              { label: "Testing", value: "Testing" },
              { label: "Done", value: "Done" },
            ],
          },
          {
            label: "Priority",
            value: priority,
            onChange: setPriority,
            options: [
              { label: "All Priority", value: "all" },
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
            ],
          },
        ]}
      />
      {filtered.length === 0 ? (
        <EmptyState />
      ) : view === "card" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} onDelete={setToDelete} />
          ))}
        </div>
      ) : (
        <TaskTable tasks={filtered} onDelete={setToDelete} />
      )}
      <ConfirmDeleteModal
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        itemName={toDelete?.title}
        onConfirm={() => {
          toast.success("Task deleted (demo)");
          setToDelete(null);
        }}
      />
    </DashboardLayout>
  );
}
