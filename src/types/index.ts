export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Bucket {
  id: string;
  workspace_id: string;
  name: string;
  allocation_percentage: number;
  current_balance: number;
  is_default: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  currency: string;
  total_balance?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string | Date;
  description?: string;
  bucket_id?: string;
  workspace_id: string;
}