import Link from "next/link";
import { Check } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Tasko home"
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-2xl ${light ? "text-white" : "text-inherit"}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Check className="h-6 w-6" strokeWidth={3} />
      </span>
      tasko<span className="text-primary">.</span>
    </Link>
  );
}
