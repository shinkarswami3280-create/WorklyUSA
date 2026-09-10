import {
  minutesToHours,
  nightMinutes,
  nonNeg,
  num,
  overtimePay,
  required,
  shiftMinutes,
  splitWeeklyHours,
} from "@/lib/calc";
import { clock, duration, hours as fmtHours, money, number, rate } from "@/lib/format";
import type { Tool } from "./types";

export const workHoursTools: Tool[] = [
  {
    slug: "time-card-calculator",
    name: "Time Card Calculator",
    h1: "Time Card Calculator",
    category: "work-hours",
    icon: "ClipboardList",
    short: "Add up a full week of clock-in and clock-out times.",
    keywords: ["time card", "timesheet", "timecard", "weekly hours", "clock in clock out"],
    title: "Time Card Calculator – Weekly Timesheet With Breaks | Workly USA",
    description:
      "Free weekly time card calculator. Enter clock-in and clock-out times with breaks to get daily hours, weekly totals and overtime pay.",
    intro:
      "Enter each day's start time, end time and unpaid break. Overnight shifts are handled automatically, and totals update as you type.",
    custom: "timecard",
    howItWorks: [
      "Each day's worked minutes are the span from start to end, minus your unpaid break.",
      "If the end time is earlier than the start time, the shift is treated as crossing midnight.",
      "Daily minutes are added together, then split into regular and overtime hours at your weekly threshold.",
    ],
    formula:
      "Daily hours = (Clock out − Clock in − Unpaid break) ÷ 60 · Weekly pay = Regular hours × Rate + Overtime hours × Rate × 1.5",
    example: [
      "Monday 9:00 AM to 5:30 PM with a 30-minute lunch is 8.00 hours.",
      "A night shift from 10:00 PM to 6:00 AM with no break is 8.00 hours.",
      "At 46 total hours and $22 per hour, weekly gross is $1,078 with 6 overtime hours.",
    ],
    assumptions: [
      "Breaks entered are unpaid and subtracted from worked time.",
      "Overtime is applied on the weekly total, not per day.",
      "Nothing you enter is stored or sent anywhere.",
    ],
    faqs: [
      {
        q: "How do I enter an overnight shift?",
        a: "Enter the real times, for example 10:00 PM to 6:00 AM. The calculator recognises the shift crossed midnight and returns 8 hours.",
      },
      {
        q: "How do I convert minutes for payroll?",
        a: "Payroll uses decimal hours: 15 minutes is 0.25, 30 minutes is 0.50, 45 minutes is 0.75. Both formats are shown.",
      },
      {
        q: "Are lunch breaks paid?",
        a: "Bona fide meal breaks are generally unpaid, while short rest breaks are usually paid. Enter only unpaid time in the break column.",
      },
    ],
    related: [
      "hours-worked-calculator",
      "overtime-calculator",
      "break-time-calculator",
      "weekly-pay-calculator",
    ],
  },

  {
    slug: "hours-worked-calculator",
    name: "Hours Worked Calculator",
    h1: "Hours Worked Calculator",
    category: "work-hours",
    icon: "Clock",
    short: "Hours between two times, minus breaks.",
    keywords: ["hours worked", "hours between times", "time duration", "hours calculator"],
    title: "Hours Worked Calculator – Time Between Two Times | Workly USA",
    description:
      "Calculate hours worked between a start and end time, including overnight shifts, with unpaid breaks subtracted.",
    intro:
      "Enter a start time and end time to get exact hours worked in both clock and decimal format.",
    fields: [
      { id: "start", label: "Start time", type: "time", default: "09:00" },
      { id: "end", label: "End time", type: "time", default: "17:30" },
      { id: "break", label: "Unpaid break", suffix: "min", default: "30", optional: true },
      { id: "rate", label: "Hourly rate (optional)", prefix: "$", default: "0", optional: true, step: "0.01" },
    ],
    compute: (v) => {
      const minutes = shiftMinutes(v['start'] ?? "", v['end'] ?? "", nonNeg(v, "break", 0));
      if (!Number.isFinite(minutes)) {
        return {
          primary: { value: "—", label: "Enter a valid start and end time" },
          rows: [],
        };
      }
      const decimal = minutesToHours(minutes);
      const hourly = nonNeg(v, "rate", 0);
      const rows = [
        { label: "Total time", value: duration(minutes), strong: true },
        { label: "Decimal hours", value: number(decimal, 2) },
        { label: "Total minutes", value: number(minutes, 0) },
        { label: "Unpaid break", value: `${number(nonNeg(v, "break", 0), 0)} min` },
      ];
      if (hourly > 0) rows.push({ label: "Pay for this time", value: money(decimal * hourly) });
      return {
        primary: { value: fmtHours(decimal), label: "Hours worked" },
        rows,
      };
    },
    howItWorks: [
      "The end time is subtracted from the start time to get elapsed minutes.",
      "If the result is zero or negative, 24 hours are added because the shift crossed midnight.",
      "Unpaid break minutes are subtracted, then converted to decimal hours.",
    ],
    formula: "Hours = (End − Start, +24h if overnight − Break minutes) ÷ 60",
    example: [
      "9:00 AM to 5:30 PM is 510 minutes.",
      "Subtract a 30-minute unpaid lunch: 480 minutes.",
      "That's 8h 0m, or 8.00 decimal hours.",
    ],
    assumptions: [
      "Shifts are assumed to be under 24 hours long.",
      "Break time entered is unpaid.",
    ],
    faqs: [
      {
        q: "Does it handle shifts past midnight?",
        a: "Yes. 10:00 PM to 6:00 AM returns 8 hours.",
      },
      {
        q: "What is 7 hours 45 minutes in decimal?",
        a: "7.75 hours. Divide the minutes by 60 to convert.",
      },
      {
        q: "Can I calculate several days at once?",
        a: "Use the time card calculator for a full week.",
      },
    ],
    related: [
      "time-card-calculator",
      "break-time-calculator",
      "shift-calculator",
      "overtime-calculator",
    ],
  },

  {
    slug: "break-time-calculator",
    name: "Break Time Calculator",
    h1: "Break Time Calculator",
    category: "work-hours",
    icon: "Coffee",
    short: "Work out paid hours after unpaid breaks.",
    keywords: ["break time", "unpaid break", "lunch break", "paid hours"],
    title: "Break Time Calculator – Paid Hours After Breaks | Workly USA",
    description:
      "Calculate how unpaid breaks change your paid hours and pay for a shift. Free break time calculator.",
    intro:
      "Enter your shift length and break details to see how many hours you're actually paid for.",
    fields: [
      { id: "shiftHours", label: "Shift length", suffix: "hrs", default: "8.5", step: "0.25" },
      { id: "breakCount", label: "Number of unpaid breaks", default: "1" },
      { id: "breakLength", label: "Length of each unpaid break", suffix: "min", default: "30" },
      {
        id: "paidBreakMinutes",
        label: "Paid break minutes",
        suffix: "min",
        default: "0",
        optional: true,
        help: "Short rest breaks are usually paid and don't reduce your hours.",
      },
      { id: "rate", label: "Hourly rate (optional)", prefix: "$", default: "0", optional: true, step: "0.01" },
    ],
    compute: (v) => {
      const shift = required(num(v, "shiftHours"), "a shift length");
      const count = nonNeg(v, "breakCount", 0);
      const length = nonNeg(v, "breakLength", 0);
      const unpaidMinutes = count * length;
      const paidHours = Math.max(0, shift - unpaidMinutes / 60);
      const hourly = nonNeg(v, "rate", 0);
      const rows = [
        { label: "Shift length", value: fmtHours(shift) },
        { label: "Unpaid break time", value: duration(unpaidMinutes) },
        { label: "Paid break time", value: duration(nonNeg(v, "paidBreakMinutes", 0)) },
        { label: "Paid hours", value: fmtHours(paidHours), strong: true },
        {
          label: "Share of shift unpaid",
          value: shift > 0 ? `${number((unpaidMinutes / 60 / shift) * 100, 1)}%` : "—",
        },
      ];
      if (hourly > 0) {
        rows.push({ label: "Pay for the shift", value: money(paidHours * hourly) });
        rows.push({ label: "Value of unpaid break time", value: money((unpaidMinutes / 60) * hourly) });
      }
      return {
        primary: { value: fmtHours(paidHours), label: "Paid hours for this shift" },
        rows,
      };
    },
    howItWorks: [
      "Unpaid break minutes are multiplied by the number of breaks.",
      "That total is converted to hours and subtracted from the shift length.",
      "Paid rest breaks are listed separately because they don't reduce paid time.",
    ],
    formula: "Paid hours = Shift hours − (Unpaid breaks × Minutes each ÷ 60)",
    example: [
      "An 8.5-hour shift with one 30-minute unpaid lunch.",
      "30 minutes is 0.5 hours of unpaid time.",
      "You are paid for 8.00 hours.",
    ],
    assumptions: [
      "Break rules differ by state and by employer policy.",
      "Bona fide meal periods are generally unpaid; short rest breaks are generally paid.",
    ],
    faqs: [
      {
        q: "Do I have to be paid for lunch?",
        a: "Generally no, if you are fully relieved of duty for a bona fide meal period. If you work through lunch, that time is normally payable.",
      },
      {
        q: "Are 15-minute breaks paid?",
        a: "Short rest breaks are usually treated as paid work time under federal rules.",
      },
      {
        q: "Do breaks count toward overtime?",
        a: "Paid break time counts toward hours worked and therefore toward overtime. Unpaid meal time does not.",
      },
    ],
    related: [
      "hours-worked-calculator",
      "time-card-calculator",
      "shift-calculator",
      "weekly-pay-calculator",
    ],
  },

  {
    slug: "overtime-calculator",
    name: "Overtime Calculator",
    h1: "Overtime Calculator",
    category: "work-hours",
    icon: "Timer",
    short: "Calculate overtime pay and total weekly earnings.",
    keywords: ["overtime", "overtime pay", "ot calculator", "time and a half", "double time"],
    title: "Overtime Calculator – Calculate Overtime Pay | Workly USA",
    description:
      "Calculate regular pay, overtime pay and total earnings with Workly USA's free overtime calculator. Supports time and a half and double time.",
    intro:
      "Enter your hourly rate and hours to see regular pay, overtime pay and total earnings for the week.",
    fields: [
      { id: "rate", label: "Hourly rate", prefix: "$", default: "22", step: "0.01" },
      { id: "regularHours", label: "Regular hours", suffix: "hrs", default: "40", step: "0.25" },
      { id: "otHours", label: "Overtime hours", suffix: "hrs", default: "6", step: "0.25" },
      { id: "otMultiplier", label: "Overtime multiplier", default: "1.5", step: "0.1" },
      {
        id: "dtHours",
        label: "Double-time hours",
        suffix: "hrs",
        default: "0",
        optional: true,
        step: "0.25",
      },
    ],
    compute: (v) => {
      const hourly = required(num(v, "rate"), "an hourly rate");
      const result = overtimePay({
        hourlyRate: hourly,
        regularHours: nonNeg(v, "regularHours", 0),
        overtimeHours: nonNeg(v, "otHours", 0),
        doubleHours: nonNeg(v, "dtHours", 0),
        overtimeMultiplier: nonNeg(v, "otMultiplier", 1.5) || 1.5,
      });
      const multiplier = nonNeg(v, "otMultiplier", 1.5) || 1.5;
      return {
        primary: { value: money(result.overtimePay + result.doublePay), label: "Your estimated overtime pay" },
        rows: [
          { label: "Overtime rate", value: rate(hourly * multiplier) },
          { label: `Overtime pay (${fmtHours(result.overtimeHours)})`, value: money(result.overtimePay) },
          { label: `Double-time pay (${fmtHours(result.doubleHours)})`, value: money(result.doublePay) },
          { label: "Regular pay", value: money(result.regularPay) },
          { label: "Total gross pay", value: money(result.total), strong: true },
          { label: "Total hours", value: fmtHours(result.totalHours) },
          { label: "Blended hourly rate", value: rate(result.blendedRate) },
        ],
      };
    },
    howItWorks: [
      "Regular hours are paid at your base rate.",
      "Overtime hours are paid at your base rate multiplied by the overtime multiplier, normally 1.5.",
      "Double-time hours are paid at twice the base rate and added to the total.",
    ],
    formula:
      "Overtime pay = Overtime hours × Hourly rate × 1.5 · Total pay = Regular pay + Overtime pay + Double-time pay",
    example: [
      "$22 per hour with 40 regular hours and 6 overtime hours.",
      "Overtime rate is $33. Overtime pay is 6 × $33 = $198.",
      "Regular pay is $880, so total gross pay for the week is $1,078.",
    ],
    assumptions: [
      "Federal law generally requires 1.5× pay after 40 hours in a workweek for non-exempt employees.",
      "Some states require daily overtime or double time after certain thresholds.",
      "Overtime is usually calculated on the regular rate of pay, which can include some bonuses and differentials.",
    ],
    disclaimer: true,
    faqs: [
      {
        q: "How do I calculate overtime pay?",
        a: "Multiply your hourly rate by 1.5, then multiply by the number of overtime hours. Add that to your regular pay.",
      },
      {
        q: "Who qualifies for overtime?",
        a: "Non-exempt employees generally qualify after 40 hours in a workweek. Exempt salaried roles usually do not. Your state may have extra protections.",
      },
      {
        q: "Is overtime taxed more?",
        a: "No. Overtime is ordinary income. A bigger paycheck can push more of that check into higher withholding, but the rate on your normal pay doesn't change.",
      },
    ],
    related: [
      "time-and-a-half-calculator",
      "double-time-calculator",
      "time-card-calculator",
      "paycheck-calculator",
    ],
  },

  {
    slug: "time-and-a-half-calculator",
    name: "Time and a Half Calculator",
    h1: "Time and a Half Calculator",
    category: "work-hours",
    icon: "Gauge",
    short: "Find your 1.5× rate and what those hours pay.",
    keywords: ["time and a half", "1.5x pay", "overtime rate", "holiday pay rate"],
    title: "Time and a Half Calculator – 1.5x Pay Rate | Workly USA",
    description:
      "Calculate your time and a half rate and the pay for hours worked at 1.5×. Free and instant, no signup.",
    intro: "Enter your base rate to see your time-and-a-half rate and total pay for those hours.",
    fields: [
      { id: "rate", label: "Base hourly rate", prefix: "$", default: "18", step: "0.01" },
      { id: "hours", label: "Hours at time and a half", suffix: "hrs", default: "8", step: "0.25" },
    ],
    compute: (v) => {
      const hourly = required(num(v, "rate"), "a base hourly rate");
      const worked = nonNeg(v, "hours", 0);
      const otRate = hourly * 1.5;
      return {
        primary: { value: rate(otRate), label: "Your time and a half rate" },
        rows: [
          { label: "Base rate", value: rate(hourly) },
          { label: "Hours at 1.5×", value: fmtHours(worked) },
          { label: "Pay for those hours", value: money(otRate * worked), strong: true },
          { label: "Extra earned vs base rate", value: money((otRate - hourly) * worked) },
          { label: "Daily total at 8 hours", value: money(otRate * 8) },
        ],
      };
    },
    howItWorks: [
      "Time and a half means your base rate plus half of your base rate.",
      "Multiply the base rate by 1.5 to get the premium rate.",
      "Multiply that rate by the hours worked at the premium.",
    ],
    formula: "Time and a half rate = Hourly rate × 1.5",
    example: [
      "A base rate of $18 per hour.",
      "$18 × 1.5 = $27 per hour.",
      "Eight hours at that rate pays $216.",
    ],
    assumptions: [
      "Holiday premium pay is set by employer policy unless a contract requires it.",
      "Overtime uses the regular rate of pay, which may be higher than base rate if you receive certain bonuses.",
    ],
    faqs: [
      {
        q: "What is time and a half for $20 an hour?",
        a: "$30 per hour.",
      },
      {
        q: "Is holiday pay always time and a half?",
        a: "No. Federal law doesn't require holiday premium pay. Many employers offer it by policy.",
      },
      {
        q: "How is it different from double time?",
        a: "Double time pays twice the base rate. Some states require it after long daily hours.",
      },
    ],
    related: [
      "overtime-calculator",
      "double-time-calculator",
      "weekly-pay-calculator",
      "shift-calculator",
    ],
  },

  {
    slug: "double-time-calculator",
    name: "Double Time Calculator",
    h1: "Double Time Calculator",
    category: "work-hours",
    icon: "Zap",
    short: "Calculate 2× pay for long days and premium hours.",
    keywords: ["double time", "2x pay", "double time and a half", "premium pay"],
    title: "Double Time Calculator – 2x Pay Rate | Workly USA",
    description:
      "Calculate double-time pay, mixed overtime and double-time hours, and total earnings for a long shift.",
    intro:
      "Some states and union agreements pay double time past a daily threshold. Enter your hours to see the split.",
    fields: [
      { id: "rate", label: "Base hourly rate", prefix: "$", default: "26", step: "0.01" },
      { id: "dailyHours", label: "Hours worked in the day", suffix: "hrs", default: "14", step: "0.25" },
      { id: "otAfter", label: "Overtime starts after", suffix: "hrs", default: "8" },
      { id: "dtAfter", label: "Double time starts after", suffix: "hrs", default: "12" },
    ],
    compute: (v) => {
      const hourly = required(num(v, "rate"), "a base hourly rate");
      const worked = nonNeg(v, "dailyHours", 0);
      const otAfter = nonNeg(v, "otAfter", 8);
      const dtAfter = Math.max(otAfter, nonNeg(v, "dtAfter", 12));
      const regular = Math.min(worked, otAfter);
      const otHours = Math.max(0, Math.min(worked, dtAfter) - otAfter);
      const dtHours = Math.max(0, worked - dtAfter);
      const result = overtimePay({
        hourlyRate: hourly,
        regularHours: regular,
        overtimeHours: otHours,
        doubleHours: dtHours,
      });
      return {
        primary: { value: money(result.doublePay), label: "Double-time pay" },
        rows: [
          { label: "Double-time rate", value: rate(hourly * 2) },
          { label: `Regular hours (${fmtHours(regular)})`, value: money(result.regularPay) },
          { label: `Overtime hours at 1.5× (${fmtHours(otHours)})`, value: money(result.overtimePay) },
          { label: `Double-time hours (${fmtHours(dtHours)})`, value: money(result.doublePay) },
          { label: "Total pay for the day", value: money(result.total), strong: true },
          { label: "Blended hourly rate", value: rate(result.blendedRate) },
        ],
      };
    },
    howItWorks: [
      "Hours are split into three bands using your daily thresholds.",
      "The first band pays base rate, the second 1.5×, the third 2×.",
      "The three amounts are added for the day's total.",
    ],
    formula: "Double-time pay = Hours past the double-time threshold × Hourly rate × 2",
    example: [
      "A 14-hour day at $26 per hour, overtime after 8, double time after 12.",
      "8 hours regular ($208), 4 hours at $39 ($156), 2 hours at $52 ($104).",
      "Total for the day: $468.",
    ],
    assumptions: [
      "Daily overtime and double-time rules are state and contract specific; California is the best-known example.",
      "Federal law alone does not require double time.",
    ],
    disclaimer: true,
    faqs: [
      {
        q: "When does double time apply?",
        a: "Where state law or a union contract requires it — often past 12 hours in a day, or on a seventh consecutive workday.",
      },
      {
        q: "What is double time for $20 an hour?",
        a: "$40 per hour.",
      },
      {
        q: "Can I get overtime and double time in one day?",
        a: "Yes. Hours are usually banded: base rate, then 1.5×, then 2×.",
      },
    ],
    related: [
      "overtime-calculator",
      "time-and-a-half-calculator",
      "shift-calculator",
      "time-card-calculator",
    ],
  },

  {
    slug: "shift-calculator",
    name: "Shift Calculator",
    h1: "Shift Calculator",
    category: "work-hours",
    icon: "Sunrise",
    short: "Hours and pay for a single shift, including overnight.",
    keywords: ["shift calculator", "shift hours", "shift pay", "overnight shift"],
    title: "Shift Calculator – Shift Hours and Pay | Workly USA",
    description:
      "Calculate the length and pay of a single shift, with breaks and overnight support. Free shift calculator.",
    intro: "Enter your shift times to see length, paid hours and pay for the shift.",
    fields: [
      { id: "start", label: "Shift start", type: "time", default: "14:00" },
      { id: "end", label: "Shift end", type: "time", default: "22:30" },
      { id: "break", label: "Unpaid break", suffix: "min", default: "30", optional: true },
      { id: "rate", label: "Hourly rate", prefix: "$", default: "21", step: "0.01" },
      {
        id: "shiftsPerWeek",
        label: "Shifts like this per week",
        default: "5",
        optional: true,
      },
    ],
    compute: (v) => {
      const minutes = shiftMinutes(v['start'] ?? "", v['end'] ?? "", nonNeg(v, "break", 0));
      if (!Number.isFinite(minutes)) {
        return { primary: { value: "—", label: "Enter a valid shift start and end" }, rows: [] };
      }
      const paidHours = minutesToHours(minutes);
      const hourly = nonNeg(v, "rate", 0);
      const perWeek = nonNeg(v, "shiftsPerWeek", 0);
      const weekHours = paidHours * perWeek;
      const split = splitWeeklyHours(weekHours, 40);
      const weekPay = split.regular * hourly + split.overtime * hourly * 1.5;
      const startMinutes = shiftMinutes(v['start'] ?? "", v['end'] ?? "", 0);
      return {
        primary: { value: money(paidHours * hourly), label: "Pay for this shift" },
        rows: [
          { label: "Paid hours", value: fmtHours(paidHours), strong: true },
          { label: "Time on the clock", value: duration(startMinutes) },
          { label: "Shift ends", value: clock((Number(v['end']?.split(":")[0] ?? 0) * 60) + Number(v['end']?.split(":")[1] ?? 0)) },
          { label: "Weekly hours at this pattern", value: fmtHours(weekHours) },
          { label: "Weekly overtime hours", value: fmtHours(split.overtime) },
          { label: "Estimated weekly pay", value: money(weekPay) },
        ],
      };
    },
    howItWorks: [
      "Shift length is the span between start and end, adding a day when the shift crosses midnight.",
      "Unpaid break minutes are removed to get paid hours.",
      "Paid hours are multiplied by your rate, then scaled to a week using your shift count.",
    ],
    formula: "Shift pay = ((End − Start) − Break) ÷ 60 × Hourly rate",
    example: [
      "A shift from 2:00 PM to 10:30 PM with a 30-minute unpaid break.",
      "That's 8.00 paid hours.",
      "At $21 per hour, the shift pays $168.",
    ],
    assumptions: [
      "Weekly overtime is applied after 40 hours.",
      "Shift differentials are not included unless added to the rate.",
    ],
    faqs: [
      {
        q: "How long is a 2 PM to 10:30 PM shift?",
        a: "8.5 hours on the clock, or 8 paid hours with a 30-minute unpaid break.",
      },
      {
        q: "Does it work for overnight shifts?",
        a: "Yes. A 10:00 PM to 6:00 AM shift returns 8 hours.",
      },
      {
        q: "What about shift premiums?",
        a: "Use the night shift calculator to add a differential percentage.",
      },
    ],
    related: [
      "night-shift-calculator",
      "hours-worked-calculator",
      "time-card-calculator",
      "overtime-calculator",
    ],
  },

  {
    slug: "night-shift-calculator",
    name: "Night Shift Calculator",
    h1: "Night Shift Differential Calculator",
    category: "work-hours",
    icon: "Moon",
    short: "Add a night differential to your shift pay.",
    keywords: ["night shift", "shift differential", "night differential", "graveyard shift"],
    title: "Night Shift Calculator – Shift Differential Pay | Workly USA",
    description:
      "Calculate night shift differential pay, including how many of your hours fall inside the premium window.",
    intro:
      "Enter your shift and your employer's night window to see how much of the shift earns a differential.",
    fields: [
      { id: "start", label: "Shift start", type: "time", default: "22:00" },
      { id: "end", label: "Shift end", type: "time", default: "06:00" },
      { id: "break", label: "Unpaid break", suffix: "min", default: "0", optional: true },
      { id: "rate", label: "Base hourly rate", prefix: "$", default: "23", step: "0.01" },
      { id: "differential", label: "Night differential", suffix: "%", default: "15", step: "0.5" },
      { id: "windowStart", label: "Night window starts", type: "time", default: "18:00" },
      { id: "windowEnd", label: "Night window ends", type: "time", default: "06:00" },
    ],
    compute: (v) => {
      const totalMinutes = shiftMinutes(v['start'] ?? "", v['end'] ?? "", nonNeg(v, "break", 0));
      const night = nightMinutes(v['start'] ?? "", v['end'] ?? "", v['windowStart'] ?? "", v['windowEnd'] ?? "");
      if (!Number.isFinite(totalMinutes) || !Number.isFinite(night)) {
        return { primary: { value: "—", label: "Enter valid shift and window times" }, rows: [] };
      }
      const hourly = required(num(v, "rate"), "a base hourly rate");
      const diff = nonNeg(v, "differential", 0);
      const paidHours = minutesToHours(totalMinutes);
      const nightHours = Math.min(paidHours, minutesToHours(night));
      const dayHours = Math.max(0, paidHours - nightHours);
      const nightRate = hourly * (1 + diff / 100);
      const total = dayHours * hourly + nightHours * nightRate;
      return {
        primary: { value: money(total), label: "Pay for this shift with differential" },
        rows: [
          { label: "Paid hours", value: fmtHours(paidHours) },
          { label: "Hours in night window", value: fmtHours(nightHours), strong: true },
          { label: "Night rate", value: rate(nightRate) },
          { label: "Differential earned", value: money(nightHours * (nightRate - hourly)) },
          { label: "Pay at base rate", value: money(dayHours * hourly) },
          { label: "Effective rate for the shift", value: paidHours > 0 ? rate(total / paidHours) : "—" },
        ],
      };
    },
    howItWorks: [
      "The overlap between your shift and the night window is measured in minutes, across midnight if needed.",
      "Those hours are paid at your base rate plus the differential percentage.",
      "The remaining hours are paid at base rate, and the two are added together.",
    ],
    formula: "Night pay = Night hours × Rate × (1 + Differential ÷ 100)",
    example: [
      "A 10:00 PM to 6:00 AM shift with a 6:00 PM–6:00 AM night window.",
      "All 8 hours fall inside the window, so all 8 earn the 15% premium.",
      "At $23 base, the night rate is $26.45 and the shift pays $211.60.",
    ],
    assumptions: [
      "Night differentials are set by employer policy or union contract, not federal law.",
      "Differentials may be included in the regular rate used for overtime.",
    ],
    faqs: [
      {
        q: "Is night shift pay required by law?",
        a: "Federal law does not require a night differential. It is typically employer policy or a bargained benefit.",
      },
      {
        q: "What is a typical differential?",
        a: "Commonly 5%–15% of base pay, or a flat dollar amount per hour.",
      },
      {
        q: "Does the differential affect overtime?",
        a: "Often yes — shift premiums are usually part of the regular rate used to calculate overtime.",
      },
    ],
    related: [
      "shift-calculator",
      "overtime-calculator",
      "time-card-calculator",
      "hours-worked-calculator",
    ],
  },
];
