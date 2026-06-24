import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { sampleTasks, type TaskStatus } from "@/data/sampleData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";

export function TaskDetailsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const task = sampleTasks.find((t) => t.id === id) ?? sampleTasks[0];
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [delOpen, setDelOpen] = useState(false);

  return (
    <DashboardLayout role="user">
      <PageHeader
        title="Task Details"
        actions={
          <>
            <Button variant="outline" onClick={() => history.back()}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Tasks
            </Button>
            <Button asChild>
              <Link to="/tasks/$id/edit" params={{ id: task.id }}>
                <Pencil className="h-4 w-4 mr-1.5" /> Edit Task
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setDelOpen(true)}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className="text-2xl font-semibold">{task.title}</h2>
            <div className="flex gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={status} />
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {task.description}
          </p>

          <div className="mt-6 pt-6 border-t">
            <div className="text-sm font-medium mb-2">Update status</div>
            <div className="flex gap-2">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => toast.success("Status updated (demo)")}>
                Update Status
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Details</h3>
          <Row icon={Calendar} label="Due Date" value={task.dueDate} />
          <Row icon={User} label="Created By" value={task.createdBy} />
          <Row icon={UserPlus} label="Assigned To" value={task.assignedTo} />
          <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
            <div>Created: {task.createdAt}</div>
            <div>Updated: {task.updatedAt}</div>
          </div>
        </Card>
      </div>

      <ConfirmDeleteModal
        open={delOpen}
        onOpenChange={setDelOpen}
        itemName={task.title}
        onConfirm={() => {
          toast.success("Task deleted (demo)");
          setDelOpen(false);
          setTimeout(() => navigate({ to: "/user/tasks" }), 400);
        }}
      />
    </DashboardLayout>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-muted grid place-items-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium text-sm">{value}</div>
      </div>
    </div>
  );
}
