"use client";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/components/api-provider";
import { CalendarClock } from "lucide-react";
import { WidgetTitle } from "./widget-title";
export function Reminders() {
  const range = useMemo(() => {
    const from = new Date();
    const to = new Date(from);
    to.setDate(to.getDate() + 7);
    return { from: from.toISOString(), to: to.toISOString() };
  }, []);
  const { events, loading, error, refresh } = useEvents(range.from, range.to);
  return (
    <Card className="dashboard-card group gap-0 p-6">
      <WidgetTitle
        title="Upcoming Events"
        icon={CalendarClock}
        href="/calendar"
      />
      <p className="text-xs text-muted-foreground mb-3">Next 7 days</p>
      {loading ? (
        <p role="status">Loading events...</p>
      ) : error ? (
        <div role="alert">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : events.length ? (
        <div className="space-y-3 max-h-64 overflow-auto">
          {events.map((event) => (
            <div key={event.id} className="p-3 border rounded-lg">
              <p className="font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.starts_at).toLocaleString()} –{" "}
                {new Date(event.ends_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No upcoming events.</p>
      )}
    </Card>
  );
}
