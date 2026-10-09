import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export function WidgetTitle({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon: LucideIcon;
  href?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:rotate-6">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={`Open ${title.toLowerCase()}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
