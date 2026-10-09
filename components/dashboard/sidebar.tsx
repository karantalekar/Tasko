"use client";

import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApi } from "@/components/api-provider";
import { Brand } from "@/components/brand";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: ClipboardList, label: "Timesheets", href: "/timesheets" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Team", href: "/team" },
];

const generalItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

export function Sidebar() {
  const { tasks } = useApi();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 w-64 bg-card border-r border-border p-4 h-screen overflow-y-auto lg:block">
      <div className="mb-7 px-1 pt-1"><Brand /></div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Menu
          </p>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    hoveredItem === item.label && !isActive && "translate-x-1",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                  {item.href === "/tasks" && (
                    <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
                      {tasks.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            General
          </p>
          <nav className="space-y-0.5">
            {generalItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    hoveredItem === item.label && !isActive && "translate-x-1",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
