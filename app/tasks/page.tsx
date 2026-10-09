import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TasksContent } from "@/components/tasks/tasks-content";
import { CreateAction } from "@/components/workspace-actions";
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <Header
          title="Tasks"
          description="Manage and organize your tasks efficiently."
          actions={<CreateAction kind="task" />}
        />
        <div className="mt-6">
          <TasksContent initialSearch={typeof q === "string" ? q : ""} />
        </div>
      </main>
    </div>
  );
}
