import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  CheckCircle2,
  CircleDot,
  Clock,
  Loader,
  LogOut,
  ListTodo,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { axiosApiInstance } from "@/lib/apiInstance";
import { getAuthUser, type AuthUser } from "@/lib/auth-route";
import type { TaskResponse, TasksListApiResponse } from "@/types/tasks";
import { getTasksFromResponse } from "@/types/tasks";

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProfilePage() {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const role = authUser?.role === "ADMIN" ? "admin" : "user";
  const roleLabel = authUser?.role === "ADMIN" ? "Admin" : "User";

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);

        const [user, taskResponse] = await Promise.all([
          getAuthUser(),
          axiosApiInstance.get<TasksListApiResponse>("/tasks", {
            params: {
              page: 1,
              limit: 100,
            },
          }),
        ]);

        if (!isMounted) return;

        setAuthUser(user);
        setTasks(getTasksFromResponse(taskResponse.data));
      } catch (error) {
        const axiosError = error as AxiosError<any>;

        console.error("Load profile failed:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });

        toast.error("Failed to load profile");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    return {
      total: tasks.length,
      open: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "COMPLETED").length,
      highPriority: tasks.filter((task) => task.priority === "HIGH").length,
    };
  }, [tasks]);

  const recentTasks = useMemo(() => tasks.slice(0, 4), [tasks]);

  const handleLogout = async () => {
    try {
      await axiosApiInstance.post("/auth/logout");
      toast.success("Logged out successfully");

      void navigate({
        to: "/login",
      });
    } catch {
      toast.error("Logout failed");
    }
  };

  const initials =
    authUser?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <DashboardLayout role={role}>
      <PageHeader
        title="Profile"
        description="Your real account details and task activity."
      />

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading profile...
        </div>
      ) : !authUser ? (
        <Card className="p-6">
          <h2 className="font-semibold">You are not logged in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please log in again to view your profile.
          </p>

          <Button
            className="mt-4"
            type="button"
            onClick={() => {
              void navigate({
                to: "/login",
              });
            }}
          >
            Go to Login
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="overflow-hidden lg:col-span-1">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

            <div className="px-6 pb-6 text-center">
              <div className="-mt-10 mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-background bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
                {initials}
              </div>

              <h2 className="mt-4 text-xl font-semibold">{authUser.name}</h2>

              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {authUser.email}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {roleLabel}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="mt-1 font-medium">{formatDate(authUser.createdAt)}</p>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="mt-1 font-medium">
                    {authUser.isEmailVerified ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-6 w-full"
                type="button"
                onClick={() => {
                  void handleLogout();
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </div>
          </Card>

          <div className="space-y-5 lg:col-span-2">
            <div>
              <h3 className="mb-3 font-semibold">Task Summary</h3>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total Tasks" value={summary.total} icon={ListTodo} />

                <StatCard
                  label="Open"
                  value={summary.open}
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
                  label="Done"
                  value={summary.done}
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
            </div>

            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-medium">Recent Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    Latest tasks visible to your account.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void navigate({
                      to: role === "admin" ? "/admin/tasks" : "/user/tasks",
                    });
                  }}
                >
                  View Tasks
                </Button>
              </div>

              {recentTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No tasks found yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.assignedTo
                            ? `Assigned to ${task.assignedTo.name}`
                            : "Unassigned"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-muted px-2 py-1">
                          {task.status === "TODO"
                            ? "Open"
                            : task.status === "IN_PROGRESS"
                              ? "In Progress"
                              : "Done"}
                        </span>

                        <span className="rounded-full bg-muted px-2 py-1">
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="font-medium">About this account</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This profile uses your authenticated account data and task
                    activity from the backend. Admin users see all tasks, while
                    normal users only see created or assigned tasks.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
