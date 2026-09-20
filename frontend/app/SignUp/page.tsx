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
const [step, setStep] = useState<"input" | "confirmation">("input");
const [rawInfo, setRawInfo] = useState("");
const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
const [isCensored, setIsCensored] = useState(true);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
	if (typeof window !== "undefined") {
	const params = new URLSearchParams(window.location.search);
	if (params.get("step") === "confirmation") {
		setStep("confirmation");
	}
	}
}, []);

const handleProceedToConfirmation = () => {
	setError("");
	if (!rawInfo.trim()) {
	setError("Please enter your info first");
	return;
	}

	const lines = rawInfo.split("\n").map((l) => l.trim()).filter(Boolean);

	const emailMatch = rawInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
	const phoneMatch = rawInfo.match(/(?:0\d{1,2}[-\s]?\d{3}[-\s]?\d{4}|\b\d{9,10}\b)/);
	const cardMatch = rawInfo.match(/(?:\d{4}[-\s]?){3}\d{4}/);
	const dobMatch = rawInfo.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);

	const parsed: FormData = {
	username: lines[0] || "",
	password: lines[1] || "",
	email: emailMatch?.[0] || "",
	phone: phoneMatch?.[0] || "",
	dateOfBirth: dobMatch?.[0].replace(/-/g, "/") || "",
	address:
		lines.find(
		(l) =>
			l !== lines[0] &&
			l !== lines[1] &&
			l !== emailMatch?.[0] &&
			l !== phoneMatch?.[0] &&
			l !== dobMatch?.[0] &&
			l !== cardMatch?.[0]
		) || "",
	creditCard: cardMatch?.[0] || "",
	};
	
	if (!parsed.username || !parsed.email || !parsed.password) {
	setError("Couldn't find username, email, or password in your info. Check the format.");
	return;
	}

	setFormData(parsed);
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
		username: formData.username,
		password: formData.password,
		email: formData.email,
		tel: formData.phone,
		date_of_birth: formData.dateOfBirth,
		address: formData.address,
		credit_card: formData.creditCard,
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

const getCensoredEmail = (email: string) => {
	if (!isCensored) return email;
	const parts = email.split("@");
	if (parts.length === 2) {
	const name = parts[0];
	const domain = parts[1];
	const maskedName = name.length > 2 ? `${name.slice(0, 1)}••••` : `${name.slice(0, 1)}*`;
	return `${maskedName}@${domain}`;
	}
	return "••••@gmail.com";
};

const getCensoredPhone = (phone: string) => {
	if (!isCensored) return phone;
	const clean = phone.trim();
	if (clean.length >= 8) {
	const prefix = clean.slice(0, 3);
	const suffix = clean.slice(-4);
	return `${prefix} ••• ${suffix}`;
	}
	return "022 ••• 2222";
};

const getCensoredCreditCard = (card: string) => {
	if (!isCensored) return card;
	const digits = card.replace(/\D/g, "");
	if (digits.length >= 12) {
	const last4 = digits.slice(-4);
	return `•••• •••• •••• ${last4}`;
	}
	return "•••• •••• •••• ••••";
};

const getCensoredDOB = (dob: string) => {
	if (!isCensored) return dob;
	return "••/••/••••";
};

const getCensoredAddress = (addr: string) => {
	if (!isCensored) return addr;
	const parts = addr.split(" ");
	if (parts.length > 1) {
	return `${parts[0]} ••••••••••`;
	}
	return "••••••••••••";
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
					placeholder={"Your info here...\ne.g.\nsomchai\nsomchai.d@company.com\n1234\n25/12/2549\n093-245-7894\n689 ซอยลาดกระบัง 19 ถนนลาดกระบัง\n1234-5678-9012-3456"}
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
				<input type="text" readOnly value={formData.username} aria-label="Username"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredEmail(formData.email)} aria-label="Email"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={isCensored ? "••••••••" : formData.password} aria-label="Password"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredDOB(formData.dateOfBirth)} aria-label="Date of Birth"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredPhone(formData.phone)} aria-label="Phone"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredAddress(formData.address)} aria-label="Address"
					className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans" />
				</div>
				<div className="border-b border-gray-400 pb-1">
				<input type="text" readOnly value={getCensoredCreditCard(formData.creditCard)} aria-label="Credit Card"
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
