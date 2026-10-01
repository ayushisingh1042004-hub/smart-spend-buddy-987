import type { TransactionType } from "./types";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Education",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Travel",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Allowance",
  "Freelance",
  "Scholarship",
  "Other",
] as const;

export function categoriesFor(type: TransactionType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const ALL_CATEGORIES: readonly string[] = Array.from(
  new Set<string>([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
);

/** Chart colour token assigned per expense category (stable ordering). */
export const CATEGORY_COLORS: Record<string, string> = {
  Food: "var(--chart-1)",
  Shopping: "var(--chart-2)",
  Transport: "var(--chart-3)",
  Education: "var(--chart-5)",
  Entertainment: "var(--chart-7)",
  Bills: "var(--chart-4)",
  Healthcare: "var(--chart-6)",
  Travel: "var(--chart-8)",
  Other: "var(--chart-9)",
};

export function colorForCategory(category: string): string {
  return CATEGORY_COLORS[category] ?? "var(--chart-9)";
}
