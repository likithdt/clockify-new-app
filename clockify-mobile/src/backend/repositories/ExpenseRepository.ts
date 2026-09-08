import type { Expense } from "../types.ts";

export interface IExpenseRepository {
  getAll(): Promise<Expense[]>;
  create(data: Omit<Expense, "id">): Promise<Expense>;
  delete(id: string): Promise<boolean>;
}

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    amount: 45.5,
    currency: "USD",
    category: "Travel",
    projectName: "[SAMPLE] Project Alpha",
    projectColor: "#ff9800",
    date: new Date().toISOString(),
    isBillable: true,
    notes: "Taxi to client office",
  },
];

export class ExpenseRepository implements IExpenseRepository {
  private expenses: Expense[] = [...INITIAL_EXPENSES];

  async getAll(): Promise<Expense[]> {
    return [...this.expenses];
  }

  async create(data: Omit<Expense, "id">): Promise<Expense> {
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      ...data,
    };
    this.expenses.unshift(expense);
    return expense;
  }

  async delete(id: string): Promise<boolean> {
    const prev = this.expenses.length;
    this.expenses = this.expenses.filter((e) => e.id !== id);
    return this.expenses.length < prev;
  }
}

export const expenseRepository = new ExpenseRepository();
