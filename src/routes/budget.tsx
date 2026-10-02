import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { BudgetProgress } from "@/components/BudgetProgress";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/StatCard";
import { LoadingGrid, Panel } from "@/components/TransactionRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colorForCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import { budgetStatus, categoryBreakdown, currentMonthKey, daysLeftInMonth, inMonth } from "@/lib/stats";
import { useFinance } from "@/store/finance-store";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Budget — SmartSpend" },
      { name: "description", content: "Set a monthly budget and track how much you've spent and have left." },
      { property: "og:title", content: "Budget — SmartSpend" },
      { property: "og:description", content: "Set a monthly budget and track how much you've spent and have left." },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { transactions, monthlyBudget, setMonthlyBudget, loading } = useFinance();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) setValue(monthlyBudget ? String(monthlyBudget) : "");
  }, [loading, monthlyBudget]);

  const status = budgetStatus(transactions, monthlyBudget);
  const breakdown = categoryBreakdown(inMonth(transactions, currentMonthKey()));
  const days = daysLeftInMonth();

  function save(e: FormEvent) {
    e.preventDefault();
    const n = Number(value);
    if (!value.trim() || Number.isNaN(n) || n <= 0) {
      setError("Enter a budget greater than 0.");
      return;
    }
    setError("");
    setMonthlyBudget(n);
    toast.success(`Monthly budget set to ${formatCurrency(n)}`);
  }

  return (
    <AppShell eyebrow="Planning" title="Budget management">
      {loading ? (
        <LoadingGrid />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Monthly budget" value={formatCurrency(monthlyBudget)} featured />
            <StatCard label="Spent this month" value={formatCurrency(status.spent)} />
            <StatCard
              label="Remaining"
              value={formatCurrency(status.remaining)}
              hint={status.remaining > 0 && days > 0 ? `≈ ${formatCurrency(status.remaining / days)} / day for ${days} days` : undefined}
              hintTone={status.level === "over" ? "expense" : "muted"}
            />
            <StatCard
              label="Budget used"
              value={`${Math.round(status.percentUsed)}%`}
              hint={status.level === "over" ? "Over budget" : status.level === "warning" ? "Approaching limit" : "On track"}
              hintTone={status.level === "over" ? "expense" : status.level === "warning" ? "gold" : "income"}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel title="Set monthly budget" subtitle="Applies to every month">
              <form onSubmit={save} noValidate className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Amount (₹)</Label>
                  <Input id="budget" type="number" min="0" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} aria-invalid={!!error} />
                  {error ? <p className="text-xs text-destructive">{error}</p> : null}
                </div>
                <Button type="submit" className="w-full">Save budget</Button>
              </form>
            </Panel>

            <Panel className="lg:col-span-2" title="This month's progress" subtitle={`${formatCurrency(status.spent)} of ${formatCurrency(monthlyBudget)}`}>
              {monthlyBudget > 0 ? (
                <BudgetProgress status={status} />
              ) : (
                <p className="text-sm text-muted-foreground">Set a budget to start tracking your progress.</p>
              )}
            </Panel>
          </section>

          <Panel title="Where the budget went" subtitle="Share of this month's budget per category">
            {breakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses this month yet.</p>
            ) : (
              <ul className="space-y-4">
                {breakdown.map((c) => {
                  const pct = monthlyBudget > 0 ? (c.amount / monthlyBudget) * 100 : c.percent;
                  return (
                    <li key={c.category}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span>{c.category}</span>
                        <span className="numeric text-muted-foreground">
                          {formatCurrency(c.amount)} · {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: colorForCategory(c.category) }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </>
      )}
    </AppShell>
  );
}
