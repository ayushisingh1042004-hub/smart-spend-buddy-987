import type { Transaction } from "./types";

/**
 * Pure calculation helpers. Every dashboard / analytics number in the app is
 * derived here from the transaction list, so charts always match the data.
 */

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // "YYYY-MM"
}

export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

export function previousMonthKey(key = currentMonthKey()): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short" });
}

export function inMonth(transactions: Transaction[], key: string): Transaction[] {
  return transactions.filter((t) => monthKey(t.date) === key);
}

export function sumBy(transactions: Transaction[], type: "income" | "expense"): number {
  return transactions.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
}

export interface Totals {
  income: number;
  expenses: number;
  balance: number;
}

export function totals(transactions: Transaction[]): Totals {
  const income = sumBy(transactions, "income");
  const expenses = sumBy(transactions, "expense");
  return { income, expenses, balance: income - expenses };
}

export interface CategorySlice {
  category: string;
  amount: number;
  percent: number;
}

export function categoryBreakdown(
  transactions: Transaction[],
  type: "income" | "expense" = "expense",
): CategorySlice[] {
  const rows = transactions.filter((t) => t.type === type);
  const total = rows.reduce((s, t) => s + t.amount, 0);
  const map = new Map<string, number>();
  for (const t of rows) map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  return [...map.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export interface MonthPoint {
  key: string;
  label: string;
  income: number;
  expenses: number;
  savings: number;
}

/** Last `count` months (oldest first), including the current month. */
export function monthlySeries(transactions: Transaction[], count = 6): MonthPoint[] {
  const now = new Date();
  const points: MonthPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const rows = inMonth(transactions, key);
    const income = sumBy(rows, "income");
    const expenses = sumBy(rows, "expense");
    points.push({ key, label: monthLabel(key), income, expenses, savings: income - expenses });
  }
  return points;
}

export interface BudgetStatus {
  budget: number;
  spent: number;
  remaining: number
  percentUsed: number;
  level: "safe" | "warning" | "over";
}

export function budgetStatus(transactions: Transaction[], budget: number): BudgetStatus {
  const spent = sumBy(inMonth(transactions, currentMonthKey()), "expense");
  const remaining = budget - spent;
  const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;
  const level = percentUsed >= 100 ? "over" : percentUsed >= 80 ? "warning" : "safe";
  return { budget, spent, remaining, percentUsed, level };
}

export function daysLeftInMonth(): number {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(0, last - now.getDate());
}
