import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categoriesFor } from "@/lib/categories";
import { todayISO } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

type FormValues = Omit<Transaction, "id">;
type Errors = Partial<Record<"amount" | "category" | "date" | "description", string>>;

/** Validation rules for a transaction. Returns an empty object when valid. */
function validate(type: TransactionType, amount: string, category: string, date: string, description: string): Errors {
  const errors: Errors = {};
  const n = Number(amount);
  if (!amount.trim()) errors.amount = "Amount is required.";
  else if (Number.isNaN(n) || n <= 0) errors.amount = "Enter an amount greater than 0.";
  else if (n > 10000000) errors.amount = "Amount looks too large.";
  if (!category || !categoriesFor(type).includes(category)) errors.category = "Choose a category.";
  if (!date) errors.date = "Date is required.";
  else if (date > todayISO()) errors.date = "Date cannot be in the future.";
  if (!description.trim()) errors.description = "Add a short description.";
  else if (description.trim().length > 120) errors.description = "Keep it under 120 characters.";
  return errors;
}

export function TransactionForm({
  initial,
  submitLabel = "Add transaction",
  onSubmit,
  onCancel,
}: {
  initial?: FormValues;
  submitLabel?: string;
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
}) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function changeType(next: TransactionType) {
    setType(next);
    if (!categoriesFor(next).includes(category)) setCategory("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(type, amount, category, date, description);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ type, amount: Number(amount), category, date, description: description.trim() });
    if (!initial) {
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(todayISO());
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label>Transaction type</Label>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => changeType(t)}
              className={cn(
                "rounded-lg py-2 text-sm font-medium capitalize transition-colors",
                type === t
                  ? t === "income"
                    ? "bg-card text-income shadow-sm"
                    : "bg-card text-expense shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            inputMode="decimal"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!!errors.amount}
          />
          {errors.amount ? <p className="text-xs text-destructive">{errors.amount}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" aria-invalid={!!errors.category}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesFor(type).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? <p className="text-xs text-destructive">{errors.category}</p> : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            max={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
          />
          {errors.date ? <p className="text-xs text-destructive">{errors.date}</p> : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="e.g. Groceries for the week"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={!!errors.description}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
