import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Privacy Policy — Workly USA";
const description =
  "How Workly USA handles your information: calculations stay in your browser, what analytics and advertising cookies do, and your privacy choices.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => pageHead({ title, description, path: "/privacy-policy" }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">The short version</h2>
        <p>
          The numbers you type into a {site.name} calculator stay in your browser. We do not transmit,
          log or store them, and we never ask for your name, employer, Social Security number or bank
          details.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Information we collect</h2>
        <p>
          <strong className="text-foreground">Calculator inputs:</strong> processed locally on your
          device only.
        </p>
        <p>
          <strong className="text-foreground">Usage analytics:</strong> if analytics is enabled, we
          collect aggregate, non-identifying information such as pages viewed, approximate region,
          device type and referring site. This tells us which calculators people need — not who they
          are.
        </p>
        <p>
          <strong className="text-foreground">Messages you send us:</strong> if you email us, we keep
          your message and address to reply.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Cookies and advertising</h2>
        <p>
          This site is supported by advertising. Third-party advertising partners, including Google,
          may use cookies or similar technologies to serve ads based on your prior visits to this and
          other websites. Google&apos;s use of advertising cookies enables it and its partners to
          serve ads based on your visits here.
        </p>
        <p>
          You can opt out of personalized advertising in{" "}
          <a
            href="https://adssettings.google.com"
            className="text-primary hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          , or opt out of third-party vendor cookies at{" "}
          <a
            href="https://www.aboutads.info"
            className="text-primary hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            aboutads.info
          </a>
          . See our{" "}
          <Link to="/cookie-policy" className="text-primary hover:underline">
            Cookie Policy
          </Link>{" "}
          for detail.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Children</h2>
        <p>
          This site is intended for adults in the workforce. We do not knowingly collect information
          from children under 13.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Your choices</h2>
        <p>
          You can block or delete cookies in your browser settings, use an ad blocker, or use the site
          in private browsing — the calculators work either way. Depending on where you live, you may
          have rights to access or delete personal information we hold; email us to exercise them.
        </p>

        <h2 className="font-display text-xl font-semibold text-foreground">Changes</h2>
        <p>
          We will update this page when our practices change. Questions? Email{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-primary hover:underline">
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
