import { Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskTable } from "@/components/TaskTable";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { sampleTasks } from "@/data/sampleData";
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
  const high = sampleTasks.filter((t) => t.priority === "High");
  const statusCounts = sampleTasks.reduce<Record<string, number>>(
    (acc, t) => ((acc[t.status] = (acc[t.status] ?? 0) + 1), acc),
    {},
  );

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of all tasks and team activity."
        actions={
          <>
            <Button asChild>
              <Link to="/tasks/create">
                <PlusCircle className="h-4 w-4 mr-1.5" /> Create Task
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/tasks">
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
        <StatCard label="Total Tasks" value={12} icon={ListTodo} />
        <StatCard
          label="Total Users"
          value={4}
          icon={Users}
          tint="bg-violet-100 text-violet-600"
        />
        <StatCard
          label="Open"
          value={5}
          icon={CircleDot}
          tint="bg-sky-100 text-sky-600"
        />
        <StatCard
          label="In Progress"
          value={3}
          icon={Loader}
          tint="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Done"
          value={4}
          icon={CheckCircle2}
          tint="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold mb-3">Recent Tasks</h2>
            <TaskTable tasks={sampleTasks.slice(0, 5)} />
          </div>
        </div>
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold mb-4">High Priority</h2>
            <div className="space-y-3">
              {high.map((t) => (
                <Link
                  key={t.id}
                  to="/tasks/$id"
                  params={{ id: t.id }}
                  className="block p-3 rounded-lg border hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium truncate">{t.title}</div>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Due {t.dueDate}</span>
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold mb-4">Task Status Overview</h2>
            <div className="space-y-3">
              {(["Open", "In Progress", "Testing", "Done"] as const).map(
                (s) => {
                  const count = statusCounts[s] ?? 0;
                  const pct = Math.round(
                    (count / Math.max(sampleTasks.length, 1)) * 100,
                  );
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm mb-1">
                        <StatusBadge status={s} />
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
