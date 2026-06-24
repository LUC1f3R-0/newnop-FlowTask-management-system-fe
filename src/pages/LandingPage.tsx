import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicNavbar } from "@/components/PublicNavbar";
import {
  CheckSquare,
  Shield,
  Workflow,
  Search,
  Users,
  ListTodo,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "Task Management",
    desc: "Create tasks, set priorities, and keep everything in one place.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Admins manage everything. Users see what's relevant to them.",
  },
  {
    icon: Workflow,
    title: "Workflow Tracking",
    desc: "Move tasks through Open, In Progress, Testing, and Done.",
  },
  {
    icon: Search,
    title: "Search & Filtering",
    desc: "Find tasks fast with rich filters by status, priority, and people.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/0.08),transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Frontend demo — no backend required
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight">
            Manage team tasks <br className="hidden sm:block" />
            with clarity
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, assign, track, and manage team tasks with a simple
            role-based workflow.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/login">
                Login <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">Admins</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              Manage every task across the team, assign work, and oversee the
              workflow from a powerful dashboard.
            </p>
          </Card>
          <Card className="p-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary text-secondary-foreground grid place-items-center">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">Users</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              See tasks assigned to you or created by you, update progress, and
              stay focused on what matters.
            </p>
          </Card>
        </div>
      </section>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-3 items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground grid place-items-center">
              <CheckSquare className="h-3.5 w-3.5" />
            </span>
            FlowTask © {new Date().getFullYear()}
          </div>
          <div>Built as a frontend demo.</div>
        </div>
      </footer>
    </div>
  );
}
