import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AnalyticsContent } from "@/components/analytics/analytics-content";
import { ExportReport } from "@/components/analytics/export-report";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <Header
          title="Analytics"
          description="Track your performance and productivity metrics."
          actions={<ExportReport />}
        />

        <div className="mt-6">
          <AnalyticsContent />
        </div>
      </main>
    </div>
  );
}
