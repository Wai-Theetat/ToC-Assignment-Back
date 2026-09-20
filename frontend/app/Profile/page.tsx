"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const API = "http://localhost:8080";

type Profile = {
	username: string;
	email: string;
	tel: string;
	date_of_birth: string;
	address: string;
	credit_card: string;
};

export default function ProfilePage() {
	const router = useRouter();
	const [profile, setProfile] = useState<Profile | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const id = localStorage.getItem("user_id");
		if (!id) {
		router.push("/Login");
		return;
		}

		fetch(`${API}/users/${id}`)
		.then(async (res) => {
			const data = await res.json();
			if (!res.ok) {
			setError(data.detail || "Could not load profile");
			return;
			}
			setProfile(data);
		})
		.catch(() => setError("Could not reach server"));
	}, [router]);

	const FIELDS = profile
	? [
		{ label: "Username", value: profile.username },
		{ label: "Email", value: profile.email },
		{ label: "Date of Birth", value: profile.date_of_birth.replace(/^DOB:/, "") },
		{ label: "Tel.", value: profile.tel },
		{ label: "Address", value: profile.address.replace(/^Address:\s*/, "") },
		{ label: "Credit card", value: profile.credit_card },
		]
	: [];

	return (
	<div className="flex min-h-screen bg-white">
		<Sidebar />

		<main className="flex-1 px-16 py-12">
		<h1 className="text-3xl text-gray-900">Profile</h1>

		{error && <p className="mt-4 text-sm text-red-500">{error}</p>}
		{!profile && !error && (
			<p className="mt-4 text-sm text-gray-500">Loading...</p>
		)}

		{profile && (
			<dl className="mt-12 grid max-w-3xl grid-cols-[180px_1fr] gap-y-10">
			{FIELDS.map((field) => (
				<div key={field.label} className="contents">
				<dt className="text-lg text-gray-900">{field.label}</dt>
				<dd className="text-lg text-gray-900">{field.value}</dd>
				</div>
			))}
			</dl>
		)}
		</main>
	</div>
	);
}