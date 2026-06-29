import { useNavigate, useRouterState } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ListTodo, CheckCircle2, Loader, LogOut } from "lucide-react";

export function ProfilePage() {
  const navigate = useNavigate();
  // Determine role from prior path if possible — default to user
  const prev = useRouterState({ select: (s) => s.location.pathname });
  const role: "admin" | "user" = prev.startsWith("/admin") ? "admin" : "user";

  const profile =
    role === "admin"
      ? {
        name: "Admin User",
        email: "admin@gmail.com",
        role: "ADMIN",
        joined: "2026-01-10",
      }
      : {
        name: "Normal User",
        email: "user@gmail.com",
        role: "USER",
        joined: "2026-02-14",
      };

  return (
    <DashboardLayout role={role}>
      <PageHeader title="Profile" description="Your account details." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 text-center">
          <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground grid place-items-center mx-auto text-2xl font-semibold">
            {profile.name.charAt(0)}
          </div>
          <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <div className="mt-3 inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
            {profile.role}
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            Joined {profile.joined}
          </div>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => navigate({ to: "/" })}
          >
            <LogOut className="h-4 w-4 mr-1.5" /> Logout
          </Button>
        </Card>
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold">Task summary</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard label="Total Tasks" value={6} icon={ListTodo} />
            <StatCard
              label="In Progress"
              value={2}
              icon={Loader}
              tint="bg-amber-100 text-amber-600"
            />
            <StatCard
              label="Completed"
              value={2}
              icon={CheckCircle2}
              tint="bg-emerald-100 text-emerald-600"
            />
          </div>
          <Card className="p-6">
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-muted-foreground">
              This is a demo profile page in FlowTask. Account details are
              static and provided only for visual reference.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
