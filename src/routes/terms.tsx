import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Terms of Use — Workly USA";
const description =
  "The terms that apply when you use Workly USA's free calculators, including acceptable use, intellectual property and limitation of liability.";

export const Route = createFileRoute("/terms")({
  head: () => pageHead({ title, description, path: "/terms" }),
  component: Terms,
});

function Terms() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Terms of Use</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          By using {site.name} you agree to these terms. If you don&apos;t agree, please don&apos;t use
          the site.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">What we provide</h2>
        <p>
          Free informational calculators and articles. We may add, change or remove tools at any time,
          and we don&apos;t guarantee uninterrupted availability.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">No professional advice</h2>
        <p>
          Results are estimates for general planning and are not tax, legal, payroll, employment or
          financial advice. Don&apos;t rely on them for filing taxes, disputing wages, or making a
          binding decision without professional guidance. See the{" "}
          <Link to="/disclaimer" className="text-primary hover:underline">
            full disclaimer
          </Link>
          .
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Acceptable use</h2>
        <p>
          Don&apos;t attempt to disrupt the site, scrape it at a volume that degrades service for
          others, reverse-engineer it to build a competing clone of our content, or misrepresent our
          results as official payroll figures.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Intellectual property</h2>
        <p>
          The site&apos;s name, design, written guides and calculator implementations belong to{" "}
          {site.name}. You&apos;re welcome to use the results for personal or internal business
          purposes and to link to any page.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Limitation of liability</h2>
        <p>
          The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest
          extent permitted by law, we are not liable for any loss arising from your use of, or
          reliance on, the site or its results.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Third-party links and ads</h2>
        <p>
          We link to third-party sites and display third-party advertising. We don&apos;t control that
          content and aren&apos;t responsible for it.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Changes</h2>
        <p>
          We may update these terms; continued use after an update means you accept the revised terms.
          Questions go to{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-primary hover:underline">
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
