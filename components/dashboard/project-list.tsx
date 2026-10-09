"use client";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/api-provider";
import { CreateAction, EditProject } from "@/components/workspace-actions";
import { dateLabel, statusLabel } from "@/lib/api";
import { FolderKanban } from "lucide-react";
import { WidgetTitle } from "./widget-title";
export function ProjectList() {
  const { projects } = useApi();
  return (
    <Card className="dashboard-card group gap-0 p-6">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <WidgetTitle title="Projects" icon={FolderKanban} />
        <CreateAction kind="project" />
      </div>
      <div className="space-y-3 max-h-96 overflow-auto">
        {projects.length ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-3 p-3 border rounded-xl transition-colors hover:border-primary/25 hover:bg-primary/5"
            >
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {dateLabel(project.due_at)} · {statusLabel(project.status)}
                </p>
              </div>
              <EditProject project={project} />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No projects yet. Create a project to start adding tasks.
          </p>
        )}
      </div>
    </Card>
  );
}
