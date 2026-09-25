"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const AMOUNTS = [1, 2, 5, 10, 50, 100, 500, 1000];
const API = "http://localhost:8080";

const getErrorMessage = (data: any, fallback: string): string => {
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) return data.detail.map((e: any) => e.msg).join(", ");
  return fallback;
};

export default function MainMenu() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBalance = async (id: string) => {
    try {
      const res = await fetch(`${API}/transactions/${id}/balance`);
      if (res.ok) {
        const data = await res.json();
        if (data.username) setUsername(data.username);
        if (typeof data.money === "number") setBalance(data.money);
      }
    } catch {
      // Fallback to locally stored username if network fails
      const savedUser = localStorage.getItem("username");
      if (savedUser) setUsername(savedUser);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUsername(savedUser);
    }

    if (!id) {
      router.push("/Login");
      return;
    }
    setUserId(id);
    fetchBalance(id).finally(() => setLoading(false));
  }, [router]);

  const bump = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    amount: number
  ) => setter((prev) => String((Number(prev) || 0) + amount));

  const handleDeposit = async () => {
    setError("");
    const value = Number(depositAmount);
    if (!value || value <= 0 || !userId) return;

    try {
      const res = await fetch(`${API}/transactions/${userId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(getErrorMessage(data, "Deposit failed"));
        return;
      }
      setDepositAmount("");
      await fetchBalance(userId);
    } catch {
      setError("Could not reach server");
    }
  };

  const handleWithdraw = async () => {
    setError("");
    const value = Number(withdrawAmount);
    if (!value || value <= 0 || !userId) return;

    try {
      const res = await fetch(`${API}/transactions/${userId}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(getErrorMessage(data, "Withdraw failed"));
        return;
      }
      setWithdrawAmount("");
      await fetchBalance(userId);
    } catch {
      setError("Could not reach server");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row bg-white">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
            <p className="text-sm font-medium text-gray-500">Loading account...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      <Sidebar />

      <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 xl:px-16 lg:py-12">
        {/* User Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-4 sm:pb-6 border-b border-gray-100 gap-1">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {username || "User"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">My Account</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 sm:p-4 border border-red-200">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Content Layout: Form Controls + Balance Display */}
        <div className="mt-6 sm:mt-8 flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 lg:gap-12">
          {/* Action Column: Deposit & Withdraw */}
          <div className="w-full max-w-xl">
            {/* Deposit Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  Deposit
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {AMOUNTS.map((amount) => (
                  <button
                    key={`deposit-${amount}`}
                    type="button"
                    onClick={() => bump(setDepositAmount, amount)}
                    className="rounded-lg bg-green-200 py-3 sm:py-3.5 md:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-900 hover:bg-green-300 active:scale-95 transition-all cursor-pointer"
                  >
                    +{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mt-3 sm:mt-4 flex items-center rounded-lg bg-green-50 pr-2 border border-green-200/60 focus-within:border-green-500 transition-colors">
                <input
                  type="text"
                  inputMode="numeric"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
                  placeholder="Enter Amount Deposit"
                  className="w-full bg-transparent px-3.5 py-3 sm:px-5 sm:py-4 text-sm sm:text-base font-semibold text-gray-900 placeholder:font-semibold placeholder:text-gray-400 focus:outline-none"
                />
                {depositAmount && (
                  <button
                    type="button"
                    onClick={handleDeposit}
                    className="shrink-0 rounded-md bg-green-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 hover:bg-green-300 active:scale-95 transition-all cursor-pointer"
                  >
                    Enter
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 sm:my-8 border-gray-200" />

            {/* Withdraw Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Withdraw
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {AMOUNTS.map((amount) => (
                  <button
                    key={`withdraw-${amount}`}
                    type="button"
                    onClick={() => bump(setWithdrawAmount, amount)}
                    className="rounded-lg bg-green-200 py-3 sm:py-3.5 md:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-900 hover:bg-green-300 active:scale-95 transition-all cursor-pointer"
                  >
                    -{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mt-3 sm:mt-4 flex items-center rounded-lg bg-green-50 pr-2 border border-green-200/60 focus-within:border-green-500 transition-colors">
                <input
                  type="text"
                  inputMode="numeric"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleWithdraw()}
                  placeholder="Enter Amount Withdraw"
                  className="w-full bg-transparent px-3.5 py-3 sm:px-5 sm:py-4 text-sm sm:text-base font-semibold text-gray-900 placeholder:font-semibold placeholder:text-gray-400 focus:outline-none"
                />
                {withdrawAmount && (
                  <button
                    type="button"
                    onClick={handleWithdraw}
                    className="shrink-0 rounded-md bg-green-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 hover:bg-green-300 active:scale-95 transition-all cursor-pointer"
                  >
                    Enter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Balance Display Widget (shows on top on mobile/tablet, and on the right side on desktop) */}
          <div className="order-first xl:order-last flex justify-center xl:flex-1 xl:justify-center py-2 xl:py-16">
            <div className="flex h-52 w-52 sm:h-64 sm:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80 shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-green-200 p-4 sm:p-6 text-center shadow-xs transition-all">
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-green-800">
                  Current Balance
                </span>
                <span className="mt-1 sm:mt-2 text-2xl sm:text-3xl xl:text-4xl font-bold text-gray-900 tabular-nums">
                  {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">
                  Baht
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}