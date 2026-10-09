"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApi } from "@/components/api-provider";
import { CreateAction } from "@/components/workspace-actions";
import { initials } from "@/lib/api";
import { UsersRound } from "lucide-react";
import { WidgetTitle } from "./widget-title";
export function TeamCollaboration() {
  const { members, tasks } = useApi();
  return (
    <Card className="dashboard-card group gap-0 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <WidgetTitle
          title="Team Collaboration"
          icon={UsersRound}
          href="/team"
        />
        <CreateAction kind="member" />
      </div>
      <div className="space-y-3 max-h-80 overflow-auto">
        {members.map((member) => {
          const assigned = tasks.filter(
            (task) =>
              task.assignee_id === member.user_id &&
              task.status !== "completed",
          );
          return (
            <div
              key={member.user_id}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <Avatar>
                <AvatarFallback>{initials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {assigned.length
                    ? assigned.map((task) => task.title).join(", ")
                    : "No active assigned tasks"}
                </p>
              </div>
              <span className="text-xs whitespace-nowrap">
                {member.active_tasks} active
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
