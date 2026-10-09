"use client";

import { useState } from "react";
import { useApi } from "@/components/api-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Team } from "@/lib/api";

export function OrganizationSettings({ team }: { team: Team }) {
  const { mutate, updateTeam } = useApi();
  const [organization, setOrganization] = useState(
    team.organization || team.name,
  );
  const [domain, setDomain] = useState(team.email_domain || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Card className="p-6">
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          setMessage("");
          try {
            const updated = await mutate<Team>(
              `/teams/${team.id}/organization`,
              "PUT",
              {
                organization: organization.trim(),
                email_domain: domain.trim(),
              },
            );
            updateTeam(updated);
            setOrganization(updated.organization || "");
            setDomain(updated.email_domain || "");
            setMessage("Organisation saved.");
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h3 className="text-lg font-semibold">Organisation · {team.name}</h3>
        <p className="text-sm text-muted-foreground">
          Members must use an email address at your organisation’s exact domain.
          Existing member emails must also match when changing the domain.
        </p>
        <Label htmlFor="organization-name">Organisation name</Label>
        <Input
          id="organization-name"
          required
          maxLength={150}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          disabled={busy}
          placeholder="Daynasas Tech"
        />
        <Label htmlFor="organization-domain">Organisation email domain</Label>
        <Input
          id="organization-domain"
          required
          maxLength={253}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          disabled={busy}
          placeholder="daynasas.com"
        />
        <p className="text-xs text-muted-foreground">
          Enter the domain without @, for example whitecode.com.
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-sm text-primary">
            {message}
          </p>
        )}
        <Button disabled={busy}>
          {busy ? "Saving..." : "Save organisation"}
        </Button>
      </form>
    </Card>
  );
}
