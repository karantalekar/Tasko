"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/components/api-provider";
import { allPages, type Meeting } from "@/lib/api";

export function useMeetings() {
  const { user, revision } = useApi();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(v => v + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const load = async () => {
      try {
        const data = await allPages<Meeting>("/meetings", controller.signal);
        if (!controller.signal.aborted) { setMeetings(data); setError(""); }
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };
    void load();
    const interval = setInterval(() => void load(), 30000);
    return () => { controller.abort(); clearInterval(interval); };
  }, [user.id, revision, version]);
  return { meetings, loading, error, refresh };
}
