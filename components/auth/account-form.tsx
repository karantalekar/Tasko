"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type Session } from "@/lib/api";

export function AccountForm({
  register,
  onSession,
  connectionError,
  onRetry,
}: {
  register: boolean;
  onSession: (session: Session) => void;
  connectionError: string | null;
  onRetry: () => Promise<void>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "member">("member");
  const strength = [
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /[0-9\W]/.test(password),
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-8 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border bg-card shadow-xl shadow-primary/5 lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#eaf0e7] p-10 text-[#18392d] lg:flex">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border-[60px] border-white/35" />
          <div className="relative">
            <Brand />
            <div className="mt-14 max-w-sm">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> A clearer day starts here
              </span>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                Great ideas.
                <br />
                Good people.
                <br />
                <span className="text-[#397e55]">One shared space.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#526d5c]">
                Bring your projects, tasks, and team together. Make a little
                more room for the work you love.
              </p>
            </div>
          </div>
          <div className="relative -mx-6 mt-7 overflow-hidden rounded-3xl">
            <img
              src="/images/tasko-team.webp"
              srcSet="/images/tasko-team-small.webp 640w, /images/tasko-team.webp 1200w"
              sizes="(min-width: 1024px) 50vw, 640px"
              width={1200}
              height={800}
              loading="lazy"
              alt="Team collaborating on a project board"
              className="aspect-[3/2] w-full object-cover mix-blend-multiply"
            />
          </div>
          <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/50 p-4">
            <span className="rounded-xl bg-white p-2 text-[#397e55]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Your work, in good hands.</p>
              <p className="text-xs text-[#526d5c]">
                Clear roles. Secure sessions. Shared purpose.
              </p>
            </div>
          </div>
        </aside>
        <section className="flex flex-col px-6 py-7 sm:px-12 lg:px-14">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
            <div className="lg:hidden">
              <Brand />
            </div>
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <LockKeyhole className="h-3 w-3" /> Secure workspace
            </span>
          </div>
          <div className="mx-auto my-auto w-full max-w-md py-10">
            <div className="mb-7 inline-flex rounded-full border bg-secondary/50 p-1">
              <Link
                href="/login"
                onClick={() => setError(null)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${!register ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => {
                  setError(null);
                  setRegistered(false);
                }}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${register ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Create account
              </Link>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {register ? "Make space for great work." : "Welcome back."}
            </h1>
            <p className="mb-7 mt-3 text-sm text-muted-foreground">
              {register
                ? "A fresh start for you and your team. Let's set it up."
                : "Your projects and people are right where you left them."}
            </p>
            {connectionError && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {connectionError}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => void onRetry()}
                >
                  Retry connection
                </Button>
              </div>
            )}
            {registered && !register && (
              <p
                role="status"
                className="mb-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Account
                created. Sign in with your email and password.
              </p>
            )}
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError(null);
                const values = new FormData(event.currentTarget);
                const credentials = { email: email.trim(), password };
                try {
                  if (register) {
                    const name = String(values.get("name") || "").trim();
                    if (!name || name.length > 150)
                      throw new Error("Name must contain 1–150 characters.");
                    if (password.length < 12 || password.length > 128)
                      throw new Error(
                        "Password must contain 12–128 characters.",
                      );
                    await api("/auth/register", {
                      method: "POST",
                      body: JSON.stringify({ ...credentials, name, role }),
                    });
                    setRegistered(true);
                    setPassword("");
                    setShowPassword(false);
                    router.replace("/login");
                  } else {
                    onSession(
                      await api<Session>("/auth/login", {
                        method: "POST",
                        body: JSON.stringify(credentials),
                      }),
                    );
                    router.replace("/");
                  }
                } catch (error) {
                  setError((error as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {register && (
                <div className="space-y-2">
                  <Label htmlFor="account-name">Full name</Label>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="account-name"
                      name="name"
                      required
                      maxLength={150}
                      autoComplete="name"
                      placeholder="Your name"
                      className="h-11 rounded-xl pl-10"
                      disabled={busy}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="account-email">Email address</Label>
                {register && role === "member" && <p className="text-xs text-muted-foreground">Use your organisation email, such as karan.talekar@whitecode.com. Its domain must match your team’s domain to join.</p>}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="account-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="h-11 rounded-xl pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="account-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={register ? 12 : 1}
                    maxLength={128}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    className="h-11 rounded-xl pl-10 pr-12"
                    placeholder={
                      register
                        ? "At least 12 characters"
                        : "Enter your password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {register && (
                  <div>
                    <div className="mt-2 flex gap-1.5" aria-hidden="true">
                      {[1, 2, 3].map((level) => (
                        <span
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${password && strength >= level ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Use 12–128 characters. Mix letters, numbers, and symbols.
                    </p>
                  </div>
                )}
              </div>
              {register && (
                <fieldset className="space-y-2" disabled={busy}>
                  <legend className="mb-2 text-sm font-medium">
                    Choose your role
                  </legend>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        {
                          value: "member",
                          title: "Member",
                          detail: "Join your team",
                          icon: UsersRound,
                        },
                        {
                          value: "owner",
                          title: "Owner",
                          detail: "Build a workspace",
                          icon: ShieldCheck,
                        },
                      ] as const
                    ).map((option) => (
                      <label
                        key={option.value}
                        className={`relative cursor-pointer rounded-xl border p-3 transition-all hover:border-primary/50 ${role === option.value ? "border-primary bg-primary/5 shadow-sm" : "border-border"}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={() => setRole(option.value)}
                        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        />
                        <span className="pointer-events-none absolute inset-0 rounded-xl peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
                        <option.icon className="mb-2 h-5 w-5 text-primary" />
                        <span className="block text-sm font-semibold">
                          {option.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {option.detail}
                        </span>
                        {role === option.value && (
                          <Check className="absolute right-3 top-3 h-3.5 w-3.5 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {role === "owner"
                      ? "Create teams and manage projects. Your account role stays fixed."
                      : "Join a team through its owner. Members can add tasks and events."}
                  </p>
                </fieldset>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="h-11 w-full rounded-xl shadow-md shadow-primary/10 transition-transform hover:-translate-y-0.5"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  <>
                    {register ? "Create account" : "Sign in"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              {register
                ? "Already part of the team?"
                : "New here? Make yourself at home."}{" "}
              <Link
                href={register ? "/login" : "/register"}
                className="font-semibold text-primary hover:underline"
              >
                {register ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            A little organization. A lot more possibility.
          </p>
        </section>
      </div>
    </div>
  );
}
