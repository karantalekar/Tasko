"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  Github,
  LayoutDashboard,
  Layers3,
  Linkedin,
  Moon,
  Sun,
  Users2,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const features = [
  {
    icon: Layers3,
    iconStyle: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    title: "A place for every project",
    description:
      "Give your ideas a home. Organize projects, set priorities, and turn the next big thing into clear next steps.",
  },
  {
    icon: Users2,
    iconStyle: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    title: "Everyone on the same page",
    description:
      "Bring your team together with clear ownership, shared tasks, and a workspace that keeps the details in reach.",
  },
  {
    icon: CalendarDays,
    iconStyle: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    title: "Make room for what matters",
    description:
      "Plan team events, track time on your tasks, and see how your work is moving forward.",
  },
];

export function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-10">
        <Brand />
        <nav
          className="hidden items-center gap-8 text-sm font-medium md:flex"
          aria-label="Public navigation"
        >
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it works
          </a>
          <a
            href="#get-started"
            className="hover:text-primary transition-colors"
          >
            Your workspace
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Toggle light and dark theme"
            title="Toggle light and dark theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
            <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
          </Button>
          <Button asChild variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full px-5">
            <Link href="/register">
              Get started <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        </div>
      </header>
      <main className="bg-linear-to-b from-primary/5 via-background to-background">
        <section className="hero-banner relative isolate overflow-hidden">
          <div className="hero-pattern pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="hero-pattern-dots absolute inset-0" />
            <div className="hero-pattern-orbit hero-pattern-orbit-one" />
            <div className="hero-pattern-orbit hero-pattern-orbit-two" />
            <span className="hero-pattern-spark absolute left-[7%] top-8 h-3 w-3 rounded-full bg-primary/40" />
            <span className="hero-pattern-spark absolute bottom-5 right-[12%] h-2 w-2 rounded-full bg-primary/50 [animation-delay:-2s]" />
          </div>
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-8 md:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-10 lg:py-12">
          <div className="relative z-10 space-y-5 animate-slide-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> A little
              clarity goes a long way
            </span>
            <h1 className="text-5xl font-semibold leading-[1.07] tracking-[-0.055em] sm:text-6xl md:text-5xl lg:text-7xl">
              Less busywork.
              <br />
              <span className="text-primary">More good work.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Meet your team's new home for projects, tasks, and everything in
              between. Plan together. Stay focused. Move forward.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full px-7 shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5"
              >
                <Link href="/register">
                  Create your account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
              >
                Take a look around <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {[
                "Clear team roles",
                "Task progress at a glance",
                "Your work, organized",
              ].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="relative isolate animate-slide-in-up">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-[#f4f2e9] shadow-xl shadow-primary/5">
              <img
                src="/images/tasko-team.webp"
                srcSet="/images/tasko-team-small.webp 640w, /images/tasko-team.webp 1200w"
                sizes="(min-width: 1440px) 650px, (min-width: 768px) 50vw, 100vw"
                width={1200}
                height={800}
                alt="Illustration of a team collaborating around a project board"
                className="aspect-[3/2] w-full object-cover"
                fetchPriority="high"
              />
              <div className="flex items-center justify-between gap-3 border-t border-primary/10 bg-card/90 px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-primary/10 p-2 text-primary">
                    <CheckCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      Good work happens together.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      One shared space. A clearer day.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="absolute -right-2 -top-4 flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-xs font-medium shadow-lg sm:-right-4">
              <span className="h-2 w-2 rounded-full bg-primary" /> Stay in sync
            </div>
          </div>
          </div>
        </section>
        <section
          id="features"
          className="scroll-mt-28 border-y border-border bg-primary/5 px-5 py-10 lg:px-10 lg:py-12"
        >
          <div className="mx-auto max-w-[1360px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Made for your everyday
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Everything you need.
                  <br />
                  Room to do your best work.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                A thoughtful set of tools to help your team turn plans into
                progress.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-3xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className={`rounded-2xl p-3 shadow-sm transition-transform duration-300 group-hover:scale-110 ${feature.iconStyle}`}>
                      <feature.icon className="h-6 w-6" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="mx-auto max-w-[1440px] scroll-mt-28 px-5 py-10 lg:px-10 lg:py-12"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Less setup, more doing
              </p>
              <h2 className="mb-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your flow.
                <br />
                In a few simple steps.
              </h2>
              <p className="max-w-sm text-muted-foreground">
                Start with your people and your next project. Tasko keeps the
                rest close at hand.
              </p>
              <div className="mt-8 flex gap-3 text-primary">
                <LayoutDashboard className="h-6 w-6" />
                <CalendarDays className="h-6 w-6" />
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-5 rounded-3xl border border-primary/10 bg-primary/5 p-6 lg:p-8">
              {[
                {
                  title: "Choose your place",
                  numberStyle: "border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400",
                  text: "Register as an Owner to build a workspace, or as a Member to join your team.",
                },
                {
                  title: "Bring the work together",
                  numberStyle: "border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-400",
                  text: "Create projects, add registered teammates, and organize tasks in one shared space.",
                },
                {
                  title: "Make progress visible",
                  numberStyle: "border-orange-200 bg-orange-100 text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-400",
                  text: "Complete tasks, schedule events, and track time while your dashboard follows along.",
                },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-5">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold shadow-sm ${step.numberStyle}`}>
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="mb-2 font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="get-started"
          className="mx-auto mb-10 max-w-[1440px] scroll-mt-28 px-5 lg:px-10"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#123f32] px-7 py-10 text-center text-white sm:px-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
            <p className="mb-3 text-sm text-emerald-200">
              A fresh start for your team's work
            </p>
            <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next great project starts here.
            </h2>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-7 text-[#123f32] hover:bg-emerald-50"
            >
              <Link href="/register">
                Let's get to work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 border-t px-5 py-5 text-sm lg:px-10">
        <Brand />
        <p className="text-muted-foreground">
          Built for work. Designed for people.
        </p>
        <nav className="flex items-center gap-4" aria-label="Social profiles">
          <a
            href="https://www.linkedin.com/in/karan-talekar-06k/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            aria-label="Karan Talekar on LinkedIn (opens in a new tab)"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href="https://github.com/karantalekar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            aria-label="Karan Talekar on GitHub (opens in a new tab)"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </nav>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 hover:text-primary"
        >
          Open your workspace <ArrowUpRight className="h-4 w-4" />
        </Link>
      </footer>
      <div className="mx-auto flex max-w-[1440px] justify-end px-5 pb-6 lg:px-10">
        <Button
          type="button"
          size="icon"
          className="group rounded-full shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
          aria-label="Back to top"
          title="Back to top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ArrowUp
            className="h-5 w-5 motion-safe:animate-bounce group-hover:animate-none"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
