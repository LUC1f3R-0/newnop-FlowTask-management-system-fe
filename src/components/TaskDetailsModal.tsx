import { useEffect, useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { axiosApiInstance } from "@/lib/apiInstance";
import type {
  TaskPayload,
  TaskPriority,
  TaskResponse,
  TaskStatus,
} from "@/types/tasks";
import { formatTaskDate } from "@/types/tasks";
import {
  UserEmailCombobox,
  type AssignableUser,
} from "@/components/UserEmailCombobox";

type ApiErrorResponse = {
  message?: string | string[];
};

type TaskDetailsModalProps = {
  open: boolean;
  task: TaskResponse | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const message = axiosError.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  return message ?? fallback;
}

function toDateInputValue(date?: string | null) {
  if (!date) return "";
  return date.slice(0, 10);
}

export function TaskDetailsModal({
  open,
  task,
  onOpenChange,
  onSaved,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    status: "TODO" as TaskStatus,
    dueDate: "",
    assignedToId: "",
  });

  useEffect(() => {
    if (!task) return;

    setIsEditing(false);

    setForm({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
      dueDate: toDateInputValue(task.dueDate),
      assignedToId: task.assignedTo?.id ?? "",
    });
  }, [task]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task) return;

    const payload: TaskPayload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      assignedToId: form.assignedToId.trim() || undefined,
    };

    try {
      setIsSubmitting(true);

      await axiosApiInstance.patch(`/tasks/${task.id}`, payload);

      toast.success("Task updated successfully");

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      console.error("Task update failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error(getErrorMessage(error, "Failed to update task"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Task Details"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the task fields and save changes."
              : "Review the selected task details."}
          </DialogDescription>
        </DialogHeader>

        {!isEditing ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {task.description ?? "No description"}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Priority</div>
                <PriorityBadge priority={task.priority} />
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Status</div>
                <StatusBadge status={task.status} />
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Due Date</div>
                <div>{formatTaskDate(task.dueDate)}</div>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Assigned To</div>
                <div>{task.assignedTo?.name ?? "Unassigned"}</div>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Created By</div>
                <div>{task.createdBy.name}</div>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Task UUID</div>
                <div className="break-all">{task.id}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>

              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) => set("description", event.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    set("priority", value as TaskPriority)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => set("status", value as TaskStatus)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="TODO">Todo</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => set("dueDate", event.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label>Assigned To User Email</Label>
                <UserEmailCombobox
                  value={form.assignedToId}
                  initialUser={initialAssignedUser}
                  disabled={isSubmitting}
                  onChange={(user) => {
                    set("assignedToId", user?.id ?? "");
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setIsEditing(false)}
              >
                Cancel Edit
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}