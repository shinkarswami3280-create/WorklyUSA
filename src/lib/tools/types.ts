import type { Values } from "@/lib/calc";

export type CategoryId = "pay" | "work-hours" | "career" | "real-life";

export type FieldType = "number" | "time" | "select";

export interface Field {
  id: string;
  label: string;
  type?: FieldType;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  help?: string;
  default?: string;
  options?: { value: string; label: string }[];
  step?: string;
  optional?: boolean;
}

export interface ResultRow {
  label: string;
  value: string;
  strong?: boolean;
}

export interface CalcResult {
  primary: { value: string; label: string };
  rows: ResultRow[];
  notes?: string[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  name: string;
  h1: string;
  category: CategoryId;
  secondaryCategories?: CategoryId[];
  icon: string;
  short: string;
  keywords: string[];
  title: string;
  description: string;
  intro: string;
  /** Field-driven calculators use fields + compute. */
  fields?: Field[];
  compute?: (values: Values) => CalcResult;
  /** Calculators with bespoke UI. */
  custom?: "timecard" | "joboffer" | "effective";
  howItWorks: string[];
  formula?: string;
  example: string[];
  assumptions: string[];
  disclaimer?: boolean;
  faqs: Faq[];
  related: string[];
}
