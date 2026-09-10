import { createFileRoute, Link } from "@tanstack/react-router";

import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbSchema, pageHead } from "@/lib/seo";

const title = "Pay & Hours Guides — Workly USA";
const description =
  "Plain-English guides to overtime rules, reading your pay stub, salary vs hourly pay, and how to work out what your job really pays per hour.";

export const Route = createFileRoute("/guides")({
  head: () => pageHead({ title, description, path: "/guides" }),
  component: Guides,
});

const guides = [
  {
    title: "How overtime pay actually works",
    body: [
      "Under the federal Fair Labor Standards Act, most hourly (non-exempt) employees earn at least 1.5× their regular rate for hours over 40 in a workweek. Overtime is calculated per workweek — not per pay period — so a 50-hour week followed by a 30-hour week still owes 10 hours of overtime.",
      "Some states go further. California, for example, adds daily overtime after 8 hours and double time after 12 hours in a day. Your state rules always win when they are more generous than federal law.",
      "Your \"regular rate\" is not always your base rate: non-discretionary bonuses, shift differentials and commissions can raise it.",
    ],
    tool: { slug: "overtime-calculator", label: "Overtime Calculator" },
  },
  {
    title: "Salary vs hourly: how to compare fairly",
    body: [
      "The standard conversion uses 2,080 hours a year (40 hours × 52 weeks). Divide an annual salary by 2,080 for a rough hourly equivalent, or multiply an hourly rate by 2,080 to annualize it.",
      "That math assumes you work exactly 40 hours. If a salaried role really takes 50 hours a week, the effective rate drops by 20% — and salaried exempt employees usually get no overtime for those extra hours.",
      "Compare total compensation too: employer retirement match, health premiums, PTO days and bonuses often move the needle more than base pay.",
    ],
    tool: { slug: "salary-to-hourly-calculator", label: "Salary to Hourly Calculator" },
  },
  {
    title: "Reading your pay stub without a headache",
    body: [
      "Gross pay is what you earned before anything comes out. Net pay is what lands in your account. Between them sit federal income tax withholding, Social Security (6.2% up to the annual wage base), Medicare (1.45%), any state and local income tax, and your own deductions.",
      "Pre-tax deductions — 401(k), HSA, most health premiums — reduce your taxable wages, so they cost you less than their face value.",
      "If your withholding looks wrong, the fix is usually a new Form W-4, not a call to payroll.",
    ],
    tool: { slug: "paycheck-calculator", label: "Paycheck Calculator" },
  },
  {
    title: "What your job really pays per hour",
    body: [
      "Add the hours a job takes but doesn't pay for: the commute, the getting-ready, the checking of email at 9pm. Then subtract what showing up costs — gas, parking, tolls, lunches, work clothes, extra childcare.",
      "Run the same math on both sides of a job decision. A role paying $5,000 less with no commute and better PTO frequently wins on effective hourly wage.",
    ],
    tool: { slug: "effective-hourly-wage-calculator", label: "Effective Hourly Wage Calculator" },
  },
];

function Guides() {
  return (
    <div className="container-page py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <header className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Guides to pay, hours and overtime
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      </header>

      <div className="mt-12 max-w-3xl space-y-12">
        {guides.map((guide) => (
          <article key={guide.title}>
            <h2 className="font-display text-2xl font-semibold">{guide.title}</h2>
            {guide.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <Link
              to="/$slug"
              params={{ slug: guide.tool.slug }}
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Try the {guide.tool.label} →
            </Link>
          </article>
        ))}
      </div>

      <p className="mt-14 max-w-3xl rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
        These guides are general information for American workers, not legal, tax or payroll advice.
        Rules vary by state and by employer — check with your HR department, your state labor
        department, or a qualified professional for your situation.
      </p>
    </div>
  );
}
