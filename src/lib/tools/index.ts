import { careerTools } from "./career";
import { workHoursTools } from "./hours";
import { payTools } from "./pay";
import { realLifeTools } from "./real-life";
import type { CategoryId, Tool } from "./types";

export type { CalcResult, CategoryId, Field, Faq, ResultRow, Tool } from "./types";

export interface Category {
  id: CategoryId;
  label: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "pay",
    label: "Pay",
    slug: "pay",
    tagline: "Salary, wages and paychecks",
    description:
      "Convert between salary and hourly pay, estimate take-home pay, and see what a raise, bonus or commission is really worth.",
    icon: "Wallet",
  },
  {
    id: "work-hours",
    label: "Work Hours",
    slug: "work-hours",
    tagline: "Time cards, shifts and overtime",
    description:
      "Add up hours worked, handle overnight shifts and breaks, and calculate overtime, time and a half and double time.",
    icon: "Clock",
  },
  {
    id: "career",
    label: "Career",
    slug: "career",
    tagline: "Offers, comparisons and rates",
    description:
      "Compare salaries and job offers, work out your effective hourly wage, and set a freelance rate that actually covers your costs.",
    icon: "Compass",
  },
  {
    id: "real-life",
    label: "Real Life",
    slug: "real-life",
    tagline: "Commuting and time off",
    description:
      "The parts of work that don't show up on a pay stub: commute cost, commute time, PTO accrual and vacation planning.",
    icon: "Car",
  },
];

export const tools: Tool[] = [...payTools, ...workHoursTools, ...careerTools, ...realLifeTools];

export const toolsBySlug: Record<string, Tool> = Object.fromEntries(
  tools.map((tool) => [tool.slug, tool]),
);

export function getTool(slug: string): Tool {
  const tool = toolsBySlug[slug];
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

export function toolsInCategory(id: CategoryId): Tool[] {
  return tools.filter(
    (tool) => tool.category === id || tool.secondaryCategories?.includes(id),
  );
}

export function getCategory(id: CategoryId): Category {
  return categories.find((category) => category.id === id) ?? categories[0]!;
}

export const popularToolSlugs = [
  "paycheck-calculator",
  "overtime-calculator",
  "time-card-calculator",
  "salary-to-hourly-calculator",
  "effective-hourly-wage-calculator",
  "raise-calculator",
];

export const popularTools = popularToolSlugs.map(getTool);

export const relatedTools = (tool: Tool): Tool[] =>
  tool.related.map((slug) => toolsBySlug[slug]).filter((t): t is Tool => Boolean(t));

/** Lightweight scored search over names, descriptions and keywords. */
export function searchTools(query: string, limit = 8): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = tools.map((tool) => {
    const haystack = [
      tool.name.toLowerCase(),
      tool.short.toLowerCase(),
      tool.category,
      ...tool.keywords.map((k) => k.toLowerCase()),
    ];
    let score = 0;
    for (const term of terms) {
      if (tool.name.toLowerCase().startsWith(term)) score += 6;
      if (tool.name.toLowerCase().includes(term)) score += 4;
      if (tool.keywords.some((k) => k.toLowerCase().includes(term))) score += 3;
      if (haystack.some((field) => field.includes(term))) score += 1;
    }
    return { tool, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, limit)
    .map((entry) => entry.tool);
}
