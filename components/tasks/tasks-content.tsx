"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/components/api-provider";
import { EditTask } from "@/components/workspace-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateLabel, statusLabel } from "@/lib/api";

export function TasksContent({
  initialSearch = "",
}: {
  initialSearch?: string;
}) {
  const { tasks, projects, members, team, user, isOwner, mutate, refresh } =
    useApi();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState(initialSearch);
  const [priority, setPriority] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);
  const filtered = tasks.filter(
    (task) =>
      (filter === "all" ||
        (filter === "completed"
          ? task.status === "completed"
          : task.status !== "completed")) &&
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (!priority || task.priority === priority) &&
      (!due || (task.due_at && localDate(task.due_at) === due)),
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Search tasks"
          placeholder="Search tasks..."
          className="flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Priority filter"
          className="border bg-background rounded-md p-2 text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Input
          aria-label="Due date filter"
          type="date"
          className="w-auto"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setPriority("");
            setDue("");
          }}
        >
          Clear filters
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "active", "completed"].map((value) => (
          <Button
            key={value}
            variant={filter === value ? "default" : "outline"}
            onClick={() => setFilter(value)}
            size="sm"
            className="capitalize"
          >
            {`${value[0].toUpperCase()}${value.slice(1)} (${tasks.filter(
                (task) =>
                  value === "all" ||
                  (value === "completed"
                    ? task.status === "completed"
                    : task.status !== "completed"),
              ).length})`}
          </Button>
        ))}
      </div>
      {error && (
        <div role="alert" className="text-destructive text-sm">
          {error}
          <Button
            variant="outline"
            onClick={() => {
              setError(null);
              void refresh();
            }}
          >
            Reload tasks
          </Button>
        </div>
      )}
      {!projects.length && (
        <p className="text-sm text-muted-foreground">
          Use Add Task to create your first project and task together.
        </p>
      )}
      {filtered.length ? (
        <div className="grid gap-4">
          {filtered.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  aria-label={`Mark ${task.title} ${task.status === "completed" ? "pending" : "completed"}`}
                  checked={task.status === "completed"}
                  disabled={
                    !!busy || (!isOwner && task.assignee_id !== user.id)
                  }
                  onCheckedChange={async (checked) => {
                    setBusy(task.id);
                    setError(null);
                    try {
                      await mutate(
                        `/teams/${team!.id}/tasks/${task.id}`,
                        "PATCH",
                        {
                          version: task.version,
                          status: checked ? "completed" : "pending",
                        },
                      );
                      await refresh();
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(null);
                    }
                  }}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3
                      className={`font-semibold ${task.status === "completed" ? "line-through opacity-60" : ""}`}
                    >
                      {task.title}
                    </h3>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : "secondary"
                      }
                      className="capitalize"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {projects.find((p) => p.id === task.project_id)?.name ||
                      "Project unavailable"}{" "}
                    · {dateLabel(task.due_at)} · {statusLabel(task.status)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {members.find((m) => m.user_id === task.assignee_id)
                      ?.name || "Unassigned"}
                  </p>
                  {task.description && (
                    <p className="text-sm">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <EditTask task={task} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-muted-foreground">
          {tasks.length ? "No tasks match your filters." : "No tasks yet."}
        </Card>
      )}
    </div>
  );
}
function localDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
