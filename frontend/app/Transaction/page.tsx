"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TransactionItem from "@/components/TransactionItem";

const API = "http://localhost:8080";

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
		if (!id) {
		router.push("/Login");
		return;
		}

		fetch(`${API}/transactions/${id}/history`)
		.then(async (res) => {
			const data = await res.json();
			if (!res.ok) {
			setError(data.detail || "Could not load history");
			return;
			}
			// newest first
			setTransactions(
			[...data].sort(
				(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			)
			);
		})
		.catch(() => setError("Could not reach server"))
		.finally(() => setLoading(false));
	}, [router]);

	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-white">
		<Sidebar />

		<main className="flex-1 min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-12">
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaction Log</h1>

			{error && <p className="mt-4 text-sm text-red-500">{error}</p>}
			{loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}
			{!loading && !error && transactions.length === 0 && (
			<p className="mt-4 text-sm text-gray-500">No transactions yet</p>
			)}

			<div className="mt-10 flex max-w-md flex-col gap-4">
			{transactions.map((t, i) => {
				const date = new Date(t.created_at);
				return (
				<TransactionItem
					key={i}
					transaction={{
					id: String(i),
					type: t.status === "withdraw" ? "withdraw" : "deposit",
					amount: Math.abs(t.transaction_amount),
					cardNumber: t.credit_card,
					date: date.toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "short",
						year: "2-digit",
					}),
					time: date.toLocaleTimeString("en-US", {
						hour: "2-digit",
						minute: "2-digit",
					}),
					}}
				/>
				);
			})}
			</div>
		</main>
		</div>
	);
}