import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { TaskTable } from "@/components/TaskTable";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { axiosApiInstance } from "@/lib/apiInstance";
import type {
  TaskPriority,
  TaskResponse,
  TaskStatus,
  TasksListApiResponse,
} from "@/types/tasks";
import { getTasksFromResponse } from "@/types/tasks";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;

function readStatusFromUrl(): StatusFilter {
  const value = new URLSearchParams(window.location.search).get("status");

  if (value === "TODO") return "TODO";
  if (value === "IN_PROGRESS") return "IN_PROGRESS";
  if (value === "COMPLETED") return "COMPLETED";

  return "all";
}

function readPriorityFromUrl(): PriorityFilter {
  const value = new URLSearchParams(window.location.search).get("priority");

  if (value === "LOW") return "LOW";
  if (value === "MEDIUM") return "MEDIUM";
  if (value === "HIGH") return "HIGH";

  return "all";
}

function replaceUrlWithFilters(status: StatusFilter, priority: PriorityFilter) {
  const params = new URLSearchParams(window.location.search);

  params.set("status", status);
  params.set("priority", priority);

  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`,
  );
}

function pushUrlWithFilters(status: StatusFilter, priority: PriorityFilter) {
  const params = new URLSearchParams(window.location.search);

  params.set("status", status);
  params.set("priority", priority);

  window.history.pushState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`,
  );
}

export function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [toDelete, setToDelete] = useState<TaskResponse | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>(() => readStatusFromUrl());
  const [priority, setPriority] = useState<PriorityFilter>(() =>
    readPriorityFromUrl(),
  );
  const [view, setView] = useState<"table" | "card">("table");

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axiosApiInstance.get<TasksListApiResponse>(
        "/tasks",
        {
          params: {
            page: 1,
            limit: 100,

            // IMPORTANT:
            // URL can show "all", but API should not receive "all".
            // If all, backend gets undefined and Prisma does not filter that field.
            status: status === "all" ? undefined : status,
            priority: priority === "all" ? undefined : priority,
          },
        },
      );

      setTasks(getTasksFromResponse(response.data));
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error("Fetch tasks failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [status, priority]);

  useEffect(() => {
    replaceUrlWithFilters(status, priority);
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const handleBackForward = () => {
      setStatus(readStatusFromUrl());
      setPriority(readPriorityFromUrl());
    };

    window.addEventListener("popstate", handleBackForward);

    return () => {
      window.removeEventListener("popstate", handleBackForward);
    };
  }, []);

  const deleteTask = async () => {
    if (!toDelete) return;

    try {
      await axiosApiInstance.delete(`/tasks/${toDelete.id}`);

      toast.success("Task deleted successfully");

      setToDelete(null);
      await fetchTasks();
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error("Delete task failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to delete task");
    }
  };

  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [tasks, search],
  );

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="All Tasks"
        description="Manage every task across the team."
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-1.5" /> Create Task
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
            onChange: (value) => {
              const nextStatus = value as StatusFilter;

              setStatus(nextStatus);
              pushUrlWithFilters(nextStatus, priority);
            },
            options: [
              { label: "All Status", value: "all" },
              { label: "Todo", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
            ],
          },
          {
            label: "Priority",
            value: priority,
            onChange: (value) => {
              const nextPriority = value as PriorityFilter;

              setPriority(nextPriority);
              pushUrlWithFilters(status, nextPriority);
            },
            options: [
              { label: "All Priority", value: "all" },
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ],
          },
        ]}
      />

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading tasks...
        </div>
      ) : visibleTasks.length === 0 ? (
        <EmptyState />
      ) : view === "table" ? (
        <TaskTable
          tasks={visibleTasks}
          onSelect={(task) => {
            setSelectedTask(task);
            setDetailsOpen(true);
          }}
          onDelete={setToDelete}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={(task) => {
                setSelectedTask(task);
                setDetailsOpen(true);
              }}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => void fetchTasks()}
      />

      <TaskDetailsModal
        open={detailsOpen}
        task={selectedTask}
        onOpenChange={(open) => {
          setDetailsOpen(open);

          if (!open) {
            setSelectedTask(null);
          }
        }}
        onSaved={() => void fetchTasks()}
      />

      <ConfirmDeleteModal
        open={!!toDelete}
        onOpenChange={(open) => {
          if (!open) {
            setToDelete(null);
          }
        }}
        itemName={toDelete?.title}
        onConfirm={() => {
          void deleteTask();
        }}
      />
    </DashboardLayout>
  );
}