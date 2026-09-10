import { useMemo, useState } from "react";

import { FieldInput, InputCard } from "./inputs";
import { ResultPanel } from "./result-panel";
import { CalcError } from "@/lib/calc";
import type { CalcResult, Tool } from "@/lib/tools";

/** Generic, field-driven calculator. Results update instantly as you type. */
export function FieldCalculator({ tool }: { tool: Tool }) {
  const fields = tool.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.id, field.default ?? ""])),
  );

  const { result, error } = useMemo<{ result: CalcResult | null; error: string | null }>(() => {
    if (!tool.compute) return { result: null, error: null };
    try {
      return { result: tool.compute(values), error: null };
    } catch (thrown) {
      if (thrown instanceof CalcError) return { result: null, error: thrown.message };
      return { result: null, error: "Check your inputs and try again." };
    }
  }, [tool, values]);

  const update = (id: string) => (value: string) =>
    setValues((current) => ({ ...current, [id]: value }));

  const reset = () =>
    setValues(Object.fromEntries(fields.map((field) => [field.id, field.default ?? ""])));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <InputCard>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={values[field.id] ?? ""}
              onChange={update(field.id)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-xs text-muted-foreground">Results update as you type.</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </InputCard>

      <ResultPanel result={result} error={error} className="lg:sticky lg:top-24" />
    </div>
  );
}
