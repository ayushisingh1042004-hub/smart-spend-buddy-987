import type { Transaction } from "./types";

/**
 * SAMPLE DATA
 * -----------
 * Used only the first time the app is opened, so the dashboard and charts are
 * not empty during a demo. To ship without sample data, return [] from
 * `createSampleTransactions()` (and set SAMPLE_BUDGET to 0).
 */

export const SAMPLE_BUDGET = 25000;

/** Date `monthsAgo` months back, on the given day of month. */
function dateOf(monthsAgo: number, day: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const safeDay = Math.min(day, monthsAgo === 0 ? Math.min(now.getDate(), lastDay) : lastDay);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
}

type Seed = [monthsAgo: number, day: number, type: Transaction["type"], amount: number, category: string, description: string];

const SEEDS: Seed[] = [
  // current month
  [0, 1, "income", 28000, "Salary", "Part-time internship stipend"],
  [0, 3, "income", 6500, "Scholarship", "Merit scholarship credit"],
  [0, 2, "expense", 4200, "Food", "Hostel mess fee"],
  [0, 4, "expense", 1250, "Food", "Groceries and snacks"],
  [0, 5, "expense", 3100, "Shopping", "Winter jacket"],
  [0, 6, "expense", 760, "Transport", "Metro card recharge"],
  [0, 8, "expense", 2400, "Bills", "Electricity and internet"],
  [0, 9, "expense", 899, "Entertainment", "Streaming subscription"],
  [0, 10, "expense", 1800, "Education", "Reference books"],
  [0, 12, "expense", 650, "Healthcare", "Pharmacy"],
  // last month
  [1, 1, "income", 28000, "Salary", "Part-time internship stipend"],
  [1, 14, "income", 4500, "Freelance", "Poster design work"],
  [1, 2, "expense", 4200, "Food", "Hostel mess fee"],
  [1, 7, "expense", 2150, "Shopping", "Sneakers"],
  [1, 11, "expense", 1400, "Transport", "Cab rides"],
  [1, 15, "expense", 2300, "Bills", "Electricity and internet"],
  [1, 18, "expense", 1900, "Travel", "Weekend trip bus tickets"],
  [1, 22, "expense", 1100, "Entertainment", "Concert ticket"],
  // older months
  [2, 1, "income", 26000, "Salary", "Part-time internship stipend"],
  [2, 5, "expense", 4100, "Food", "Hostel mess fee"],
  [2, 9, "expense", 3400, "Education", "Online course"],
  [2, 16, "expense", 1250, "Transport", "Fuel"],
  [2, 20, "expense", 2600, "Shopping", "Desk lamp and stationery"],
  [3, 1, "income", 26000, "Salary", "Part-time internship stipend"],
  [3, 2, "income", 3000, "Allowance", "Family allowance"],
  [3, 6, "expense", 4000, "Food", "Hostel mess fee"],
  [3, 12, "expense", 5200, "Travel", "Train tickets home"],
  [3, 19, "expense", 1500, "Healthcare", "Dental check-up"],
  [4, 1, "income", 24000, "Salary", "Part-time internship stipend"],
  [4, 4, "expense", 3900, "Food", "Hostel mess fee"],
  [4, 10, "expense", 2100, "Entertainment", "Movies and outings"],
  [4, 21, "expense", 1750, "Bills", "Mobile recharge and internet"],
  [5, 1, "income", 24000, "Salary", "Part-time internship stipend"],
  [5, 3, "expense", 3850, "Food", "Hostel mess fee"],
  [5, 13, "expense", 2950, "Shopping", "Backpack"],
  [5, 24, "expense", 1200, "Transport", "Metro card recharge"],
];

export function createSampleTransactions(): Transaction[] {
  return SEEDS.map(([monthsAgo, day, type, amount, category, description], i) => ({
    id: `sample-${i + 1}`,
    type,
    amount,
    category,
    date: dateOf(monthsAgo, day),
    description,
  }));
}
