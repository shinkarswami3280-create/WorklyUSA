import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "About Workly USA — Free Calculators for American Workers";
const description =
  "Workly USA builds free, no-login calculators for pay, paychecks, overtime and work hours. Learn who we are, how our tools work, and how we make money.";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title, description, path: "/about" }),
  component: About,
});

function About() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">About Workly USA</h1>
      <div className="prose-page mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          {site.name} exists for one reason: American workers should be able to check their own
          numbers without an account, a paywall, or a spreadsheet. {site.tagline}
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">What we build</h2>
        <p>
          Calculators for the questions people actually ask on payday. What is my paycheck going to
          be? How much overtime did I earn? What does this salary work out to per hour? Is this new
          offer really better? Every tool gives an instant answer, shows the math, and states what it
          assumes.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">How your data is handled</h2>
        <p>
          Every calculation runs locally in your browser. We do not ask for your name, your employer,
          or your Social Security number, and the figures you type are never sent to us or stored.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">How we stay free</h2>
        <p>
          Advertising. Ads sit around the content, never in the middle of a calculator, and never
          disguised as a result. We would rather load a page fast than squeeze in another banner.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">Accuracy and limits</h2>
        <p>
          Our results are estimates for planning. Real paychecks depend on your W-4, your state and
          local taxes, your benefits elections and your employer&apos;s payroll rules. We are not a
          payroll provider and nothing here is tax, legal or financial advice. See our{" "}
          <Link to="/disclaimer" className="text-primary hover:underline">
            disclaimer
          </Link>{" "}
          for the full picture.
        </p>
        <p>
          Spotted something wrong, or want a calculator we don&apos;t have?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Tell us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
