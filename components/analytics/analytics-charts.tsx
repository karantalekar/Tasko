"use client";

import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { statusLabel, type Status } from "@/lib/api";

const statuses: Status[] = ["pending", "in_progress", "completed", "on_hold"];
const colors = ["#d97706", "#3b82f6", "#059669", "#8b5cf6"];
const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
  month: "short", day: "numeric", timeZone: "UTC",
});

export default function AnalyticsCharts({ dailyCompletions, distribution }: {
  dailyCompletions: { date: string; count: number }[];
  distribution: Record<Status, number>;
}) {
  const completionData = [...dailyCompletions].sort((a, b) => a.date.localeCompare(b.date));
  const projectData = statuses.map((status, index) => ({
    status, name: statusLabel(status), count: distribution[status] ?? 0, fill: colors[index],
  }));
  const totalProjects = projectData.reduce((total, row) => total + row.count, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="min-w-0 gap-0 p-4 sm:p-6">
        <h3 className="text-lg font-semibold">Task completions</h3>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Completed tasks by date this year (UTC)</p>
        {completionData.length ? (
          <>
            <ChartContainer className="h-72 w-full aspect-auto" config={{ count: { label: "Completed tasks", color: "var(--primary)" } }} aria-label="Task completions by date">
              <BarChart accessibilityLayer data={completionData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickFormatter={formatDate} tickLine={false} axisLine={false} minTickGap={28} tickMargin={10} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => formatDate(String(value))} />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[5, 5, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ChartContainer>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-muted-foreground">View completion data</summary>
              <div className="mt-3 max-h-48 overflow-auto">
                <table className="w-full text-left"><caption className="sr-only">Task completions by date</caption><thead><tr><th scope="col" className="py-2">Date (UTC)</th><th scope="col" className="text-right">Tasks</th></tr></thead><tbody>
                  {completionData.map((row) => <tr key={row.date} className="border-t"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>)}
                </tbody></table>
              </div>
            </details>
          </>
        ) : <div className="flex h-72 items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">No completed tasks in this period.</div>}
      </Card>
      <Card className="min-w-0 gap-0 p-4 sm:p-6">
        <h3 className="text-lg font-semibold">Project distribution</h3>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Current workspace projects by status</p>
        {totalProjects > 0 ? (
          <ChartContainer className="h-64 w-full aspect-auto" config={Object.fromEntries(projectData.map((row) => [row.status, { label: row.name, color: row.fill }]))} aria-label={`${totalProjects} projects by status`}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
              <Pie data={projectData.filter((row) => row.count > 0)} dataKey="count" nameKey="status" innerRadius={72} outerRadius={100} paddingAngle={3} stroke="var(--card)" strokeWidth={3}>
                {projectData.filter((row) => row.count > 0).map((row) => <Cell key={row.status} fill={row.fill} />)}
                <Label content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  return <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle"><tspan x={viewBox.cx} dy="-6" className="fill-foreground text-3xl font-bold">{totalProjects}</tspan><tspan x={viewBox.cx} dy="26" className="fill-muted-foreground text-sm">Projects</tspan></text>;
                }} />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : <div className="flex h-64 items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">No projects in this workspace yet.</div>}
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projectData.map((row) => <li key={row.status} className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.fill }} /><span>{row.name}</span><span className="ml-auto font-semibold tabular-nums">{row.count} <span className="font-normal text-muted-foreground">({totalProjects ? Math.round(row.count / totalProjects * 100) : 0}%)</span></span></li>)}
        </ul>
      </Card>
    </div>
  );
}
