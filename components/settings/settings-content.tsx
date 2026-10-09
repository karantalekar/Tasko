"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useApi } from "@/components/api-provider";
import type { Preferences, User } from "@/lib/api";
import { OrganizationSettings } from "./organization-settings";
export function SettingsContent() {
  const { user, mutate, updateUser, team, isOwner } = useApi();
  const { setTheme } = useTheme();
  const [name, setName] = useState(user.name);
  const [preferences, setPreferences] = useState(user.preferences);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setName(user.name);
    setPreferences(user.preferences);
  }, [user]);
  const toggles: { key: keyof Preferences; label: string }[] = [
    { key: "email_notifications", label: "Email notifications" },
    { key: "push_notifications", label: "Push notifications" },
    { key: "task_reminders", label: "Task reminders" },
    { key: "team_updates", label: "Team updates" },
    { key: "dark_mode", label: "Dark mode" },
  ];
  return (
    <div className="max-w-4xl space-y-6">
    {isOwner && team && <OrganizationSettings key={team.id} team={team} />}
    <form
      className="space-y-6 max-w-4xl"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        setMessage(null);
        try {
          let updated = user;
          if (name.trim() !== user.name) {
            updated = await mutate<User>("/users/me", "PATCH", {
              name: name.trim(),
            });
            updateUser(updated);
          }
          const saved = await mutate<Preferences>(
            "/users/me/preferences",
            "PUT",
            preferences,
          );
          updateUser({ ...updated, preferences: saved });
          setTheme(saved.dark_mode ? "dark" : "light");
          setMessage("Changes saved.");
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Profile Information</h3>
        <Label htmlFor="profile-name">Full name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={150}
          disabled={busy}
        />
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" type="email" value={user.email} readOnly />
      </Card>
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Save your notification preferences and appearance.
        </p>
        {toggles.map((toggle) => (
          <div
            key={toggle.key}
            className="flex justify-between items-center border-b py-3"
          >
            <Label htmlFor={toggle.key}>{toggle.label}</Label>
            <Switch
              id={toggle.key}
              checked={preferences[toggle.key]}
              disabled={busy}
              onCheckedChange={(value) => {
                setPreferences((current) => ({
                  ...current,
                  [toggle.key]: value,
                }));
                if (toggle.key === "dark_mode")
                  setTheme(value ? "dark" : "light");
                setMessage(null);
              }}
            />
          </div>
        ))}
      </Card>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      <Button disabled={busy}>{busy ? "Saving..." : "Save Changes"}</Button>
    </form>
    </div>
  );
}
