import {
  createRoute,
  createRootRouteWithContext,
  Outlet,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";

// Import all pages
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminTasksPage } from "../pages/admin/AdminTasksPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { UserDashboardPage } from "../pages/user/UserDashboardPage";
import { UserTasksPage } from "../pages/user/UserTasksPage";
import { CreateTaskPage } from "../pages/tasks/CreateTaskPage";
import { EditTaskPage } from "../pages/tasks/EditTaskPage";
import { TaskDetailsPage } from "../pages/tasks/TaskDetailsPage";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// Shell removed for pure SPA

function RootComponent() {
  const { queryClient } = rootRoute.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: LandingPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/login", component: LoginPage });
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: "/register", component: RegisterPage });

const adminDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin/dashboard", component: AdminDashboardPage });
const adminTasksRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin/tasks", component: AdminTasksPage });
const adminUsersRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin/users", component: AdminUsersPage });

const userDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/user/dashboard", component: UserDashboardPage });
const userTasksRoute = createRoute({ getParentRoute: () => rootRoute, path: "/user/tasks", component: UserTasksPage });

const createTaskRoute = createRoute({ getParentRoute: () => rootRoute, path: "/tasks/create", component: CreateTaskPage });
const editTaskRoute = createRoute({ getParentRoute: () => rootRoute, path: "/tasks/$id/edit", component: EditTaskPage });
const taskDetailsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/tasks/$id", component: TaskDetailsPage });

const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile", component: ProfilePage });
const accessDeniedRoute = createRoute({ getParentRoute: () => rootRoute, path: "/access-denied", component: AccessDeniedPage });

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  adminDashboardRoute,
  adminTasksRoute,
  adminUsersRoute,
  userDashboardRoute,
  userTasksRoute,
  createTaskRoute,
  editTaskRoute,
  taskDetailsRoute,
  profileRoute,
  accessDeniedRoute,
]);
