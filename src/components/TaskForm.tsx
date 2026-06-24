import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignableUsers, type Task } from "@/data/sampleData";

export function TaskForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: Partial<Task>;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    priority: initial?.priority ?? "Medium",
    status: initial?.status ?? "Open",
    dueDate: initial?.dueDate ?? "",
    assignedTo: initial?.assignedTo ?? assignableUsers[0],
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      mode === "create"
        ? "Task created successfully"
        : "Task updated successfully",
    );
    setTimeout(() => navigate({ to: "/user/tasks" }), 600);
  };

  return (
    <Card className="p-6 max-w-3xl">
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Task title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What needs to be done?"
            rows={4}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(v) => set("priority", v as Task["priority"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => set("status", v as Task["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Select
              value={form.assignedTo}
              onValueChange={(v) => set("assignedTo", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignableUsers.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => history.back()}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create Task" : "Update Task"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
