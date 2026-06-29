import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { UserTable, type UserTableUser } from "@/components/UserTable";
import { axiosApiInstance } from "@/lib/apiInstance";
import { Search } from "lucide-react";

type UsersApiResponse = {
  data?: {
    users?: UserTableUser[];
  };
  users?: UserTableUser[];
};

function getUsersFromResponse(responseData: UsersApiResponse) {
  return responseData.data?.users ?? responseData.users ?? [];
}

export function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<UserTableUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axiosApiInstance.get<UsersApiResponse>("/users", {
        params: {
          search: q.trim() || undefined,
        },
      });

      setUsers(getUsersFromResponse(response.data));
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      console.error("Fetch users failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="User Management"
        description="View team members and their task activity."
      />

      <div className="relative max-w-md mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search users..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          No users found.
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </DashboardLayout>
  );
}
