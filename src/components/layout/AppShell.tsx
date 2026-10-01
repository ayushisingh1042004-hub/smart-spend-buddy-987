import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Info,
  LayoutDashboard,
  Menu,
  PiggyBank,
  PlusCircle,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/format";
import { budgetStatus } from "@/lib/stats";
import { useFinance } from "@/store/finance-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add", label: "Add Transaction", icon: PlusCircle },
  { to: "/history", label: "History", icon: Receipt },
  { to: "/budget", label: "Budget", icon: PiggyBank },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/about", label: "About", icon: Info },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1 text-sm">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-foreground/70 transition-colors hover:bg-primary/5"
          activeProps={{ className: "bg-primary text-primary-foreground font-medium" }}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function BudgetMini() {
  const { transactions, monthlyBudget } = useFinance();
  const status = budgetStatus(transactions, monthlyBudget);

  if (monthlyBudget <= 0) {
    return (
      <div className="rounded-2xl border border-border bg-primary/5 p-4">
        <p className="mb-1 text-[11px] text-muted-foreground">Monthly budget</p>
        <Link to="/budget" className="text-sm font-medium text-primary hover:underline">
          Set a budget →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-primary/5 p-4">
      <p className="mb-2 text-[11px] text-muted-foreground">Monthly budget</p>
      <div className="flex items-baseline gap-1">
        <span className="numeric font-display text-xl font-semibold">
          {formatCurrency(status.spent)}
        </span>
        <span className="numeric text-xs text-muted-foreground">
          / {formatCurrency(monthlyBudget)}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-primary/10">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            status.level === "over" ? "bg-expense" : status.level === "warning" ? "bg-gold" : "bg-income",
          )}
          style={{ width: `${Math.min(100, status.percentUsed)}%` }}
        />
      </div>
      <p
        className={cn(
          "mt-2 text-[11px] font-medium",
          status.level === "over" ? "text-expense" : status.level === "warning" ? "text-gold" : "text-income",
        )}
      >
        {Math.round(status.percentUsed)}% used this month
      </p>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-primary">
        <span className="font-display text-xl font-semibold text-primary-foreground">S</span>
      </div>
      <div>
        <p className="font-display text-lg font-semibold leading-none">SmartSpend</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Personal ledger</p>
      </div>
    </div>
  );
}

export function AppShell({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card px-5 py-7 lg:flex">
          <div className="mb-10 px-2">
            <Brand />
          </div>
          <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Menu
          </p>
          <NavLinks />
          <div className="mt-auto">
            <BudgetMini />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-4 border-b border-border bg-card/60 px-5 py-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  aria-label="Open menu"
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-border lg:hidden"
                >
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-card p-5">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="mb-8 mt-2">
                    <Brand />
                  </div>
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                  <div className="mt-8">
                    <BudgetMini />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {eyebrow}
                </p>
                <h1 className="truncate font-display text-xl font-semibold sm:text-2xl">{title}</h1>
              </div>
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
          </header>

          <main className="space-y-6 px-5 py-7 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
