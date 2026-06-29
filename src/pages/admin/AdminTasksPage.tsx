import { useCallback, useEffect, useState } from "react";
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
import { PaginationControls } from "@/components/PaginationControls";
import { axiosApiInstance } from "@/lib/apiInstance";
import type {
  TaskListMeta,
  TaskPriority,
  TaskResponse,
  TaskStatus,
  TasksListApiResponse,
} from "@/types/tasks";
import { getTasksFromResponse, getTasksMetaFromResponse } from "@/types/tasks";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;

const PAGE_LIMIT = 10;

const DEFAULT_META: TaskListMeta = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 1,
};

export function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [meta, setMeta] = useState<TaskListMeta>(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [toDelete, setToDelete] = useState<TaskResponse | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [view, setView] = useState<"table" | "card">("table");
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axiosApiInstance.get<TasksListApiResponse>(
        "/tasks",
        {
          params: {
            page,
            limit: PAGE_LIMIT,
            search: search.trim() || undefined,
            status: status === "all" ? undefined : status,
            priority: priority === "all" ? undefined : priority,
          },
        },
      );

      const nextTasks = getTasksFromResponse(response.data);
      const nextMeta = getTasksMetaFromResponse(response.data);

      setTasks(nextTasks);
      setMeta(nextMeta);

      if (nextMeta.totalPages > 0 && page > nextMeta.totalPages) {
        setPage(nextMeta.totalPages);
      }
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
  }, [page, search, status, priority]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

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
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        view={view}
        onViewChange={setView}
        filters={[
          {
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as StatusFilter);
              setPage(1);
            },
            options: [
              { label: "All Status", value: "all" },
              { label: "Open", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "COMPLETED" },
            ],
          },
          {
            label: "Priority",
            value: priority,
            onChange: (value) => {
              setPriority(value as PriorityFilter);
              setPage(1);
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
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : view === "table" ? (
        <TaskTable
          tasks={tasks}
          onSelect={(task) => {
            setSelectedTask(task);
            setDetailsOpen(true);
          }}
          onDelete={setToDelete}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
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

      <PaginationControls
        page={meta.page}
        limit={meta.limit}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      <CreateTaskModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => {
          setPage(1);
          void fetchTasks();
        }}
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
