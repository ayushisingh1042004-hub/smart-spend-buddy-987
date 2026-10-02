import { createFileRoute } from "@tanstack/react-router";

import { CategoryDonut } from "@/components/charts/CategoryDonut";
import { IncomeExpenseBar } from "@/components/charts/IncomeExpenseBar";
import { SpendingTrendLine } from "@/components/charts/SpendingTrendLine";
import { AppShell } from "@/components/layout/AppShell";
import { SmartInsights } from "@/components/SmartInsights";
import { LoadingGrid, Panel } from "@/components/TransactionRow";
import { colorForCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import { buildInsights } from "@/lib/insights";
import { categoryBreakdown, monthlySeries } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useFinance } from "@/store/finance-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SmartSpend" },
      { name: "description", content: "Charts of category spending, income vs expense, trends and monthly savings." },
      { property: "og:title", content: "Analytics — SmartSpend" },
      { property: "og:description", content: "Charts of category spending, income vs expense, trends and monthly savings." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { transactions, monthlyBudget, loading } = useFinance();
  const series = monthlySeries(transactions, 6);
  const sixMonthKeys = new Set(series.map((s) => s.key));
  const recent = transactions.filter((t) => sixMonthKeys.has(t.date.slice(0, 7)));
  const breakdown = categoryBreakdown(recent);
  const insights = buildInsights(transactions, monthlyBudget);
  const maxAmount = breakdown[0]?.amount ?? 0;

  return (
    <AppShell eyebrow="Reports" title="Analytics">
      {loading ? (
        <LoadingGrid />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Income vs expense" subtitle="Last 6 months">
              <IncomeExpenseBar data={series} />
            </Panel>
            <Panel title="Expenses by category" subtitle="Last 6 months">
              <CategoryDonut data={breakdown} />
            </Panel>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Spending trend" subtitle="Monthly expenses and savings">
              <SpendingTrendLine data={series} />
            </Panel>
            <Panel title="Top spending categories" subtitle="Ranked by amount">
              {breakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
              ) : (
                <ol className="space-y-3">
                  {breakdown.slice(0, 5).map((c, i) => (
                    <li key={c.category}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span><span className="mr-2 text-muted-foreground">{i + 1}.</span>{c.category}</span>
                        <span className="numeric font-medium">{formatCurrency(c.amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-primary/10">
                        <div className="h-full rounded-full" style={{ width: `${(c.amount / maxAmount) * 100}%`, background: colorForCategory(c.category) }} />
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Monthly savings" subtitle="Income minus expenses per month">
              <div className="overflow-x-auto">
                <table className="numeric w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-2 font-medium">Month</th>
                      <th className="py-2 text-right font-medium">Income</th>
                      <th className="py-2 text-right font-medium">Expenses</th>
                      <th className="py-2 text-right font-medium">Savings</th>
                      <th className="py-2 text-right font-medium">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[...series].reverse().map((m) => (
                      <tr key={m.key}>
                        <td className="py-2.5">{m.label} {m.key.slice(0, 4)}</td>
                        <td className="py-2.5 text-right">{formatCurrency(m.income)}</td>
                        <td className="py-2.5 text-right">{formatCurrency(m.expenses)}</td>
                        <td className={cn("py-2.5 text-right font-medium", m.savings >= 0 ? "text-income" : "text-expense")}>
                          {formatCurrency(m.savings)}
                        </td>
                        <td className="py-2.5 text-right text-muted-foreground">
                          {m.income > 0 ? `${Math.round((m.savings / m.income) * 100)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel title="Smart insights" subtitle="Rule-based, computed from your transactions">
              <SmartInsights insights={insights} />
            </Panel>
          </section>
        </>
      )}
    </AppShell>
  );
}
