"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_URL, getErrorMessage } from "@/lib/api";

const QUICK_AMOUNTS = [100, 500, 1_000, 5_000];
type BalanceResponse = { username?: string; money?: number };

export default function MainMenu() {
  const router = useRouter();
  const userIdRef = useRef<string | null>(null);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTarget, setTransferTarget] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<"deposit" | "withdraw" | "transfer" | null>(null);

  const loadBalance = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}/balance`);
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object") {
        setError(getErrorMessage(data, "We could not load your account balance."));
        return;
      }
      const account = data as BalanceResponse;
      if (typeof account.username === "string") setUsername(account.username);
      if (typeof account.money === "number") setBalance(account.money);
    } catch {
      setError("We could not reach the account service. Try again shortly.");
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      router.push("/Login");
      return;
    }
    userIdRef.current = id;
    void (async () => {
      await loadBalance(id);
      setLoading(false);
    })();
  }, [router]);

  const addAmount = (setter: Dispatch<SetStateAction<string>>, quickAmount: number) => {
    setter((current) => (Number(current || 0) + quickAmount).toString());
  };

  const submitTransaction = async (type: "deposit" | "withdraw" | "transfer") => {
    const id = userIdRef.current;
    let inputAmount = "";
    if (type === "deposit") inputAmount = depositAmount;
    else if (type === "withdraw") inputAmount = withdrawAmount;
    else inputAmount = transferAmount;

    const amount = Number(inputAmount);
    setError("");

    if (!id || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than 0 before continuing.");
      return;
    }
    if (type === "transfer" && (!transferTarget || transferTarget.trim() === "")) {
      setError("Please enter the recipient's username.");
      return;
    }

    setSubmitting(type);
    try {
      const payload: Record<string, string | number> = { amount };
      if (type === "transfer") payload.target_username = transferTarget.trim();

      const response = await fetch(`${API_URL}/transactions/${id}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(data, `${type === "transfer" ? "Transfer" : type === "deposit" ? "Deposit" : "Withdrawal"} failed. Try again.`));
        return;
      }
      if (type === "deposit") setDepositAmount("");
      else if (type === "withdraw") setWithdrawAmount("");
      else { setTransferAmount(""); setTransferTarget(""); }
      await loadBalance(id);
    } catch {
      setError("The transaction service is unavailable. Try again shortly.");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-white px-5 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col justify-between gap-6 border-b border-[#e0ebe5] pb-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Account overview</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0d1f1c] sm:text-4xl">
                Welcome back, {username || "there"}.
              </h1>
              <p className="mt-3 text-[0.9375rem] text-[#52716a]">
                Manage your funds. All entries are recorded in your masked activity log.
              </p>
            </div>
            <div className="badge badge-green self-start md:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-[#147a60] animate-pulse" aria-hidden /> Session active
            </div>
          </header>

          {error && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
              <p className="text-sm font-medium text-[#c0392b]">{error}</p>
            </div>
          )}

          <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
            <div className="grid gap-8">
              <TransactionPanel
                title="Deposit funds"
                description="Add liquidity to this account instantly."
                amount={depositAmount}
                onAmountChange={setDepositAmount}
                onQuickAmount={(a) => addAmount(setDepositAmount, a)}
                onSubmit={() => submitTransaction("deposit")}
                submitting={submitting === "deposit"}
                tone="deposit"
              />
              <TransactionPanel
                title="Withdraw funds"
                description="Move available funds securely."
                amount={withdrawAmount}
                onAmountChange={setWithdrawAmount}
                onQuickAmount={(a) => addAmount(setWithdrawAmount, a)}
                onSubmit={() => submitTransaction("withdraw")}
                submitting={submitting === "withdraw"}
                tone="withdraw"
              />
              <TransactionPanel
                title="Transfer funds"
                description="Send money to another user by their username."
                amount={transferAmount}
                onAmountChange={setTransferAmount}
                onQuickAmount={(a) => addAmount(setTransferAmount, a)}
                onSubmit={() => submitTransaction("transfer")}
                submitting={submitting === "transfer"}
                tone="transfer"
                target={transferTarget}
                onTargetChange={setTransferTarget}
              />
            </div>

            <aside className="card sticky top-8 overflow-hidden bg-[#0d1f1c] text-white">
              {/* aesthetic grid inset */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative p-7 sm:p-9">
                <p className="text-sm font-medium text-[#7a9790]">Available balance</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-medium text-[#52716a]">฿</span>
                  <p className="text-4xl font-bold tracking-tight sm:text-5xl tabular-nums break-all">
                    {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="mt-10 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-sm text-[#c8ecd9]">
                    <svg className="h-5 w-5 opacity-80" viewBox="0 0 24 24" fill="none"><path d="M12 3.5v17M4 10h16M4 14h16M19 6.4v4.7c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4V6.4l7-2.9 7 2.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                    <span>Masking policy active</span>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

type TransactionPanelProps = {
  title: string;
  description: string;
  amount: string;
  onAmountChange: (value: string) => void;
  onQuickAmount: (amount: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  tone: "deposit" | "withdraw" | "transfer";
  target?: string;
  onTargetChange?: (value: string) => void;
};

function TransactionPanel({ title, description, amount, onAmountChange, onQuickAmount, onSubmit, submitting, tone, target, onTargetChange }: TransactionPanelProps) {
  const isDeposit = tone === "deposit";
  const isTransfer = tone === "transfer";
  return (
    <section className="card p-6 sm:p-8">
      <div className="flex items-start">
        <div>
          <h2 className="text-[1.125rem] font-bold text-[#0d1f1c] flex items-center gap-2">
            {isDeposit && <svg className="h-5 w-5 text-[#147a60]" viewBox="0 0 24 24" fill="none"><path d="M12 17V7m0 0L8 11m4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {tone === "withdraw" && <svg className="h-5 w-5 text-[#b45309]" viewBox="0 0 24 24" fill="none"><path d="M12 7v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {isTransfer && <svg className="h-5 w-5 text-[#2563eb]" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#7a9790]">{description}</p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => onQuickAmount(amt)}
            className="flex h-[2.25rem] items-center rounded-lg border border-[#e0ebe5] bg-[#f5f9f7] px-3.5 text-[0.8125rem] font-medium text-[#1e3532] hover:bg-[#e2f5ec] hover:border-[#c8ecd9] hover:text-[#083a31] transition-colors"
          >
            +{amt.toLocaleString()}
          </button>
        ))}
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {isTransfer && (
          <div className="field-shell flex h-12 flex-1 items-center px-4">
            <span className="mr-2 text-sm font-medium text-[#7a9790]">@</span>
            <input
              type="text"
              value={target ?? ""}
              onChange={(e) => onTargetChange?.(e.target.value)}
              placeholder="Username"
              className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] font-semibold text-[#0d1f1c] outline-none placeholder:font-normal placeholder:text-[#a0b5af]"
            />
          </div>
        )}
        <div className="field-shell flex h-12 flex-1 items-center px-4">
          <span className="mr-2 text-sm font-medium text-[#7a9790]">THB</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              if (val.split(".").length <= 2) onAmountChange(val);
            }}
            placeholder="0.00"
            className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] font-semibold text-[#0d1f1c] outline-none placeholder:font-normal placeholder:text-[#a0b5af]"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={`flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isTransfer ? "bg-[#2563eb] hover:bg-[#1d4ed8] focus-visible:outline-[#3b82f6]" : isDeposit ? "bg-[#083a31] hover:bg-[#0d5546] focus-visible:outline-[#147a60]" : "bg-[#b45309] hover:bg-[#92400e] focus-visible:outline-[#d97706]"}`}
        >
          {submitting ? "Processing…" : isTransfer ? "Transfer" : isDeposit ? "Deposit" : "Withdraw"}
        </button>
      </form>
    </section>
  );
}

function LoadingScreen() {
  return <div className="flex min-h-screen items-center justify-center bg-white"><div className="text-center"><svg className="mx-auto h-8 w-8 animate-spin text-[#147a60]" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><p className="mt-4 text-[0.875rem] font-medium text-[#7a9790]">Loading workspace…</p></div></div>;
}