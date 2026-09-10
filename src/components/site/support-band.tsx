import { Link } from "@tanstack/react-router";
import { Mail, MessageCircleQuestion } from "lucide-react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SupportBand({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-surface p-7 sm:p-10",
        className,
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <MessageCircleQuestion className="size-3.5" aria-hidden="true" />
            Support
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
            Stuck on a number? We&apos;ll help.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Tell us which calculator you were using and what looked off. Suggestions for new
            calculators are just as welcome.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href={`mailto:${site.contactEmail}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="size-4" aria-hidden="true" />
            {site.contactEmail}
          </a>
          <Link to="/contact" className="text-sm font-medium text-primary hover:underline">
            Other ways to reach us →
          </Link>
        </div>
      </div>
    </section>
  );
}
