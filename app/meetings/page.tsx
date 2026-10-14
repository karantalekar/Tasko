import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MeetingsContent } from "@/components/meetings/meetings-content";

export default function MeetingsPage() {
  return <div className="flex min-h-screen bg-background">
    <div className="hidden lg:block"><Sidebar /></div>
    <main className="flex-1 p-4 lg:p-6 lg:ml-64">
      <Header title="Meetings" description="Schedule meetings, share access with teams, and join in one click." />
      <div className="mt-6"><MeetingsContent /></div>
    </main>
  </div>;
}
