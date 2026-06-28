import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TaskTable } from "@/components/TaskTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { axiosApiInstance } from "@/lib/apiInstance";
import { getAuthUser, type AuthUser } from "@/lib/auth-route";
import type { TaskResponse, TasksListApiResponse } from "@/types/tasks";
import { getTasksFromResponse } from "@/types/tasks";

import {
  CheckCircle2,
  CircleDot,
  Clock,
  ListTodo,
  Loader,
  PlusCircle,
} from "lucide-react";

export function UserDashboardPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [user, tasksResponse] = await Promise.all([
        getAuthUser(),
        axiosApiInstance.get<TasksListApiResponse>("/tasks", {
          params: {
            page: 1,
            limit: 100,
          },
        }),
      ]);

      setAuthUser(user);
      setTasks(getTasksFromResponse(tasksResponse.data));
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error("Fetch user dashboard failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  const summary = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((task) => task.status === "TODO").length;
    const inProgress = tasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;
    const completed = tasks.filter(
      (task) => task.status === "COMPLETED",
    ).length;
    const highPriority = tasks.filter(
      (task) => task.priority === "HIGH",
    ).length;

    return {
      total,
      todo,
      inProgress,
      completed,
      highPriority,
    };
  }, [tasks]);

  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  const highPriorityTasks = useMemo(
    () => tasks.filter((task) => task.priority === "HIGH").slice(0, 5),
    [tasks],
  );

  return (
    <DashboardLayout role="user">
      <PageHeader
        title={`Welcome${authUser?.name ? `, ${authUser.name}` : ""}`}
        description="Here is your personal task summary."
        actions={
          <>
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" /> Create Task
            </Button>

            <Button asChild variant="outline">
              <Link to="/user/tasks">
                <ListTodo className="h-4 w-4 mr-1.5" /> My Tasks
              </Link>
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              label="My Tasks"
              value={summary.total}
              icon={ListTodo}
            />

            <StatCard
              label="Todo"
              value={summary.todo}
              icon={CircleDot}
              tint="bg-sky-100 text-sky-600"
            />

            <StatCard
              label="In Progress"
              value={summary.inProgress}
              icon={Loader}
              tint="bg-amber-100 text-amber-600"
            />

            <StatCard
              label="Completed"
              value={summary.completed}
              icon={CheckCircle2}
              tint="bg-emerald-100 text-emerald-600"
            />

            <StatCard
              label="High Priority"
              value={summary.highPriority}
              icon={Clock}
              tint="bg-rose-100 text-rose-600"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Recent Tasks</h2>

                  <Button asChild variant="ghost" size="sm">
                    <Link to="/user/tasks">View all</Link>
                  </Button>
                </div>

                {recentTasks.length === 0 ? (
                  <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                    No tasks found yet.
                  </div>
                ) : (
                  <TaskTable
                    tasks={recentTasks}
                    showActions={false}
                    showPeople={false}
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">High Priority Tasks</h2>

                  <Button asChild variant="ghost" size="sm">
                    <Link to="/user/tasks">View all</Link>
                  </Button>
                </div>

                {highPriorityTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No high priority tasks.
                  </p>
                ) : (
                  <TaskTable
                    tasks={highPriorityTasks}
                    showActions={false}
                    showPeople={false}
                  />
                )}
              </Card>

              <Card className="p-5">
                <h2 className="font-semibold mb-4">Task Progress</h2>

                <div className="space-y-4">
                  {[
                    {
                      label: "Todo",
                      count: summary.todo,
                    },
                    {
                      label: "In Progress",
                      count: summary.inProgress,
                    },
                    {
                      label: "Completed",
                      count: summary.completed,
                    },
                  ].map((item) => {
                    const percentage = Math.round(
                      (item.count / Math.max(summary.total, 1)) * 100,
                    );

                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.label}</span>

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
        </>
      )}

      <CreateTaskModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => void fetchDashboardData()}
      />
    </DashboardLayout>
  );
}