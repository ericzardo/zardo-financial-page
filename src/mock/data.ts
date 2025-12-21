import { Transaction, Bucket, Workspace, User } from "@/types";

export const mockUser: User = {
  id: "1",
  name: "Zardo Developer",
  email: "dev@zardo.dev",
  avatar: "",
};

export const mockWorkspaces: Workspace[] = [
  { 
    id: "1",
    name: "Principal", 
    currency: "BRL", 
  },
  { 
    id: "2", 
    name: "Investimentos", 
    currency: "USD", 
  },
];

export const mockBuckets: Bucket[] = [
  { 
    id: "1", 
    workspace_id: "1", 
    name: "Despesas Fixas", 
    allocation_percentage: 50,
    current_balance: 2000,
    is_default: true
  },
  { 
    id: "2", 
    workspace_id: "1", 
    name: "Lazer", 
    allocation_percentage: 30, 
    current_balance: 500 ,
    is_default: false
  },
  { 
    id: "3", 
    workspace_id: "1", 
    name: "Investimentos", 
    allocation_percentage: 20, 
    current_balance: 1000,
    is_default: false
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    amount: 5000,
    type: "INCOME",
    date: "2024-03-10T10:00:00",
    description: "Salário Mensal",
    workspace_id: "1",
    bucket_id: "1"
  },
  {
    id: "t2",
    amount: 150,
    type: "EXPENSE",
    date: "2024-03-12T14:30:00",
    description: "Supermercado",
    workspace_id: "1",
    bucket_id: "1"
  },
  {
    id: "t3",
    amount: 89.90,
    type: "EXPENSE",
    date: "2024-03-15T19:00:00",
    description: "Assinatura Netflix/Spotify",
    workspace_id: "1",
    bucket_id: "2"
  },
  {
    id: "t4",
    amount: 1200,
    type: "INCOME",
    date: "2024-03-20T09:00:00",
    description: "Freelance Projeto X",
    workspace_id: "1"
  },
  {
    id: "t5",
    amount: 500,
    type: "INCOME",
    date: "2024-03-05T10:00:00",
    description: "Dividendos Apple",
    workspace_id: "2"
  }
];