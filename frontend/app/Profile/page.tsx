"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_URL, getErrorMessage } from "@/lib/api";

type Profile = {
  username: string;
  email: string;
  tel: string;
  date_of_birth: string;
  address: string;
  credit_card: string;
};

const FIELD_META: { label: string; key: keyof Profile; mask: (v: string) => string; mono?: boolean }[] = [
  { label: "Username",     key: "username",      mask: (v) => v },
  { label: "Email",        key: "email",         mask: maskEmail, mono: true },
  { label: "Phone",        key: "tel",           mask: maskPhone, mono: true },
  { label: "Date of birth",key: "date_of_birth", mask: maskDob  },
  { label: "Card",         key: "credit_card",   mask: maskCard, mono: true },
  { label: "Address",      key: "address",       mask: maskAddress },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) { router.push("/Login"); return; }
    void (async () => {
      try {
        const response = await fetch(`${API_URL}/users/${id}`);
        const data: unknown = await response.json();
        if (!response.ok || !isProfile(data)) {
          setError(getErrorMessage(data, "We could not load this profile."));
          return;
        }
        setProfile(data);
      } catch {
        setError("We could not reach the profile service. Try again shortly.");
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-white px-5 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-[#e0ebe5] pb-8">
            <p className="eyebrow">Privacy profile</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0d1f1c] sm:text-4xl">
              Protected details.
            </h1>
            <p className="mt-3 text-[0.9375rem] text-[#52716a]">
              All sensitive fields are masked by the active data-protection policy.
            </p>
          </header>

          {error && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-4">
              <p className="text-sm text-[#c0392b]">{error}</p>
            </div>
          )}

          {!profile && !error && <LoadingProfile />}

          {profile && (
            <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              {/* Field list */}
              <div className="card overflow-hidden">
                <div className="border-b border-[#e0ebe5] bg-[#f5f9f7] px-6 py-5">
                  <p className="text-sm font-semibold text-[#0d1f1c]">Account identity</p>
                  <p className="mt-0.5 text-xs text-[#7a9790]">Values display as masked by policy. Cannot be edited here.</p>
                </div>
                <dl className="divide-y divide-[#f0f6f3]">
                  {FIELD_META.map(({ label, key, mask, mono }) => (
                    <div key={key} className="flex flex-col gap-1.5 px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                      <dt className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#7a9790]">
                        {label}
                      </dt>
                      <dd className={`min-w-0 break-all text-sm text-[#0d1f1c] ${mono ? "font-mono" : ""}`}>
                        {mask(profile[key]) || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Info sidebar */}
              <div className="space-y-5">
                <div className="card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d1f1c] text-white">
                    <ShieldIcon />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-[#0d1f1c]">Masked by default</h2>
                  <p className="mt-2 text-sm leading-6 text-[#52716a]">
                    Your personal fields are protected by active masking using regular expressions before any data is surfaced.
                  </p>
                </div>
                <div className="card p-6">
                  <h3 className="text-sm font-bold text-[#0d1f1c]">Need to update details?</h3>
                  <p className="mt-1.5 text-sm leading-5 text-[#52716a]">
                    Contact an authorized administrator directly. Changes are logged for audit review.
                  </p>
                  <div className="mt-4 rounded-xl border border-[#e0ebe5] bg-[#f5f9f7] px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#52716a]">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7 4.75A.75.75 0 0 1 8.5 5v4.5a.75.75 0 0 1-1.5 0V5A.75.75 0 0 1 7 4.75Zm1 7.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
                      </svg>
                      Access logged · Policy enforced
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Profile>;
  return [item.username, item.email, item.tel, item.date_of_birth, item.address, item.credit_card].every(
    (f) => typeof f === "string"
  );
}

function maskEmail(value: string) {
  const [local, domain] = value.split("@");
  if (!local || !domain) return "••••••";
  if (local.length <= 2) return `${local[0] ?? "•"}••@${domain}`;
  return `${local[0]}${"•".repeat(Math.max(1, local.length - 2))}${local.at(-1)}@${domain}`;
}
function maskPhone(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length < 4) return "••••";
  return `XXX-XXX-${d.slice(-4)}`;
}
function maskCard(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length < 4) return "••••";
  return `XXXX-XXXX-XXXX-${d.slice(-4)}`;
}
function maskDob(value: string) {
  return value.replace(/^DOB:\s*/i, "").replace(/\d/g, "X");
}
function maskAddress(value: string) {
  return value.replace(/^Address:\s*/i, "").replace(/^\d+(?:\/\d+)?/, (h) => h.replace(/\d/g, "X"));
}

function LoadingProfile() {
  return (
    <div className="mt-10 card p-10 text-center">
      <svg className="mx-auto h-8 w-8 animate-spin text-[#147a60]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="mt-4 text-sm font-medium text-[#7a9790]">Loading protected details…</p>
    </div>
  );
}
function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5 19 6.4v4.7c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4V6.4l7-2.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m8.9 12 2.1 2.1 4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
