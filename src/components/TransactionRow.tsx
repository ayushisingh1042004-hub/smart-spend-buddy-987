import { formatShortDate, formatSigned } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function TransactionRow({ tx, actions }: { tx: Transaction; actions?: ReactNode }) {
  const income = tx.type === "income";
  return (
    <div className="flex items-center gap-4 py-3">
      <div
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold",
          income ? "bg-income/12 text-income" : "bg-expense/12 text-expense",
        )}
      >
        {income ? "+" : "−"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {tx.description} <span className="text-muted-foreground">· {tx.category}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatShortDate(tx.date)} · {income ? "Income" : "Expense"}
        </p>
      </div>
      <span
        className={cn(
          "numeric shrink-0 font-display font-semibold",
          income ? "text-income" : "text-expense",
        )}
      >
        {formatSigned(tx.amount, tx.type)}
      </span>
      {actions}
    </div>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{detail}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Panel({ title, subtitle, right, children, className }: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
