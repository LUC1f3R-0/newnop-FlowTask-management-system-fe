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
  createdBy: TaskUser;
  assignedTo: TaskUser | null;
  createdAt: string;
  updatedAt: string;
};

export type TasksListData = {
  tasks: TaskResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TasksListApiResponse = {
  success?: boolean;
  message?: string;
  data?: TasksListData;
  tasks?: TaskResponse[];
};

export function getTasksFromResponse(responseData: TasksListApiResponse) {
  return responseData.data?.tasks ?? responseData.tasks ?? [];
}

export function formatTaskStatus(status: TaskStatus) {
  if (status === "TODO") return "Todo";
  if (status === "IN_PROGRESS") return "In Progress";
  return "Completed";
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