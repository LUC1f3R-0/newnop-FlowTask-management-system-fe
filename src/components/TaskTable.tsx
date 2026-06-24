import { Link } from "@tanstack/react-router";
import type { Task } from "@/data/sampleData";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TaskTable({
  tasks,
  onDelete,
  showPeople = true,
}: {
  tasks: Task[];
  onDelete?: (t: Task) => void;
  showPeople?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            {showPeople && <TableHead>Created By</TableHead>}
            {showPeople && <TableHead>Assigned To</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium max-w-[260px] truncate">
                {t.title}
              </TableCell>
              <TableCell>
                <PriorityBadge priority={t.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={t.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {t.dueDate}
              </TableCell>
              {showPeople && <TableCell>{t.createdBy}</TableCell>}
              {showPeople && <TableCell>{t.assignedTo}</TableCell>}
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  <Button asChild size="icon" variant="ghost">
                    <Link to="/tasks/$id" params={{ id: t.id }}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="ghost">
                    <Link to="/tasks/$id/edit" params={{ id: t.id }}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete?.(t)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
