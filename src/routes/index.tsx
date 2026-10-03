import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Plus, Target, Wallet, Scale } from "lucide-react";

import { BudgetProgress } from "@/components/BudgetProgress";
import { CategoryDonut } from "@/components/charts/CategoryDonut";
import { IncomeExpenseBar } from "@/components/charts/IncomeExpenseBar";
import { AppShell } from "@/components/layout/AppShell";
import { SmartInsights } from "@/components/SmartInsights";
import { StatCard } from "@/components/StatCard";
import { EmptyState, LoadingGrid, Panel, TransactionRow } from "@/components/TransactionRow";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { buildInsights } from "@/lib/insights";
import { budgetStatus, categoryBreakdown, currentMonthKey, inMonth, monthlySeries, totals } from "@/lib/stats";
import { useFinance, useSortedTransactions } from "@/store/finance-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmartSpend" },
      { name: "description", content: "Your income, expenses, budget and savings at a glance." },
      { property: "og:title", content: "Dashboard — SmartSpend" },
      { property: "og:description", content: "Your income, expenses, budget and savings at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { transactions, monthlyBudget, loading, error } = useFinance();
  const sorted = useSortedTransactions();

  const all = totals(transactions);
  const month = totals(inMonth(transactions, currentMonthKey()));
  const budget = budgetStatus(transactions, monthlyBudget);
  const breakdown = categoryBreakdown(inMonth(transactions, currentMonthKey()));
  const series = monthlySeries(transactions, 6);
  const insights = buildInsights(transactions, monthlyBudget);

  return (
    <AppShell
      eyebrow="Overview"
      title="Dashboard"
      actions={
        <Button asChild>
          <Link to="/add">
            <Plus className="size-4" /> <span className="hidden sm:inline">Add transaction</span>
          </Link>
        </Button>
      }
    >
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : null}

      {loading ? (
        <LoadingGrid />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard label="Total income" value={formatCurrency(all.income)} hint="all time" icon={ArrowUpRight} />
            <StatCard label="Total expenses" value={formatCurrency(all.expenses)} hint="all time" icon={ArrowDownRight} />
            <StatCard label="Current balance" value={formatCurrency(all.balance)} hint="income − expenses" icon={Wallet} featured />
            <StatCard label="Monthly budget" value={formatCurrency(monthlyBudget)} hint={monthlyBudget ? "this month" : "not set"} icon={Target} />
            <StatCard
              label="Remaining budget"
              value={formatCurrency(budget.remaining)}
              hint={`${Math.round(budget.percentUsed)}% used`}
              hintTone={budget.level === "over" ? "expense" : budget.level === "warning" ? "gold" : "income"}
              icon={Scale}
            />
            <StatCard
              label="Savings"
              value={formatCurrency(month.balance)}
              hint="this month"
              hintTone={month.balance >= 0 ? "income" : "expense"}
              icon={PiggyBank}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Monthly trend" subtitle="Income vs expense, last 6 months">
              <IncomeExpenseBar data={series} />
            </Panel>
            <Panel title="Spending mix" subtitle="This month's category breakdown">
              <CategoryDonut data={breakdown} />
            </Panel>
          </section>

          {monthlyBudget > 0 ? (
            <Panel
              title="Budget usage"
              subtitle={`${formatCurrency(budget.spent)} of ${formatCurrency(monthlyBudget)} spent this month`}
              right={<Link to="/budget" className="text-xs font-medium text-primary hover:underline">Manage →</Link>}
            >
              <BudgetProgress status={budget} />
            </Panel>
          ) : null}

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel
              className="lg:col-span-2"
              title="Recent transactions"
              right={<Link to="/history" className="text-xs font-medium text-primary hover:underline">View all →</Link>}
            >
              {sorted.length === 0 ? (
                <EmptyState
                  title="No transactions yet"
                  detail="Start by adding your first income or expense."
                  action={<Button asChild><Link to="/add">Add transaction</Link></Button>}
                />
              ) : (
                <div className="divide-y divide-border">
                  {sorted.slice(0, 6).map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}
            </Panel>
            <Panel title="Smart insights" subtitle="Rule-based tips from your data">
              <SmartInsights insights={insights} limit={4} />
            </Panel>
          </section>
        </>
      )}
    </AppShell>
  );
}
