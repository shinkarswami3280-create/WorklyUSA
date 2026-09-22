import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { JsonLd } from "@/components/site/json-ld";
import { articleSchema, breadcrumbSchema, pageHead } from "@/lib/seo";
import { guidesBySlug } from "@/lib/guides";

export const Route = createFileRoute("/guide/$slug")({
  loader: ({ params }) => {
    const guide = guidesBySlug[params.slug];
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => loaderData ? pageHead({ title: `${loaderData.guide.title} — Workly USA`, description: loaderData.guide.summary, path: `/guide/${loaderData.guide.slug}` }) : {},
  component: GuideArticle,
});

function GuideArticle() {
  const { guide } = Route.useLoaderData();
  return <div className="container-page py-10">
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: guide.title, path: `/guide/${guide.slug}` }])} />
    <JsonLd data={articleSchema({ headline: guide.title, description: guide.summary, path: `/guide/${guide.slug}`, datePublished: guide.updated })} />
    <article className="mx-auto max-w-3xl">
      <Link to="/guides" className="text-sm font-semibold text-primary hover:underline">← All guides</Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-primary">{guide.category}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">{guide.title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated {guide.updated} · Workly USA editorial team</p>
      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{guide.intro}</p>
      {guide.sections.map((section) => <section key={section.heading} className="mt-10"><h2 className="font-display text-2xl font-semibold">{section.heading}</h2>{section.paragraphs.map((p) => <p key={p} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>)}</section>)}
      <section className="mt-10"><h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2><div className="mt-4 space-y-5">{guide.faqs.map((faq) => <div key={faq.question}><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
      {guide.calculator ? <div className="mt-10 rounded-2xl border border-border bg-surface p-6"><h2 className="font-display text-xl font-semibold">Put this into practice</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use our free browser-based calculator to explore your own numbers. Results are estimates for planning.</p><Link to="/$slug" params={{ slug: guide.calculator.slug }} className="mt-4 inline-flex font-semibold text-primary hover:underline">Open the {guide.calculator.label} →</Link></div> : null}
      <p className="mt-10 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">This article is general educational information for American workers, not tax, legal, payroll, or financial advice. Rules vary by state and employer. Verify current requirements with your state labor department or a qualified professional.</p>
    </article>
  </div>;
}
