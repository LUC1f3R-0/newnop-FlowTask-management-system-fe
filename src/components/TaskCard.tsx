import { Link } from "@tanstack/react-router";
import { Calendar, Eye, Pencil, Trash2, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import type { TaskResponse } from "@/types/tasks";
import { formatTaskDate } from "@/types/tasks";

type TaskCardProps = {
  task: TaskResponse;
  onSelect?: (task: TaskResponse) => void;
  onDelete?: (task: TaskResponse) => void;
};

export function TaskCard({ task, onSelect, onDelete }: TaskCardProps) {
  return (
    <Card
      className="p-5 flex flex-col gap-3 cursor-pointer hover:bg-muted/40 transition"
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(task)}
      onKeyDown={(event) => {
        if (!onSelect) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(task);
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {task.description ?? "No description"}
      </p>

      <div className="flex items-center gap-2">
        <StatusBadge status={task.status} />
      </div>

      <div className="text-xs text-muted-foreground space-y-1 mt-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Due {formatTaskDate(task.dueDate)}
        </div>

        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {task.assignedTo?.name ?? "Unassigned"}
        </div>
      </div>

      <div
        className="flex gap-2 pt-2 border-t mt-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link to="/tasks/$id" params={{ id: task.id }}>
            <Eye className="h-3.5 w-3.5 mr-1" /> View
          </Link>
        </Button>

        <Button asChild size="sm" variant="outline">
          <Link to="/tasks/$id/edit" params={{ id: task.id }}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>

        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => onDelete(task)}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </Card>
  );
}
