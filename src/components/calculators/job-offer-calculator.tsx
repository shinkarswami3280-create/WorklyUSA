import { useMemo, useState } from "react";

import { LabeledInput } from "./inputs";
import { ResultStat } from "./result-panel";
import { evaluateOffer, type OfferInput } from "@/lib/calc";
import { hours as fmtHours, money, rate } from "@/lib/format";
import { cn } from "@/lib/utils";

type OfferForm = Record<keyof OfferInput, string>;

const offerA: OfferForm = {
  salary: "78000",
  bonus: "4000",
  hoursPerWeek: "42",
  weeksPerYear: "50",
  commuteMinutes: "60",
  daysPerWeek: "5",
  ptoDays: "15",
  retirementMatchPercent: "4",
  benefitsValue: "6000",
  otherComp: "0",
};

const offerB: OfferForm = {
  salary: "72000",
  bonus: "0",
  hoursPerWeek: "40",
  weeksPerYear: "50",
  commuteMinutes: "0",
  daysPerWeek: "5",
  ptoDays: "22",
  retirementMatchPercent: "6",
  benefitsValue: "9000",
  otherComp: "1500",
};

const fields: { id: keyof OfferInput; label: string; prefix?: string; suffix?: string }[] = [
  { id: "salary", label: "Base salary", prefix: "$" },
  { id: "bonus", label: "Annual bonus", prefix: "$" },
  { id: "hoursPerWeek", label: "Real hours per week", suffix: "hrs" },
  { id: "weeksPerYear", label: "Weeks worked per year", suffix: "wks" },
  { id: "commuteMinutes", label: "Round-trip commute", suffix: "min" },
  { id: "daysPerWeek", label: "Onsite days per week", suffix: "days" },
  { id: "ptoDays", label: "Paid time off", suffix: "days" },
  { id: "retirementMatchPercent", label: "401(k) match", suffix: "%" },
  { id: "benefitsValue", label: "Health & other benefits", prefix: "$" },
  { id: "otherComp", label: "Other comp (stipends, equity)", prefix: "$" },
];

const toNumbers = (form: OfferForm): OfferInput =>
  Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, Math.max(0, Number(value) || 0)]),
  ) as unknown as OfferInput;

export function JobOfferCalculator() {
  const [a, setA] = useState(offerA);
  const [b, setB] = useState(offerB);

  const resultA = useMemo(() => evaluateOffer(toNumbers(a)), [a]);
  const resultB = useMemo(() => evaluateOffer(toNumbers(b)), [b]);

  const winner =
    Number.isFinite(resultA.effectiveHourly) && Number.isFinite(resultB.effectiveHourly)
      ? resultA.effectiveHourly === resultB.effectiveHourly
        ? "tie"
        : resultA.effectiveHourly > resultB.effectiveHourly
          ? "a"
          : "b"
      : null;

  const columns = [
    { key: "a" as const, title: "Offer A", form: a, setForm: setA, result: resultA },
    { key: "b" as const, title: "Offer B", form: b, setForm: setB, result: resultB },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {columns.map((column) => (
          <section
            key={column.key}
            className={cn(
              "rounded-2xl border bg-card p-5 shadow-card sm:p-6",
              winner === column.key ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{column.title}</h2>
              {winner === column.key && (
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  Better per hour
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <LabeledInput
                  key={field.id}
                  label={field.label}
                  prefix={field.prefix}
                  suffix={field.suffix}
                  value={column.form[field.id]}
                  onChange={(value) =>
                    column.setForm((current) => ({ ...current, [field.id]: value }))
                  }
                />
              ))}
            </div>

            <dl className="mt-5 divide-y divide-border border-t border-border">
              {[
                { label: "Total compensation", value: money(column.result.totalComp), strong: true },
                { label: "401(k) match value", value: money(column.result.retirementMatch) },
                { label: "PTO value", value: money(column.result.ptoValue) },
                { label: "Work hours per year", value: fmtHours(column.result.annualWorkHours) },
                { label: "Commute hours per year", value: fmtHours(column.result.annualCommuteHours) },
                {
                  label: "Effective hourly",
                  value: Number.isFinite(column.result.effectiveHourly)
                    ? rate(column.result.effectiveHourly)
                    : "—",
                  strong: true,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd
                    className={cn("numeric text-sm font-semibold", row.strong && "text-primary")}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold">The verdict</h2>
        {winner && winner !== "tie" ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">
              Offer {winner === "a" ? "A" : "B"} pays more for every hour it asks of you
            </strong>{" "}
            — {rate(Math.abs(resultA.effectiveHourly - resultB.effectiveHourly))} more per committed
            hour, once total compensation, real hours and commuting are counted.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Both offers work out to the same effective hourly wage. Compare the non-numeric factors:
            growth, manager, flexibility and stability.
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultStat value={money(resultA.totalComp)} label="A total comp" />
          <ResultStat
            value={Number.isFinite(resultA.effectiveHourly) ? rate(resultA.effectiveHourly) : "—"}
            label="A per hour"
            emphasis={winner === "a"}
          />
          <ResultStat value={money(resultB.totalComp)} label="B total comp" />
          <ResultStat
            value={Number.isFinite(resultB.effectiveHourly) ? rate(resultB.effectiveHourly) : "—"}
            label="B per hour"
            emphasis={winner === "b"}
          />
        </div>
      </div>
    </div>
  );
}
