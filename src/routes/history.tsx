import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { TransactionForm } from "@/components/TransactionForm";
import { EmptyState, LoadingGrid, Panel, TransactionRow } from "@/components/TransactionRow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_CATEGORIES } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { useFinance, useSortedTransactions } from "@/store/finance-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Transaction History — SmartSpend" },
      { name: "description", content: "Search, filter, edit and delete all your transactions." },
      { property: "og:title", content: "Transaction History — SmartSpend" },
      { property: "og:description", content: "Search, filter, edit and delete all your transactions." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { loading, updateTransaction, deleteTransaction } = useFinance();
  const sorted = useSortedTransactions();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category !== "all" && t.category !== category) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (q && !`${t.description} ${t.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sorted, query, type, category, from, to]);

  const hasFilters = query || type !== "all" || category !== "all" || from || to;

  function clearFilters() {
    setQuery("");
    setType("all");
    setCategory("all");
    setFrom("");
    setTo("");
  }

  return (
    <AppShell
      eyebrow="Ledger"
      title="Transaction history"
      actions={<Button asChild><Link to="/add">Add transaction</Link></Button>}
    >
      <Panel title="Filters">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="search" className="pl-9" placeholder="Description or category" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger aria-label="Type filter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger aria-label="Category filter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {ALL_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>
        {hasFilters ? (
          <button onClick={clearFilters} className="mt-3 text-xs font-medium text-primary hover:underline">
            Clear filters
          </button>
        ) : null}
      </Panel>

      <Panel title="All transactions" subtitle={`${filtered.length} of ${sorted.length} shown`}>
        {loading ? (
          <LoadingGrid />
        ) : sorted.length === 0 ? (
          <EmptyState title="No transactions yet" detail="Your ledger is empty. Add your first entry to get started." action={<Button asChild><Link to="/add">Add transaction</Link></Button>} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matches" detail="No transactions match these filters." action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>} />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                actions={
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" aria-label="Edit transaction" onClick={() => setEditing(tx)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Delete transaction" onClick={() => setDeleting(tx)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </Panel>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Edit transaction</DialogTitle>
          </DialogHeader>
          {editing ? (
            <TransactionForm
              initial={editing}
              submitLabel="Save changes"
              onCancel={() => setEditing(null)}
              onSubmit={(values) => {
                updateTransaction(editing.id, values);
                setEditing(null);
                toast.success("Transaction updated");
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting ? `"${deleting.description}" (${formatCurrency(deleting.amount)}) will be permanently removed.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleting) deleteTransaction(deleting.id);
                setDeleting(null);
                toast.success("Transaction deleted");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
