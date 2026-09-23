"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthBrandPanel from "@/components/AuthBrandPanel";

interface FormData {
username: string;
email: string;
password: string;
dateOfBirth: string;
phone: string;
address: string;
creditCard: string;
}

const DEFAULT_FORM_DATA: FormData = {
username: "",
email: "",
password: "",
dateOfBirth: "",
phone: "",
address: "",
creditCard: "",
};

export default function SignUpPage() {
	const router = useRouter();
	const [step, setStep] = useState<"input" | "confirmation">(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			if (params.get("step") === "confirmation") return "confirmation";
		}
		return "input";
	});
	const [rawInfo, setRawInfo] = useState("");
	const [unmarkedForm, setUnmarkedForm] = useState<FormData>(DEFAULT_FORM_DATA);
	const [markedForm, setMarkedForm] = useState<FormData>(DEFAULT_FORM_DATA);
	const [isCensored, setIsCensored] = useState(true);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleProceedToConfirmation = async () => {
		setError("");
		if (!rawInfo.trim()) {
			setError("Please enter your info first");
			return;
		}

		const lines = rawInfo.split("\n").map((l) => l.trim()).filter(Boolean);

		let username = lines[0];
		let password = lines[1];

		let bodyString = lines.slice(2).join(" ");
		console.log(bodyString)
		const res = await fetch("http://localhost:8080/mask", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text : bodyString
			}),
		});
// 		{
// {
//   "original_email": "Som@gmail.com",
//   "original_date_of_birth": "25/12/2549",
//   "original_phone_number": "080-666-6666",
//   "original_address": "689 ซอย ลาดกระบัง",
//   "original_credit_card": "1234-1234-1234-1234",
//   "email": "S*m@gmail.com",
//   "date_of_birth": "XX/XX/25XX",
//   "phone_number": "XXX-XXX-6666",
//   "address": "XXX ซอย ลาดกระบัง",
//   "credit_card": "XXXX-XXXX-XXXX-1234"
// }
// }
		const data = await res.json();

		const markedForm: FormData = {
			username,
			password,
			email: data["email"] ?? "",
			phone: data["phone_number"] ?? "",
			dateOfBirth: data["date_of_birth"] ? `${data["date_of_birth"]}` : "",
			address: data["address"] ? `${data["address"]}` : "",
			creditCard: data["credit_card"] ?? "",
		};

		const unmarkedForm : FormData = {
			username,
			password,
			email: data["original_email"] ?? "",
			phone: data["original_phone_number"] ?? "",
			dateOfBirth: data["original_date_of_birth"] ? `${data["original_date_of_birth"]}` : "",
			address: data["original_address"] ? `${data["original_address"]}` : "",
			creditCard: data["original_credit_card"] ?? "",
		}

		if (!markedForm.username || !markedForm.email) {
			setError("Couldn't find username or email in your info. Check the format.");
			return;
		}

		setMarkedForm(markedForm);
		setUnmarkedForm(unmarkedForm);
		setStep("confirmation");
	};

	const handleSignUp = async () => {
		setError("");
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8080/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: unmarkedForm.username,
					password: unmarkedForm.password,
					email: unmarkedForm.email,
					tel: unmarkedForm.phone,
					date_of_birth: unmarkedForm.dateOfBirth,
					address: unmarkedForm.address,
					credit_card: unmarkedForm.creditCard,
				}),
			});
			const data = await res.json();

			if (!res.ok) {
				setError(data.detail || "Sign up failed");
				return;
			}

			router.push("/Login");
		} catch {
			setError("Could not reach server. Is the backend running?");
		} finally {
			setLoading(false);
		}
	};

	const getCensoredEmail = (masked: string, unmasked: string) => {
		return isCensored ? masked : unmasked;
	};

	const getCensoredPhone = (masked: string, unmasked: string) => {
		return isCensored ? masked : unmasked;
	};

	const getCensoredCreditCard = (masked: string, unmasked: string) => {
		return isCensored ? masked : unmasked;
	};

	const getCensoredDOB = (masked: string, unmasked: string) => {
		return isCensored ? masked : unmasked;
	};

	const getCensoredAddress = (masked: string, unmasked: string) => {
		return isCensored ? masked : unmasked;
	};

return (
	<div className="flex min-h-screen flex-col lg:flex-row bg-[#F0FDFD]">
	<AuthBrandPanel />

	<main className="flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
		<div className="w-full max-w-sm">
		{step === "input" && (
			<div>
			<div className="text-center">
				<h1 className="text-4xl sm:text-5xl font-normal text-black tracking-tight">
				Welcome
				</h1>
				<p className="mt-2 text-base sm:text-lg text-gray-500 font-normal">
				Create account
				</p>
			</div>

			<div className="mt-8">
				<div className="h-64 sm:h-72 w-full rounded-2xl border-2 border-gray-400 bg-white p-4 transition focus-within:border-[#5cb874]">
				<textarea
					id="user-info-input"
					value={rawInfo}
					onChange={(e) => setRawInfo(e.target.value)}
					placeholder={"Enter your info or paste a bank log...\ne.g.\nsomchai\n1234\nsomchai.d@company.com\n093-245-7894\nDOB:25/12/2549\nAddress: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ\n1234-5678-9012-3456"}
					className="h-full w-full resize-none bg-transparent text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
				/>
				</div>
			</div>

			{error && (
				<p className="mt-3 text-center text-sm text-red-500">{error}</p>
			)}

			<div className="mt-6">
				<button
				type="button"
				onClick={handleProceedToConfirmation}
				className="w-full rounded-xl bg-[#5cb874] hover:bg-[#4ea865] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
				>
				Sign Up
				</button>
			</div>

			<p className="mt-4 text-center text-sm text-gray-500">
				Already have account?{" "}
				<Link
				href="/Login"
				className="text-[#5cb874] hover:underline font-medium"
				>
				Log In
				</Link>
			</p>
			</div>
		)}

		{step === "confirmation" && (
			<div>
			<div className="text-center">
				<h1 className="text-4xl sm:text-5xl font-normal text-black tracking-tight">
				Welcome
				</h1>
				<p className="mt-2 text-base sm:text-lg text-gray-500 font-normal">
				Create Account
				</p>
			</div>

			<div className="mt-4 flex items-center justify-between px-1">
				<span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
				<span
					className={`inline-block h-2 w-2 rounded-full ${
					isCensored ? "bg-amber-500" : "bg-emerald-500"
					}`}
				/>
				{isCensored ? "Personal Data Censored" : "Raw Data Visible"}
				</span>
				<button
				type="button"
				onClick={() => setIsCensored(!isCensored)}
				className="text-xs font-medium text-[#5cb874] hover:underline cursor-pointer"
				>
				{isCensored ? "👁️ Show Plain" : "🔒 Censor Data"}
				</button>
			</div>

			<div className="mt-4 space-y-4">
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={markedForm.username} aria-label="Username"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredEmail(markedForm.email, unmarkedForm.email)} aria-label="Email"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={isCensored ? "••••••••" : markedForm.password} aria-label="Password"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredDOB(markedForm.dateOfBirth, unmarkedForm.dateOfBirth)} aria-label="Date of Birth"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredPhone(markedForm.phone, unmarkedForm.phone)} aria-label="Phone"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredAddress(markedForm.address, unmarkedForm.address)} aria-label="Address"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredCreditCard(markedForm.creditCard, unmarkedForm.creditCard)} aria-label="Credit Card"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
			</div>

			{error && (
				<p className="mt-4 text-center text-sm text-red-500">{error}</p>
			)}

			<div className="mt-8 space-y-3">
				<button
				type="button"
				onClick={handleSignUp}
				disabled={loading}
				className="w-full rounded-xl bg-[#5cb874] hover:bg-[#4ea865] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer disabled:opacity-60"
				>
				{loading ? "Signing up..." : "Sign Up"}
				</button>

				<button
				type="button"
				onClick={() => setStep("input")}
				className="w-full rounded-xl bg-[#c4c4c4] hover:bg-[#b5b5b5] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
				>
				Cancel
				</button>
			</div>
			</div>
		)}
		</div>
	</main>
	</div>
);
}
