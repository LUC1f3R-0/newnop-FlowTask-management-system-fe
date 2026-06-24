export type TaskStatus = "Open" | "In Progress" | "Testing" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdTasks: number;
  assignedTasks: number;
  joinedDate: string;
}

export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Design login page",
    description:
      "Create a clean login and register UI for the task management system.",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-07-01",
    createdBy: "Admin User",
    assignedTo: "Normal User",
    createdAt: "2026-06-20",
    updatedAt: "2026-06-25",
  },
  {
    id: "2",
    title: "Build task list page",
    description: "Create table and card views for displaying tasks.",
    priority: "Medium",
    status: "Open",
    dueDate: "2026-07-04",
    createdBy: "Normal User",
    assignedTo: "Normal User",
    createdAt: "2026-06-21",
    updatedAt: "2026-06-22",
  },
  {
    id: "3",
    title: "Add admin task filters",
    description:
      "Allow admin to filter tasks by status, priority, created user, and assigned user.",
    priority: "High",
    status: "Testing",
    dueDate: "2026-07-06",
    createdBy: "Admin User",
    assignedTo: "Kasun Perera",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-26",
  },
  {
    id: "4",
    title: "Write README file",
    description:
      "Prepare setup instructions, dependencies, demo login details, and usage guide.",
    priority: "Low",
    status: "Done",
    dueDate: "2026-06-30",
    createdBy: "Normal User",
    assignedTo: "Normal User",
    createdAt: "2026-06-18",
    updatedAt: "2026-06-29",
  },
  {
    id: "5",
    title: "Improve mobile layout",
    description:
      "Make dashboard, task cards, and forms responsive on mobile devices.",
    priority: "Medium",
    status: "Open",
    dueDate: "2026-07-08",
    createdBy: "Kasun Perera",
    assignedTo: "Normal User",
    createdAt: "2026-06-23",
    updatedAt: "2026-06-24",
  },
];

export const sampleUsers: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@gmail.com",
    role: "ADMIN",
    createdTasks: 2,
    assignedTasks: 0,
    joinedDate: "2026-01-10",
  },
  {
    id: "u2",
    name: "Normal User",
    email: "user@gmail.com",
    role: "USER",
    createdTasks: 2,
    assignedTasks: 3,
    joinedDate: "2026-02-14",
  },
  {
    id: "u3",
    name: "Kasun Perera",
    email: "kasun@gmail.com",
    role: "USER",
    createdTasks: 1,
    assignedTasks: 1,
    joinedDate: "2026-03-01",
  },
  {
    id: "u4",
    name: "Nimal Fernando",
    email: "nimal@gmail.com",
    role: "USER",
    createdTasks: 0,
    assignedTasks: 0,
    joinedDate: "2026-03-22",
  },
];

export const assignableUsers = ["Normal User", "Kasun Perera", "Nimal Fernando"];
