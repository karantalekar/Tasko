"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  api,
  allPages,
  ApiError,
  type Analytics,
  type CalendarEvent,
  type Member,
  type Project,
  type Session,
  type Task,
  type Team,
  type Timer,
  type User,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const AccountForm = dynamic(() => import("@/components/auth/account-form").then((module) => module.AccountForm));
const LandingPage = dynamic(() => import("@/components/landing-page").then((module) => module.LandingPage));

type Data = {
  projects: Project[];
  tasks: Task[];
  members: Member[];
  analytics: Analytics | null;
  timers: Timer[];
};
const emptyData: Data = {
  projects: [],
  tasks: [],
  members: [],
  analytics: null,
  timers: [],
};
type ApiContextValue = Data & {
  user: User;
  teams: Team[];
  team: Team | null;
  isOwner: boolean;
  loading: boolean;
  error: string | null;
  revision: number;
  selectTeam: (id: string) => void;
  refresh: () => Promise<void>;
  mutate: <T>(path: string, method: string, body?: unknown) => Promise<T>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  updateTeam: (team: Team) => void;
};
const ApiContext = createContext<ApiContextValue | null>(null);
export function useApi() {
  const value = useContext(ApiContext);
  if (!value) throw new Error("useApi requires ApiProvider");
  return value;
}

export function ApiProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState("");
  const activeTeamId = useRef(teamId);
  activeTeamId.current = teamId;
  const [teamsReady, setTeamsReady] = useState(false);
  const [data, setData] = useState<Data>(emptyData);
  const [loading, setLoading] = useState(false);
  const [loadedTeamId, setLoadedTeamId] = useState("");
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const teamsRequest = useRef<AbortController | null>(null);
  const { setTheme } = useTheme();
  const setThemeRef = useRef(setTheme);
  setThemeRef.current = setTheme;
  const acceptSession = useCallback((value: Session | null) => {
    sessionRef.current = value;
    setSession(value);
    if (value)
      setThemeRef.current(value.user.preferences.dark_mode ? "dark" : "light");
  }, []);

  const checkSession = useCallback(async () => {
    setChecking(true);
    setSessionError(null);
    try {
      acceptSession(await api<Session>("/auth/session"));
    } catch (error) {
      acceptSession(null);
      if (!(error instanceof ApiError && error.status === 401))
        setSessionError((error as Error).message);
    } finally {
      setChecking(false);
    }
  }, [acceptSession]);
  useEffect(() => {
    void checkSession();
  }, [checkSession]);
  useEffect(() => {
    if (session && (pathname === "/login" || pathname === "/register"))
      router.replace("/");
  }, [session, pathname, router]);

  const loadTeams = useCallback(async () => {
    teamsRequest.current?.abort();
    const controller = new AbortController();
    teamsRequest.current = controller;
    setTeamsReady(false);
    setError(null);
    try {
      const list = await allPages<Team>("/teams", controller.signal);
      if (controller.signal.aborted) return;
      setTeams(list);
      setTeamId((current) =>
        list.some((t) => t.id === current) ? current : list[0]?.id || "",
      );
      setTeamsReady(true);
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof ApiError && error.status === 401)
        acceptSession(null);
      else setError((error as Error).message);
    }
  }, [acceptSession]);
  useEffect(() => {
    if (session?.user.id) void loadTeams();
    else {
      setTeams([]);
      setTeamId("");
      setData(emptyData);
      setTeamsReady(false);
    }
    return () => {
      teamsRequest.current?.abort();
      request.current?.abort();
    };
  }, [session?.user.id, loadTeams]);

  const refresh = useCallback(async () => {
    if (activeTeamId.current !== teamId) return;
    request.current?.abort();
    if (!teamId || !sessionRef.current) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);
    const path = `/teams/${teamId}`;
    const start = new Date(
      Date.UTC(new Date().getFullYear(), 0, 1),
    ).toISOString();
    const end = new Date(
      Date.UTC(new Date().getFullYear() + 1, 0, 1),
    ).toISOString();
    try {
      const [projects, tasks, members, analytics, timers] = await Promise.all([
        allPages<Project>(`${path}/projects`, controller.signal),
        allPages<Task>(`${path}/tasks`, controller.signal),
        allPages<Member>(`${path}/members`, controller.signal),
        api<Analytics>(
          `${path}/analytics?${new URLSearchParams({ from: start, to: end })}`,
          { signal: controller.signal },
        ),
        allPages<Timer>(`${path}/time-entries`, controller.signal),
      ]);
      if (!controller.signal.aborted) {
        setData({ projects, tasks, members, analytics, timers });
        setLoadedTeamId(teamId);
        setRevision((value) => value + 1);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setData(emptyData);
      if (error instanceof ApiError && error.status === 401)
        acceptSession(null);
      else setError((error as Error).message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [teamId, acceptSession]);
  useEffect(() => {
    setData(emptyData);
    setLoadedTeamId("");
    void refresh();
    return () => request.current?.abort();
  }, [refresh]);

  async function mutate<T>(
    path: string,
    method: string,
    body?: unknown,
  ): Promise<T> {
    try {
      return await api<T>(
        path,
        {
          method,
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        },
        sessionRef.current?.csrf_token,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        acceptSession(null);
      throw error;
    }
  }
  async function logout() {
    await mutate("/auth/logout", "POST");
    request.current?.abort();
    teamsRequest.current?.abort();
    acceptSession(null);
    setData(emptyData);
    setTeams([]);
    setTeamId("");
  }

  if (checking)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
      >
        Connecting to your account…
      </div>
    );
  if (!session && pathname === "/") return <LandingPage />;
  if (!session)
    return (
      <AccountForm
        register={pathname === "/register"}
        onSession={acceptSession}
        connectionError={sessionError}
        onRetry={checkSession}
      />
    );
  if (!teamsReady)
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
        <p role={error ? "alert" : "status"}>
          {error || "Loading your teams…"}
        </p>
        {error && <Button onClick={() => void loadTeams()}>Retry</Button>}
        <Button
          variant="outline"
          onClick={() => void logout().catch((e) => setError(e.message))}
        >
          Sign out
        </Button>
      </div>
    );
  if (!teams.length && session.user.role === "member")
    return (
      <MemberSetup
        email={session.user.email}
        onRefresh={loadTeams}
        onLogout={logout}
      />
    );
  if (!teams.length)
    return (
      <TeamSetup
        onCreate={async (name, organization, email_domain) => {
          await mutate("/teams", "POST", { name, organization, email_domain });
          await loadTeams();
        }}
        onLogout={logout}
      />
    );
  const team = teams.find((t) => t.id === teamId) || null;
  return (
    <ApiContext.Provider
      value={{
        ...data,
        user: session.user,
        teams,
        team,
        isOwner:
          session.user.role === "owner" && team?.owner_id === session.user.id,
        loading,
        error,
        revision,
        selectTeam: (id) => {
          if (id === teamId) return;
          activeTeamId.current = id;
          request.current?.abort();
          setData(emptyData);
          setLoadedTeamId("");
          setLoading(true);
          setError(null);
          setTeamId(id);
        },
        refresh,
        mutate,
        logout,
        updateUser: (user) => acceptSession({ ...session, user }),
        updateTeam: (updated) => setTeams((current) => current.map((item) => item.id === updated.id ? updated : item)),
      }}
    >
      {error ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p role="alert">{error}</p>
          <Button onClick={() => void refresh()}>Retry loading data</Button>
          <Button
            variant="outline"
            onClick={() => void logout().catch((e) => setError(e.message))}
          >
            Sign out
          </Button>
        </div>
      ) : loadedTeamId !== teamId ? (
        <div
          className="min-h-screen flex items-center justify-center"
          role="status"
        >
          Loading your workspace…
        </div>
      ) : (
        <>
          {loading && (
            <div
              role="status"
              className="fixed bottom-4 right-4 z-50 rounded-md bg-card border p-3 text-sm shadow-lg"
            >
              Refreshing workspace...
            </div>
          )}
          {children}
        </>
      )}
    </ApiContext.Provider>
  );
}

function MemberSetup({
  email,
  onRefresh,
  onLogout,
}: {
  email: string;
  onRefresh: () => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Join your team</h1>
        <p className="text-sm text-muted-foreground">
          Ask your team owner to add your registered email:{" "}
          <strong>{email}</strong>.
        </p>
        <p className="text-sm text-muted-foreground">
          Once you are added, check for team access to open your workspace.
        </p>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        <Button disabled={busy} onClick={() => void run(onRefresh)}>
          Check for team access
        </Button>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => void run(onLogout)}
        >
          Sign out
        </Button>
      </Card>
    </div>
  );
}

function TeamSetup({
  onCreate,
  onLogout,
}: {
  onCreate: (name: string, organization: string, emailDomain: string) => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold">Create your first team</h1>
        <p className="text-muted-foreground text-sm">
          Start a workspace, or ask an existing team owner to add your
          registered email.
        </p>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const values = new FormData(e.currentTarget);
            const name = String(values.get("name") || "").trim();
            const organization = String(values.get("organization") || "").trim();
            const domain = String(values.get("email_domain") || "").trim();
            setBusy(true);
            setError(null);
            try {
              await onCreate(name, organization, domain);
            } catch (error) {
              setError((error as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Label htmlFor="team-name">Team name</Label>
          <Input id="team-name" name="name" required maxLength={150} />
          <Label htmlFor="team-organization">Organisation name</Label>
          <Input id="team-organization" name="organization" required maxLength={150} placeholder="Whitecode" />
          <Label htmlFor="team-domain">Organisation email domain</Label>
          <Input id="team-domain" name="email_domain" required maxLength={253} placeholder="whitecode.com" />
          <p className="text-sm text-muted-foreground">Member emails must use this exact domain, for example karan.talekar@whitecode.com.</p>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          <Button disabled={busy}>Create team</Button>
        </form>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => void onLogout().catch((e) => setError(e.message))}
        >
          Sign out
        </Button>
      </Card>
    </div>
  );
}

export function useEvents(from: string, to: string) {
  const {
    team,
    mutate,
    revision: workspaceRevision,
    refresh: refreshWorkspace,
  } = useApi();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!team) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setEvents([]);
    allPages<CalendarEvent>(
      `/teams/${team.id}/events?${new URLSearchParams({ from, to })}`,
      controller.signal,
    )
      .then((data) => {
        if (!controller.signal.aborted) setEvents(data);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(e.message);
          if (e instanceof ApiError && e.status === 401)
            void refreshWorkspace();
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [team?.id, from, to, revision, workspaceRevision, refreshWorkspace]);
  return {
    events,
    loading,
    error,
    refresh: () => setRevision((r) => r + 1),
    mutate,
  };
}
