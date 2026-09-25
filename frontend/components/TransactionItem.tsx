import type { Transaction } from "@/lib/transactions";

const LABELS: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  transfer_in: "Transfer received",
  transfer_out: "Transfer sent",
};

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { type, amount, cardNumber, date, time } = transaction;
  const isPositive = type === "deposit" || type === "transfer_in";

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#e0ebe5] bg-white p-4 sm:p-5">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${isPositive ? "bg-[#eaf7f0] text-[#147a60]" : "bg-[#fff4e1] text-[#b45309]"}`} aria-hidden="true">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          {type === "deposit" && <path d="M12 17V7m0 0L8 11m4-4 4 4M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
          {type === "withdraw" && <path d="M12 7v10m0 0 4-4m-4 4-4-4M5 5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
          {type === "transfer_in" && <path d="M19 12H5m0 0l7-7m-7 7l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
          {type === "transfer_out" && <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-semibold text-[#0d1f1c]">{LABELS[type]}</p>
          <p className={`text-base font-semibold tabular-nums ${isPositive ? "text-[#147a60]" : "text-[#b45309]"}`}>{isPositive ? "+" : "−"}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem] text-[#7a9790]"><span className="font-mono">{cardNumber}</span><span>{date} · {time}</span></div>
      </div>
    </article>
  );
}
