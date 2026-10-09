import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { CalendarContent } from "@/components/calendar/calendar-content";
export default function CalendarPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <Header
          title="Calendar"
          description="Schedule and track your events and meetings."
        />
        <div className="mt-6">
          <CalendarContent />
        </div>
      </main>
    </div>
  );
}
