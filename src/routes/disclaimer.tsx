import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import { ESTIMATE_DISCLAIMER, site } from "@/lib/site";

const title = "Disclaimer — Workly USA";
const description =
  "Workly USA calculators produce estimates for planning only. Here's exactly what our results do and don't account for, and when to seek professional advice.";

export const Route = createFileRoute("/disclaimer")({
  head: () => pageHead({ title, description, path: "/disclaimer" }),
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Disclaimer</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-surface p-4 text-foreground">
          {ESTIMATE_DISCLAIMER}
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">What our estimates assume</h2>
        <p>
          Each calculator lists its assumptions on its own page. In general we use standard
          conventions: 40-hour weeks, 52 weeks a year, 2,080 annual hours, federal overtime at 1.5×
          after 40 hours in a workweek, and the current Social Security and Medicare rates.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">What they can&apos;t know</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your exact Form W-4 elections, credits and dependents</li>
          <li>State, county and city income taxes, and local payroll levies</li>
          <li>Pre-tax benefits, garnishments, union dues and per-employer deductions</li>
          <li>State overtime rules that are more generous than federal law</li>
          <li>Your employer&apos;s rounding, accrual and pay-period practices</li>
        </ul>
        <p>
          Because of that, a calculated paycheck will rarely match your stub to the penny. Treat the
          result as a planning range, not a promise.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">When to get real advice</h2>
        <p>
          For tax filing, talk to a CPA or tax preparer. For unpaid wages or misclassification, contact
          your state labor department or the U.S. Department of Labor Wage and Hour Division. For
          benefits and withholding, start with your HR or payroll team.
        </p>

        <p>
          {site.name} is an independent site and is not affiliated with any government agency,
          employer or payroll provider. Read this with our{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
