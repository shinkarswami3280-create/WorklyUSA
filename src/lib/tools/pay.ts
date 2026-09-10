import {
  PAY_FREQUENCY_OPTIONS,
  num,
  nonNeg,
  paycheckEstimate,
  payBreakdownFromAnnual,
  payBreakdownFromHourly,
  periodsPerYear,
  required,
  splitWeeklyHours,
  str,
} from "@/lib/calc";
import { hours as fmtHours, money, moneySmart, number, percent, rate } from "@/lib/format";
import type { Tool } from "./types";

const hoursPerWeekField = {
  id: "hoursPerWeek",
  label: "Hours per week",
  suffix: "hrs",
  default: "40",
  step: "0.25",
};

const weeksPerYearField = {
  id: "weeksPerYear",
  label: "Weeks worked per year",
  suffix: "weeks",
  default: "52",
  help: "Use 50 if you take two unpaid weeks off.",
};

export const payTools: Tool[] = [
  {
    slug: "salary-to-hourly-calculator",
    name: "Salary to Hourly Calculator",
    h1: "Salary to Hourly Calculator",
    category: "pay",
    icon: "Coins",
    short: "Turn an annual salary into an equivalent hourly rate.",
    keywords: ["salary to hourly", "annual to hourly", "yearly to hourly", "convert salary"],
    title: "Salary to Hourly Calculator – Convert Yearly Pay | Workly USA",
    description:
      "Convert an annual salary into an hourly rate, plus weekly, biweekly and monthly pay. Free, instant and no signup required.",
    intro:
      "Enter your annual salary and normal schedule to see what you earn per hour, per week and per paycheck.",
    fields: [
      { id: "annualSalary", label: "Annual salary", prefix: "$", default: "62000" },
      hoursPerWeekField,
      weeksPerYearField,
      { id: "daysPerWeek", label: "Work days per week", default: "5" },
    ],
    compute: (v) => {
      const salary = required(num(v, "annualSalary"), "an annual salary");
      const hpw = required(num(v, "hoursPerWeek", 40), "hours per week");
      const wpy = required(num(v, "weeksPerYear", 52), "weeks per year");
      const dpw = nonNeg(v, "daysPerWeek", 5);
      const b = payBreakdownFromAnnual(salary, hpw, wpy, dpw);
      return {
        primary: { value: rate(b.hourly), label: "Equivalent hourly rate" },
        rows: [
          { label: "Annual", value: moneySmart(b.annual), strong: true },
          { label: "Monthly", value: money(b.monthly) },
          { label: "Biweekly", value: money(b.biweekly) },
          { label: "Weekly", value: money(b.weekly) },
          { label: "Daily", value: money(b.daily) },
          { label: "Hours worked per year", value: fmtHours(b.annualHours) },
        ],
      };
    },
    howItWorks: [
      "Your schedule is converted into total hours worked per year: hours per week × weeks per year.",
      "Annual salary is divided by those hours to give the hourly equivalent.",
      "Weekly, biweekly and monthly figures come straight from the annual salary, not from rounding the hourly rate.",
    ],
    formula: "Hourly rate = Annual salary ÷ (Hours per week × Weeks per year)",
    example: [
      "A $62,000 salary at 40 hours per week for 52 weeks is 2,080 work hours.",
      "$62,000 ÷ 2,080 = $29.81 per hour.",
      "That is $1,192.31 per week and $2,384.62 every two weeks before taxes.",
    ],
    assumptions: [
      "Salaried pay is treated as the same amount every period, regardless of hours actually worked.",
      "Paid time off is included in the weeks-per-year value you enter.",
      "Figures are gross pay, before taxes and deductions.",
    ],
    faqs: [
      {
        q: "How many work hours are in a year?",
        a: "A standard full-time schedule of 40 hours per week for 52 weeks is 2,080 hours. If you take two unpaid weeks off, use 50 weeks for 2,000 hours.",
      },
      {
        q: "Should I use 52 weeks if I get paid vacation?",
        a: "Yes. Paid time off is still paid, so the salary is spread across the full 52 weeks.",
      },
      {
        q: "Is this my take-home hourly rate?",
        a: "No. This is gross pay. Use the paycheck calculator to estimate what lands in your bank account.",
      },
    ],
    related: [
      "hourly-to-salary-calculator",
      "effective-hourly-wage-calculator",
      "paycheck-calculator",
      "raise-calculator",
    ],
  },

  {
    slug: "hourly-to-salary-calculator",
    name: "Hourly to Salary Calculator",
    h1: "Hourly to Salary Calculator",
    category: "pay",
    icon: "TrendingUp",
    short: "See what an hourly wage adds up to over a year.",
    keywords: ["hourly to salary", "hourly to annual", "wage to salary", "yearly pay"],
    title: "Hourly to Salary Calculator – Annual Pay From Wage | Workly USA",
    description:
      "Convert an hourly wage into annual, monthly, biweekly and weekly pay. Free hourly to salary calculator with no signup.",
    intro:
      "Enter your hourly wage and schedule to see what it adds up to per week, per paycheck and per year.",
    fields: [
      { id: "hourlyRate", label: "Hourly rate", prefix: "$", default: "24.50", step: "0.01" },
      hoursPerWeekField,
      weeksPerYearField,
      { id: "daysPerWeek", label: "Work days per week", default: "5" },
    ],
    compute: (v) => {
      const hourly = required(num(v, "hourlyRate"), "an hourly rate");
      const hpw = required(num(v, "hoursPerWeek", 40), "hours per week");
      const wpy = required(num(v, "weeksPerYear", 52), "weeks per year");
      const dpw = nonNeg(v, "daysPerWeek", 5);
      const b = payBreakdownFromHourly(hourly, hpw, wpy, dpw);
      return {
        primary: { value: moneySmart(b.annual), label: "Estimated annual pay" },
        rows: [
          { label: "Monthly", value: money(b.monthly), strong: true },
          { label: "Biweekly", value: money(b.biweekly) },
          { label: "Weekly", value: money(b.weekly) },
          { label: "Daily", value: money(b.daily) },
          { label: "Hourly", value: rate(hourly) },
          { label: "Hours worked per year", value: fmtHours(b.annualHours) },
        ],
      };
    },
    howItWorks: [
      "Weekly pay is your hourly rate multiplied by hours per week.",
      "Annual pay is weekly pay multiplied by the number of weeks you work.",
      "Monthly and biweekly amounts divide the annual figure by 12 and 26.",
    ],
    formula: "Annual pay = Hourly rate × Hours per week × Weeks per year",
    example: [
      "$24.50 per hour at 40 hours per week for 52 weeks.",
      "$24.50 × 40 = $980 per week.",
      "$980 × 52 = $50,960 per year, or about $4,246.67 per month before taxes.",
    ],
    assumptions: [
      "Every week is assumed to have the same number of hours.",
      "Overtime, bonuses and shift differentials are not included.",
      "Unpaid time off should be removed by lowering weeks per year.",
    ],
    faqs: [
      {
        q: "What is $20 an hour annually?",
        a: "At 40 hours a week for 52 weeks it is $41,600 per year before taxes.",
      },
      {
        q: "Does this include overtime?",
        a: "No. Add overtime separately with the overtime calculator, since those hours pay at a higher rate.",
      },
      {
        q: "Why does my paycheck look smaller?",
        a: "These figures are gross. Taxes, insurance and retirement contributions come out before you are paid.",
      },
    ],
    related: [
      "salary-to-hourly-calculator",
      "overtime-calculator",
      "paycheck-calculator",
      "annual-pay-calculator",
    ],
  },

  {
    slug: "paycheck-calculator",
    name: "Paycheck Calculator",
    h1: "Paycheck Calculator",
    category: "pay",
    icon: "Wallet",
    short: "Estimate take-home pay after taxes and deductions.",
    keywords: ["paycheck", "take home pay", "net pay", "after tax pay", "payroll"],
    title: "Paycheck Calculator – Estimate Take-Home Pay | Workly USA",
    description:
      "Estimate your take-home pay from gross pay, pay frequency, an estimated tax rate and deductions. Free paycheck estimator, no signup.",
    intro:
      "A simple take-home estimate. Enter your gross pay for one pay period, how often you are paid, and an estimated overall tax withholding rate.",
    fields: [
      { id: "gross", label: "Gross pay this period", prefix: "$", default: "2400" },
      {
        id: "frequency",
        label: "Pay frequency",
        type: "select",
        default: "biweekly",
        options: PAY_FREQUENCY_OPTIONS,
      },
      {
        id: "taxRate",
        label: "Estimated total tax withholding",
        suffix: "%",
        default: "22",
        help: "Federal, state and FICA combined. Check a recent pay stub for your real rate.",
      },
      {
        id: "preTax",
        label: "Pre-tax deductions per period",
        prefix: "$",
        default: "0",
        optional: true,
        help: "401(k), HSA, most health premiums.",
      },
      {
        id: "postTax",
        label: "Post-tax deductions per period",
        prefix: "$",
        default: "0",
        optional: true,
        help: "Roth 401(k), garnishments, union dues.",
      },
    ],
    compute: (v) => {
      const gross = required(num(v, "gross"), "your gross pay");
      const frequency = str(v, "frequency", "biweekly");
      const est = paycheckEstimate({
        gross,
        frequency,
        taxRatePercent: nonNeg(v, "taxRate", 0),
        preTaxDeductions: nonNeg(v, "preTax", 0),
        postTaxDeductions: nonNeg(v, "postTax", 0),
      });
      return {
        primary: { value: money(est.net), label: "Estimated take-home pay per paycheck" },
        rows: [
          { label: "Gross pay", value: money(est.gross) },
          { label: "Pre-tax deductions", value: `− ${money(est.preTax)}` },
          { label: "Estimated taxes withheld", value: `− ${money(est.taxes)}` },
          { label: "Post-tax deductions", value: `− ${money(est.postTax)}` },
          { label: "Estimated net pay", value: money(est.net), strong: true },
          { label: "Effective deduction rate", value: percent(est.effectiveTaxRate) },
          { label: "Annual gross", value: moneySmart(est.annualGross) },
          { label: "Estimated annual net", value: moneySmart(est.annualNet) },
        ],
        notes: [
          `Based on ${periodsPerYear(frequency)} pay periods per year.`,
        ],
      };
    },
    howItWorks: [
      "Pre-tax deductions are subtracted from gross pay first, because they lower taxable wages.",
      "The estimated tax rate you enter is applied to the remaining taxable amount.",
      "Post-tax deductions come out last to give estimated net pay.",
    ],
    formula:
      "Net pay ≈ (Gross − Pre-tax deductions) − ((Gross − Pre-tax deductions) × Tax rate) − Post-tax deductions",
    example: [
      "Gross pay of $2,400 every two weeks with $150 going into a 401(k).",
      "Taxable pay is $2,250. At a 22% combined rate, withholding is $495.",
      "Estimated take-home pay is $1,755 per paycheck, about $45,630 per year.",
    ],
    assumptions: [
      "One blended withholding rate stands in for federal, state, local and FICA taxes.",
      "Real payroll uses filing status, allowances, wage brackets and state-specific rules.",
      "Nothing you type is sent to a server or stored.",
    ],
    disclaimer: true,
    faqs: [
      {
        q: "What tax rate should I enter?",
        a: "Divide the total deductions line on a recent pay stub by the gross pay on that stub. Many US workers land somewhere between 18% and 30%.",
      },
      {
        q: "Why isn't this exact?",
        a: "Actual withholding depends on your W-4, filing status, state, local taxes and year-to-date wages. This tool gives a planning estimate, not a payroll calculation.",
      },
      {
        q: "Do pre-tax deductions really save money?",
        a: "They reduce taxable wages, so each dollar contributed costs you less than a dollar of take-home pay.",
      },
    ],
    related: [
      "biweekly-pay-calculator",
      "salary-to-hourly-calculator",
      "bonus-calculator",
      "overtime-calculator",
    ],
  },

  {
    slug: "weekly-pay-calculator",
    name: "Weekly Pay Calculator",
    h1: "Weekly Pay Calculator",
    category: "pay",
    icon: "CalendarDays",
    short: "Work out one week of pay, including overtime hours.",
    keywords: ["weekly pay", "week wages", "weekly earnings", "pay per week"],
    title: "Weekly Pay Calculator – Weekly Earnings With Overtime | Workly USA",
    description:
      "Calculate one week of gross pay from your hourly rate and hours worked, with overtime past 40 hours handled automatically.",
    intro:
      "Enter your hourly rate and the hours you worked this week. Anything past the overtime threshold is paid at the higher rate.",
    fields: [
      { id: "hourlyRate", label: "Hourly rate", prefix: "$", default: "22", step: "0.01" },
      { id: "hoursWorked", label: "Hours worked this week", suffix: "hrs", default: "46", step: "0.25" },
      { id: "threshold", label: "Overtime starts after", suffix: "hrs", default: "40" },
      { id: "multiplier", label: "Overtime multiplier", default: "1.5", step: "0.1" },
    ],
    compute: (v) => {
      const hourly = required(num(v, "hourlyRate"), "an hourly rate");
      const worked = required(num(v, "hoursWorked"), "hours worked", true);
      const threshold = nonNeg(v, "threshold", 40);
      const multiplier = nonNeg(v, "multiplier", 1.5) || 1.5;
      const split = splitWeeklyHours(worked, threshold);
      const regularPay = split.regular * hourly;
      const otPay = split.overtime * hourly * multiplier;
      const total = regularPay + otPay;
      return {
        primary: { value: money(total), label: "Gross pay for the week" },
        rows: [
          { label: "Regular hours", value: fmtHours(split.regular) },
          { label: "Regular pay", value: money(regularPay) },
          { label: "Overtime hours", value: fmtHours(split.overtime) },
          { label: `Overtime pay (×${multiplier})`, value: money(otPay) },
          { label: "Total pay", value: money(total), strong: true },
          { label: "Average rate for the week", value: worked > 0 ? rate(total / worked) : "—" },
        ],
      };
    },
    howItWorks: [
      "Hours up to the threshold are paid at your base rate.",
      "Hours over the threshold are paid at your base rate times the overtime multiplier.",
      "The two amounts are added for gross weekly pay.",
    ],
    formula:
      "Weekly pay = (Regular hours × Rate) + (Overtime hours × Rate × Multiplier)",
    example: [
      "46 hours at $22 per hour with overtime after 40.",
      "40 × $22 = $880 regular, 6 × $33 = $198 overtime.",
      "Total gross pay for the week is $1,078.",
    ],
    assumptions: [
      "Federal law generally requires overtime after 40 hours in a workweek for non-exempt employees.",
      "Some states use daily overtime rules that this simple weekly view does not model.",
      "Amounts are gross, before withholding.",
    ],
    faqs: [
      {
        q: "Does everyone get overtime after 40 hours?",
        a: "Non-exempt employees generally do under federal rules. Exempt salaried roles usually do not, and some states have additional daily rules.",
      },
      {
        q: "How do I handle unpaid breaks?",
        a: "Only enter paid hours. The time card calculator subtracts breaks for you.",
      },
      {
        q: "Can I change the threshold?",
        a: "Yes. Set it to 8 for a daily calculation or to another number if your agreement differs.",
      },
    ],
    related: [
      "overtime-calculator",
      "time-card-calculator",
      "biweekly-pay-calculator",
      "hourly-to-salary-calculator",
    ],
  },

  {
    slug: "biweekly-pay-calculator",
    name: "Biweekly Pay Calculator",
    h1: "Biweekly Pay Calculator",
    category: "pay",
    icon: "CalendarClock",
    short: "See your paycheck amount when you're paid every two weeks.",
    keywords: ["biweekly pay", "every two weeks", "26 paychecks", "fortnightly pay"],
    title: "Biweekly Pay Calculator – Pay Every Two Weeks | Workly USA",
    description:
      "Calculate biweekly paycheck amounts from an annual salary or hourly wage, including the months with three paychecks.",
    intro:
      "Being paid every two weeks means 26 paychecks a year, not 24. Enter your salary to see the real per-paycheck amount.",
    fields: [
      {
        id: "mode",
        label: "I know my",
        type: "select",
        default: "salary",
        options: [
          { value: "salary", label: "Annual salary" },
          { value: "hourly", label: "Hourly rate" },
        ],
      },
      { id: "annualSalary", label: "Annual salary", prefix: "$", default: "62000", optional: true },
      { id: "hourlyRate", label: "Hourly rate", prefix: "$", default: "0", optional: true, step: "0.01" },
      hoursPerWeekField,
    ],
    compute: (v) => {
      const mode = str(v, "mode", "salary");
      const hpw = required(num(v, "hoursPerWeek", 40), "hours per week");
      const annual =
        mode === "hourly"
          ? required(num(v, "hourlyRate"), "an hourly rate") * hpw * 52
          : required(num(v, "annualSalary"), "an annual salary");
      const biweekly = annual / 26;
      return {
        primary: { value: money(biweekly), label: "Gross pay every two weeks" },
        rows: [
          { label: "Paychecks per year", value: "26" },
          { label: "Annual gross", value: moneySmart(annual), strong: true },
          { label: "Weekly", value: money(annual / 52) },
          { label: "Monthly average", value: money(annual / 12) },
          { label: "Hourly equivalent", value: rate(annual / (hpw * 52)) },
          { label: "Three-paycheck month total", value: money(biweekly * 3) },
        ],
        notes: [
          "Two months each year contain three biweekly paychecks — useful months for savings or extra debt payments.",
        ],
      };
    },
    howItWorks: [
      "A biweekly schedule pays every 14 days, which is 26 pay periods in a 365-day year.",
      "Annual salary is divided by 26, not by 24, so each check is slightly smaller than a semi-monthly one.",
      "Because 26 checks don't line up with 12 months, two months a year contain three paychecks.",
    ],
    formula: "Biweekly gross = Annual salary ÷ 26",
    example: [
      "A $62,000 salary paid biweekly.",
      "$62,000 ÷ 26 = $2,384.62 gross per paycheck.",
      "In the two three-paycheck months, gross pay for the month is $7,153.86.",
    ],
    assumptions: [
      "26 pay periods per year; some years have 27 depending on the payroll calendar.",
      "Amounts shown are gross, before taxes and deductions.",
    ],
    faqs: [
      {
        q: "Is biweekly the same as semi-monthly?",
        a: "No. Biweekly is every 14 days (26 checks). Semi-monthly is twice a month (24 checks) on fixed dates.",
      },
      {
        q: "Why do I sometimes get three paychecks in a month?",
        a: "26 fourteen-day periods don't divide evenly into 12 months, so two months each year contain a third payday.",
      },
      {
        q: "How much is that after taxes?",
        a: "Run the number through the paycheck calculator with your estimated withholding rate.",
      },
    ],
    related: [
      "paycheck-calculator",
      "monthly-pay-calculator",
      "weekly-pay-calculator",
      "annual-pay-calculator",
    ],
  },

  {
    slug: "monthly-pay-calculator",
    name: "Monthly Pay Calculator",
    h1: "Monthly Pay Calculator",
    category: "pay",
    icon: "Calendar",
    short: "Convert hourly or weekly pay into a monthly figure.",
    keywords: ["monthly pay", "monthly income", "pay per month", "monthly salary"],
    title: "Monthly Pay Calculator – Monthly Income From Hourly Pay | Workly USA",
    description:
      "Convert an hourly wage or weekly pay into accurate monthly income for budgeting, rent applications and planning.",
    intro:
      "Monthly income from hourly work isn't simply four weeks of pay. This uses the full-year average so your budget stays accurate.",
    fields: [
      { id: "hourlyRate", label: "Hourly rate", prefix: "$", default: "26", step: "0.01" },
      hoursPerWeekField,
      weeksPerYearField,
    ],
    compute: (v) => {
      const hourly = required(num(v, "hourlyRate"), "an hourly rate");
      const hpw = required(num(v, "hoursPerWeek", 40), "hours per week");
      const wpy = required(num(v, "weeksPerYear", 52), "weeks per year");
      const annual = hourly * hpw * wpy;
      return {
        primary: { value: money(annual / 12), label: "Average monthly gross income" },
        rows: [
          { label: "Annual", value: moneySmart(annual), strong: true },
          { label: "Weekly", value: money(annual / wpy) },
          { label: "Biweekly", value: money(annual / 26) },
          { label: "Semi-monthly", value: money(annual / 24) },
          { label: "Four-week month", value: money(hourly * hpw * 4) },
        ],
        notes: [
          "A month averages 4.33 weeks, so using four weeks understates monthly income by roughly 8%.",
        ],
      };
    },
    howItWorks: [
      "Weekly pay is multiplied by weeks per year to get annual pay.",
      "Annual pay is divided by 12 for a true monthly average.",
      "This avoids the common mistake of multiplying weekly pay by four.",
    ],
    formula: "Monthly income = (Hourly rate × Hours per week × Weeks per year) ÷ 12",
    example: [
      "$26 per hour, 40 hours a week, 52 weeks.",
      "$26 × 40 × 52 = $54,080 per year.",
      "$54,080 ÷ 12 = $4,506.67 average per month.",
    ],
    assumptions: [
      "Hours are assumed steady across the year.",
      "Gross amounts, before taxes and deductions.",
    ],
    faqs: [
      {
        q: "Why not multiply weekly pay by 4?",
        a: "Most months are longer than four weeks. The yearly average of 4.33 weeks per month is more accurate.",
      },
      {
        q: "What if my hours change week to week?",
        a: "Use your average weekly hours over the last few months for a realistic figure.",
      },
      {
        q: "Do landlords use gross or net income?",
        a: "Most rental applications ask for gross monthly income, which is the figure shown here.",
      },
    ],
    related: [
      "annual-pay-calculator",
      "biweekly-pay-calculator",
      "hourly-to-salary-calculator",
      "paycheck-calculator",
    ],
  },

  {
    slug: "annual-pay-calculator",
    name: "Annual Pay Calculator",
    h1: "Annual Pay Calculator",
    category: "pay",
    icon: "PiggyBank",
    short: "Add up a full year of pay including overtime and bonuses.",
    keywords: ["annual pay", "yearly income", "total yearly earnings", "annual salary"],
    title: "Annual Pay Calculator – Total Yearly Earnings | Workly USA",
    description:
      "Calculate total yearly earnings from your hourly rate, weekly overtime and any annual bonus. Free annual pay calculator.",
    intro:
      "Estimate everything you'll earn in a year, including regular hours, weekly overtime and a bonus.",
    fields: [
      { id: "hourlyRate", label: "Hourly rate", prefix: "$", default: "25", step: "0.01" },
      hoursPerWeekField,
      weeksPerYearField,
      {
        id: "otHours",
        label: "Overtime hours per week",
        suffix: "hrs",
        default: "0",
        optional: true,
        step: "0.25",
      },
      { id: "bonus", label: "Annual bonus", prefix: "$", default: "0", optional: true },
    ],
    compute: (v) => {
      const hourly = required(num(v, "hourlyRate"), "an hourly rate");
      const hpw = required(num(v, "hoursPerWeek", 40), "hours per week");
      const wpy = required(num(v, "weeksPerYear", 52), "weeks per year");
      const ot = nonNeg(v, "otHours", 0);
      const bonus = nonNeg(v, "bonus", 0);
      const base = hourly * hpw * wpy;
      const otPay = ot * hourly * 1.5 * wpy;
      const total = base + otPay + bonus;
      return {
        primary: { value: moneySmart(total), label: "Estimated total annual pay" },
        rows: [
          { label: "Base pay", value: moneySmart(base) },
          { label: "Overtime pay", value: moneySmart(otPay) },
          { label: "Bonus", value: moneySmart(bonus) },
          { label: "Total", value: moneySmart(total), strong: true },
          { label: "Monthly average", value: money(total / 12) },
          { label: "Total hours worked", value: fmtHours((hpw + ot) * wpy) },
        ],
      };
    },
    howItWorks: [
      "Base pay is hourly rate × hours per week × weeks per year.",
      "Weekly overtime is paid at time and a half and multiplied across the year.",
      "Any annual bonus is added on top.",
    ],
    formula:
      "Annual pay = (Rate × Hours × Weeks) + (OT hours × Rate × 1.5 × Weeks) + Bonus",
    example: [
      "$25 per hour, 40 regular hours plus 5 overtime hours a week, 50 weeks, $1,500 bonus.",
      "Base: $50,000. Overtime: 5 × $37.50 × 50 = $9,375.",
      "Total estimated pay: $60,875 for the year.",
    ],
    assumptions: [
      "Overtime is assumed at 1.5× and the same every week.",
      "Bonuses are shown gross; supplemental withholding often applies.",
    ],
    faqs: [
      {
        q: "Should I include unpaid leave?",
        a: "Reduce weeks per year for each unpaid week off.",
      },
      {
        q: "Does the bonus get taxed differently?",
        a: "Bonuses are often withheld at a flat supplemental rate, though your final tax bill depends on total income.",
      },
      {
        q: "Where do shift differentials go?",
        a: "Add them to your hourly rate, or model them with the night shift calculator.",
      },
    ],
    related: [
      "hourly-to-salary-calculator",
      "overtime-calculator",
      "bonus-calculator",
      "monthly-pay-calculator",
    ],
  },

  {
    slug: "raise-calculator",
    name: "Raise Calculator",
    h1: "Pay Raise Calculator",
    category: "pay",
    icon: "ArrowUpRight",
    short: "See what a raise means per hour, per check and per year.",
    keywords: ["raise calculator", "pay increase", "salary increase", "percentage raise"],
    title: "Raise Calculator – What Your Pay Increase Is Worth | Workly USA",
    description:
      "Calculate your new salary after a raise, the dollar increase per paycheck and the difference per hour. Free raise calculator.",
    intro:
      "Enter your current pay and the raise you were offered — as a percentage or a dollar amount — to see the real impact.",
    fields: [
      { id: "currentSalary", label: "Current annual salary", prefix: "$", default: "58000" },
      {
        id: "raiseType",
        label: "Raise is expressed as",
        type: "select",
        default: "percent",
        options: [
          { value: "percent", label: "A percentage" },
          { value: "amount", label: "A dollar amount" },
        ],
      },
      { id: "raisePercent", label: "Raise percentage", suffix: "%", default: "4", step: "0.1" },
      { id: "raiseAmount", label: "Raise amount per year", prefix: "$", default: "0", optional: true },
      hoursPerWeekField,
    ],
    compute: (v) => {
      const current = required(num(v, "currentSalary"), "your current salary");
      const hpw = required(num(v, "hoursPerWeek", 40), "hours per week");
      const type = str(v, "raiseType", "percent");
      const increase =
        type === "amount"
          ? nonNeg(v, "raiseAmount", 0)
          : current * (num(v, "raisePercent", 0) / 100);
      const next = current + increase;
      const annualHours = hpw * 52;
      return {
        primary: { value: moneySmart(next), label: "New annual salary" },
        rows: [
          { label: "Raise amount", value: `+ ${moneySmart(increase)}` },
          {
            label: "Raise percentage",
            value: current > 0 ? percent((increase / current) * 100, 2) : "—",
          },
          { label: "More per month", value: money(increase / 12), strong: true },
          { label: "More per biweekly check", value: money(increase / 26) },
          { label: "More per hour", value: annualHours > 0 ? rate(increase / annualHours) : "—" },
          { label: "New hourly equivalent", value: rate(next / annualHours) },
        ],
        notes: ["The per-paycheck increase shown is before taxes and deductions."],
      };
    },
    howItWorks: [
      "A percentage raise multiplies your current salary by the percentage to find the increase.",
      "The increase is added to your current salary for the new figure.",
      "The same increase is divided by 12, 26 and your annual hours to show it per month, per check and per hour.",
    ],
    formula: "New salary = Current salary × (1 + Raise % ÷ 100)",
    example: [
      "A 4% raise on a $58,000 salary.",
      "$58,000 × 0.04 = $2,320 increase, for a new salary of $60,320.",
      "That's about $193 more per month, or $1.12 more per hour at 40 hours a week.",
    ],
    assumptions: [
      "The raise applies for a full year starting immediately.",
      "Gross figures only; higher pay may also raise withholding.",
    ],
    faqs: [
      {
        q: "Is a 3% raise good?",
        a: "It depends on inflation and your market rate. If prices rose more than your raise, your real buying power fell.",
      },
      {
        q: "How do I ask for a specific number?",
        a: "Work backwards: decide the annual salary you want, then express the gap as a percentage of your current pay.",
      },
      {
        q: "Does a raise change my tax bracket badly?",
        a: "Only income above a bracket threshold is taxed at the higher rate, so a raise always leaves you with more take-home pay.",
      },
    ],
    related: [
      "pay-cut-calculator",
      "salary-comparison-calculator",
      "salary-to-hourly-calculator",
      "effective-hourly-wage-calculator",
    ],
  },

  {
    slug: "pay-cut-calculator",
    name: "Pay Cut Calculator",
    h1: "Pay Cut Calculator",
    category: "pay",
    icon: "ArrowDownRight",
    short: "Understand the impact of reduced pay or hours.",
    keywords: ["pay cut", "salary reduction", "reduced hours", "pay decrease"],
    title: "Pay Cut Calculator – Impact of a Salary Reduction | Workly USA",
    description:
      "See what a pay cut means per paycheck, per month and per year, so you can plan your budget around the new number.",
    intro:
      "Enter your current pay and the reduction to see the new salary and what you lose each month.",
    fields: [
      { id: "currentSalary", label: "Current annual salary", prefix: "$", default: "72000" },
      {
        id: "cutType",
        label: "Cut is expressed as",
        type: "select",
        default: "percent",
        options: [
          { value: "percent", label: "A percentage" },
          { value: "amount", label: "A dollar amount" },
        ],
      },
      { id: "cutPercent", label: "Cut percentage", suffix: "%", default: "10", step: "0.1" },
      { id: "cutAmount", label: "Cut amount per year", prefix: "$", default: "0", optional: true },
    ],
    compute: (v) => {
      const current = required(num(v, "currentSalary"), "your current salary");
      const type = str(v, "cutType", "percent");
      const decrease =
        type === "amount" ? nonNeg(v, "cutAmount", 0) : current * (nonNeg(v, "cutPercent", 0) / 100);
      const next = Math.max(0, current - decrease);
      return {
        primary: { value: moneySmart(next), label: "New annual salary" },
        rows: [
          { label: "Reduction", value: `− ${moneySmart(decrease)}` },
          {
            label: "Reduction percentage",
            value: current > 0 ? percent((decrease / current) * 100, 2) : "—",
          },
          { label: "Less per month", value: money(decrease / 12), strong: true },
          { label: "Less per biweekly check", value: money(decrease / 26) },
          { label: "Less per week", value: money(decrease / 52) },
          {
            label: "Raise needed later to get back",
            value: next > 0 ? percent((decrease / next) * 100, 2) : "—",
          },
        ],
      };
    },
    howItWorks: [
      "The reduction is calculated from your current salary, either as a percent or a flat amount.",
      "It is subtracted to give the new annual figure.",
      "Because the base is now smaller, the raise needed to return to your old salary is a larger percentage than the cut.",
    ],
    formula: "New salary = Current salary − (Current salary × Cut % ÷ 100)",
    example: [
      "A 10% cut on $72,000 removes $7,200, leaving $64,800.",
      "That is $600 less per month.",
      "Getting back to $72,000 later would require an 11.11% raise.",
    ],
    assumptions: [
      "The reduction applies for a full year.",
      "Benefits tied to salary, such as retirement matching, may also fall.",
    ],
    faqs: [
      {
        q: "Why does it take a bigger raise to undo a cut?",
        a: "The raise is calculated on the lower salary, so the same dollar amount is a larger percentage of it.",
      },
      {
        q: "Does reduced pay affect unemployment or benefits?",
        a: "It can. Rules vary by state and employer, so check with your state agency and HR.",
      },
      {
        q: "What about reduced hours instead of reduced rate?",
        a: "Use the weekly pay calculator with your new hours to see the effect.",
      },
    ],
    related: [
      "raise-calculator",
      "weekly-pay-calculator",
      "paycheck-calculator",
      "salary-comparison-calculator",
    ],
  },

  {
    slug: "bonus-calculator",
    name: "Bonus Calculator",
    h1: "Bonus Calculator",
    category: "pay",
    icon: "Gift",
    short: "Estimate take-home pay from a bonus payment.",
    keywords: ["bonus calculator", "bonus after tax", "bonus withholding", "supplemental wages"],
    title: "Bonus Calculator – Estimate Bonus After Taxes | Workly USA",
    description:
      "Estimate what's left of a bonus after withholding, and see it as a percentage of your salary. Free bonus calculator.",
    intro:
      "Bonuses are often withheld at a flat supplemental rate. Enter your bonus to estimate the net amount.",
    fields: [
      { id: "bonus", label: "Bonus amount", prefix: "$", default: "5000" },
      {
        id: "withholding",
        label: "Estimated withholding rate",
        suffix: "%",
        default: "22",
        help: "22% is the common federal supplemental rate; add state and FICA for a fuller estimate.",
      },
      { id: "fica", label: "Add FICA", suffix: "%", default: "7.65", optional: true },
      { id: "salary", label: "Annual salary (optional)", prefix: "$", default: "0", optional: true },
    ],
    compute: (v) => {
      const bonus = required(num(v, "bonus"), "a bonus amount");
      const withholding = nonNeg(v, "withholding", 22);
      const fica = nonNeg(v, "fica", 0);
      const federal = bonus * (withholding / 100);
      const ficaAmount = bonus * (fica / 100);
      const net = Math.max(0, bonus - federal - ficaAmount);
      const salary = nonNeg(v, "salary", 0);
      const rows = [
        { label: "Gross bonus", value: money(bonus) },
        { label: `Withholding (${number(withholding, 2)}%)`, value: `− ${money(federal)}` },
        { label: `FICA (${number(fica, 2)}%)`, value: `− ${money(ficaAmount)}` },
        { label: "Estimated net bonus", value: money(net), strong: true },
      ];
      if (salary > 0) {
        rows.push({ label: "Bonus as % of salary", value: percent((bonus / salary) * 100, 2) });
        rows.push({ label: "Total gross comp", value: moneySmart(salary + bonus) });
      }
      return {
        primary: { value: money(net), label: "Estimated bonus after withholding" },
        rows,
      };
    },
    howItWorks: [
      "Bonuses are supplemental wages and are frequently withheld at a flat percentage rather than your normal rate.",
      "FICA (Social Security and Medicare) applies to bonuses too.",
      "Withholding is not the same as your final tax; over-withholding comes back as a refund.",
    ],
    formula: "Net bonus ≈ Bonus − (Bonus × Withholding %) − (Bonus × FICA %)",
    example: [
      "A $5,000 bonus with 22% federal supplemental withholding and 7.65% FICA.",
      "$1,100 federal and $382.50 FICA come out.",
      "Estimated net bonus: $3,517.50, before any state tax.",
    ],
    assumptions: [
      "State and local taxes are not included unless you add them to the withholding rate.",
      "Employers may instead use the aggregate method, which withholds based on your regular pay.",
    ],
    disclaimer: true,
    faqs: [
      {
        q: "Are bonuses taxed at a higher rate?",
        a: "They are often withheld at a flat 22% federal rate, but they are taxed as ordinary income when you file. Extra withholding comes back as a refund.",
      },
      {
        q: "Can I put my bonus into a 401(k)?",
        a: "Many employers allow it, which lowers taxable wages for the year. Check your plan's bonus deferral setting.",
      },
      {
        q: "Why was my bonus so much smaller than expected?",
        a: "Federal supplemental withholding, FICA and state tax can easily total 30% or more together.",
      },
    ],
    related: [
      "paycheck-calculator",
      "annual-pay-calculator",
      "commission-calculator",
      "raise-calculator",
    ],
  },

  {
    slug: "commission-calculator",
    name: "Commission Calculator",
    h1: "Commission Calculator",
    category: "pay",
    secondaryCategories: ["career"],
    icon: "Percent",
    short: "Calculate commission earnings on top of base pay.",
    keywords: ["commission", "sales commission", "commission rate", "on target earnings"],
    title: "Commission Calculator – Sales Commission & Total Pay | Workly USA",
    description:
      "Calculate sales commission, total earnings with base salary, and your effective commission rate. Free commission calculator.",
    intro:
      "Enter your sales, commission rate and base pay to see total earnings for the period.",
    fields: [
      { id: "sales", label: "Sales amount for the period", prefix: "$", default: "85000" },
      { id: "rate", label: "Commission rate", suffix: "%", default: "5", step: "0.1" },
      {
        id: "threshold",
        label: "Commission only on sales above",
        prefix: "$",
        default: "0",
        optional: true,
        help: "Enter a quota floor if commission starts after a target.",
      },
      { id: "base", label: "Base pay for the period", prefix: "$", default: "0", optional: true },
      { id: "draw", label: "Draw already paid", prefix: "$", default: "0", optional: true },
    ],
    compute: (v) => {
      const sales = required(num(v, "sales"), "a sales amount", true);
      const commissionRate = nonNeg(v, "rate", 0);
      const threshold = nonNeg(v, "threshold", 0);
      const base = nonNeg(v, "base", 0);
      const draw = nonNeg(v, "draw", 0);
      const commissionable = Math.max(0, sales - threshold);
      const commission = commissionable * (commissionRate / 100);
      const total = base + commission;
      const owed = Math.max(0, total - draw);
      return {
        primary: { value: money(commission), label: "Commission earned" },
        rows: [
          { label: "Commissionable sales", value: moneySmart(commissionable) },
          { label: "Base pay", value: money(base) },
          { label: "Total earnings", value: money(total), strong: true },
          { label: "Less draw already paid", value: `− ${money(draw)}` },
          { label: "Remaining payout", value: money(owed) },
          {
            label: "Effective rate on total sales",
            value: sales > 0 ? percent((commission / sales) * 100, 2) : "—",
          },
        ],
      };
    },
    howItWorks: [
      "Any quota floor is subtracted from sales to find commissionable revenue.",
      "The commission rate is applied to that amount.",
      "Base pay is added and any draw already advanced is subtracted.",
    ],
    formula: "Commission = (Sales − Quota floor) × Rate ÷ 100",
    example: [
      "$85,000 in sales with a 5% rate and no quota floor.",
      "Commission is $4,250 for the period.",
      "With $2,000 base pay, total earnings are $6,250.",
    ],
    assumptions: [
      "A single flat rate is used; tiered or accelerator plans need separate tiers.",
      "Amounts are gross and commission is usually treated as supplemental wages for withholding.",
    ],
    faqs: [
      {
        q: "What is a recoverable draw?",
        a: "An advance against future commission. If you earn less than the draw, the shortfall is typically carried forward against later commissions.",
      },
      {
        q: "How do I handle tiered commission?",
        a: "Run each tier separately with its own rate and threshold, then add the results.",
      },
      {
        q: "Is commission taxed differently?",
        a: "It is usually withheld as supplemental wages, similar to a bonus, but taxed as ordinary income overall.",
      },
    ],
    related: [
      "bonus-calculator",
      "annual-pay-calculator",
      "freelance-rate-calculator",
      "paycheck-calculator",
    ],
  },
];
