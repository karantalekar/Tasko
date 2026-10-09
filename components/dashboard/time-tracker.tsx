"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/components/api-provider";
import { Clock3 } from "lucide-react";
export function TimeTracker() {
  const { tasks, timers, team, user, isOwner, mutate, refresh } = useApi();
  const [taskId, setTaskId] = useState("");
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const running = timers.find((timer) => timer.running);
  const permitted = tasks.filter(
    (task) =>
      task.status !== "completed" && (isOwner || task.assignee_id === user.id),
  );
  useEffect(() => {
    setTaskId("");
    setError(null);
  }, [team?.id]);
  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [running?.id]);
  const seconds = running
    ? Math.max(
        0,
        Math.floor((now - new Date(running.started_at).getTime()) / 1000),
      )
    : 0;
  const time = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  async function change() {
    setBusy(true);
    setError(null);
    try {
      if (running)
        await mutate(
          `/teams/${team!.id}/time-entries/${running.id}/stop`,
          "POST",
        );
      else
        await mutate(`/teams/${team!.id}/time-entries/start`, "POST", {
          task_id: taskId || permitted[0]?.id,
        });
      await refresh();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="dashboard-card group p-6 bg-foreground text-background">
      <h2 className="flex items-center gap-3 text-lg font-semibold mb-4">
        <span className="rounded-xl bg-background/10 p-2.5">
          <Clock3 className="h-5 w-5" />
        </span>
        Time Tracker
      </h2>
      <p className="text-4xl font-mono font-bold mb-4" aria-live="off">
        {time}
      </p>
      {running ? (
        <p className="text-sm mb-4">
          {tasks.find((t) => t.id === running.task_id)?.title || "Running task"}
        </p>
      ) : (
        <select
          aria-label="Task to track"
          className="w-full bg-background text-foreground border rounded-md p-2 mb-4"
          value={taskId || permitted[0]?.id || ""}
          onChange={(e) => setTaskId(e.target.value)}
        >
          {permitted.length ? (
            permitted.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))
          ) : (
            <option value="">No available tasks</option>
          )}
        </select>
      )}
      <Button
        variant="secondary"
        disabled={busy || (!running && !permitted.length)}
        onClick={() => void change()}
      >
        {busy ? "Saving..." : running ? "Stop timer" : "Start timer"}
      </Button>
      {error && (
        <p className="text-sm mt-3" role="alert">
          {error}
        </p>
      )}
      {!running && (
        <p className="text-xs mt-3 opacity-80">
          {timers.length} saved time entries
        </p>
      )}
    </Card>
  );
}
