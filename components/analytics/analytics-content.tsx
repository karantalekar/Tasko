"use client";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/api-provider";
import dynamic from "next/dynamic";

const AnalyticsCharts = dynamic(() => import("./analytics-charts"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl bg-muted" role="status" aria-label="Loading analytics charts" />,
});
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
          ? "N/A"
          : `${(analytics.average_completion_seconds / 86400).toFixed(1)} days`,
    },
  ];

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
      <AnalyticsCharts dailyCompletions={analytics.daily_task_completion} distribution={analytics.project_status_distribution} />
    </div>
  );
}
