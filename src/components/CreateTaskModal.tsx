import { TaskForm } from "@/components/TaskForm";
import type { TaskResponse } from "@/types/tasks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TaskModalMode = "create" | "edit";

type CreateTaskModalProps = {
  open: boolean;
  mode?: TaskModalMode;
  task?: TaskResponse | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

export function CreateTaskModal({
  open,
  mode = "create",
  task = null,
  onOpenChange,
  onSaved,
}: CreateTaskModalProps) {
  const isEdit = mode === "edit";

  const handleSuccess = () => {
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the selected task details."
              : "Add a new task without leaving the current page."}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          mode={mode}
          initial={task}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}