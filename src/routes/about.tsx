import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/TransactionRow";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/store/finance-store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SmartSpend" },
      { name: "description", content: "About the SmartSpend personal expense and budget management project." },
      { property: "og:title", content: "About — SmartSpend" },
      { property: "og:description", content: "About the SmartSpend personal expense and budget management project." },
    ],
  }),
  component: AboutPage,
});

const OBJECTIVES = [
  "Record income and expenses quickly with proper validation.",
  "Help users set and stick to a monthly budget.",
  "Visualise spending patterns with clear charts.",
  "Give simple, rule-based suggestions to improve savings.",
  "Keep data persistent across sessions.",
];

const FEATURES = [
  "Dashboard with income, expenses, balance, budget and savings",
  "Add, edit and delete transactions",
  "Transaction history with search and filters",
  "Monthly budget tracking with warnings",
  "Analytics: donut, bar and line charts",
  "Rule-based Smart Insights",
  "Responsive layout for desktop and mobile",
];

const TECH = [
  ["React 19 + TypeScript", "Component-based user interface"],
  ["TanStack Router / Start", "File-based page routing"],
  ["Tailwind CSS", "Styling with a design-token system"],
  ["Recharts", "Charts and data visualisation"],
  ["Browser localStorage", "Persistent data storage"],
];

function AboutPage() {
  const { resetToSampleData, clearAllData } = useFinance();

  return (
    <AppShell eyebrow="Project" title="About SmartSpend">
      <section className="rounded-2xl bg-primary p-8 text-primary-foreground">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/70">BTech CSE Project</p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          SmartSpend – Personal Expense &amp; Budget Management System
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80">
          A personal finance management web application designed to help users track income and expenses,
          manage budgets and understand their spending patterns.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Problem statement">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Students and young earners often lose track of where their money goes. Without a simple record of
            daily spending, it is hard to plan a budget, notice overspending early or build savings. Existing
            tools can be complex or overloaded with features. SmartSpend offers a focused, easy-to-use way to
            record transactions, set a monthly budget and see spending patterns clearly.
          </p>
        </Panel>
        <Panel title="Objectives">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {OBJECTIVES.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </Panel>
        <Panel title="Key features">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {FEATURES.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </Panel>
        <Panel title="Technology used">
          <dl className="divide-y divide-border text-sm">
            {TECH.map(([name, use]) => (
              <div key={name} className="flex justify-between gap-4 py-2">
                <dt className="font-medium">{name}</dt>
                <dd className="text-right text-muted-foreground">{use}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </section>

      <Panel title="Demo data" subtitle="Useful before a presentation">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { resetToSampleData(); toast.success("Sample data restored"); }}>
            Restore sample data
          </Button>
          <Button variant="outline" onClick={() => { clearAllData(); toast.success("All data cleared"); }}>
            Start with empty data
          </Button>
        </div>
      </Panel>
    </AppShell>
  );
}
