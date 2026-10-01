import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompact, formatCurrency } from "@/lib/format";
import type { MonthPoint } from "@/lib/stats";

export function IncomeExpenseBar({ data }: { data: MonthPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
          <Legend iconType="square" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="income" name="Income" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Bar dataKey="expenses" name="Expense" fill="var(--gold)" radius={[4, 4, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
