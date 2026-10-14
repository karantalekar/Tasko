"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateAction } from "@/components/workspace-actions";
import { useEvents } from "@/components/api-provider";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function CalendarContent() {
  const [selected, setSelected] = useState(() => new Date());
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const range = useMemo(
    () => ({
      from: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
      to: new Date(month.getFullYear(), month.getMonth() + 1, 1).toISOString(),
    }),
    [month],
  );
  const { events, loading, error, refresh } = useEvents(range.from, range.to);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const start = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate(),
  );
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const daily = events.filter(
    (e) => new Date(e.starts_at) < end && new Date(e.ends_at) > start,
  );
  const date = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`;
  function move(delta: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    setSelected(next);
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            aria-label="Previous month"
            onClick={() => move(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold">
            {month.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button
            variant="outline"
            aria-label="Next month"
            onClick={() => move(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const now = new Date();
              setSelected(now);
              setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
          >
            Today
          </Button>
        </div>
        <CreateAction kind="event" defaultDate={date} onCreated={refresh} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: month.getDay() }, (_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;
              const value = new Date(
                month.getFullYear(),
                month.getMonth(),
                day,
              );
              const next = new Date(
                month.getFullYear(),
                month.getMonth(),
                day + 1,
              );
              const hasEvents = events.some(
                (event) =>
                  new Date(event.starts_at) < next &&
                  new Date(event.ends_at) > value,
              );
              return (
                <button
                  key={day}
                  aria-label={`${value.toLocaleDateString()}${hasEvents ? ", has events" : ""}`}
                  aria-pressed={
                    selected.toDateString() === value.toDateString()
                  }
                  onClick={() => setSelected(value)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm ${selected.toDateString() === value.toDateString() ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                >
                  {day}
                  {hasEvents && (
                    <span className="h-1 w-1 mt-1 rounded-full bg-current" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Events · {selected.toLocaleDateString()}
          </h3>
          {loading ? (
            <p role="status">Loading events...</p>
          ) : error ? (
            <div role="alert">
              <p className="text-destructive text-sm">{error}</p>
              <Button onClick={refresh}>Retry</Button>
            </div>
          ) : daily.length ? (
            <div className="space-y-3">
              {daily.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{event.title}</h4>
                  {event.url && <Button asChild size="sm" className="my-2"><a href={event.url}>Join meeting</a></Button>}
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.starts_at).toLocaleString()} ...{" "}
                    {new Date(event.ends_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No events on this day.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
