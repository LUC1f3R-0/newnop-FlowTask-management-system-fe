import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosApiInstance } from "@/lib/apiInstance";
import type { TaskPayload, TaskPriority, TaskResponse, TaskStatus } from "@/types/tasks";

type ApiErrorResponse = {
  message?: string | string[];
  errors?: unknown;
};

type TaskFormProps = {
  mode: "create" | "edit";
  initial?: TaskResponse | null;
  onSuccess?: () => void;
  onCancel?: () => void;
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

function createFormState(initial?: TaskResponse | null) {
  return {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    priority: initial?.priority ?? ("MEDIUM" as TaskPriority),
    status: initial?.status ?? ("TODO" as TaskStatus),
    dueDate: toDateInputValue(initial?.dueDate),
    assignedToId: initial?.assignedTo?.id ?? "",
  };
}

export function TaskForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(() => createFormState(initial));

  useEffect(() => {
    setForm(createFormState(initial));
  }, [initial, mode]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: TaskPayload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      assignedToId: form.assignedToId.trim() || undefined,
    };

    if (mode === "create") {
      await createTask(payload);
      return;
    }

    await updateTask(payload);
  };

  const createTask = async (payload: TaskPayload) => {
    try {
      setIsSubmitting(true);

      const response = await axiosApiInstance.post("/tasks/create", payload);

      console.log("Task create response:", response.data);

      toast.success("Task created successfully");

      if (onSuccess) {
        onSuccess();
        return;
      }

      navigate({ to: "/user/tasks" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      console.error("Task create failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      toast.error(getErrorMessage(error, "Failed to create task"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTask = async (payload: TaskPayload) => {
    if (!initial?.id) {
      toast.error("Task id is missing");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axiosApiInstance.patch(
        `/tasks/${initial.id}`,
        payload,
      );

      console.log("Task update response:", response.data);

      toast.success("Task updated successfully");

      if (onSuccess) {
        onSuccess();
        return;
      }

      navigate({ to: "/user/tasks" });
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

  return (
    <Card className="p-6 max-w-3xl">
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>

          <Input
            id="title"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="Task title"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>

          <Textarea
            id="description"
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            placeholder="What needs to be done?"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Priority</Label>

            <Select
              value={form.priority}
              onValueChange={(value) => set("priority", value as TaskPriority)}
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
            <Label htmlFor="assignedToId">Assigned To User UUID</Label>

            <Input
              id="assignedToId"
              value={form.assignedToId}
              onChange={(event) => set("assignedToId", event.target.value)}
              placeholder="Optional user UUID"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              onCancel?.();
            }}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Task"
                : "Update Task"}
          </Button>
        </div>
      </form>
    </Card>
  );
}