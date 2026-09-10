import { useMemo, useState } from "react";

import { LabeledInput } from "./inputs";
import { ResultPanel, ResultStat } from "./result-panel";
import { minutesToHours, shiftMinutes, splitWeeklyHours } from "@/lib/calc";
import { duration, hours as fmtHours, money, number, rate } from "@/lib/format";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Row {
  start: string;
  end: string;
  breakMinutes: string;
}

const defaultRows: Row[] = [
  { start: "09:00", end: "17:30", breakMinutes: "30" },
  { start: "09:00", end: "17:30", breakMinutes: "30" },
  { start: "09:00", end: "18:00", breakMinutes: "30" },
  { start: "09:00", end: "17:30", breakMinutes: "30" },
  { start: "09:00", end: "17:00", breakMinutes: "30" },
  { start: "", end: "", breakMinutes: "0" },
  { start: "", end: "", breakMinutes: "0" },
];

export function TimeCardCalculator() {
  const [rows, setRows] = useState<Row[]>(defaultRows);
  const [hourlyRate, setHourlyRate] = useState("22");
  const [threshold, setThreshold] = useState("40");

  const daily = useMemo(
    () =>
      rows.map((row) => {
        if (!row.start || !row.end) return 0;
        const minutes = shiftMinutes(row.start, row.end, Number(row.breakMinutes) || 0);
        return Number.isFinite(minutes) ? minutes : 0;
      }),
    [rows],
  );

  const totalMinutes = daily.reduce((sum, minutes) => sum + minutes, 0);
  const totalHours = minutesToHours(totalMinutes);
  const hourly = Math.max(0, Number(hourlyRate) || 0);
  const split = splitWeeklyHours(totalHours, Math.max(0, Number(threshold) || 40));
  const regularPay = split.regular * hourly;
  const overtimePay = split.overtime * hourly * 1.5;
  const totalPay = regularPay + overtimePay;

  const update = (index: number, patch: Partial<Row>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
      <section className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6">
        <h2 className="text-base font-semibold">This week&apos;s hours</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Leave a day blank if you didn&apos;t work. Overnight shifts are handled automatically.
        </p>

        <div className="mt-5 space-y-3">
          {rows.map((row, index) => (
            <div
              key={DAYS[index]}
              className="rounded-xl border border-border bg-background/60 p-3 sm:p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{DAYS[index]}</h3>
                <span className="numeric text-sm font-semibold text-primary">
                  {(daily[index] ?? 0) > 0 ? `${number(minutesToHours(daily[index] ?? 0), 2)} hrs` : "—"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <LabeledInput
                  label="Clock in"
                  type="time"
                  value={row.start}
                  onChange={(value) => update(index, { start: value })}
                />
                <LabeledInput
                  label="Clock out"
                  type="time"
                  value={row.end}
                  onChange={(value) => update(index, { end: value })}
                />
                <LabeledInput
                  label="Unpaid break"
                  suffix="min"
                  value={row.breakMinutes}
                  onChange={(value) => update(index, { breakMinutes: value })}
                />
              </div>
              {(daily[index] ?? 0) > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {duration(daily[index] ?? 0)} paid
                  {row.end < row.start && row.end !== "" ? " · overnight shift" : ""}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <LabeledInput
            label="Hourly rate"
            prefix="$"
            step="0.01"
            value={hourlyRate}
            onChange={setHourlyRate}
          />
          <LabeledInput
            label="Overtime starts after"
            suffix="hrs"
            value={threshold}
            onChange={setThreshold}
          />
        </div>
      </section>

      <div className="grid gap-4 lg:sticky lg:top-24">
        <ResultPanel
          result={{
            primary: { value: fmtHours(totalHours), label: "Total hours this week" },
            rows: [
              { label: "Total time on the clock", value: duration(totalMinutes) },
              { label: "Regular hours", value: fmtHours(split.regular) },
              { label: "Overtime hours", value: fmtHours(split.overtime) },
              { label: "Regular pay", value: money(regularPay) },
              { label: "Overtime pay (1.5×)", value: money(overtimePay) },
              { label: "Estimated gross pay", value: money(totalPay), strong: true },
              {
                label: "Average rate for the week",
                value: totalHours > 0 ? rate(totalPay / totalHours) : "—",
              },
            ],
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <ResultStat value={number(totalHours, 2)} label="Decimal hours for payroll" />
          <ResultStat value={money(totalPay)} label="Gross pay" emphasis />
        </div>
      </div>
    </div>
  );
}
