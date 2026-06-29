import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { axiosApiInstance } from "@/lib/apiInstance";
import type { TaskResponse } from "@/types/tasks";
import { formatTaskDate } from "@/types/tasks";

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

export function TaskDetailsPage() {
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
        title="Task Details"
        description={task?.title ?? "View selected task"}
        actions={
          task ? (
            <Button asChild>
              <Link
                to="/tasks/$id/edit"
                params={{
                  id: task.id,
                }}
              >
                Edit Task
              </Link>
            </Button>
          ) : null
        }
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
        <Card className="p-5 space-y-5">
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
        </Card>
      )}
    </DashboardLayout>
  );
}
