import { useMemo, useState } from "react";

import { InputCard, LabeledInput } from "./inputs";
import { ResultPanel, ResultStat } from "./result-panel";
import { effectiveWage } from "@/lib/calc";
import { hours as fmtHours, money, number, percent, rate } from "@/lib/format";

export function EffectiveWageCalculator() {
  const [salary, setSalary] = useState("65000");
  const [hoursPerWeek, setHoursPerWeek] = useState("45");
  const [weeksPerYear, setWeeksPerYear] = useState("50");
  const [commute, setCommute] = useState("50");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [expenses, setExpenses] = useState("3600");

  const result = useMemo(
    () =>
      effectiveWage({
        annualSalary: Math.max(0, Number(salary) || 0),
        hoursPerWeek: Math.max(0, Number(hoursPerWeek) || 0),
        weeksPerYear: Math.max(0, Number(weeksPerYear) || 0),
        commuteMinutesPerDay: Math.max(0, Number(commute) || 0),
        workDaysPerWeek: Math.max(0, Number(daysPerWeek) || 0),
        annualExpenses: Math.max(0, Number(expenses) || 0),
      }),
    [salary, hoursPerWeek, weeksPerYear, commute, daysPerWeek, expenses],
  );

  const valid = Number.isFinite(result.effectiveHourly);
  const gapPercent =
    valid && result.nominalHourly > 0 ? (result.hourlyGap / result.nominalHourly) * 100 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <InputCard description="Include every hour the job actually costs you — not just the ones on your timesheet.">
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledInput label="Annual salary" prefix="$" value={salary} onChange={setSalary} />
          <LabeledInput
            label="Real hours worked per week"
            suffix="hrs"
            help="Include unpaid overtime and after-hours email."
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
          />
          <LabeledInput
            label="Weeks worked per year"
            suffix="wks"
            value={weeksPerYear}
            onChange={setWeeksPerYear}
          />
          <LabeledInput
            label="Round-trip commute"
            suffix="min/day"
            value={commute}
            onChange={setCommute}
          />
          <LabeledInput
            label="Days in the office per week"
            suffix="days"
            value={daysPerWeek}
            onChange={setDaysPerWeek}
          />
          <LabeledInput
            label="Job-related costs per year"
            prefix="$"
            help="Gas, parking, tolls, lunches, uniforms, childcare premium."
            value={expenses}
            onChange={setExpenses}
          />
        </div>
      </InputCard>

      <div className="grid gap-4 lg:sticky lg:top-24">
        <ResultPanel
          result={
            valid
              ? {
                  primary: {
                    value: rate(result.effectiveHourly),
                    label: "Your effective hourly wage",
                  },
                  rows: [
                    { label: "Wage on paper", value: rate(result.nominalHourly) },
                    { label: "Hourly gap", value: rate(result.hourlyGap) },
                    { label: "You keep", value: percent(100 - gapPercent) },
                    {
                      label: "After job costs",
                      value: rate(result.effectiveAfterExpenses),
                      strong: true,
                    },
                    { label: "Paid work hours per year", value: fmtHours(result.annualWorkHours) },
                    { label: "Commuting hours per year", value: fmtHours(result.annualCommuteHours) },
                    {
                      label: "Total committed hours",
                      value: fmtHours(result.totalCommittedHours),
                    },
                    { label: "Annual", value: money(result.annual) },
                    { label: "Monthly", value: money(result.monthly) },
                    { label: "Weekly", value: money(result.weekly) },
                  ],
                  notes: [
                    `You give this job about ${number(result.annualCommuteHours / 8, 0)} extra 8-hour days a year just commuting.`,
                  ],
                }
              : null
          }
          error={valid ? null : "Enter your salary, weekly hours and weeks per year to see results."}
        />
        {valid && (
          <div className="grid grid-cols-2 gap-3">
            <ResultStat value={rate(result.nominalHourly)} label="On paper" />
            <ResultStat value={rate(result.effectiveHourly)} label="In reality" emphasis />
          </div>
        )}
      </div>
    </div>
  );
}
