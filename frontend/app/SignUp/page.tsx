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
const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
const [isCensored, setIsCensored] = useState(true);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

	const handleProceedToConfirmation = () => {
		setError("");
		if (!rawInfo.trim()) {
			setError("Please enter your info first");
			return;
		}

		const lines = rawInfo.split("\n").map((l) => l.trim()).filter(Boolean);

		const emailMatch = rawInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
		const phoneMatch = rawInfo.match(/(?:0\d{1,2}[-\s]?\d{3}[-\s]?\d{4}|\b\d{3}-\d{3}-\d{4}\b|\b0\d{8,9}\b)/);
		const cardMatch = rawInfo.match(/(?:\d{4}-){3}\d{4}|\b\d{16}\b/);
		const dobMatch = rawInfo.match(/(?:DOB:\s*)?(\d{1,2}[/-]\d{1,2}[/-]\d{2,7})/i);
		const addressPrefixMatch = rawInfo.match(/Address:\s*([^\n\r]+)/i);

		let username = "";
		let password = "";

		// If multiline structured input (line 0 = username, line 1 = password)
		if (lines.length >= 2 && !lines[0].includes("@") && !/^Address:/i.test(lines[0]) && !/^DOB:/i.test(lines[0])) {
			username = lines[0];
			password = lines[1];
		} else if (emailMatch) {
			// If single-line bank log, derive username from email prefix and assign default password
			username = emailMatch[0].split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
			password = "password123";
		} else {
			username = lines[0] || "user";
			password = "password123";
		}

		let extractedAddress = "";
		if (addressPrefixMatch) {
			extractedAddress = `Address: ${addressPrefixMatch[1].trim()}`;
		} else {
			extractedAddress =
				lines.find(
					(l) =>
						l !== lines[0] &&
						l !== lines[1] &&
						!l.includes(emailMatch?.[0] || "___") &&
						!l.includes(phoneMatch?.[0] || "___") &&
						!l.includes(cardMatch?.[0] || "___") &&
						!(dobMatch && l.includes(dobMatch[0]))
				) || "";
		}

		const parsed: FormData = {
			username,
			password,
			email: emailMatch?.[0] || "",
			phone: phoneMatch?.[0] || "",
			dateOfBirth: dobMatch ? (dobMatch[0].toUpperCase().startsWith("DOB:") ? dobMatch[0] : `DOB:${dobMatch[1]}`) : "",
			address: extractedAddress,
			creditCard: cardMatch?.[0] || "",
		};

		if (!parsed.username || !parsed.email) {
			setError("Couldn't find username or email in your info. Check the format.");
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

	// Regex Masking functions following assignment specification & QA test cases
	const getCensoredEmail = (email: string) => {
		if (!isCensored || !email) return email;
		// Mask username characters between first and last with '*'
		return email.replace(/^([\w.-])(.*)([\w.-])(?=@)/, (_, first, middle, last) => {
			return `${first}${"*".repeat(middle.length)}${last}`;
		});
	};

	const getCensoredPhone = (phone: string) => {
		if (!isCensored || !phone) return phone;
		const trimmed = phone.trim();
		if (/^\d{3}-\d{3}-\d{4}$/.test(trimmed)) {
			return trimmed.replace(/^(\d{3})-(\d{3})-(\d{4})$/, "XXX-XXX-$3");
		}
		if (/^\d{10}$/.test(trimmed)) {
			return trimmed.replace(/^(\d{6})(\d{4})$/, "XXX-XXX-$2");
		}
		return trimmed.replace(/(\d{3})-(\d{3})-(\d{4})/, "XXX-XXX-$3");
	};

	const getCensoredCreditCard = (card: string) => {
		if (!isCensored || !card) return card;
		const trimmed = card.trim();
		if (/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(trimmed)) {
			return trimmed.replace(/^(\d{4})-(\d{4})-(\d{4})-(\d{4})$/, "XXXX-XXXX-XXXX-$4");
		}
		if (/^\d{16}$/.test(trimmed)) {
			return trimmed.replace(/^(\d{12})(\d{4})$/, "XXXXXXXXXXXX$2");
		}
		return trimmed.replace(/(?:\d{4}-){3}(\d{4})/, "XXXX-XXXX-XXXX-$1");
	};

	const getCensoredDOB = (dob: string) => {
		if (!isCensored || !dob) return dob;
		const hasPrefix = /^DOB:/i.test(dob);
		const clean = dob.replace(/^DOB:\s*/i, "");
		const masked = clean.replace(/(\d{1,2})[/-](\d{1,2})[/-](\d{2})(\d+)/, (_, d, m, yPrefix, ySuffix) => {
			return `XX/XX/${yPrefix}${"X".repeat(ySuffix.length)}`;
		});
		return hasPrefix ? `DOB:${masked}` : masked;
	};

	const getCensoredAddress = (addr: string) => {
		if (!isCensored || !addr) return addr;
		const hasPrefix = /^Address:\s*/i.test(addr);
		const clean = addr.replace(/^Address:\s*/i, "");
		// Only mask the first house number pattern (\d+(?:/\d+)?), replacing each digit with 'X'
		const masked = clean.replace(/\d+(?:\/\d+)?/, (houseNumber) => {
			return houseNumber.replace(/\d/g, "X");
		});
		return hasPrefix ? `Address: ${masked}` : masked;
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
