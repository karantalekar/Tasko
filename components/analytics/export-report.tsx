"use client";
import { Button } from "@/components/ui/button";
import { useApi } from "@/components/api-provider";
export function ExportReport() {
  const { analytics, team } = useApi();
  return (
    <Button
      variant="outline"
      disabled={!analytics}
      onClick={() => {
        const url = URL.createObjectURL(
          new Blob([JSON.stringify({ team, analytics }, null, 2)], {
            type: "application/json",
          }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "tasko-analytics.json";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}
    >
      Export Report
    </Button>
  );
}
