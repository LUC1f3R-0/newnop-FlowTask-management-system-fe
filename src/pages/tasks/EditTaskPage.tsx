import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";
import { sampleTasks } from "@/data/sampleData";
import { useParams } from "@tanstack/react-router";

export function EditTaskPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const task = sampleTasks.find((t) => t.id === id) ?? sampleTasks[0];
  return (
    <DashboardLayout role="user">
      <PageHeader title="Edit Task" description={task.title} />
      <TaskForm mode="edit" initial={task} />
    </DashboardLayout>
  );
}
