import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { AdSlot } from "@/components/site/ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { ToolCard } from "@/components/site/tool-card";
import { ToolIcon } from "@/components/site/icon";
import { breadcrumbSchema, pageHead } from "@/lib/seo";
import { categories, toolsInCategory, type CategoryId } from "@/lib/tools";

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    const category = categories.find((item) => item.slug === params.category);
    if (!category) throw notFound();
    return { id: category.id as CategoryId };
  },
  head: ({ params, loaderData }) => {
    const category = categories.find((item) => item.id === loaderData?.id);
    if (!category) {
      return { meta: [{ title: "Category not found — Workly USA" }, { name: "robots", content: "noindex" }] };
    }
    const count = toolsInCategory(category.id).length;
    return pageHead({
      title: `${category.label} Calculators — ${category.tagline} | Workly USA`,
      description: `${count} free ${category.label.toLowerCase()} calculators. ${category.description}`,
      path: `/category/${params.category}`,
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { id } = Route.useLoaderData();
  const category = categories.find((item) => item.id === id)!;
  const tools = toolsInCategory(id);

  return (
    <div className="container-page py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: category.label, path: `/category/${category.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{category.label}</span>
      </nav>

      <header className="max-w-3xl">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent">
          <ToolIcon name={category.icon} className="size-6 text-primary" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {category.label} calculators
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{category.description}</p>
      </header>

      <AdSlot placement="top" className="mt-8" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <section className="mt-14 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold">Other categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories
            .filter((item) => item.id !== category.id)
            .map((item) => (
              <Link
                key={item.id}
                to="/category/$category"
                params={{ category: item.slug }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          <Link
            to="/all-tools"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            All tools
          </Link>
        </div>
      </section>

      <AdSlot placement="bottom" className="mt-12" />
    </div>
  );
}
