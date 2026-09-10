/**
 * Central site configuration.
 *
 * Environment variables (set these before launch — see LAUNCH-CHECKLIST.md):
 *   VITE_SITE_URL                     canonical origin, e.g. https://worklyusa.com
 *   VITE_GA_MEASUREMENT_ID            Google Analytics 4 ID; analytics stays off while blank
 *   VITE_ADSENSE_CLIENT_ID            AdSense publisher ID (ca-pub-XXXXXXXX); ad slots stay
 *                                     collapsed and no ad script loads while blank
 *   VITE_SEARCH_CONSOLE_VERIFICATION  google-site-verification token, if you verify by meta tag
 *
 * No IDs are hardcoded. Nothing third-party loads until a real value is supplied.
 */

const env = import.meta.env as Record<string, string | undefined>;

export const site = {
  name: "Workly USA",
  tagline: "Know Your Pay. Know Your Worth.",
  secondaryTagline: "Free work & paycheck calculators built for American workers.",
  url: (env['VITE_SITE_URL'] ?? "https://worklyusa.com").replace(/\/$/, ""),
  contactEmail: env['VITE_CONTACT_EMAIL'] ?? "worklyusa@gmail.com",
};

export const analyticsConfig = {
  measurementId: env['VITE_GA_MEASUREMENT_ID'] ?? "",
  get enabled() {
    return this.measurementId.length > 0;
  },
};

export const adsConfig = {
  clientId: env['VITE_ADSENSE_CLIENT_ID'] ?? "",
  get enabled() {
    return this.clientId.startsWith("ca-pub-");
  },
};

export const searchConsoleVerification = env['VITE_SEARCH_CONSOLE_VERIFICATION'] ?? "";

export const canonical = (path: string) =>
  `${site.url}${path === "/" ? "" : path.startsWith("/") ? path : `/${path}`}`;

export const ESTIMATE_DISCLAIMER =
  "Results are estimates based on the information you provide and may differ from your actual paycheck. This calculator is for informational and planning purposes and is not tax, payroll, legal, or financial advice.";
