import {
  freelanceRate,
  nonNeg,
  num,
  payBreakdownFromAnnual,
  required,
} from "@/lib/calc";
import { hours as fmtHours, money, moneySmart, number, percent, rate } from "@/lib/format";
import type { Tool } from "./types";

export const careerTools: Tool[] = [
  {
    slug: "effective-hourly-wage-calculator",
    name: "Effective Hourly Wage Calculator",
    h1: "What Am I Really Making?",
    category: "career",
    icon: "Compass",
    short: "Your true hourly rate after hours, commute and work costs.",
    keywords: [
      "effective hourly wage",
      "real hourly rate",
      "what am i really making",
      "true hourly pay",
      "commute adjusted pay",
    ],
    title: "Effective Hourly Wage Calculator – Your Real Hourly Rate | Workly USA",
    description:
      "Your salary doesn't tell the whole story. Calculate your effective hourly wage after long hours, commuting and work expenses.",
    intro:
      "Your salary doesn't tell the whole story. Add your real hours, commute and work costs to see what your time is actually worth.",
    custom: "effective",
    howItWorks: [
      "Annual work hours are your weekly hours multiplied by the weeks you work.",
      "Commute hours add the time you spend travelling for the job: daily commute minutes × work days × weeks.",
      "Effective hourly wage divides your salary by work hours plus commute hours, then optionally subtracts job-related expenses.",
    ],
    formula:
      "Effective hourly = (Annual salary − Work expenses) ÷ (Annual work hours + Annual commute hours)",
    example: [
      "A $75,000 salary at 50 hours a week for 50 weeks is 2,500 work hours — $30.00 per hour on paper.",
      "A 45-minute daily commute over 5 days a week adds 187.5 hours a year.",
      "Effective wage: $75,000 ÷ 2,687.5 = $27.91 per hour, before $2,000 of parking and work clothing.",
    ],
    assumptions: [
      "Commute time is counted as time the job costs you, even though it isn't paid.",
      "Only expenses you enter are subtracted; taxes are not included.",
      "Gross salary is used, so this is a comparison tool rather than a take-home figure.",
    ],
    faqs: [
      {
        q: "Why include commute time?",
        a: "Commuting is unpaid time you spend because of the job. Including it shows why a shorter commute can be worth more than a raise.",
      },
      {
        q: "Should I count unpaid overtime?",
        a: "Yes. Enter the hours you actually work, not the hours in your contract. That's usually where the biggest gap appears.",
      },
      {
        q: "What counts as work expenses?",
        a: "Parking, transit passes, tools, uniforms, professional dues and extra childcare are common examples.",
      },
    ],
    related: [
      "job-offer-comparison-calculator",
      "commute-cost-calculator",
      "salary-to-hourly-calculator",
      "salary-comparison-calculator",
    ],
  },

  {
    slug: "salary-comparison-calculator",
    name: "Salary Comparison Calculator",
    h1: "Salary Comparison Calculator",
    category: "career",
    icon: "Scale",
    short: "Compare two salaries side by side, hour for hour.",
    keywords: ["salary comparison", "compare salaries", "salary difference", "which pays more"],
    title: "Salary Comparison Calculator – Compare Two Salaries | Workly USA",
    description:
      "Compare two salaries by annual pay and by hourly rate, so different schedules can be compared fairly.",
    intro:
      "A bigger salary with longer hours isn't always more money per hour. Compare both on the same basis.",
    fields: [
      { id: "salaryA", label: "Salary A", prefix: "$", default: "78000" },
      { id: "hoursA", label: "Hours per week (A)", suffix: "hrs", default: "45", step: "0.5" },
      { id: "salaryB", label: "Salary B", prefix: "$", default: "70000" },
      { id: "hoursB", label: "Hours per week (B)", suffix: "hrs", default: "38", step: "0.5" },
      { id: "weeksPerYear", label: "Weeks worked per year", default: "50" },
    ],
    compute: (v) => {
      const salaryA = required(num(v, "salaryA"), "salary A");
      const salaryB = required(num(v, "salaryB"), "salary B");
      const weeks = required(num(v, "weeksPerYear", 50), "weeks per year");
      const a = payBreakdownFromAnnual(salaryA, required(num(v, "hoursA", 40), "hours per week for A"), weeks);
      const b = payBreakdownFromAnnual(salaryB, required(num(v, "hoursB", 40), "hours per week for B"), weeks);
      const diff = salaryA - salaryB;
      const hourlyDiff = a.hourly - b.hourly;
      const higherHourly = hourlyDiff >= 0 ? "A" : "B";
      return {
        primary: {
          value: `${diff >= 0 ? "+" : "−"}${moneySmart(Math.abs(diff))}`,
          label: diff >= 0 ? "Salary A pays more per year" : "Salary B pays more per year",
        },
        rows: [
          { label: "Hourly rate — A", value: rate(a.hourly) },
          { label: "Hourly rate — B", value: rate(b.hourly) },
          {
            label: "Hourly difference",
            value: `${hourlyDiff >= 0 ? "+" : "−"}${money(Math.abs(hourlyDiff))}/hr`,
            strong: true,
          },
          { label: "Annual hours — A", value: fmtHours(a.annualHours) },
          { label: "Annual hours — B", value: fmtHours(b.annualHours) },
          {
            label: "Percent difference in salary",
            value: salaryB > 0 ? percent((diff / salaryB) * 100, 2) : "—",
          },
        ],
        notes: [
          `Based on the information entered, option ${higherHourly} pays more per hour worked.`,
        ],
      };
    },
    howItWorks: [
      "Each salary is divided by its own annual hours to get a comparable hourly rate.",
      "The annual and hourly differences are shown separately, because they can point in opposite directions.",
      "Only pay and hours are compared here — benefits and commute live in the job offer comparison tool.",
    ],
    formula: "Hourly rate = Salary ÷ (Hours per week × Weeks per year)",
    example: [
      "$78,000 at 45 hours a week versus $70,000 at 38 hours, 50 weeks each.",
      "A is $34.67 per hour; B is $36.84 per hour.",
      "A pays $8,000 more per year, but B pays $2.17 more per hour worked.",
    ],
    assumptions: [
      "Both options are assumed to work the same number of weeks per year.",
      "Gross pay only; taxes and benefits are excluded.",
    ],
    faqs: [
      {
        q: "Which number matters more, salary or hourly?",
        a: "It depends on your goal. Total salary matters for bills; hourly rate tells you what your time is worth.",
      },
      {
        q: "Where do benefits fit in?",
        a: "Use the job offer comparison calculator, which includes bonus, retirement match and benefits value.",
      },
      {
        q: "Should I compare gross or net pay?",
        a: "Gross is fine for comparing offers in the same state. Compare net if the offers are in states with very different income taxes.",
      },
    ],
    related: [
      "job-offer-comparison-calculator",
      "effective-hourly-wage-calculator",
      "raise-calculator",
      "salary-to-hourly-calculator",
    ],
  },

  {
    slug: "job-offer-comparison-calculator",
    name: "Job Offer Comparison Calculator",
    h1: "Compare Two Job Offers",
    category: "career",
    icon: "GitCompareArrows",
    short: "Compare total compensation, hours and commute for two offers.",
    keywords: [
      "job offer comparison",
      "compare job offers",
      "total compensation",
      "which offer is better",
    ],
    title: "Job Offer Comparison Calculator – Compare Two Offers | Workly USA",
    description:
      "Compare two job offers on total compensation, working hours, commute time and estimated effective hourly value.",
    intro:
      "Enter both offers to compare total compensation and what each one asks of your time.",
    custom: "joboffer",
    howItWorks: [
      "Total compensation adds salary, bonus, retirement match, benefits value and other pay.",
      "Time commitment adds annual working hours and annual commute hours.",
      "Effective hourly value divides total compensation by total time committed, which is why a shorter commute or fewer hours can beat a bigger salary.",
    ],
    formula:
      "Effective hourly value = Total compensation ÷ (Annual work hours + Annual commute hours)",
    example: [
      "Offer A: $95,000 salary, $5,000 bonus, 50 hours a week, 40-minute commute.",
      "Offer B: $88,000 salary, 4% match, 40 hours a week, fully remote.",
      "Offer A pays more on paper, but B often wins on effective hourly value because it asks for far less time.",
    ],
    assumptions: [
      "Benefits value is whatever you enter; employer health premiums and perks vary widely.",
      "PTO is valued at your daily rate as an illustration only.",
      "Taxes, cost of living and career growth are not modelled.",
    ],
    faqs: [
      {
        q: "Which offer should I take?",
        a: "This tool can't decide for you. It shows which offer has the higher estimated effective value based on the numbers you entered, and leaves the judgement to you.",
      },
      {
        q: "How do I value benefits?",
        a: "Use the employer's contribution to health premiums, plus the annual value of perks you'd actually use, such as a transit or learning stipend.",
      },
      {
        q: "Should remote work count for something?",
        a: "It shows up automatically as zero commute time, which usually moves effective hourly value more than people expect.",
      },
    ],
    related: [
      "effective-hourly-wage-calculator",
      "salary-comparison-calculator",
      "commute-cost-calculator",
      "pto-hours-calculator",
    ],
  },

  {
    slug: "freelance-rate-calculator",
    name: "Freelance Rate Calculator",
    h1: "Freelance Rate Calculator",
    category: "career",
    icon: "Briefcase",
    short: "Set an hourly rate that covers taxes, expenses and downtime.",
    keywords: ["freelance rate", "contractor rate", "hourly rate self employed", "day rate"],
    title: "Freelance Rate Calculator – Set Your Hourly Rate | Workly USA",
    description:
      "Calculate the freelance hourly rate you need to hit your income target after taxes, business expenses and unbillable time.",
    intro:
      "Freelance rates have to cover self-employment taxes, business costs and the hours you can't bill. Start from the income you want.",
    fields: [
      { id: "targetIncome", label: "Target take-home income", prefix: "$", default: "85000" },
      { id: "expenses", label: "Annual business expenses", prefix: "$", default: "6000" },
      {
        id: "taxRate",
        label: "Estimated tax rate",
        suffix: "%",
        default: "28",
        help: "Self-employment tax plus income tax. Many US freelancers set aside 25–35%.",
      },
      { id: "billableHours", label: "Billable hours per week", suffix: "hrs", default: "30", step: "0.5" },
      { id: "weeks", label: "Working weeks per year", default: "46", help: "Leave weeks for holidays and sick time." },
      {
        id: "utilization",
        label: "Realistic utilisation",
        suffix: "%",
        default: "80",
        help: "Share of planned billable hours you actually invoice.",
      },
    ],
    compute: (v) => {
      const result = freelanceRate({
        targetIncome: required(num(v, "targetIncome"), "a target income"),
        expenses: nonNeg(v, "expenses", 0),
        taxRatePercent: nonNeg(v, "taxRate", 0),
        billableHoursPerWeek: required(num(v, "billableHours", 30), "billable hours per week"),
        workWeeksPerYear: required(num(v, "weeks", 46), "working weeks per year"),
        utilizationPercent: nonNeg(v, "utilization", 80) || 80,
      });
      return {
        primary: { value: rate(result.hourly), label: "Minimum hourly rate to hit your target" },
        rows: [
          { label: "Revenue needed per year", value: moneySmart(result.grossNeeded), strong: true },
          { label: "Monthly revenue target", value: money(result.monthlyRevenueTarget) },
          { label: "Realistic billable hours per year", value: fmtHours(result.billableHours) },
          { label: "Suggested day rate (8 hrs)", value: money(result.dayRate) },
          { label: "Suggested weekly rate", value: money(result.weekRate) },
          { label: "Rate rounded for quoting", value: money(Math.ceil(result.hourly / 5) * 5, 0) },
        ],
      };
    },
    howItWorks: [
      "Your income target and expenses are grossed up for tax, giving the revenue you need to invoice.",
      "Billable hours are reduced by your utilisation rate to reflect admin, sales and downtime.",
      "Revenue needed divided by realistic billable hours gives the minimum rate.",
    ],
    formula:
      "Rate = ((Target income + Expenses) ÷ (1 − Tax rate)) ÷ (Billable hours × Weeks × Utilisation)",
    example: [
      "Target $85,000 take-home, $6,000 expenses, 28% tax.",
      "Revenue needed: $126,389. Realistic billable hours: 30 × 46 × 80% = 1,104.",
      "Minimum rate: about $114 per hour, or roughly $915 per day.",
    ],
    assumptions: [
      "Self-employment tax, income tax and any state tax are combined into one rate.",
      "Health insurance and retirement contributions should be in expenses or the income target.",
      "This is a floor, not a market price — value-based pricing may support more.",
    ],
    disclaimer: true,
    faqs: [
      {
        q: "Why is my freelance rate so much higher than an employee hourly rate?",
        a: "You cover self-employment tax, insurance, retirement, tools, unpaid admin and time between projects. A 2–3× multiple over an equivalent salary rate is common.",
      },
      {
        q: "What utilisation should I assume?",
        a: "Most established freelancers bill 60%–80% of planned hours. New freelancers should assume less.",
      },
      {
        q: "Should I quote hourly or by project?",
        a: "Either. Use this rate as your internal floor when pricing fixed-fee work.",
      },
    ],
    related: [
      "commission-calculator",
      "effective-hourly-wage-calculator",
      "annual-pay-calculator",
      "salary-to-hourly-calculator",
    ],
  },
];
