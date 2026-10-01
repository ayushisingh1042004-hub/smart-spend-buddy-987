import { formatCurrency } from "./format";
import {
  budgetStatus,
  categoryBreakdown,
  currentMonthKey,
  daysLeftInMonth,
  inMonth,
  previousMonthKey,
  sumBy,
} from "./stats";
import type { Transaction } from "./types";

/**
 * Rule-based "Smart Insights".
 *
 * These are simple if/else financial rules computed from the user's own
 * transactions — there is no machine-learning model involved.
 */

export type InsightTone = "good" | "warn" | "info";

export interface Insight {
  id: string;
  tone: InsightTone;
  title: string;
  detail: string;
}

export function buildInsights(transactions: Transaction[], monthlyBudget: number): Insight[] {
  const insights: Insight[] = [];
  const thisMonth = inMonth(transactions, currentMonthKey());
  const lastMonth = inMonth(transactions, previousMonthKey());

  if (thisMonth.length === 0) {
    return [
      {
        id: "empty",
        tone: "info",
        title: "No activity yet this month",
        detail: "Add a transaction and your insights will appear here automatically.",
      },
    ];
  }

  const expenses = sumBy(thisMonth, "expense");
  const income = sumBy(thisMonth, "income");
  const lastExpenses = sumBy(lastMonth, "expense");
  const savings = income - expenses;
  const budget = budgetStatus(transactions, monthlyBudget);
  const top = categoryBreakdown(thisMonth)[0];

  // Rule 1 — highest spending category
  if (top) {
    insights.push({
      id: "top-category",
      tone: "info",
      title: `${top.category} is your highest spending category`,
      detail: `${formatCurrency(top.amount)} spent on ${top.category.toLowerCase()} — ${Math.round(
        top.percent,
      )}% of this month's expenses.`,
    });
  }

  // Rule 2 — budget usage
  if (monthlyBudget > 0) {
    if (budget.level === "over") {
      insights.push({
        id: "budget",
        tone: "warn",
        title: `You have exceeded your monthly budget`,
        detail: `${formatCurrency(budget.spent)} spent against a budget of ${formatCurrency(
          monthlyBudget,
        )} — over by ${formatCurrency(Math.abs(budget.remaining))}.`,
      });
    } else if (budget.level === "warning") {
      insights.push({
        id: "budget",
        tone: "warn",
        title: `You have used ${Math.round(budget.percentUsed)}% of your monthly budget`,
        detail: `${formatCurrency(budget.remaining)} left with ${daysLeftInMonth()} days to go.`,
      });
    } else {
      insights.push({
        id: "budget",
        tone: "good",
        title: `Budget on track at ${Math.round(budget.percentUsed)}%`,
        detail: `${formatCurrency(budget.remaining)} of ${formatCurrency(
          monthlyBudget,
        )} still available this month.`,
      });
    }
  }

  // Rule 3 — month-over-month spending comparison
  if (lastExpenses > 0) {
    const change = ((expenses - lastExpenses) / lastExpenses) * 100;
    if (change > 5) {
      insights.push({
        id: "trend",
        tone: "warn",
        title: `Your spending is higher than last month`,
        detail: `Up ${Math.round(change)}% compared with ${formatCurrency(lastExpenses)} last month.`,
      });
    } else if (change < -5) {
      insights.push({
        id: "trend",
        tone: "good",
        title: `Your spending is lower than last month`,
        detail: `Down ${Math.round(Math.abs(change))}% compared with ${formatCurrency(
          lastExpenses,
        )} last month.`,
      });
    }
  }

  // Rule 4 — savings this month
  if (savings > 0) {
    insights.push({
      id: "savings",
      tone: "good",
      title: `You saved ${formatCurrency(savings)} this month`,
      detail:
        income > 0
          ? `That is ${Math.round((savings / income) * 100)}% of your income this month.`
          : "Keep it up by recording every expense.",
    });
  } else if (income > 0) {
    insights.push({
      id: "savings",
      tone: "warn",
      title: "You spent more than you earned this month",
      detail: `Expenses exceed income by ${formatCurrency(Math.abs(savings))}.`,
    });
  }

  // Rule 5 — suggestion on the top category
  if (top && top.percent >= 30) {
    insights.push({
      id: "suggestion",
      tone: "info",
      title: `Consider reducing spending on ${top.category}`,
      detail: `Cutting ${top.category.toLowerCase()} by 10% would free up about ${formatCurrency(
        top.amount * 0.1,
      )} next month.`,
    });
  }

  return insights;
}
