import { canonical, site } from "./site";

interface PageHeadOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/** Unique per-page metadata plus a self-referencing canonical URL. */
export function pageHead({ title, description, path, noindex }: PageHeadOptions) {
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical(path) },
    { property: "og:site_name", content: site.name },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  return {
    meta,
    links: [{ rel: "canonical", href: canonical(path) }],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function webPageSchema(options: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: canonical(options.path),
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
  };
}

export function articleSchema(options: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.headline,
    description: options.description,
    mainEntityOfPage: canonical(options.path),
    datePublished: options.datePublished,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}
