import type { User } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";

export function UserTable({ users }: { users: User[] }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center">Assigned</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold">
                  {u.name.charAt(0)}
                </div>
                {u.name}
              </TableCell>
              <TableCell className="text-muted-foreground">{u.email}</TableCell>
              <TableCell>
                <span
                  className={
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset " +
                    (u.role === "ADMIN"
                      ? "bg-primary/10 text-primary ring-primary/20"
                      : "bg-slate-100 text-slate-700 ring-slate-200")
                  }
                >
                  {u.role}
                </span>
              </TableCell>
              <TableCell className="text-center">{u.createdTasks}</TableCell>
              <TableCell className="text-center">{u.assignedTasks}</TableCell>
              <TableCell className="text-muted-foreground">
                {u.joinedDate}
              </TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
