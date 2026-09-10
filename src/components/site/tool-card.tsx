import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ToolIcon } from "./icon";
import { getCategory, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ToolCard({ tool, className }: { tool: Tool; className?: string }) {
  const category = getCategory(tool.category);
  return (
    <article
      className={cn(
        "group card-hover relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="gradient-primary flex size-10 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
          <ToolIcon name={tool.icon} className="size-5" />
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {category.label}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold leading-snug">
        <Link to="/$slug" params={{ slug: tool.slug }} className="focus-visible:underline">
          <span className="absolute inset-0" aria-hidden="true" />
          {tool.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.short}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Use calculator
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </article>
  );
}

export function ToolLinkList({ tools }: { tools: Tool[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {tools.map((tool) => (
        <li key={tool.slug}>
          <Link
            to="/$slug"
            params={{ slug: tool.slug }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <ToolIcon name={tool.icon} className="size-4 text-primary" />
            {tool.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
