// types/index.ts

export interface Transaction {
  merchant: string;
  amount: number;
  date: string;
  description: string;
  transaction_type: "debit" | "credit";  // Only these two values allowed
}

export interface ProcessedStatement {
  transactions: Transaction[];
  total_spent: number;
  transaction_count: number;
  date_range: string | null;
}

export interface MerchantGroup {
  merchant: string;
  transactions: Transaction[];
  total: number;          
  count: number;          
}

export type SortField = "merchant" | "amount" | "date";
export type SortDirection = "asc" | "desc";