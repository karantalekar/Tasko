import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TimesheetsContent } from "@/components/timesheets/timesheets-content";

export default function TimesheetsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block"><Sidebar /></div>
      <main className="min-w-0 flex-1 p-4 lg:ml-64 lg:p-6">
        <Header title="Timesheets" description="Record your work and view submitted timesheets." />
        <div className="mt-6"><TimesheetsContent /></div>
      </main>
    </div>
  );
}
