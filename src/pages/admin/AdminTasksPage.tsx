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
import { sampleTasks, sampleUsers, type Task } from "@/data/sampleData";
import { PlusCircle } from "lucide-react";

export function AdminTasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [assigned, setAssigned] = useState("all");
  const [creator, setCreator] = useState("all");
  const [view, setView] = useState<"table" | "card">("table");
  const [toDelete, setToDelete] = useState<Task | null>(null);

  const userOpts = [
    { label: "All Users", value: "all" },
    ...sampleUsers.map((u) => ({ label: u.name, value: u.name })),
  ];

  const filtered = useMemo(
    () =>
      sampleTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) &&
          (status === "all" || t.status === status) &&
          (priority === "all" || t.priority === priority) &&
          (assigned === "all" || t.assignedTo === assigned) &&
          (creator === "all" || t.createdBy === creator),
      ),
    [search, status, priority, assigned, creator],
  );

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="All Tasks"
        description="Manage every task across the team."
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
          {
            label: "Assigned",
            value: assigned,
            onChange: setAssigned,
            options: userOpts,
          },
          {
            label: "Created By",
            value: creator,
            onChange: setCreator,
            options: userOpts,
          },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : view === "table" ? (
        <TaskTable tasks={filtered} onDelete={setToDelete} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} onDelete={setToDelete} />
          ))}
        </div>
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
