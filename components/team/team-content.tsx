"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/components/api-provider";
import { initials } from "@/lib/api";
export function TeamContent() {
  const { members } = useApi();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <Card key={member.user_id} className="p-6 space-y-3">
          <Avatar className="w-16 h-16">
            <AvatarFallback>{initials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{member.name}</h3>
            {member.job_title && (
              <p className="text-sm text-muted-foreground">
                {member.job_title}
              </p>
            )}
          </div>
          <Badge className="capitalize">{member.role}</Badge>
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <span>Active tasks</span>
            <span className="font-semibold">{member.active_tasks}</span>
          </div>
          <a
            className="text-sm text-primary underline break-all"
            href={`mailto:${member.email}`}
          >
            {member.email}
          </a>
        </Card>
      ))}
    </div>
  );
}
