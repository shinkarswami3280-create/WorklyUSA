import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Cookie Policy — Workly USA";
const description =
  "What cookies Workly USA and its advertising partners use, why they exist, and how to turn them off without losing access to the calculators.";

export const Route = createFileRoute("/cookie-policy")({
  head: () => pageHead({ title, description, path: "/cookie-policy" }),
  component: CookiePolicy,
});

function CookiePolicy() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Cookie Policy</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Cookies are small files a website stores in your browser. {site.name} keeps them to a
          minimum — no cookie is required to use any calculator.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Categories we use</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Essential:</strong> keep the site functioning and
            secure. These cannot be switched off.
          </li>
          <li>
            <strong className="text-foreground">Analytics:</strong> aggregate, non-identifying counts
            of page views and device types, so we know which tools to improve.
          </li>
          <li>
            <strong className="text-foreground">Advertising:</strong> set by third-party ad partners,
            including Google, to limit repeat ads, measure performance and — unless you opt out —
            personalize what you see.
          </li>
        </ul>

        <h2 className="font-display text-xl font-semibold text-foreground">Managing cookies</h2>
        <p>
          Every major browser lets you block or delete cookies in its privacy settings. You can also
          opt out of personalized ads in{" "}
          <a
            href="https://adssettings.google.com"
            className="text-primary hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>{" "}
          or at{" "}
          <a
            href="https://www.aboutads.info"
            className="text-primary hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            aboutads.info
          </a>
          . Blocking cookies does not break the calculators — your inputs never leave your device
          either way.
        </p>

        <p>
          Read this alongside our{" "}
          <Link to="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
