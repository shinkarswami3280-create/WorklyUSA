import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { ToolIcon } from "./icon";
import { getCategory, searchTools } from "@/lib/tools";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { label: "Overtime", slug: "overtime-calculator" },
  { label: "Paycheck", slug: "paycheck-calculator" },
  { label: "Salary to hourly", slug: "salary-to-hourly-calculator" },
  { label: "Time card", slug: "time-card-calculator" },
  { label: "Raise", slug: "raise-calculator" },
  { label: "Job comparison", slug: "job-offer-comparison-calculator" },
];

interface ToolSearchProps {
  size?: "lg" | "sm";
  label?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function ToolSearch({
  size = "lg",
  label = "What do you want to calculate?",
  showSuggestions = true,
  autoFocus = false,
  onNavigate,
}: ToolSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchTools(query, 6), [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (slug: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    navigate({ to: "/$slug", params: { slug } });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor={inputId} className={cn("block text-sm font-medium", size === "sm" && "sr-only")}>
        {label}
      </label>
      <div className={cn("relative", size === "lg" && "mt-2")}>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={`${inputId}-results`}
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          placeholder="Try “overtime”, “time card” or “salary to hourly”"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, results.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault();
              go(results[activeIndex].slug);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn(
            "w-full rounded-2xl border border-border bg-card pl-12 pr-11 text-foreground shadow-card outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary",
            size === "lg" ? "h-14 text-base" : "h-11 text-sm",
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      {open && query.trim().length > 0 && (
        <ul
          id={`${inputId}-results`}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lift"
        >
          {results.length === 0 && (
            <li className="px-3 py-3 text-sm text-muted-foreground">
              No tools matched. Try “pay”, “hours” or{" "}
              <Link to="/all-tools" className="text-primary underline" onClick={() => onNavigate?.()}>
                browse all tools
              </Link>
              .
            </li>
          )}
          {results.map((tool, index) => (
            <li key={tool.slug} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(tool.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                  index === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                )}
              >
                <ToolIcon name={tool.icon} className="size-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{tool.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{tool.short}</span>
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {getCategory(tool.category).label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Popular
          </span>
          {SUGGESTIONS.map((item) => (
            <Link
              key={item.slug}
              to="/$slug"
              params={{ slug: item.slug }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent/50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
