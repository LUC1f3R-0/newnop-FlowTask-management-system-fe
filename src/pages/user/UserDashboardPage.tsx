import { Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { sampleTasks } from "@/data/sampleData";
import {
  ListTodo,
  CircleDot,
  Loader,
  CheckCircle2,
  Flame,
  PlusCircle,
  Calendar,
} from "lucide-react";

export function UserDashboardPage() {
  const myTasks = sampleTasks.filter(
    (t) => t.assignedTo === "Normal User" || t.createdBy === "Normal User",
  );
  return (
    <DashboardLayout role="user">
      <PageHeader
        title="My Dashboard"
        description="Your assigned tasks and progress."
        actions={
          <Button asChild>
            <Link to="/tasks/create">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Create Task
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="My Tasks" value={6} icon={ListTodo} />
        <StatCard
          label="Open"
          value={2}
          icon={CircleDot}
          tint="bg-sky-100 text-sky-600"
        />
        <StatCard
          label="In Progress"
          value={2}
          icon={Loader}
          tint="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Done"
          value={2}
          icon={CheckCircle2}
          tint="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          label="High Priority"
          value={1}
          icon={Flame}
          tint="bg-rose-100 text-rose-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-3">Recently Assigned</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {myTasks.slice(0, 4).map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold mb-4">Due Soon</h2>
            <div className="space-y-3">
              {myTasks.slice(0, 4).map((t) => (
                <Link
                  key={t.id}
                  to="/tasks/$id"
                  params={{ id: t.id }}
                  className="block p-3 rounded-lg border hover:bg-muted/40"
                >
                  <div className="font-medium text-sm truncate">{t.title}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {t.dueDate}
                    </span>
                    <PriorityBadge priority={t.priority} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold mb-4">My Task Preview</h2>
            <div className="space-y-3">
              {(["Open", "In Progress", "Done"] as const).map((s) => (
                <div key={s} className="flex justify-between items-center">
                  <StatusBadge status={s} />
                  <span className="text-sm text-muted-foreground">
                    {myTasks.filter((t) => t.status === s).length} tasks
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
