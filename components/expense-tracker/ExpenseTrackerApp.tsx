"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Car,
  CreditCard,
  HeartPulse,
  Home,
  Pencil,
  PiggyBank,
  Plus,
  ShoppingCart,
  Trash2,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import FinanceChart from "./FinanceChart";
import {
  createCategory,
  createExpense,
  deleteExpense,
  subscribeToTracker,
  updateExpense,
  type CategoryColor,
  type ExpenseCategory,
  type ExpenseDraft,
  type ExpenseRecord,
  type ExpenseType,
} from "@/lib/firebase/expenseTracker";
import { cn } from "@/lib/utils";

const categoryColorClasses: Record<CategoryColor, string> = {
  violet: "bg-violet-500/15 text-violet-200 ring-violet-400/20",
  emerald: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/20",
  cyan: "bg-cyan-500/15 text-cyan-200 ring-cyan-400/20",
  amber: "bg-amber-500/15 text-amber-200 ring-amber-400/20",
  rose: "bg-rose-500/15 text-rose-200 ring-rose-400/20",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-200 ring-fuchsia-400/20",
};

const categoryIconMap = {
  Home,
  ShoppingCart,
  Car,
  UtensilsCrossed,
  HeartPulse,
  Wallet,
  CreditCard,
  PiggyBank,
} as const;

const categoryIcons = Object.keys(categoryIconMap) as Array<
  keyof typeof categoryIconMap
>;
const categoryColors = Object.keys(categoryColorClasses) as CategoryColor[];

const initialExpenseDraft = (
  categoryId = "",
  type: ExpenseType = "expense",
): ExpenseDraft => ({
  title: "",
  amount: 0,
  type,
  categoryId,
  date: new Date().toISOString().slice(0, 10),
  note: "",
});

const initialCategoryDraft = {
  name: "",
  color: "violet" as CategoryColor,
  icon: "CreditCard",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatAmount(value: number) {
  return currencyFormatter.format(value || 0);
}

function getCategoryMeta(category: ExpenseCategory | undefined) {
  const Icon = category
    ? categoryIconMap[category.icon as keyof typeof categoryIconMap] ?? CreditCard
    : CreditCard;

  return {
    Icon,
    colorClass: category ? categoryColorClasses[category.color] : categoryColorClasses.violet,
  };
}

export default function ExpenseTrackerApp() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | ExpenseType>("all");
  const [selectedRange, setSelectedRange] = useState<"30" | "90" | "365">("30");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expenseDraft, setExpenseDraft] = useState<ExpenseDraft>(initialExpenseDraft());
  const [categoryDraft, setCategoryDraft] = useState(initialCategoryDraft);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    subscribeToTracker(
      ({ categories: nextCategories, expenses: nextExpenses }) => {
        setCategories(nextCategories);
        setExpenses(nextExpenses);
        setIsLoading(false);

        setExpenseDraft((current) => {
          if (current.categoryId || !nextCategories[0]) return current;
          return { ...current, categoryId: nextCategories[0].id };
        });
      },
      (error) => {
        setIsLoading(false);
        toast.error("Could not load your expense tracker.", {
          description:
            error.message === "permission-denied"
              ? "Check your Firestore rules."
              : "Please confirm your Firebase project is configured correctly.",
        });
      },
    )
      .then((cleanup) => {
        unsubscribe = cleanup;
      })
      .catch((error: Error) => {
        setIsLoading(false);
        toast.error("Could not connect to Firebase.", {
          description: error.message,
        });
      });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    const days = Number(selectedRange);
    const earliest = new Date();
    earliest.setDate(earliest.getDate() - days);

    return expenses.filter((expense) => {
      const matchesCategory =
        selectedCategory === "all" || expense.categoryId === selectedCategory;
      const matchesType = selectedType === "all" || expense.type === selectedType;
      const matchesRange = new Date(expense.date) >= earliest;

      return matchesCategory && matchesType && matchesRange;
    });
  }, [expenses, selectedCategory, selectedType, selectedRange]);

  const metrics = useMemo(() => {
    const income = filteredExpenses
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const outflow = filteredExpenses
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    const balance = income - outflow;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

    return {
      income,
      outflow,
      balance,
      savingsRate,
      transactionCount: filteredExpenses.length,
    };
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    const monthMap = new Map<string, { label: string; income: number; expense: number }>();

    expenses
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((expense) => {
        const month = new Date(expense.date).toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        });

        if (!monthMap.has(month)) {
          monthMap.set(month, { label: month, income: 0, expense: 0 });
        }

        const entry = monthMap.get(month);
        if (!entry) return;

        if (expense.type === "income") {
          entry.income += expense.amount;
        } else {
          entry.expense += expense.amount;
        }
      });

    return Array.from(monthMap.values()).slice(-6);
  }, [expenses]);

  const topCategories = useMemo(() => {
    const totals = new Map<string, number>();

    filteredExpenses
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        totals.set(item.categoryId, (totals.get(item.categoryId) ?? 0) + item.amount);
      });

    return categories
      .map((category) => ({
        category,
        total: totals.get(category.id) ?? 0,
      }))
      .filter((entry) => entry.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [categories, filteredExpenses]);

  const resetExpenseForm = () => {
    setEditingExpenseId(null);
    setExpenseDraft(initialExpenseDraft(categories[0]?.id ?? "", "expense"));
  };

  const handleExpenseSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!expenseDraft.title.trim() || !expenseDraft.categoryId || !expenseDraft.date) {
      toast.error("Fill in the title, category, and date.");
      return;
    }

    if (!expenseDraft.amount || expenseDraft.amount <= 0) {
      toast.error("Amount must be greater than zero.");
      return;
    }

    setIsSavingExpense(true);

    try {
      if (editingExpenseId) {
        await updateExpense(editingExpenseId, expenseDraft);
        toast.success("Transaction updated.");
      } else {
        await createExpense(expenseDraft);
        toast.success("Transaction added.");
      }

      resetExpenseForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Could not save the transaction.", { description: message });
    } finally {
      setIsSavingExpense(false);
    }
  };

  const handleEditExpense = (expense: ExpenseRecord) => {
    setEditingExpenseId(expense.id);
    setExpenseDraft({
      title: expense.title,
      amount: expense.amount,
      type: expense.type,
      categoryId: expense.categoryId,
      date: expense.date,
      note: expense.note ?? "",
    });
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast.success("Transaction removed.");

      if (editingExpenseId === id) {
        resetExpenseForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Could not delete the transaction.", { description: message });
    }
  };

  const handleCategorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryDraft.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSavingCategory(true);

    try {
      await createCategory(categoryDraft);
      toast.success("Category created.");
      setCategoryDraft(initialCategoryDraft);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Could not create category.", { description: message });
    } finally {
      setIsSavingCategory(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-28 sm:px-6 lg:px-8">
      <section className="expense-shell relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-linear-to-r from-primary/20 via-cyan-400/10 to-transparent blur-3xl"
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-[0.24em] text-text-secondary uppercase">
              Personal Finance OS
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Premium expense tracking that feels like a real product.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Track spend, monitor savings, and keep every transaction in one
              calm, premium dashboard with live Firebase persistence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label="Balance"
              value={formatAmount(metrics.balance)}
              hint={metrics.balance >= 0 ? "Healthy runway" : "Review fixed costs"}
              icon={<Wallet className="h-4 w-4" />}
            />
            <MetricCard
              label="Income"
              value={formatAmount(metrics.income)}
              hint="Cash in"
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
            <MetricCard
              label="Expenses"
              value={formatAmount(metrics.outflow)}
              hint="Cash out"
              icon={<ArrowDownRight className="h-4 w-4" />}
            />
            <MetricCard
              label="Savings"
              value={`${metrics.savingsRate}%`}
              hint={`${metrics.transactionCount} transactions`}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <Panel className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Monthly cashflow
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                Income vs expenses
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["30", "90", "365"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedRange(range)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    selectedRange === range
                      ? "border-primary/40 bg-primary/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-text-secondary hover:text-white",
                  )}
                >
                  {range === "30" ? "30 days" : range === "90" ? "90 days" : "1 year"}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <FinanceChart data={chartData} currencyFormatter={currencyFormatter} />
          ) : (
            <EmptyState
              title="No trend line yet"
              description="Add your first income or expense to unlock monthly analytics."
            />
          )}
        </Panel>

        <Panel className="p-6">
          <p className="text-sm font-medium text-text-secondary">Top categories</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Where your money goes
          </h2>

          <div className="mt-6 space-y-4">
            {topCategories.length > 0 ? (
              topCategories.map(({ category, total }) => {
                const { Icon, colorClass } = getCategoryMeta(category);

                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
                          colorClass,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{category.name}</div>
                        <div className="text-sm text-text-secondary">
                          {filteredExpenses.filter(
                            (item) =>
                              item.categoryId === category.id && item.type === "expense",
                          ).length}{" "}
                          transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {formatAmount(total)}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-text-muted">
                        spent
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="Category insights will appear here"
                description="The dashboard starts surfacing your highest spend buckets as soon as you add expenses."
              />
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Transactions
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                Recent activity
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="expense-input min-w-[140px] bg-white/[0.03]"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(event.target.value as "all" | ExpenseType)
                }
                className="expense-input min-w-[120px] bg-white/[0.03]"
              >
                <option value="all">All types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/8">
            <div className="grid grid-cols-[1.5fr_0.9fr_0.7fr_0.8fr] gap-3 border-b border-white/8 bg-white/[0.04] px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              <span>Transaction</span>
              <span>Category</span>
              <span>Amount</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-white/6">
              {isLoading ? (
                <div className="px-4 py-10 text-sm text-text-secondary">
                  Loading your data...
                </div>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => {
                  const category = categories.find(
                    (item) => item.id === expense.categoryId,
                  );
                  const { Icon, colorClass } = getCategoryMeta(category);

                  return (
                    <div
                      key={expense.id}
                      className="grid grid-cols-[1.5fr_0.9fr_0.7fr_0.8fr] gap-3 px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
                            colorClass,
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{expense.title}</div>
                          <div className="text-sm text-text-secondary">
                            {new Date(expense.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {expense.note ? ` • ${expense.note}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-sm text-text-secondary">
                          {category?.name ?? "Uncategorized"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={cn(
                            "font-semibold",
                            expense.type === "income"
                              ? "text-emerald-300"
                              : "text-white",
                          )}
                        >
                          {expense.type === "income" ? "+" : "-"}
                          {formatAmount(expense.amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditExpense(expense)}
                          className="rounded-full border border-white/10 p-2 text-text-secondary transition-colors hover:text-white"
                          aria-label="Edit transaction"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="rounded-full border border-white/10 p-2 text-text-secondary transition-colors hover:text-rose-300"
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  title="No transactions match these filters"
                  description="Try another range or add a new transaction from the form on the right."
                  className="border-0 rounded-none"
                />
              )}
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  Quick add
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {editingExpenseId ? "Edit transaction" : "Add transaction"}
                </h2>
              </div>
              {editingExpenseId ? (
                <button
                  type="button"
                  onClick={resetExpenseForm}
                  className="text-sm text-text-secondary transition-colors hover:text-white"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <form className="space-y-4" onSubmit={handleExpenseSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Title</span>
                  <input
                    className="expense-input"
                    placeholder="Monthly salary"
                    value={expenseDraft.title}
                    onChange={(event) =>
                      setExpenseDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="expense-input"
                    value={expenseDraft.amount || ""}
                    onChange={(event) =>
                      setExpenseDraft((current) => ({
                        ...current,
                        amount: Number(event.target.value),
                      }))
                    }
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Type</span>
                  <select
                    className="expense-input"
                    value={expenseDraft.type}
                    onChange={(event) =>
                      setExpenseDraft((current) => ({
                        ...current,
                        type: event.target.value as ExpenseType,
                      }))
                    }
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Category</span>
                  <select
                    className="expense-input"
                    value={expenseDraft.categoryId}
                    onChange={(event) =>
                      setExpenseDraft((current) => ({
                        ...current,
                        categoryId: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Date</span>
                  <input
                    type="date"
                    className="expense-input"
                    value={expenseDraft.date}
                    onChange={(event) =>
                      setExpenseDraft((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Note</span>
                  <input
                    className="expense-input"
                    placeholder="Optional"
                    value={expenseDraft.note ?? ""}
                    onChange={(event) =>
                      setExpenseDraft((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSavingExpense}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary via-[#5f74ff] to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_44px_rgba(88,105,255,0.4)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {isSavingExpense
                  ? "Saving..."
                  : editingExpenseId
                    ? "Update transaction"
                    : "Add transaction"}
              </button>
            </form>
          </Panel>

          <Panel className="p-6">
            <div className="mb-5">
              <p className="text-sm font-medium text-text-secondary">
                Categories
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                Add a custom category
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleCategorySubmit}>
              <label className="space-y-2 text-sm">
                <span className="text-text-secondary">Category name</span>
                <input
                  className="expense-input"
                  placeholder="Freelance"
                  value={categoryDraft.name}
                  onChange={(event) =>
                    setCategoryDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Color</span>
                  <select
                    className="expense-input"
                    value={categoryDraft.color}
                    onChange={(event) =>
                      setCategoryDraft((current) => ({
                        ...current,
                        color: event.target.value as CategoryColor,
                      }))
                    }
                  >
                    {categoryColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-text-secondary">Icon</span>
                  <select
                    className="expense-input"
                    value={categoryDraft.icon}
                    onChange={(event) =>
                      setCategoryDraft((current) => ({
                        ...current,
                        icon: event.target.value,
                      }))
                    }
                  >
                    {categoryIcons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSavingCategory}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingCategory ? "Saving category..." : "Create category"}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => {
                const { Icon, colorClass } = getCategoryMeta(category);

                return (
                  <div
                    key={category.id}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ring-1",
                      colorClass,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/8 bg-white/[0.025] shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white">
        {icon}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-text-muted">
        {hint}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-dashed border-white/12 bg-white/[0.02] px-5 py-8 text-center",
        className,
      )}
    >
      <div className="text-base font-medium text-white">{title}</div>
      <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
        {description}
      </div>
    </div>
  );
}
