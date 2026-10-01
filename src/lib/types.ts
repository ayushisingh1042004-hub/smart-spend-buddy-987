/** Core domain types for SmartSpend. */

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Positive amount in rupees. */
  amount: number;
  category: string;
  /** ISO date string, e.g. "2026-04-12". */
  date: string;
  description: string;
}

export interface AppData {
  transactions: Transaction[];
  /** Monthly spending budget in rupees. */
  monthlyBudget: number;
}
