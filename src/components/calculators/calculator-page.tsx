import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { EffectiveWageCalculator } from "./effective-wage-calculator";
import { FieldCalculator } from "./field-calculator";
import { JobOfferCalculator } from "./job-offer-calculator";
import { TimeCardCalculator } from "./time-card-calculator";
import { AdSlot } from "@/components/site/ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { ToolCard } from "@/components/site/tool-card";
import { ToolIcon } from "@/components/site/icon";
import { ESTIMATE_DISCLAIMER } from "@/lib/site";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { getCategory, relatedTools, type Tool } from "@/lib/tools";

function CalculatorBody({ tool }: { tool: Tool }) {
  if (tool.custom === "timecard") return <TimeCardCalculator />;
  if (tool.custom === "effective") return <EffectiveWageCalculator />;
  if (tool.custom === "joboffer") return <JobOfferCalculator />;
  return <FieldCalculator tool={tool} />;
}

export function CalculatorPage({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  const related = relatedTools(tool);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.label, path: `/category/${category.slug}` },
    { name: tool.name, path: `/${tool.slug}` },
  ];

  return (
    <div className="container-page py-8 sm:py-10">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={webPageSchema({
          name: tool.title,
          description: tool.description,
          path: `/${tool.slug}`,
        })}
      />
      {tool.faqs.length > 0 && <JsonLd data={faqSchema(tool.faqs)} />}

      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {crumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
              {index === crumbs.length - 1 ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link to={crumb.path} className="transition-colors hover:text-primary">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          <ToolIcon name={tool.icon} className="size-3.5" />
          {category.label}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{tool.h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{tool.intro}</p>
      </header>

      <div className="mt-8">
        <CalculatorBody tool={tool} />
      </div>

      <AdSlot placement="in-content" className="mt-10" />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="max-w-3xl space-y-10">
          <section>
            <h2 className="font-display text-2xl font-semibold">How this calculator works</h2>
            <ol className="mt-4 space-y-3">
              {tool.howItWorks.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="numeric flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            {tool.formula && (
              <div className="mt-5 rounded-xl border border-border bg-surface p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Formula
                </h3>
                <p className="numeric mt-2 text-sm leading-relaxed text-foreground">{tool.formula}</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Worked example</h2>
            <ul className="mt-4 space-y-2">
              {tool.example.map((line) => (
                <li key={line} className="text-sm leading-relaxed text-muted-foreground">
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">What we assume</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {tool.assumptions.map((line) => (
                <li key={line} className="text-sm leading-relaxed text-muted-foreground">
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {tool.faqs.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-border border-y border-border">
                {tool.faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                      <span className="flex items-start justify-between gap-4">
                        {faq.q}
                        <ChevronRight
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                          aria-hidden="true"
                        />
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <p className="rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
            {ESTIMATE_DISCLAIMER}
          </p>
        </div>

        <aside className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Related calculators</h2>
          <div className="grid gap-3">
            {related.map((item) => (
              <ToolCard key={item.slug} tool={item} />
            ))}
          </div>
          <AdSlot placement="bottom" />
        </aside>
      </div>
    </div>
  );
}
