"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckSquare2,
  Clock3,
  LifeBuoy,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    id: "account",
    title: "Account & roles",
    detail: "Find your place",
    icon: ShieldCheck,
  },
  {
    id: "tasks",
    title: "Projects & tasks",
    detail: "Turn plans into progress",
    icon: CheckSquare2,
  },
  {
    id: "team",
    title: "Your team",
    detail: "Work better together",
    icon: UsersRound,
  },
  {
    id: "calendar",
    title: "Calendar & time",
    detail: "Make every day clearer",
    icon: CalendarDays,
  },
];
const faqs = [
  {
    category: "account",
    question: "What is the difference between an Owner and a Member?",
    answer:
      "Choose Owner during registration to create and manage teams. Members join a team through its owner and can add their own tasks and team events. Your account role cannot be changed in Settings.",
  },
  {
    category: "account",
    question: "Why do I see Join your team after signing in?",
    answer:
      "Your member account has not joined a team yet. Ask an owner to add your registered email, then choose Check for team access.",
  },
  {
    category: "account",
    question: "How do I change the appearance?",
    answer:
      "Open Settings and toggle Dark mode to preview the theme immediately. Choose Save Changes to keep it on your account.",
  },
  {
    category: "tasks",
    question: "How do I create a project or task?",
    answer:
      "Team owners can add projects from the dashboard. Both owners and members can use Add Task. If no projects exist, an owner can create a first project in the same task dialog. Members need an existing team project; their new tasks are assigned to themselves.",
  },
  {
    category: "tasks",
    question: "How is project progress calculated?",
    answer:
      "Project Progress shows completed tasks divided by total tasks. Choose a project in the dropdown, or use All projects. Completing or reopening a task updates the percentage after saving.",
  },
  {
    category: "tasks",
    question: "Why can't I edit a task?",
    answer:
      "Owners can edit tasks in their teams. Members can only edit tasks assigned to them, and cannot reassign tasks. If an update conflicts with another change, reload the workspace before retrying.",
  },
  {
    category: "team",
    question: "How do I add a teammate?",
    answer:
      "Ask the person to register first. As the team owner, open Team, choose Add Member, and enter their exact registered email and an optional job title.",
  },
  {
    category: "team",
    question: "How do I switch between teams?",
    answer:
      "Choose your team from the selector at the top of any workspace page. Each team has its own projects, tasks, members, and events.",
  },
  {
    category: "calendar",
    question: "Can members add events?",
    answer:
      "Yes. Open Calendar, choose a date, then Add Event. Enter the title, start time, and end time. Events are shared with your team, and the end must be after the start. Editing existing events remains owner-only.",
  },
  {
    category: "calendar",
    question: "How do I track time on a task?",
    answer:
      "Choose an available task in the dashboard Time Tracker and start it. Stop the timer to save the entry. A running timer resumes its display after a reload. Members can track time on tasks assigned to them.",
  },
];

export function HelpContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const matches = faqs.filter(
    (faq) =>
      (category === "all" || faq.category === category) &&
      `${faq.question} ${faq.answer}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <div className="max-w-5xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-8 sm:px-9">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-[25px] border-primary/5" />
        <div className="relative flex items-start gap-4">
          <span className="hidden rounded-2xl bg-card p-3 text-primary shadow-sm sm:block">
            <LifeBuoy className="h-8 w-8" />
          </span>
          <div className="flex-1">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> A little help, a lot of
              clarity
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Let's get you moving.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Find a quick answer, learn your way around, and get back to the
              good work.
            </p>
            <div className="relative mt-6 max-w-xl">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search help"
                placeholder="What would you like to know?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-xl bg-card pl-11 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((item) => (
          <button
            key={item.id}
            aria-pressed={category === item.id}
            onClick={() =>
              setCategory((current) => (current === item.id ? "all" : item.id))
            }
            className={`group rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg ${category === item.id ? "border-primary/40 bg-primary/5" : "bg-card"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <span className="block text-sm font-semibold">{item.title}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {item.detail}
            </span>
          </button>
        ))}
      </div>
      <Card className="gap-3 rounded-2xl p-6 sm:p-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-primary" /> Your questions,
            answered
          </h3>
          {category !== "all" && (
            <button
              onClick={() => setCategory("all")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Show all topics
            </button>
          )}
        </div>
        {matches.length ? (
          <Accordion type="single" collapsible>
            {matches.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-border"
              >
                <AccordionTrigger className="py-5 text-left text-sm font-medium hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-8 text-center">
            <Search className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
            <p className="font-medium">No matching articles.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different keyword or clear your topic filter.
            </p>
          </div>
        )}
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Clock3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Ready to get back to it?</p>
            <p className="text-xs text-muted-foreground">
              Your next step is right here.
            </p>
          </div>
        </div>
        <div className="flex gap-5 text-sm font-medium">
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 text-primary hover:underline"
          >
            Open tasks <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/settings"
            className="text-muted-foreground hover:text-primary"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
