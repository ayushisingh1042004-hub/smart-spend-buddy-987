import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { createSampleTransactions, SAMPLE_BUDGET } from "@/lib/sample-data";
import type { AppData, Transaction } from "@/lib/types";

/**
 * Persistent storage layer.
 *
 * Transactions and the monthly budget are kept in the browser's localStorage,
 * so a page refresh never loses data. All reads/writes go through this single
 * provider, which keeps the rest of the app free of storage details.
 */

const STORAGE_KEY = "smartspend.data.v1";

interface FinanceContextValue extends AppData {
  loading: boolean;
  error: string | null;
  addTransaction: (input: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, input: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  setMonthlyBudget: (amount: number) => void;
  resetToSampleData: () => void;
  clearAllData: () => void;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

function defaultData(): AppData {
  return { transactions: createSampleTransactions(), monthlyBudget: SAMPLE_BUDGET };
}

function readStorage(): AppData {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultData();
  const parsed = JSON.parse(raw) as Partial<AppData>;
  return {
    transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    monthlyBudget: typeof parsed.monthlyBudget === "number" ? parsed.monthlyBudget : 0,
  };
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ transactions: [], monthlyBudget: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load once on the client (localStorage is not available during SSR).
  useEffect(() => {
    try {
      setData(readStorage());
    } catch {
      setError("We couldn't read your saved data, so we started with a fresh set.");
      setData(defaultData());
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist on every change after the initial load.
  useEffect(() => {
    if (loading) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setError("Your changes could not be saved on this device.");
    }
  }, [data, loading]);

  const addTransaction = useCallback((input: Omit<Transaction, "id">) => {
    setData((prev) => ({
      ...prev,
      transactions: [{ ...input, id: crypto.randomUUID() }, ...prev.transactions],
    }));
  }, []);

  const updateTransaction = useCallback((id: string, input: Omit<Transaction, "id">) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...input, id } : t)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const setMonthlyBudget = useCallback((amount: number) => {
    setData((prev) => ({ ...prev, monthlyBudget: Math.max(0, amount) }));
  }, []);

  const resetToSampleData = useCallback(() => setData(defaultData()), []);
  const clearAllData = useCallback(() => setData({ transactions: [], monthlyBudget: 0 }), []);

  const value = useMemo<FinanceContextValue>(
    () => ({
      ...data,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setMonthlyBudget,
      resetToSampleData,
      clearAllData,
    }),
    [
      data,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setMonthlyBudget,
      resetToSampleData,
      clearAllData,
    ],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside <FinanceProvider>");
  return ctx;
}

/** Transactions sorted newest first. */
export function useSortedTransactions() {
  const { transactions } = useFinance();
  return useMemo(
    () => [...transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [transactions],
  );
}
