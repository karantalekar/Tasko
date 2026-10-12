"use client";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useApi } from "@/components/api-provider";
import { CreateAction } from "@/components/workspace-actions";
import { initials } from "@/lib/api";

export function Header({
  title = "Tasko",
  description = "Your team workspace",
  actions,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  const { user, teams, team, selectTeam, refresh } = useApi();
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <header className="space-y-4 pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-0 lg:animate-[slideInUp_0.5s_ease-out_forwards]">
      <div className="fixed inset-x-0 top-0 z-40 flex h-[calc(4rem+env(safe-area-inset-top))] items-center justify-between gap-3 border-b border-border bg-background px-4 pt-[env(safe-area-inset-top)] lg:static lg:h-auto lg:flex-wrap lg:border-0 lg:bg-transparent lg:p-0">
        <div className="flex min-w-0 items-center gap-2 flex-1">
          <MobileNav />
          <form
            className="relative min-w-0 max-w-md flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/tasks?q=${encodeURIComponent(search.trim())}`);
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              aria-label="Search tasks"
              placeholder="Search tasks and press Enter"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-xs lg:block">
            <p className="font-semibold">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          Team{" "}
          <select
            aria-label="Active team"
            className="ml-2 border rounded-md bg-background px-2 py-1"
            value={team?.id || ""}
            onChange={(e) => selectTeam(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <CreateAction kind="team" />
        <Button variant="outline" size="sm" onClick={() => void refresh()}>
          Refresh
        </Button>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
