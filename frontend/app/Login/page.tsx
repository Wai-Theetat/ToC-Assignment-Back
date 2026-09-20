"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthBrandPanel from "@/components/AuthBrandPanel";

export default function LoginPage() {

	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const getErrorMessage = (data: any, fallback: string): string => {
		if (typeof data?.detail === "string") return data.detail;
		if (Array.isArray(data?.detail)) {
			return data.detail.map((e: any) => e.msg).join(", ");
		}
		return fallback;
	};


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		
		if (!username || !password) {
			setError("Please enter username and password");
			return;
		}
	
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8080/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			const data = await res.json();

			if (!res.ok) {
				setError(getErrorMessage(data, "Login failed"));
				return
			}
			
			localStorage.setItem("user_id", String(data.user_id));
			localStorage.setItem("username", data.username);
			router.push("/MainMenu");
			} catch {
				setError("Could not reach server. Is the backend running?");
			} finally {
				setLoading(false);
			}
	};


	return (
	<div className="flex min-h-screen flex-col lg:flex-row bg-[#F0FDFD]">
	{/* Left Brand Panel */}
	<AuthBrandPanel />

	{/* Right Form Panel */}
	<main className="flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
		<div className="w-full max-w-sm">
		{/* Header */}
		<div className="text-center">
			<h1 className="text-4xl sm:text-5xl font-normal text-black tracking-tight">
			Welcome
			</h1>
			<p className="mt-2 text-base sm:text-lg text-gray-500 font-normal">
			Log-In with Username
			</p>
		</div>

		{/* Form */}
		<form
			className="mt-10 sm:mt-14 space-y-6"
			onSubmit={handleSubmit}
		>
			<div className="border-b border-gray-400 pb-1">
			<input
				id="login-username"
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				className="w-full bg-transparent py-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:placeholder-transparent"
			/>
			</div>

			<div className="border-b border-gray-400 pb-1">
			<input
				id="login-password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="w-full bg-transparent py-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:placeholder-transparent"
			/>
			</div>

			{error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

			<div className="pt-8 text-center">
			<p className="text-sm text-gray-500">
				Don&apos;t have account?{" "}
				<Link
				href="/SignUp"
				className="text-[#5cb874] hover:underline font-medium"
				>
				Sign Up
				</Link>
			</p>

			<div className="mt-4">
				<button
				type="submit"
				className="w-full rounded-xl bg-[#5cb874] hover:bg-[#4ea865] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
				>
				Log In
				</button>
			</div>
			</div>
		</form>
		</div>
	</main>
	</div>
);
}
