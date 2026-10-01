import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompact, formatCurrency } from "@/lib/format";
import type { MonthPoint } from "@/lib/stats";

export function SpendingTrendLine({ data }: { data: MonthPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            tickFormatter={(v: number) => formatCompact(v)}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            formatter={(value: number, name) => [formatCurrency(value), name as string]}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="var(--expense)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--expense)" }}
          />
          <Line
            type="monotone"
            dataKey="savings"
            name="Savings"
            stroke="var(--income)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "var(--income)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
