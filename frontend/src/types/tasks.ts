export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type TaskPayload = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedToId?: string;
};

export type TaskUser = {
  id: string;
  name: string;
  email: string;
};

export type TaskResponse = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  deletedAt?: string | null;
  createdBy: TaskUser;
  assignedTo: TaskUser | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TasksListData = {
  tasks: TaskResponse[];
  meta: TaskListMeta;
};

export type TasksListApiResponse = {
  success?: boolean;
  message?: string;
  data?: TasksListData;
  meta?: TaskListMeta | null;
  tasks?: TaskResponse[];
};

export function getTasksFromResponse(responseData: TasksListApiResponse) {
  return responseData.data?.tasks ?? responseData.tasks ?? [];
}

export function getTasksMetaFromResponse(
  responseData: TasksListApiResponse,
): TaskListMeta {
  const tasks = getTasksFromResponse(responseData);

  return (
    responseData.data?.meta ??
    responseData.meta ?? {
      page: 1,
      limit: Math.max(tasks.length, 10),
      total: tasks.length,
      totalPages: 1,
    }
  );
}

export function formatTaskStatus(status: TaskStatus) {
  if (status === "TODO") return "Open";
  if (status === "IN_PROGRESS") return "In Progress";
  return "Done";
}

export function formatTaskPriority(priority: TaskPriority) {
  if (priority === "LOW") return "Low";
  if (priority === "MEDIUM") return "Medium";
  return "High";
}

export function formatTaskDate(date: string | null) {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date?: string | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleString();
}
