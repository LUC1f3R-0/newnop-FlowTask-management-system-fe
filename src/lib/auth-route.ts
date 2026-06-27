import { redirect } from "@tanstack/react-router";
import { axiosApiInstance } from "@/lib/apiInstance";

export type AuthUser = {
  uuid: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ApiSuccessResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type AuthResponse = ApiSuccessResponse<{
  user?: AuthUser;
}> & {
  user?: AuthUser;
};

function extractUser(responseData: AuthResponse) {
  return responseData.data?.user ?? responseData.user ?? null;
}

export async function getAuthUser() {
  try {
    const response = await axiosApiInstance.get<AuthResponse>("/auth/me");

    return extractUser(response.data);
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    throw redirect({
      to: "/login",
      replace: true,
    });
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw redirect({
      to: "/access-denied",
      replace: true,
    });
  }

  return user;
}

export async function requireUser() {
  const user = await requireAuth();

  if (user.role === "ADMIN") {
    throw redirect({
      to: "/admin/dashboard",
      replace: true,
    });
  }

  if (user.role !== "USER") {
    throw redirect({
      to: "/access-denied",
      replace: true,
    });
  }

  return user;
}
