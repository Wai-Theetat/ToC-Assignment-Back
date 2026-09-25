"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TransactionItem from "@/components/TransactionItem";
import { API_URL, getErrorMessage } from "@/lib/api";

type ApiTransaction = {
  credit_card: string;
  old_money: number;
  updated_money: number;
  transaction_amount: number;
  status: string;
  created_at: string;
};

export default function TransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) { router.push("/Login"); return; }

    void (async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}/history`);
        const data: unknown = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          setError(getErrorMessage(data, "We could not load transaction activity."));
          return;
        }
        const valid = (data as unknown[]).filter(isApiTransaction);
        setTransactions(valid.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch {
        setError("We could not reach the activity service. Try again shortly.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const depositCount = transactions.filter((t) => t.status === "deposit").length;
  const withdrawCount = transactions.filter((t) => t.status === "withdraw").length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-white px-5 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <header className="flex flex-col justify-between gap-6 border-b border-[#e0ebe5] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Account activity</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0d1f1c] sm:text-4xl">
                Transaction history.
              </h1>
              <p className="mt-3 text-[0.9375rem] text-[#52716a]">
                Every movement is shown with a masked card reference for safer review.
              </p>
            </div>
            {!loading && (
              <div className="flex gap-2 self-start sm:self-auto">
                <span className="badge badge-green">{depositCount} deposit{depositCount !== 1 ? "s" : ""}</span>
                <span className="badge badge-neutral">{withdrawCount} withdrawal{withdrawCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </header>

          {error && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-5 py-4">
              <p className="text-sm text-[#c0392b]">{error}</p>
            </div>
          )}

          {loading && <LoadingHistory />}
          {!loading && !error && transactions.length === 0 && <EmptyHistory />}

          {!loading && !error && transactions.length > 0 && (
            <section className="mt-8 space-y-3">
              {transactions.map((t, i) => {
                const date = new Date(t.created_at);
                return (
                  <TransactionItem
                    key={`${t.created_at}-${i}`}
                    transaction={{
                      id: String(i),
                      type: t.status === "withdraw" ? "withdraw" : "deposit",
                      amount: Math.abs(t.transaction_amount),
                      cardNumber: t.credit_card,
                      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                    }}
                  />
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function isApiTransaction(value: unknown): value is ApiTransaction {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ApiTransaction>;
  return (
    (item.status === "deposit" || item.status === "withdraw") &&
    typeof item.credit_card === "string" &&
    typeof item.transaction_amount === "number" &&
    typeof item.created_at === "string"
  );
}

function LoadingHistory() {
  return (
    <div className="mt-10 card p-12 text-center">
      <svg className="mx-auto h-8 w-8 animate-spin text-[#147a60]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="mt-4 text-sm font-medium text-[#7a9790]">Loading activity…</p>
    </div>
  );
}

function EmptyHistory() {
  return (
    <section className="mt-10 card border-dashed p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e2f5ec] text-[#147a60]">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 3v3m12-3v3M4.5 9.5h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 6 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="mt-5 text-lg font-bold tracking-tight text-[#0d1f1c]">No transactions yet.</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-[#52716a]">
        Deposits and withdrawals will appear here as soon as you make them.
      </p>
    </section>
  );
}
