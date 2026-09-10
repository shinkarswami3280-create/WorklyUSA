import { useId } from "react";

import type { Field } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function LabeledInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  help,
  type = "number",
  step,
  options,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string | undefined;
  suffix?: string | undefined;
  help?: string | undefined;
  type?: "number" | "time" | "select" | "text" | undefined;
  step?: string | undefined;
  options?: { value: string; label: string }[] | undefined;
  placeholder?: string | undefined;
  className?: string | undefined;
}) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-1.5">
        {prefix && type !== "select" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {prefix}
          </span>
        )}
        {type === "select" ? (
          <select
            id={id}
            value={value}
            aria-describedby={help ? helpId : undefined}
            onChange={(event) => onChange(event.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-input bg-card px-3.5 text-sm outline-none transition-colors focus-visible:border-primary"
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            inputMode={type === "number" ? "decimal" : undefined}
            step={step}
            value={value}
            placeholder={placeholder}
            aria-describedby={help ? helpId : undefined}
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              "h-12 w-full rounded-xl border border-input bg-card text-sm tabular-nums outline-none transition-colors focus-visible:border-primary",
              prefix ? "pl-8" : "pl-3.5",
              suffix ? "pr-14" : "pr-3.5",
            )}
          />
        )}
        {suffix && type !== "select" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
      {help && (
        <p id={helpId} className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {help}
        </p>
      )}
    </div>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <LabeledInput
      label={field.label}
      value={value}
      onChange={onChange}
      prefix={field.prefix}
      suffix={field.suffix}
      help={field.help}
      type={field.type ?? "number"}
      step={field.step}
      options={field.options}
      placeholder={field.placeholder}
    />
  );
}

export function InputCard({
  children,
  title = "Your details",
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}
