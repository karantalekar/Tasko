"use client";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/api-provider";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { WidgetTitle } from "./widget-title";
import dynamic from "next/dynamic";

const CompletionChart = dynamic(() => import("./completion-chart"), {
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" role="status" aria-label="Loading task chart" />,
  ssr: false,
});
export function ProjectAnalytics() {
  const { analytics } = useApi();
  const chartData =
    analytics?.daily_task_completion.map((row) => ({
      date: row.date,
      tasks: row.count,
    })) || [];
  return (
    <Card className="dashboard-card group gap-0 p-6">
      <WidgetTitle
        title="Task Completion"
        icon={ChartNoAxesColumnIncreasing}
        href="/analytics"
      />
      <p className="text-sm text-muted-foreground mb-4">
        Actual completion dates this year (UTC)
      </p>
      {chartData.length ? (
        <CompletionChart data={chartData} />
      ) : (
        <p className="text-muted-foreground">No completed tasks in this period.</p>
      )}
    </Card>
  );
}
