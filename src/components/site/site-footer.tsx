import { Link } from "@tanstack/react-router";

import { categories, toolsInCategory } from "@/lib/tools";
import { site } from "@/lib/site";

const legalLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/terms", label: "Terms of Use" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/pay-stub-glossary", label: "Pay Stub Glossary" },
  { to: "/job-offer-checklist", label: "Offer Checklist" },
  { to: "/editorial-standards", label: "Editorial Standards" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <span className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                W
              </span>
              Workly <span className="text-primary">USA</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.secondaryTagline} No login, no paywall, and your numbers never leave your browser.
            </p>
          </div>

          {categories.map((category) => (
            <div key={category.id}>
              <h2 className="text-sm font-semibold">{category.label}</h2>
              <ul className="mt-3 space-y-2">
                {toolsInCategory(category.id)
                  .slice(0, 6)
                  .map((tool) => (
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
                <li>
                  <Link
                    to="/category/$category"
                    params={{ category: category.slug }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    All {category.label} tools
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/guides" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Guides
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. Estimates for planning only — not tax, payroll or
            financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
