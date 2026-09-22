import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Lock, ShieldCheck, Zap } from "lucide-react";

import { AdSlot } from "@/components/site/ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { SupportBand } from "@/components/site/support-band";
import { ToolCard } from "@/components/site/tool-card";
import { ToolIcon } from "@/components/site/icon";
import { ToolSearch } from "@/components/site/tool-search";
import { adsConfig, canonical, site } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { categories, popularTools, tools, toolsInCategory } from "@/lib/tools";

const title = "Workly USA — Free Paycheck, Salary & Work Hours Calculators";
const description =
  "Free calculators for American workers: paycheck estimates, salary to hourly, overtime, time cards and effective hourly wage. No sign-up, instant results.";

export const Route = createFileRoute("/")({
  head: () => pageHead({ title, description, path: "/" }),
  component: Home,
});

const heroBreakdown = [
  { label: "Gross pay", value: "$1,846.15" },
  { label: "Federal + FICA", value: "−$338.47" },
  { label: "State tax", value: "−$61.00" },
  { label: "Benefits & 401(k)", value: "−$34.00" },
];

const heroChips = [
  { value: "42.5 hrs", label: "Hours worked" },
  { value: "$28.40", label: "Effective rate" },
  { value: "2.5 hrs", label: "Overtime" },
];

const promises = [
  {
    icon: Zap,
    title: "Instant answers",
    copy: "Every result updates as you type. No submit button, no waiting.",
  },
  {
    icon: Lock,
    title: "No login, ever",
    copy: "No accounts, no email walls, no paywalls hiding your own numbers.",
  },
  {
    icon: ShieldCheck,
    title: "Runs in your browser",
    copy: "Your pay details are never sent to a server or stored.",
  },
  {
    icon: Clock,
    title: "Built for real jobs",
    copy: "Overnight shifts, unpaid breaks, overtime rules and commutes.",
  },
];

function Home() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: canonical("/"),
          description,
          potentialAction: {
            "@type": "SearchAction",
            target: `${canonical("/all-tools")}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <section className="relative isolate overflow-hidden border-b border-border bg-hero">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-lines opacity-60"
        />
        <div className="container-page relative py-14 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-card backdrop-blur">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                {tools.length} free calculators · no sign-up
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Know Your Pay.
                <br />
                <span className="text-gradient-primary">Know Your Worth.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {site.secondaryTagline} Work out your paycheck, your overtime, your hours and what
                your job is really paying you per hour — in seconds, with no sign-up.
              </p>
              <div className="mt-8 max-w-2xl">
                <ToolSearch />
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[2.5rem] gradient-primary opacity-15 blur-2xl"
              />
              <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-lift backdrop-blur sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sample paycheck
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    <span
                      className="size-1.5 animate-pulse rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    Live
                  </span>
                </div>
                <p className="numeric mt-4 text-4xl font-bold leading-none sm:text-5xl">
                  $1,412.68
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Estimated take-home, biweekly</p>
                <dl className="mt-6 divide-y divide-border border-t border-border">
                  {heroBreakdown.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-sm text-muted-foreground">{row.label}</dt>
                      <dd className="numeric text-sm font-semibold">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {heroChips.map((chip) => (
                    <div
                      key={chip.label}
                      className="rounded-xl border border-border bg-surface/70 px-3 py-2.5 text-center"
                    >
                      <p className="numeric text-sm font-bold">{chip.value}</p>
                      <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                        {chip.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page">
        <AdSlot placement="top" slotId={adsConfig.slots.top} className="mt-8" />

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Most used calculators
            </h2>
            <Link to="/all-tools" className="text-sm font-medium text-primary hover:underline">
              Browse all {tools.length} tools →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <div
              key={promise.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <promise.icon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold">{promise.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{promise.copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Browse by category</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {categories.map((category) => {
              const categoryTools = toolsInCategory(category.id);
              return (
                <div
                  key={category.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                      <ToolIcon name={category.icon} className="size-5 text-primary" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{category.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{category.tagline}</p>
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {categoryTools.slice(0, 6).map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          to="/$slug"
                          params={{ slug: tool.slug }}
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/category/$category"
                    params={{ category: category.slug }}
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    All {categoryTools.length} {category.label.toLowerCase()} tools →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-border bg-surface p-7 sm:p-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            The number most workers never calculate
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Your salary divided by 2,080 hours isn&apos;t what you earn. Add unpaid overtime, the
            commute, and the costs of showing up, and the real figure is usually lower. Our
            Effective Hourly Wage calculator shows you the gap.
          </p>
          <Link
            to="/$slug"
            params={{ slug: "effective-hourly-wage-calculator" }}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Calculate my real hourly wage
          </Link>
        </section>

        <section className="mt-16 grid gap-8 rounded-3xl border border-border bg-card p-7 shadow-card sm:p-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Built for clarity
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Useful answers, not vague estimates
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              Workly USA explains the assumptions behind every result so you can make a better
              decision about a job, a shift, or your next paycheck. We update our guides as rules
              and common payroll practices change.
            </p>
            <Link
              to="/about"
              className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Learn how Workly is built →
            </Link>
          </div>
          <ul className="grid gap-3 self-center text-sm text-muted-foreground">
            {[
              "Plain-English explanations for each calculator",
              "Transparent formulas and planning assumptions",
              "Privacy-first tools that run in your browser",
              "Free access with no account or paywall",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <SupportBand className="mt-16" />

        <AdSlot placement="bottom" slotId={adsConfig.slots.bottom} className="mt-14" />
      </div>
    </div>
  );
}
