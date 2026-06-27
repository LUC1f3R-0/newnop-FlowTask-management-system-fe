import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { axiosApiInstance } from "@/lib/apiInstance";

type AuthUser = {
  uuid: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  isEmailVerified: boolean;
};

type ApiSuccessResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"ADMIN" | "USER">;
};

function getUserFromResponse(
  responseData: ApiSuccessResponse<{ user: AuthUser }> & {
    user?: AuthUser;
  },
) {
  return responseData.data?.user ?? responseData.user;
}

function getDashboardRoute(user: AuthUser) {
  if (user.role === "ADMIN") {
    return "/admin/dashboard";
  }

  return "/user/dashboard";
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosApiInstance.get("/auth/me");

        const user = getUserFromResponse(response.data);

        if (!user) {
          navigate({ to: "/login" });
          return;
        }

        if (!user.isEmailVerified) {
          navigate({ to: "/login" });
          return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          navigate({ to: getDashboardRoute(user) });
          return;
        }

        setIsAllowed(true);
      } catch {
        navigate({ to: "/login" });
      } finally {
        setIsChecking(false);
      }
    };

    void checkAuth();
  }, [navigate, allowedRoles]);

  if (isChecking) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return children;
}