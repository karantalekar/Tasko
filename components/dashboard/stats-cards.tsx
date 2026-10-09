"use client";
import { Card } from "@/components/ui/card";
import { useApi } from "@/components/api-provider";
import Link from "next/link";
import {
  ArrowUpRight,
  Layers3,
  CircleCheck,
  Timer,
  Hourglass,
} from "lucide-react";
export function StatsCards() {
  const { analytics } = useApi();
  const distribution = analytics?.project_status_distribution;
  const stats = [
    {
      title: "Total Projects",
      icon: Layers3,
      value: distribution
        ? Object.values(distribution).reduce((a, b) => a + b, 0)
        : null,
    },
    {
      title: "Ended Projects",
      value: distribution?.completed,
      icon: CircleCheck,
    },
    {
      title: "Running Projects",
      value: distribution?.in_progress,
      icon: Timer,
    },
    {
      title: "Pending Projects",
      value: distribution?.pending,
      icon: Hourglass,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <Card
          key={stat.title}
          className={`dashboard-card group gap-3 p-5 ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card"}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`rounded-xl p-2 ${i === 0 ? "bg-white/15" : "bg-primary/10 text-primary"}`}
            >
              <stat.icon className="h-5 w-5" />
            </span>
            <Link
              href="/analytics"
              aria-label={`View ${stat.title.toLowerCase()}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${i === 0 ? "hover:bg-white/20" : "hover:bg-primary/10 text-primary"}`}
            >
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <h3 className="text-sm text-inherit opacity-80">{stat.title}</h3>
          <p className="text-3xl font-bold">{stat.value ?? "—"}</p>
        </Card>
      ))}
    </div>
  );
}
