"use client";
import { Bell } from "lucide-react";
import { useApi } from "@/components/api-provider";
import { useMeetings } from "./use-meetings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function MeetingNotifications() {
  const { mutate } = useApi();
  const { meetings, error, loading, refresh } = useMeetings();
  const [readError, setReadError] = useState("");
  const unread = meetings.filter(m => !m.read);
  return <Popover><PopoverTrigger asChild>
    <Button variant="outline" size="sm" aria-label={`Meeting notifications, ${unread.length} unread`} className="relative">
      <Bell className="h-4 w-4" />{unread.length > 0 && <span className="text-xs">{unread.length}</span>}
    </Button>
  </PopoverTrigger><PopoverContent align="end" className="w-80 max-h-96 overflow-y-auto space-y-3">
    <h2 className="font-semibold">Meeting notifications</h2>
    {(error || readError) && <p role="alert" className="text-sm text-destructive">{error || readError}</p>}
    {loading && <p role="status" className="text-sm">Loading...</p>}
    {!loading && !unread.length && <p className="text-sm text-muted-foreground">You’re all caught up.</p>}
    {unread.map(m => <div key={m.id} className="border rounded-lg p-3 space-y-2">
      <p className="font-medium text-sm">New meeting: {m.title}</p>
      <p className="text-xs text-muted-foreground">{new Date(m.starts_at).toLocaleString()}</p>
      <div className="flex gap-2"><Button asChild size="sm"><a href={m.url}>Join meeting</a></Button>
        <Button variant="ghost" size="sm" onClick={async () => {
          try { await mutate(`/meetings/${m.id}/read`, "POST"); setReadError(""); refresh(); }
          catch (e) { setReadError((e as Error).message); }
        }}>Mark read</Button></div>
    </div>)}
  </PopoverContent></Popover>;
}
