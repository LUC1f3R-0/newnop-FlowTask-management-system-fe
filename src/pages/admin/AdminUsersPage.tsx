import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/UserTable";
import { sampleUsers } from "@/data/sampleData";
import { Search } from "lucide-react";

export function AdminUsersPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      sampleUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="User Management"
        description="View team members and their activity."
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
      <UserTable users={filtered} />
    </DashboardLayout>
  );
}
