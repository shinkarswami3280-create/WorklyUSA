import { createFileRoute } from "@tanstack/react-router";

import { AdSlot } from "@/components/site/ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { SupportBand } from "@/components/site/support-band";
import { ToolCard } from "@/components/site/tool-card";
import { ToolIcon } from "@/components/site/icon";
import { ToolSearch } from "@/components/site/tool-search";
import { breadcrumbSchema, pageHead } from "@/lib/seo";
import { categories, tools, toolsInCategory } from "@/lib/tools";

const title = "All Calculators — Workly USA";
const description =
  "Every Workly USA calculator in one place: pay and paycheck tools, work hours and overtime, career comparisons, commuting and time off. All free, no sign-up.";

export const Route = createFileRoute("/all-tools")({
  head: () => pageHead({ title, description, path: "/all-tools" }),
  component: AllTools,
});

function AllTools() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "All Tools", path: "/all-tools" },
        ])}
      />

      <section className="border-b border-border bg-hero">
        <div className="container-page py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-card backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              Calculator library
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              All {tools.length} work &amp; pay calculators
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-7 max-w-xl">
              <ToolSearch size="sm" label="Search calculators" showSuggestions={false} />
            </div>
          </div>

          <nav aria-label="Jump to category" className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-card transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ToolIcon name={category.icon} className="size-4 text-primary" />
                {category.label}
                <span className="numeric text-xs text-muted-foreground">
                  {toolsInCategory(category.id).length}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-page">
        <AdSlot placement="top" className="mt-8" />

        {categories.map((category) => (
          <section key={category.id} id={category.slug} className="mt-14 scroll-mt-24">
            <div className="flex items-start gap-3">
              <span className="gradient-primary flex size-11 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
                <ToolIcon name={category.icon} className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold">{category.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.tagline}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolsInCategory(category.id).map((tool) => (
                <ToolCard key={`${category.id}-${tool.slug}`} tool={tool} />
              ))}
            </div>
          </section>
        ))}

        <SupportBand className="mt-16" />

        <AdSlot placement="bottom" className="mt-14" />
      </div>
    </div>
  );
}
