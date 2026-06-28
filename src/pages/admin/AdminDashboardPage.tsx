import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskTable } from "@/components/TaskTable";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { axiosApiInstance } from "@/lib/apiInstance";
import type { TaskResponse, TasksListApiResponse } from "@/types/tasks";
import { getTasksFromResponse } from "@/types/tasks";

import {
  ListTodo,
  Users,
  CircleDot,
  Loader,
  CheckCircle2,
  PlusCircle,
  Settings,
  UserCog,
} from "lucide-react";

export function AdminDashboardPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);

      const response = await axiosApiInstance.get<TasksListApiResponse>(
        "/tasks",
        {
          params: {
            page: 1,
            limit: 100,
          },
        },
      );

      setTasks(getTasksFromResponse(response.data));
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error("Fetch dashboard tasks failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to load dashboard tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  const highPriorityTasks = useMemo(
    () => tasks.filter((task) => task.priority === "HIGH").slice(0, 5),
    [tasks],
  );

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((task) => task.status === "TODO").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of all tasks and team activity."
        actions={
          <>
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" /> Create Task
            </Button>

            <Button asChild variant="outline">
              <Link to="/admin/tasks?status=all&priority=all">
                <Settings className="h-4 w-4 mr-1.5" /> Manage Tasks
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link to="/admin/users">
                <UserCog className="h-4 w-4 mr-1.5" /> Manage Users
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Tasks" value={totalTasks} icon={ListTodo} />

        <StatCard
          label="Total Users"
          value="—"
          icon={Users}
          tint="bg-violet-100 text-violet-600"
        />

        <StatCard
          label="Todo"
          value={todoTasks}
          icon={CircleDot}
          tint="bg-sky-100 text-sky-600"
        />

        <StatCard
          label="In Progress"
          value={inProgressTasks}
          icon={Loader}
          tint="bg-amber-100 text-amber-600"
        />

        <StatCard
          label="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          tint="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold mb-3">Recent Tasks</h2>

            {isLoading ? (
              <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                Loading recent tasks...
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                No tasks found.
              </div>
            ) : (
              <TaskTable tasks={recentTasks} showActions={false} />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold mb-4">High Priority</h2>

            {highPriorityTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No high priority tasks.
              </p>
            ) : (
              <div className="space-y-3">
                {highPriorityTasks.map((task) => (
                  <div
                    key={task.id}
                    className="block p-3 rounded-lg border"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{task.title}</div>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Due{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>

                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold mb-4">Task Status Overview</h2>

            <div className="space-y-3">
              {[
                { label: "Todo", status: "TODO" as const, count: todoTasks },
                {
                  label: "In Progress",
                  status: "IN_PROGRESS" as const,
                  count: inProgressTasks,
                },
                {
                  label: "Completed",
                  status: "COMPLETED" as const,
                  count: completedTasks,
                },
              ].map((item) => {
                const percentage = Math.round(
                  (item.count / Math.max(totalTasks, 1)) * 100,
                );

                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-sm mb-1">
                      <StatusBadge status={item.status} />
                      <span className="text-muted-foreground">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <CreateTaskModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => void fetchTasks()}
      />
    </DashboardLayout>
  );
}