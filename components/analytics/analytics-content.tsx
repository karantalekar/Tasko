"use client";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/api-provider";
import { statusLabel, type Status } from "@/lib/api";
export function AnalyticsContent() {
  const { analytics, isOwner } = useApi();
  if (!analytics) return <p>Analytics unavailable.</p>;
  const stats = [
    { title: "Tasks completed this year", value: analytics.tasks_completed },
    { title: "Active projects", value: analytics.active_projects },
    { title: "Team members", value: analytics.team_members },
    {
      title: isOwner ? "Average completion time" : "Total working hours",
      value:
        !isOwner
          ? `${(analytics.total_working_minutes / 60).toFixed(2)} hrs`
          : analytics.average_completion_seconds === null
          ? "—"
          : `${(analytics.average_completion_seconds / 86400).toFixed(1)} days`,
    },
  ];
  const max = Math.max(
    1,
    ...analytics.daily_task_completion.map((m) => m.count),
  );
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {isOwner ? "Team task" : "Your assigned task"} completions for {new Date().getFullYear()} (UTC).
        Only dates with completed tasks are shown. Project and member counts reflect the current workspace.
        {!isOwner && " Working hours are the total from your submitted timesheets across all dates."}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-4">
            <h3 className="text-sm mb-3">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">
            Task Completion Dates
          </h3>
          <div className="space-y-4">
            {analytics.daily_task_completion.length === 0 && <p className="text-sm text-muted-foreground">No completed tasks in this period.</p>}
            {analytics.daily_task_completion.map((row) => (
              <div key={row.date}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{new Date(`${row.date}T00:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                  <span>{row.count} tasks</span>
                </div>
                <div className="bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(row.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Project Distribution</h3>
          <div className="space-y-4">
            {(
              Object.keys(analytics.project_status_distribution) as Status[]
            ).map((status) => (
              <div
                key={status}
                className="flex justify-between border rounded-lg p-3"
              >
                <span>{statusLabel(status)}</span>
                <span className="text-2xl font-bold">
                  {analytics.project_status_distribution[status]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
