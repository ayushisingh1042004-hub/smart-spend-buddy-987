import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

import type { Insight } from "@/lib/insights";
import { cn } from "@/lib/utils";

const TONE = {
  warn: { icon: AlertTriangle, box: "border-gold/30 bg-gold/10", icon_: "text-gold" },
  good: { icon: CheckCircle2, box: "border-income/25 bg-income/10", icon_: "text-income" },
  info: { icon: Lightbulb, box: "border-border bg-primary/5", icon_: "text-primary" },
} as const;

export function SmartInsights({ insights, limit }: { insights: Insight[]; limit?: number }) {
  const list = limit ? insights.slice(0, limit) : insights;
  return (
    <ul className="space-y-3">
      {list.map((ins) => {
        const tone = TONE[ins.tone];
        const Icon = tone.icon;
        return (
          <li key={ins.id} className={cn("flex gap-3 rounded-xl border p-3", tone.box)}>
            <Icon className={cn("mt-0.5 size-4 shrink-0", tone.icon_)} />
            <div>
              <p className="text-sm font-medium">{ins.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{ins.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
