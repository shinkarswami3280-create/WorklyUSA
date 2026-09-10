import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { pageHead } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Contact Workly USA";
const description =
  "Get in touch with Workly USA about a calculator result, a bug, an advertising question, or a tool you'd like us to build.";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ title, description, path: "/contact" }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Contact us</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        We read everything. Whether a number looks off, a page is broken, or you want a calculator we
        haven&apos;t built yet, email is the fastest way to reach us.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <Mail className="size-5 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold">Email</h2>
        <a
          href={`mailto:${site.contactEmail}`}
          className="mt-1 inline-block text-lg font-semibold text-primary hover:underline"
        >
          {site.contactEmail}
        </a>
        <p className="mt-3 text-sm text-muted-foreground">
          We usually reply within a few business days.
        </p>
      </div>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">
          What we can and can&apos;t help with
        </h2>
        <p>
          We can explain how a calculator works, fix mistakes, and take requests for new tools.
        </p>
        <p>
          We can&apos;t give tax, legal, payroll or financial advice, review your specific paycheck,
          or contact your employer on your behalf. For a wage dispute, contact your state labor
          department or the U.S. Department of Labor Wage and Hour Division.
        </p>
      </div>
    </div>
  );
}
