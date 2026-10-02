import { AlertTriangle, CheckCircle2, OctagonAlert } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { BudgetStatus } from "@/lib/stats";
import { cn } from "@/lib/utils";

export function BudgetProgress({ status }: { status: BudgetStatus }) {
  const bar =
    status.level === "over" ? "bg-expense" : status.level === "warning" ? "bg-gold" : "bg-income";

  return (
    <div className="space-y-4">
      <div className="h-3 overflow-hidden rounded-full bg-primary/10">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bar)}
          style={{ width: `${Math.min(100, status.percentUsed)}%` }}
        />
      </div>
      <div className="numeric flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <span>Spent {formatCurrency(status.spent)}</span>
        <span className="font-medium text-foreground">{Math.round(status.percentUsed)}% used</span>
        <span>Budget {formatCurrency(status.budget)}</span>
      </div>

      {status.level === "over" ? (
        <div className="flex gap-3 rounded-xl border border-expense/30 bg-expense/10 p-3 text-sm">
          <OctagonAlert className="mt-0.5 size-4 shrink-0 text-expense" />
          <p>
            <span className="font-medium text-expense">Budget exceeded.</span> You are over by{" "}
            {formatCurrency(Math.abs(status.remaining))} this month.
          </p>
        </div>
      ) : status.level === "warning" ? (
        <div className="flex gap-3 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            <span className="font-medium text-gold">Approaching your limit.</span> Only{" "}
            {formatCurrency(status.remaining)} left this month.
          </p>
        </div>
      ) : (
        <div className="flex gap-3 rounded-xl border border-income/25 bg-income/10 p-3 text-sm">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-income" />
          <p>
            <span className="font-medium text-income">On track.</span>{" "}
            {formatCurrency(status.remaining)} still available.
          </p>
        </div>
      )}
    </div>
  );
}
