import { createFileRoute, notFound } from "@tanstack/react-router";

import { CalculatorPage } from "@/components/calculators/calculator-page";
import { pageHead } from "@/lib/seo";
import { toolsBySlug } from "@/lib/tools";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const tool = toolsBySlug[params.slug];
    if (!tool) throw notFound();
    return { slug: tool.slug };
  },
  head: ({ params, loaderData }) => {
    const tool = loaderData ? toolsBySlug[loaderData.slug] : undefined;
    if (!tool) {
      return {
        meta: [
          { title: "Calculator not found — Workly USA" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return pageHead({
      title: tool.title,
      description: tool.description,
      path: `/${params.slug}`,
    });
  },
  component: ToolRoute,
});

function ToolRoute() {
  const { slug } = Route.useLoaderData();
  return <CalculatorPage tool={toolsBySlug[slug]!} />;
}
