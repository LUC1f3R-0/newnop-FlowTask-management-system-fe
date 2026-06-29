import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserEmailCombobox,
  type AssignableUser,
} from "@/components/UserEmailCombobox";
import { axiosApiInstance } from "@/lib/apiInstance";
import type {
  TaskPayload,
  TaskPriority,
  TaskResponse,
  TaskStatus,
} from "@/types/tasks";

type TaskFormMode = "create" | "edit";

type TaskFormProps = {
  mode?: TaskFormMode;
  initial?: TaskResponse | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type ApiErrorResponse = {
  message?: string | string[];
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
  mode = "create",
  initial = null,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => createFormState(initial));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialAssignedUser = useMemo<AssignableUser | null>(() => {
    if (!initial?.assignedTo) return null;

    return {
      id: initial.assignedTo.id,
      name: initial.assignedTo.name,
      email: initial.assignedTo.email,
      role: "USER",
    };
  }, [initial?.assignedTo]);

  useEffect(() => {
    setForm(createFormState(initial));
  }, [initial]);

  const set = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const createTask = async (payload: TaskPayload) => {
    try {
      setIsSubmitting(true);
  
      console.log("Create task payload:", payload);
  
      await axiosApiInstance.post("/tasks/create", payload);
  
      toast.success("Task created successfully");
  
      if (onSuccess) {
        onSuccess();
        return;
      }
  
      await navigate({
        to: "/user/tasks",
        search: {
          status: "all",
          priority: "all",
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
  
      console.error("Task create failed:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.response?.data?.message,
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

      await axiosApiInstance.patch(`/tasks/${initial.id}`, payload);

      toast.success("Task updated successfully");

      if (onSuccess) {
        onSuccess();
        return;
      }

      await navigate({
        to: "/tasks/$id",
        params: {
          id: initial.id,
        },
      });
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

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      toast.error("Task title is required");
      return;
    }

    const payload: TaskPayload = {
      title,
      description: form.description.trim() || undefined,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      assignedToId: form.assignedToId.trim() || undefined,
    };
    console.log("Create task payload:", payload);
    if (isEdit) {
      await updateTask(payload);
      return;
    }

    await createTask(payload);
  };

  return (
    <Card className="p-5">
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>

          <Input
            id="title"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            disabled={isSubmitting}
            placeholder="Enter task title"
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
            placeholder="Enter task description"
            rows={4}
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
                <SelectValue placeholder="Select priority" />
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
                <SelectValue placeholder="Select status" />
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
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Task"}
          </Button>
        </div>
      </form>
    </Card>
  );
}