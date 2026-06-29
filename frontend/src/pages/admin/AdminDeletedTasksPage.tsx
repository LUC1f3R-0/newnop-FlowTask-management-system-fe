import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Pencil, RotateCcw } from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { EmptyState } from "@/components/EmptyState";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { PaginationControls } from "@/components/PaginationControls";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosApiInstance } from "@/lib/apiInstance";
import type {
  TaskListMeta,
  TaskPriority,
  TaskResponse,
  TaskStatus,
  TasksListApiResponse,
} from "@/types/tasks";
import {
  formatDateTime,
  formatTaskDate,
  getTasksFromResponse,
  getTasksMetaFromResponse,
} from "@/types/tasks";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;

const PAGE_LIMIT = 10;

const DEFAULT_META: TaskListMeta = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 1,
};

export function AdminDeletedTasksPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [meta, setMeta] = useState<TaskListMeta>(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [page, setPage] = useState(1);

  const fetchDeletedTasks = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axiosApiInstance.get<TasksListApiResponse>(
        "/tasks/deleted",
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

      console.error("Fetch deleted tasks failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to load deleted tasks");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, priority]);

  useEffect(() => {
    void fetchDeletedTasks();
  }, [fetchDeletedTasks]);

  const restoreTask = async (task: TaskResponse) => {
    try {
      setIsRestoring(task.id);

      await axiosApiInstance.patch(`/tasks/${task.id}/restore`);

      toast.success("Task restored successfully");

      await fetchDeletedTasks();
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error("Restore task failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to restore task");
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Deleted Tasks"
        description="Admin-only soft deleted tasks. Edit them or restore them back to All Tasks."
      />

      <SearchAndFilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
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
          Loading deleted tasks...
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No deleted tasks"
          description="Soft deleted tasks will appear here."
        />
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {task.description ?? "No description"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>

                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatTaskDate(task.dueDate)}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDateTime(task.deletedAt)}
                  </TableCell>

                  <TableCell>{task.createdBy.name}</TableCell>

                  <TableCell>
                    {task.assignedTo?.name ?? "Unassigned"}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isRestoring === task.id}
                        onClick={() => {
                          void restoreTask(task);
                        }}
                      >
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                        Restore
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        open={editOpen}
        mode="edit"
        task={selectedTask}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedTask(null);
          }
        }}
        onSaved={() => {
          void fetchDeletedTasks();
        }}
      />
    </DashboardLayout>
  );
}
