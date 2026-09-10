import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import type { CalcResult } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ResultPanel({
  result,
  error,
  children,
  className,
}: {
  result?: CalcResult | null;
  error?: string | null;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7",
        className,
      )}
      aria-live="polite"
    >
      {error ? (
        <div className="flex items-start gap-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : result ? (
        <>
          <p className="numeric text-gradient-primary text-4xl font-bold leading-none sm:text-5xl">
            {result.primary.value}
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">{result.primary.label}</p>

          {result.rows.length > 0 && (
            <dl className="mt-6 divide-y divide-border border-t border-border">
              {result.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd
                    className={cn(
                      "numeric text-sm font-semibold",
                      row.strong && "text-base text-primary",
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {result.notes?.map((note) => (
            <p key={note} className="mt-4 rounded-xl bg-accent/50 p-3 text-sm text-accent-foreground">
              {note}
            </p>
          ))}
        </>
      ) : null}
      {children}
    </div>
  );
}

export function ResultStat({
  value,
  label,
  emphasis,
}: {
  value: string;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        emphasis
          ? "border-primary/30 bg-accent/60"
          : "border-border bg-card",
      )}
    >
      <p className={cn("numeric font-bold leading-tight", emphasis ? "text-3xl" : "text-xl")}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
