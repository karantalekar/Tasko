"use client";
import { useState } from "react";
import { useApi } from "@/components/api-provider";
import { useMeetings } from "./use-meetings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MeetingsContent() {
  const { user, teams, mutate } = useApi();
  const { meetings, loading, error, refresh } = useMeetings();
  const ownedTeams = teams.filter(t => t.owner_id === user.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  return <div className="space-y-6">
    {ownedTeams.length > 0 && <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Schedule a meeting</h2>
      <form className="space-y-4" onSubmit={async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setFormError(""); setMessage("");
        if (!selected.length) { setFormError("Select at least one team."); return; }
        const start = new Date(String(data.get("starts_at")));
        const end = new Date(String(data.get("ends_at")));
        if (end <= start) { setFormError("End time must be after start time."); return; }
        setSaving(true);
        try {
          await mutate("/meetings", "POST", {
            title: data.get("title"), url: data.get("url"),
            starts_at: start.toISOString(), ends_at: end.toISOString(), team_ids: selected,
          });
          form.reset(); setSelected([]); refresh();
          setMessage("Meeting scheduled. Selected teams can see it in their calendars and in-app notifications.");
        } catch (e) { setFormError((e as Error).message); }
        finally { setSaving(false); }
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="meeting-title">Meeting title</Label><Input id="meeting-title" name="title" required maxLength={150} placeholder="Weekly team catch-up" /></div>
          <div className="space-y-2"><Label htmlFor="meeting-url">Meeting URL</Label><Input id="meeting-url" name="url" type="url" pattern="https?://.*" required placeholder="https://meet.google.com/..." /></div>
          <div className="space-y-2"><Label htmlFor="meeting-start">Starts at (your local time)</Label><Input id="meeting-start" name="starts_at" type="datetime-local" required /></div>
          <div className="space-y-2"><Label htmlFor="meeting-end">Ends at (your local time)</Label><Input id="meeting-end" name="ends_at" type="datetime-local" required /></div>
        </div>
        <fieldset className="space-y-2"><legend className="text-sm font-medium mb-2">Teams with access</legend>
          {ownedTeams.map(t => <label key={t.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(t.id)} onChange={e => setSelected(ids => e.target.checked ? [...ids, t.id] : ids.filter(id => id !== t.id))} />{t.name}</label>)}
        </fieldset>
        {formError && <p role="alert" className="text-destructive text-sm">{formError}</p>}
        {message && <p role="status" className="text-sm">{message}</p>}
        <Button disabled={saving}>{saving ? "Scheduling..." : "Schedule and notify teams"}</Button>
      </form>
    </Card>}
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Your meetings</h2><Button variant="outline" onClick={refresh}>Refresh</Button></div>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {loading ? <p role="status">Loading meetings...</p> : meetings.length === 0 ? <Card className="p-6 text-muted-foreground">No meetings have been shared with your teams yet.</Card> :
      <div className="grid gap-4 md:grid-cols-2">{[...meetings].sort((a,b) => a.starts_at.localeCompare(b.starts_at)).map(m => <Card key={m.id} className="p-5 space-y-3">
        <h3 className="font-semibold">{m.title}</h3>
        <p className="text-sm text-muted-foreground">{new Date(m.starts_at).toLocaleString()} – {new Date(m.ends_at).toLocaleString()}</p>
        <p className="text-sm">Teams: {teams.filter(t => m.team_ids.includes(t.id)).map(t => t.name).join(", ")}</p>
        <p className="text-sm text-muted-foreground break-all">{m.url}</p>
        <Button asChild><a href={m.url}>Join meeting</a></Button>
      </Card>)}</div>}
  </div>;
}
