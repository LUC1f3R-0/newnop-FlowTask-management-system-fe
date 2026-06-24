import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";

export function CreateTaskPage() {
  return (
    <DashboardLayout role="user">
      <PageHeader
        title="Create Task"
        description="Add a new task to the workflow."
      />
      <TaskForm mode="create" />
    </DashboardLayout>
  );
}
