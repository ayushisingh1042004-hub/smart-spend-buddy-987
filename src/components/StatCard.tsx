import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  hintTone = "muted",
  icon: Icon,
  featured = false,
}: {
  label: string;
  value: string;
  hint?: string | undefined;
  hintTone?: "muted" | "income" | "expense" | "gold";
  icon?: LucideIcon;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 transition-shadow hover:shadow-sm",
        featured ? "bg-primary text-primary-foreground" : "border border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-xs font-medium",
            featured ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {Icon ? (
          <Icon
            className={cn(
              "size-4 shrink-0",
              featured ? "text-primary-foreground/60" : "text-muted-foreground",
            )}
          />
        ) : null}
      </div>
      <p className="numeric mt-2 font-display text-2xl font-semibold sm:text-3xl">{value}</p>
      {hint ? (
        <p
          className={cn(
            "mt-1 text-xs",
            featured && "text-primary-foreground/70",
            !featured && hintTone === "muted" && "text-muted-foreground",
            !featured && hintTone === "income" && "font-medium text-income",
            !featured && hintTone === "expense" && "font-medium text-expense",
            !featured && hintTone === "gold" && "font-medium text-gold",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
