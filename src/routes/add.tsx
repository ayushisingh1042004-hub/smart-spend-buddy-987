import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { TransactionForm } from "@/components/TransactionForm";
import { Panel } from "@/components/TransactionRow";
import { formatCurrency } from "@/lib/format";
import { useFinance } from "@/store/finance-store";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Add Transaction — SmartSpend" },
      { name: "description", content: "Record a new income or expense in SmartSpend." },
      { property: "og:title", content: "Add Transaction — SmartSpend" },
      { property: "og:description", content: "Record a new income or expense in SmartSpend." },
    ],
  }),
  component: AddPage,
});

function AddPage() {
  const { addTransaction } = useFinance();
  const navigate = useNavigate();

  return (
    <AppShell eyebrow="New entry" title="Add transaction">
      <div className="mx-auto max-w-2xl">
        <Panel title="Transaction details" subtitle="All fields are required">
          <TransactionForm
            onSubmit={(values) => {
              addTransaction(values);
              toast.success(`${values.type === "income" ? "Income" : "Expense"} of ${formatCurrency(values.amount)} added`, {
                action: { label: "View history", onClick: () => navigate({ to: "/history" }) },
              });
            }}
          />
        </Panel>
      </div>
    </AppShell>
  );
}
