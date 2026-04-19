"use client";

import { signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "./client";

export type CategoryColor =
  | "violet"
  | "emerald"
  | "cyan"
  | "amber"
  | "rose"
  | "fuchsia";

export type ExpenseCategory = {
  id: string;
  name: string;
  color: CategoryColor;
  icon: string;
  createdAt?: unknown;
};

export type ExpenseType = "expense" | "income";

export type ExpenseRecord = {
  id: string;
  title: string;
  amount: number;
  type: ExpenseType;
  categoryId: string;
  date: string;
  note: string | null;
  createdAt?: unknown;
};

export type ExpenseDraft = Omit<ExpenseRecord, "id" | "createdAt">;
export type CategoryDraft = Omit<ExpenseCategory, "id" | "createdAt">;

type TrackerSnapshot = {
  categories: ExpenseCategory[];
  expenses: ExpenseRecord[];
};

const DEFAULT_CATEGORIES: CategoryDraft[] = [
  { name: "Housing", color: "violet", icon: "Home" },
  { name: "Groceries", color: "emerald", icon: "ShoppingCart" },
  { name: "Transport", color: "cyan", icon: "Car" },
  { name: "Food", color: "amber", icon: "UtensilsCrossed" },
  { name: "Wellness", color: "rose", icon: "HeartPulse" },
  { name: "Salary", color: "fuchsia", icon: "Wallet" },
];

let signingIn: Promise<string> | null = null;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  code: string,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(code)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  }) as Promise<T>;
}

async function ensureAuthed(): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }

  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  signingIn =
    signingIn ??
    signInAnonymously(auth).then((credential) => {
      signingIn = null;
      return credential.user.uid;
    });

  return withTimeout(signingIn, 12_000, "FIREBASE_AUTH_TIMEOUT");
}

function getUserDoc(userId: string) {
  return doc(getFirebaseDb(), "users", userId);
}

function getCategoriesCollection(userId: string) {
  return collection(getUserDoc(userId), "categories");
}

function getExpensesCollection(userId: string) {
  return collection(getUserDoc(userId), "expenses");
}

function mapCategory(docSnap: QueryDocumentSnapshot): ExpenseCategory {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    name: String(data.name ?? ""),
    color: (data.color ?? "violet") as CategoryColor,
    icon: String(data.icon ?? "Wallet"),
    createdAt: data.createdAt,
  };
}

function mapExpense(docSnap: QueryDocumentSnapshot): ExpenseRecord {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    title: String(data.title ?? ""),
    amount: Number(data.amount ?? 0),
    type: (data.type ?? "expense") as ExpenseType,
    categoryId: String(data.categoryId ?? ""),
    date: String(data.date ?? ""),
    note: typeof data.note === "string" ? data.note : null,
    createdAt: data.createdAt,
  };
}

export async function ensureTrackerReady() {
  const userId = await ensureAuthed();
  const db = getFirebaseDb();

  await withTimeout(
    setDoc(
      getUserDoc(userId),
      {
        seedVersion: 1,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
    12_000,
    "FIREBASE_WRITE_TIMEOUT",
  );

  const existingCategories = await withTimeout(
    getDocs(query(getCategoriesCollection(userId), limit(1))),
    12_000,
    "FIREBASE_READ_TIMEOUT",
  );

  if (existingCategories.empty) {
    const batch = writeBatch(db);

    for (const category of DEFAULT_CATEGORIES) {
      const categoryRef = doc(getCategoriesCollection(userId));
      batch.set(categoryRef, {
        ...category,
        createdAt: serverTimestamp(),
      });
    }

    await withTimeout(batch.commit(), 12_000, "FIREBASE_WRITE_TIMEOUT");
  }

  return userId;
}

export async function subscribeToTracker(
  onData: (snapshot: TrackerSnapshot) => void,
  onError: (error: Error) => void,
) {
  const userId = await ensureTrackerReady();

  const categoriesQuery = query(
    getCategoriesCollection(userId),
    orderBy("createdAt", "asc"),
  );
  const expensesQuery = query(
    getExpensesCollection(userId),
    orderBy("date", "desc"),
    orderBy("createdAt", "desc"),
  );

  let categories: ExpenseCategory[] = [];
  let expenses: ExpenseRecord[] = [];

  const publish = () => {
    onData({ categories, expenses });
  };

  const unsubscribeCategories = onSnapshot(
    categoriesQuery,
    (snapshot) => {
      categories = snapshot.docs.map(mapCategory);
      publish();
    },
    (error) => onError(error as Error),
  );

  const unsubscribeExpenses = onSnapshot(
    expensesQuery,
    (snapshot) => {
      expenses = snapshot.docs.map(mapExpense);
      publish();
    },
    (error) => onError(error as Error),
  );

  return () => {
    unsubscribeCategories();
    unsubscribeExpenses();
  };
}

export async function createCategory(input: CategoryDraft) {
  const userId = await ensureTrackerReady();

  await withTimeout(
    addDoc(getCategoriesCollection(userId), {
      ...input,
      createdAt: serverTimestamp(),
    }),
    12_000,
    "FIREBASE_WRITE_TIMEOUT",
  );
}

export async function createExpense(input: ExpenseDraft) {
  const userId = await ensureTrackerReady();

  await withTimeout(
    addDoc(getExpensesCollection(userId), {
      ...input,
      note: input.note?.trim() || null,
      createdAt: serverTimestamp(),
    }),
    12_000,
    "FIREBASE_WRITE_TIMEOUT",
  );
}

export async function updateExpense(id: string, input: ExpenseDraft) {
  const userId = await ensureTrackerReady();

  await withTimeout(
    updateDoc(doc(getExpensesCollection(userId), id), {
      ...input,
      note: input.note?.trim() || null,
      updatedAt: serverTimestamp(),
    }),
    12_000,
    "FIREBASE_WRITE_TIMEOUT",
  );
}

export async function deleteExpense(id: string) {
  const userId = await ensureTrackerReady();

  await withTimeout(
    deleteDoc(doc(getExpensesCollection(userId), id)),
    12_000,
    "FIREBASE_WRITE_TIMEOUT",
  );
}
