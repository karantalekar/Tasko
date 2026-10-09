"use client";

import { useState } from "react";
import { useApi } from "@/components/api-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusLabel, type Project, type Status, type Task } from "@/lib/api";

const selectClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
type Kind = "project" | "task" | "member" | "event" | "team";
const titles: Record<Kind, string> = {
  project: "Add Project",
  task: "Add Task",
  member: "Add Member",
  event: "Add Event",
  team: "Create Team",
};

export function CreateAction({
  kind,
  onCreated,
  defaultDate,
}: {
  kind: Kind;
  onCreated?: () => void;
  defaultDate?: string;
}) {
  const { team, isOwner, projects, members, mutate, refresh, user } = useApi();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (kind === "team" && user.role !== "owner") return null;
  if (kind !== "team" && kind !== "task" && kind !== "event" && !isOwner) return null;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!busy) {
          setOpen(value);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>+ {titles[kind]}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titles[kind]}</DialogTitle>
          <DialogDescription>
            {kind === "member"
              ? team?.email_domain
                ? `Enter a registered member email ending in @${team.email_domain}.`
                : "Set the organisation email domain in Settings before adding members."
              : `Save ${kind === "team" ? "a new workspace" : `a new ${kind} in ${team?.name}`}.`}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            setBusy(true);
            setError(null);
            const field = (key: string) => String(form.get(key) || "").trim();
            const stamp = (key: string) =>
              field(key) ? new Date(field(key)).toISOString() : null;
            try {
              let projectId = field("project_id");
              if (kind === "task" && !projectId && projects.length === 0) {
                if (!isOwner) throw new Error("Ask the team owner to create a project before adding tasks.");
                const projectName = field("project_name");
                if (!projectName)
                  throw new Error("Enter a project name for your first task.");
                const project = await mutate<Project>(
                  `/teams/${team!.id}/projects`,
                  "POST",
                  { name: projectName },
                );
                projectId = project.id;
                await refresh();
              }
              let body: unknown;
              if (kind === "project")
                body = {
                  name: field("name"),
                  description: field("description"),
                  status: field("status"),
                  due_at: stamp("due_at"),
                };
              else if (kind === "task")
                body = {
                  title: field("name"),
                  description: field("description"),
                  project_id: projectId,
                  assignee_id: isOwner ? field("assignee_id") || null : user.id,
                  priority: field("priority"),
                  due_at: stamp("due_at"),
                  tags: field("tags")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                };
              else if (kind === "member") {
                if (!team?.email_domain) throw new Error("Set your organisation email domain in Settings first.");
                if (field("email").split("@").pop()?.toLowerCase() !== team.email_domain.toLowerCase())
                  throw new Error(`Member email must use @${team.email_domain}.`);
                body = { email: field("email"), job_title: field("job_title") };
              }
              else if (kind === "event")
                body = {
                  title: field("name"),
                  starts_at: stamp("starts_at"),
                  ends_at: stamp("ends_at"),
                };
              else body = { name: field("name"), organization: field("organization"), email_domain: field("email_domain") };
              await mutate(
                kind === "team"
                  ? "/teams"
                  : `/teams/${team!.id}/${{ project: "projects", task: "tasks", member: "members", event: "events" }[kind]}`,
                "POST",
                body,
              );
              setOpen(false);
              if (kind === "team") window.location.reload();
              else if (kind === "event") onCreated?.();
              else await refresh();
            } catch (error) {
              setError((error as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {kind === "member" ? (
            <>
              <Field
                label="Registered email"
                name="email"
                type="email"
                required
              />
              <Field label="Job title" name="job_title" maxLength={120} />
            </>
          ) : (
            <Field
              label={kind === "task" || kind === "event" ? "Title" : "Name"}
              name="name"
              required
              maxLength={150}
            />
          )}
          {(kind === "project" || kind === "task") && (
            <>
              <Field label="Description" name="description" maxLength={5000} />
              <Field label="Due date" name="due_at" type="datetime-local" />
            </>
          )}
          {kind === "team" && <>
            <Field label="Organisation name" name="organization" required maxLength={150} placeholder="Whitecode" />
            <Field label="Organisation email domain" name="email_domain" required maxLength={253} placeholder="whitecode.com" />
            <p className="text-sm text-muted-foreground">All member emails must use this exact domain.</p>
          </>}
          {kind === "project" && <StatusField />}
          {kind === "task" && (
            <>
              {projects.length ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Project</span>
                  <select
                    aria-label="Project"
                    className={selectClass}
                    name="project_id"
                    required
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : isOwner ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Tasks belong to a project. Create your first project along
                    with this task.
                  </p>
                  <Field
                    label="New project name"
                    name="project_name"
                    required
                    maxLength={150}
                  />
                </div>
              ) : <p className="text-sm text-muted-foreground">Ask the team owner to create a project before adding tasks.</p>}
              {isOwner ? <label className="block space-y-2">
                <span className="text-sm font-medium">Assignee</span>
                <select
                  aria-label="Assignee"
                  className={selectClass}
                  name="assignee_id"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label> : <p className="text-sm text-muted-foreground">This task will be assigned to you ({user.name}).</p>}
              <label className="block space-y-2">
                <span className="text-sm font-medium">Priority</span>
                <select
                  className={selectClass}
                  name="priority"
                  aria-label="Priority"
                  defaultValue="medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <Field label="Tags (comma separated)" name="tags" />
            </>
          )}
          {kind === "event" && (
            <>
              <Field
                label="Starts"
                name="starts_at"
                type="datetime-local"
                required
                defaultValue={defaultDate ? `${defaultDate}T09:00` : undefined}
              />
              <Field
                label="Ends"
                name="ends_at"
                type="datetime-local"
                required
                defaultValue={defaultDate ? `${defaultDate}T10:00` : undefined}
              />
            </>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy || (kind === "task" && !isOwner && !projects.length)}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`create-${name}`}>{label}</Label>
      <Input id={`create-${name}`} name={name} {...props} />
    </div>
  );
}
function StatusField({ value = "pending" }: { value?: Status }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">Status</span>
      <select
        aria-label="Status"
        name="status"
        className={selectClass}
        defaultValue={value}
      >
        {(["pending", "in_progress", "completed", "on_hold"] as Status[]).map(
          (status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

export function EditProject({ project }: { project: Project }) {
  const { team, mutate, refresh, isOwner } = useApi();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isOwner) return null;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!busy) {
          setOpen(value);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Update this project and its status.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            setBusy(true);
            setError(null);
            try {
              await mutate(`/teams/${team!.id}/projects/${project.id}`, "PUT", {
                name: String(form.get("name")).trim(),
                description: String(form.get("description") || ""),
                status: form.get("status"),
                due_at: project.due_at,
              });
              setOpen(false);
              await refresh();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field
            label="Name"
            name="name"
            defaultValue={project.name}
            required
            maxLength={150}
          />
          <Field
            label="Description"
            name="description"
            defaultValue={project.description}
            maxLength={5000}
          />
          <StatusField value={project.status} />
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          <Button disabled={busy}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditTask({ task }: { task: Task }) {
  const { team, mutate, refresh, isOwner, user, members } = useApi();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isOwner && task.assignee_id !== user.id) return null;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!busy) {
          setOpen(value);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Changes are saved to your team.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            setBusy(true);
            setError(null);
            try {
              await mutate(`/teams/${team!.id}/tasks/${task.id}`, "PATCH", {
                version: task.version,
                title: String(form.get("name")).trim(),
                description: String(form.get("description") || ""),
                status: form.get("status"),
                ...(isOwner
                  ? { assignee_id: form.get("assignee_id") || null }
                  : {}),
              });
              setOpen(false);
              await refresh();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field
            label="Title"
            name="name"
            defaultValue={task.title}
            required
            maxLength={150}
          />
          <Field
            label="Description"
            name="description"
            defaultValue={task.description}
            maxLength={5000}
          />
          <StatusField value={task.status} />
          {isOwner && (
            <label className="block space-y-2">
              <span className="text-sm font-medium">Assignee</span>
              <select
                className={selectClass}
                name="assignee_id"
                aria-label="Assignee"
                defaultValue={task.assignee_id || ""}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {error && (
            <p role="alert" className="text-destructive">
              {error} Reload workspace data before retrying a conflicting
              update.
            </p>
          )}
          <Button disabled={busy}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
