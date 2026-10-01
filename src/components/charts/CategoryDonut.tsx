import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { colorForCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategorySlice } from "@/lib/stats";

export function CategoryDonut({ data }: { data: CategorySlice[] }) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No expenses recorded yet for this period.
      </p>
    );
  }

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative size-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={1}
              stroke="none"
            >
              {data.map((slice) => (
                <Cell key={slice.category} fill={colorForCategory(slice.category)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name) => [formatCurrency(value), name as string]}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Total</p>
            <p className="numeric font-display text-sm font-semibold">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      <ul className="w-full flex-1 space-y-2 text-xs">
        {data.map((slice) => (
          <li key={slice.category} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: colorForCategory(slice.category) }}
              />
              <span className="truncate">{slice.category}</span>
            </span>
            <span className="numeric shrink-0 font-medium">
              {formatCurrency(slice.amount)}{" "}
              <span className="text-muted-foreground">({Math.round(slice.percent)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
