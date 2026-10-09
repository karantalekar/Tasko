"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useApi } from "@/components/api-provider";
export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <Header title="Logout" description="End your current session." />
        <div className="flex justify-center mt-12">
          <Card className="p-8 max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-bold">Sign out of Tasko?</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={busy}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    await logout();
                    router.replace("/");
                  } catch (error) {
                    setError((error as Error).message);
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Signing out..." : "Logout"}
              </Button>
            </div>
            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
