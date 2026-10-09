import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TeamContent } from "@/components/team/team-content";
import { CreateAction } from "@/components/workspace-actions";
export default function TeamPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <Header
          title="Team"
          description="Manage your team members and their roles."
          actions={<CreateAction kind="member" />}
        />
        <div className="mt-6">
          <TeamContent />
        </div>
      </main>
    </div>
  );
}
