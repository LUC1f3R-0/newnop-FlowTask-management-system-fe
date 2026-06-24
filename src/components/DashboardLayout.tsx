import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Users,
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  CheckSquare,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "All Tasks", to: "/admin/tasks", icon: ListTodo },
  { label: "Create Task", to: "/tasks/create", icon: PlusCircle },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Profile", to: "/profile", icon: UserIcon },
];

const userNav: NavItem[] = [
  { label: "Dashboard", to: "/user/dashboard", icon: LayoutDashboard },
  { label: "My Tasks", to: "/user/tasks", icon: ListTodo },
  { label: "Create Task", to: "/tasks/create", icon: PlusCircle },
  { label: "Profile", to: "/profile", icon: UserIcon },
];

export function DashboardLayout({
  role,
  children,
}: {
  role: "admin" | "user";
  children: ReactNode;
}) {
  const nav = role === "admin" ? adminNav : userNav;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const displayName = role === "admin" ? "Admin User" : "Normal User";
  const email = role === "admin" ? "admin@gmail.com" : "user@gmail.com";

  const Sidebar = (
    <aside className="h-full w-64 bg-sidebar text-sidebar-foreground border-r flex flex-col">
      <div className="h-16 px-5 flex items-center gap-2 border-b border-sidebar-border">
        <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
          <CheckSquare className="h-4 w-4" />
        </span>
        <span className="font-semibold">FlowTask</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider rounded-md px-1.5 py-0.5 bg-sidebar-accent text-sidebar-accent-foreground">
          {role}
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active =
            pathname === item.to ||
            (item.to !== "/" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{Sidebar}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-medium text-sm">
                {displayName.charAt(0)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground">{email}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
