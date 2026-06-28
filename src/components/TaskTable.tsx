import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import type { TaskResponse } from "@/types/tasks";
import { formatTaskDate } from "@/types/tasks";
import { Trash2 } from "lucide-react";
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
  onSelect,
  onDelete,
  showPeople = true,
  showActions = true,
}: {
  tasks: TaskResponse[];
  onSelect?: (task: TaskResponse) => void;
  onDelete?: (task: TaskResponse) => void;
  showPeople?: boolean;
  showActions?: boolean;
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
            {showActions && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer"
              onClick={() => onSelect?.(task)}
            >
              <TableCell className="font-medium max-w-[260px] truncate">
                {task.title}
              </TableCell>

              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>

              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>

              <TableCell className="text-muted-foreground">
                {formatTaskDate(task.dueDate)}
              </TableCell>

              {showPeople && <TableCell>{task.createdBy.name}</TableCell>}

              {showPeople && (
                <TableCell>{task.assignedTo?.name ?? "Unassigned"}</TableCell>
              )}

              {showActions && (
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete?.(task);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}