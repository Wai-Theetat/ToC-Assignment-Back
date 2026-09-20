import { Transaction } from "@/lib/transactions";

const LABELS: Record<Transaction["type"], string> = {	
	deposit: "รายการฝาก",
	withdraw: "รายการถอน",
};

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
const { type, amount, cardNumber, date, time } = transaction;
const signedAmount = type === "withdraw" ? `-${amount}` : `${amount}`;

return (
	<div className="rounded-lg bg-green-100 px-5 py-4">
	<div className="flex items-start justify-between">
		<p className="text-sm text-gray-700">{LABELS[type]}</p>
		<p className="text-xs text-gray-500">{time}</p>
	</div>
	<p className="text-xs text-gray-500">{cardNumber}</p>
	<div className="mt-1 flex items-end justify-between">
		<p className="text-xs text-gray-500">{date}</p>
		<p className="text-lg font-semibold text-gray-900">{signedAmount} baht</p>
	</div>
	</div>
);
}