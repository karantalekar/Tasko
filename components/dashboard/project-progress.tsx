"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/api-provider";
import { statusLabel, type Status } from "@/lib/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChartPie, FolderOpen } from "lucide-react";
import { WidgetTitle } from "./widget-title";

export function ProjectProgress() {
  const { projects, tasks } = useApi();
  const [selectedProject, setSelectedProject] = useState("all");
  const projectId =
    selectedProject === "all" ||
    projects.some((project) => project.id === selectedProject)
      ? selectedProject
      : "all";
  const projectIds = new Set(projects.map((project) => project.id));
  const scopedTasks = tasks.filter((task) =>
    projectId === "all"
      ? projectIds.has(task.project_id)
      : task.project_id === projectId,
  );
  const distribution: Record<Status, number> = {
    pending: 0,
    in_progress: 0,
    completed: 0,
    on_hold: 0,
  };
  for (const task of scopedTasks) distribution[task.status]++;
  const total = scopedTasks.length;
  const progress = total
    ? Math.round((distribution.completed / total) * 100)
    : 0;
  const circumference = 2 * Math.PI * 70;

  return (
    <Card className="dashboard-card group gap-0 p-6">
      <WidgetTitle title="Project Progress" icon={ChartPie} href="/tasks" />
      {!projects.length ? (
        <p className="text-sm text-muted-foreground">
          No projects yet. Create a project to track progress.
        </p>
      ) : (
        <>
          <label className="block text-sm mb-4" htmlFor="progress-project">
            Project
          </label>
          <Select value={projectId} onValueChange={setSelectedProject}>
            <SelectTrigger
              id="progress-project"
              className="mb-5 h-11 w-full rounded-xl border-primary/15 bg-primary/5 text-sm shadow-none hover:bg-primary/10"
            >
              <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
              <SelectValue placeholder="Choose a project" />
            </SelectTrigger>
            <SelectContent className="rounded-xl p-1 shadow-xl">
              <SelectItem value="all" className="rounded-lg py-2.5">
                All projects
              </SelectItem>
              {projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                  className="rounded-lg py-2.5"
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div
            className="relative w-40 h-40 mx-auto"
            role="progressbar"
            aria-label="Task completion"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 160 160"
              aria-hidden="true"
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                className="text-primary transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{progress}%</span>
              <span className="text-xs text-muted-foreground">
                Tasks completed
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {total
              ? `${distribution.completed} of ${total} tasks completed`
              : "No tasks in this project yet. Add a task to start tracking progress."}
          </p>
          {!!total && (
            <div className="space-y-2 mt-4">
              {(Object.keys(distribution) as Status[]).map((status) => (
                <div key={status} className="flex justify-between text-sm">
                  <span>{statusLabel(status)}</span>
                  <span>{distribution[status]}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
