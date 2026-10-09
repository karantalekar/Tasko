export type Status = "pending" | "in_progress" | "completed" | "on_hold";
export type Preferences = {
  email_notifications: boolean;
  push_notifications: boolean;
  task_reminders: boolean;
  team_updates: boolean;
  dark_mode: boolean;
};
export type User = {
  role: "owner" | "member";
  id: string;
  name: string;
  email: string;
  preferences: Preferences;
};
export type Session = { user: User; csrf_token: string; expires_at: string };
export type Team = {
  id: string;
  name: string;
  owner_id: string;
  organization: string | null;
  email_domain: string | null;
};
export type Project = {
  id: string;
  name: string;
  description: string;
  status: Status;
  due_at: string | null;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assignee_id: string | null;
  priority: "low" | "medium" | "high";
  due_at: string | null;
  tags: string[];
  status: Status;
  completed_at: string | null;
  version: number;
};
export type Member = {
  user_id: string;
  name: string;
  email: string;
  job_title: string;
  role: "owner" | "member";
  active_tasks: number;
};
export type CalendarEvent = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
};
export type Timer = {
  id: string;
  task_id: string;
  started_at: string;
  ended_at: string | null;
  running: boolean;
};
export type Analytics = {
  tasks_completed: number;
  active_projects: number;
  team_members: number;
  average_completion_seconds: number | null;
  monthly_task_completion: { month: string; count: number }[];
  daily_task_completion: { date: string; count: number }[];
  total_working_minutes: number;
  project_status_distribution: Record<Status, number>;
};
export type Timesheet = {
  id: string;
  team_id: string;
  user_id: string;
  member_name: string;
  task_id: string;
  task_title: string;
  project_name: string;
  work_date: string;
  minutes: number;
  notes: string;
  created_at: string;
};
export type Page<T> = { items: T[]; total: number; limit: number; offset: number };

const baseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  csrf?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (csrf) headers.set("X-CSRF-Token", csrf);
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new ApiError(
      0,
      "Cannot reach the API. Check that the backend is running and allows this frontend origin.",
    );
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const details = body?.error?.details;
    const validation = Array.isArray(details)
      ? details
          .map(
            (d: {
              location?: (string | number)[];
              loc?: (string | number)[];
              type?: string;
              msg?: string;
            }) => {
              const field =
                (d.location || d.loc)?.slice(1).join(".") || "Input";
              if (path === "/auth/register") {
                if (field === "password")
                  return "Password must contain 12–128 characters.";
                if (field === "email")
                  return "Enter a valid email address, for example name@whitecode.com.";
                if (field === "name")
                  return "Name must contain 1–150 characters.";
              }
              return `${field}: ${d.msg || (d.type ? d.type.replaceAll("_", " ") : "Invalid value")}`;
            },
          )
          .join("; ")
      : "";
    throw new ApiError(
      response.status,
      validation ||
        body?.error?.message ||
        body?.detail ||
        `Request failed (${response.status})`,
    );
  }
  return body as T;
}

// Follow every page; a dashboard must never treat the first 20 rows as the total.
export async function allPages<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = [];
  for (let offset = 0; ; offset += 100) {
    if (offset > 10000)
      throw new ApiError(
        0,
        "This dataset exceeds the API paging limit. Narrow the date range or filters.",
      );
    const page = await api<Page<T>>(
      `${path}${path.includes("?") ? "&" : "?"}limit=100&offset=${offset}`,
      { signal },
    );
    items.push(...page.items);
    if (items.length >= page.total) return items;
    if (page.items.length === 0)
      throw new ApiError(
        0,
        "Data changed while loading. Refresh the workspace and try again.",
      );
  }
}

export const statusLabel = (status: Status) =>
  ({
    pending: "Pending",
    in_progress: "In progress",
    completed: "Completed",
    on_hold: "On hold",
  })[status];
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
export const dateLabel = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No due date";
