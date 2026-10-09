"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useApi } from "@/components/api-provider";
import { api, type Page, type Timesheet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const duration = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
const localToday = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export function TimesheetsContent() {
  const { team, user } = useApi();
  return team ? <TeamTimesheets key={`${team.id}:${user.id}`} teamId={team.id} /> : null;
}

function TeamTimesheets({ teamId }: { teamId: string }) {
  const { isOwner, user, tasks, members, mutate, refresh, revision } = useApi();
  const assignedTasks = tasks.filter((task) => task.assignee_id === user.id);
  const [taskId, setTaskId] = useState("");
  const [workDate, setWorkDate] = useState(localToday);
  const [hours, setHours] = useState("1");
  const [minutes, setMinutes] = useState("0");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [memberId, setMemberId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);
  const [reload, setReload] = useState(0);
  const [history, setHistory] = useState<Page<Timesheet> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const invalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  useEffect(() => {
    const controller = new AbortController();
    setHistory(null);
    setLoadError("");
    if (invalidRange) {
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    const params = new URLSearchParams({ limit: "20", offset: String(offset) });
    if (isOwner && memberId) params.set("member_id", memberId);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    void api<Page<Timesheet>>(`/teams/${teamId}/timesheets?${params}`, { signal: controller.signal })
      .then((result) => { if (!controller.signal.aborted) setHistory(result); })
      .catch((error: Error) => { if (!controller.signal.aborted) setLoadError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [teamId, isOwner, memberId, dateFrom, dateTo, offset, reload, revision, invalidRange]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSuccess("");
    const totalMinutes = Number(hours) * 60 + Number(minutes);
    if (!Number.isInteger(totalMinutes) || totalMinutes < 1 || totalMinutes > 1440) {
      setSubmitError("Enter a duration between 1 minute and 24 hours.");
      return;
    }
    if (!notes.trim()) { setSubmitError("Describe the work you completed."); return; }
    setSaving(true);
    try {
      await mutate(`/teams/${teamId}/timesheets`, "POST", {
        task_id: taskId, work_date: workDate, minutes: totalMinutes, notes: notes.trim(),
      });
      setNotes("");
      setSuccess("Timesheet submitted. Your team owner can now view it.");
      setOffset(0);
      await refresh();
    } catch (error) { setSubmitError((error as Error).message); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      {!isOwner && user.role === "member" && (
        <Card className="p-5 md:p-6">
          <h2 className="text-lg font-semibold">Submit a timesheet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Log time against an assigned task. Submitted entries are kept as a permanent history.</p>
          {assignedTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">You need an assigned task before you can submit a timesheet.</p>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4">
              <fieldset disabled={saving} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timesheet-task">Task</Label>
                    <select id="timesheet-task" required value={taskId} onChange={(e) => setTaskId(e.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                      <option value="">Select an assigned task</option>
                      {assignedTasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timesheet-date">Work date</Label>
                    <Input id="timesheet-date" type="date" required value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timesheet-hours">Hours</Label>
                    <Input id="timesheet-hours" type="number" min="0" max="24" step="1" required value={hours} onChange={(e) => setHours(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timesheet-minutes">Minutes</Label>
                    <Input id="timesheet-minutes" type="number" min="0" max="59" step="1" required value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timesheet-notes">Work summary</Label>
                  <Textarea id="timesheet-notes" required maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you work on?" />
                </div>
                <Button type="submit">{saving ? "Submitting..." : "Submit timesheet"}</Button>
              </fieldset>
            </form>
          )}
          {submitError && <p role="alert" className="mt-3 text-sm text-destructive">{submitError}</p>}
          {success && <p role="status" className="mt-3 text-sm text-primary">{success}</p>}
        </Card>
      )}
      <Card className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{isOwner ? "Team timesheet history" : "My timesheet history"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{isOwner ? "Review member submissions for your active team." : "View your submitted work entries."}</p>
          </div>
          <Button variant="outline" disabled={loading} onClick={() => setReload((value) => value + 1)}>Refresh history</Button>
        </div>
        <div className="my-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isOwner && <div className="space-y-2">
            <Label htmlFor="timesheet-member-filter">Member</Label>
            <select id="timesheet-member-filter" value={memberId} onChange={(e) => { setMemberId(e.target.value); setOffset(0); }} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
              <option value="">All members</option>
              {members.filter((member) => member.role === "member").map((member) => <option key={member.user_id} value={member.user_id}>{member.name}</option>)}
            </select>
          </div>}
          <div className="space-y-2">
            <Label htmlFor="timesheet-from">From date</Label>
            <Input id="timesheet-from" type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setOffset(0); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timesheet-to">To date</Label>
            <Input id="timesheet-to" type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setOffset(0); }} />
          </div>
        </div>
        {invalidRange && <p role="alert" className="text-sm text-destructive">End date must be on or after start date.</p>}
        {loadError && <p role="alert" className="text-sm text-destructive">{loadError}</p>}
        {loading && <p role="status" className="text-sm text-muted-foreground">Loading timesheets...</p>}
        {!loading && history && <>
          {history.total === 0 ? <p className="py-6 text-sm text-muted-foreground">No timesheets found for these filters.</p> : <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-muted-foreground"><tr>
                  <th scope="col" className="p-3">Work date</th>
                  {isOwner && <th scope="col" className="p-3">Member</th>}
                  <th scope="col" className="p-3">Task / project</th>
                  <th scope="col" className="p-3">Time</th>
                  <th scope="col" className="p-3">Work summary</th>
                  <th scope="col" className="p-3">Submitted</th>
                </tr></thead>
                <tbody>{history.items.map((entry) => <tr key={entry.id} className="border-b align-top">
                  <td className="whitespace-nowrap p-3">{new Date(`${entry.work_date}T00:00:00`).toLocaleDateString()}</td>
                  {isOwner && <td className="p-3">{entry.member_name}</td>}
                  <td className="min-w-40 p-3"><p className="font-medium">{entry.task_title}</p><p className="text-muted-foreground">{entry.project_name}</p></td>
                  <td className="whitespace-nowrap p-3">{duration(entry.minutes)}</td>
                  <td className="min-w-48 max-w-md whitespace-pre-wrap break-words p-3">{entry.notes}</td>
                  <td className="whitespace-nowrap p-3 text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{offset + 1}–{offset + history.items.length} of {history.total} entries · {duration(history.items.reduce((sum, entry) => sum + entry.minutes, 0))} on this page</p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={offset === 0} onClick={() => setOffset((value) => Math.max(0, value - 20))}>Previous</Button>
                <Button variant="outline" disabled={offset + 20 >= history.total || offset >= 10000} onClick={() => setOffset((value) => value + 20)}>Next</Button>
              </div>
            </div>
            {offset >= 10000 && offset + history.items.length < history.total && (
              <p className="mt-3 text-sm text-muted-foreground">Narrow the date range or member filter to view more entries.</p>
            )}
          </>}
        </>}
      </Card>
    </div>
  );
}
