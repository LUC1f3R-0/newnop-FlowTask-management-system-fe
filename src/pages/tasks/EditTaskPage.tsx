import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";
import { axiosApiInstance } from "@/lib/apiInstance";
import type { TaskResponse } from "@/types/tasks";

type TaskDetailsApiResponse = {
  data?: TaskResponse | { task?: TaskResponse };
  task?: TaskResponse;
};

function getTaskFromResponse(responseData: TaskDetailsApiResponse): TaskResponse | null {
  if (responseData.data && "task" in responseData.data) {
    return responseData.data.task ?? null;
  }

  if (responseData.data && "id" in responseData.data) {
    return responseData.data;
  }

  return responseData.task ?? null;
}

export function EditTaskPage() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false }) as { id: string };

  const [task, setTask] = useState<TaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);

        const response =
          await axiosApiInstance.get<TaskDetailsApiResponse>(`/tasks/${id}`);

        setTask(getTaskFromResponse(response.data));
      } catch (error) {
        const axiosError = error as AxiosError<any>;

        console.error("Fetch task failed:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });

        toast.error("Failed to load task");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTask();
  }, [id]);

  return (
    <DashboardLayout role="user">
      <PageHeader
        title="Edit Task"
        description={task?.title ?? "Update task details"}
      />

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading task...
        </div>
      ) : !task ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Task not found.
        </div>
      ) : (
        <TaskForm
          mode="edit"
          initial={task}
          onSuccess={() => {
            void navigate({
              to: "/tasks/$id",
              params: {
                id: task.id,
              },
            });
          }}
          onCancel={() => {
            void navigate({
              to: "/tasks/$id",
              params: {
                id: task.id,
              },
            });
          }}
        />
      )}
    </DashboardLayout>
  );
}
