"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import BrandMark from "@/components/BrandMark";
import { API_URL, getErrorMessage } from "@/lib/api";

type FormData = {
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  creditCard: string;
};

type MaskResponse = {
  original_email?: string;
  original_date_of_birth?: string;
  original_phone_number?: string;
  original_address?: string;
  original_credit_card?: string;
  email?: string;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
  credit_card?: string;
};

const EMPTY_FORM: FormData = {
  username: "", email: "", password: "", dateOfBirth: "", phone: "", address: "", creditCard: "",
};
const EXAMPLE = `somchai
1234
somchai.d@company.com
093-245-7894
DOB:25/12/2549
Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง
1234-5678-9012-3456`;

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "review">("input");
  const [rawInfo, setRawInfo] = useState("");
  const [plainForm, setPlainForm] = useState<FormData>(EMPTY_FORM);
  const [maskedForm, setMaskedForm] = useState<FormData>(EMPTY_FORM);
  const [showPlain, setShowPlain] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const prepareReview = async () => {
    setError("");
    const lines = rawInfo.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 3) { setError("Add a username, password, and contact details."); return; }
    const username = lines[0] ?? "";
    const password = lines[1] ?? "";
    const text = lines.slice(2).join(" ");
    if (!username || !password || !text) { setError("Incomplete details. Check the format."); return; }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/mask/`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object") {
        setError(getErrorMessage(data, "Could not process details.")); return;
      }
      const masked = data as MaskResponse;
      if (!masked.original_email) {
        setError("Could not extract an email address. Check the format."); return;
      }
      setPlainForm({
        username, password,
        email: masked.original_email ?? "",
        phone: masked.original_phone_number ?? "",
        dateOfBirth: masked.original_date_of_birth ?? "",
        address: masked.original_address ?? "",
        creditCard: masked.original_credit_card ?? "",
      });
      setMaskedForm({
        username, password: "••••••••",
        email: masked.email ?? "",
        phone: masked.phone_number ?? "",
        dateOfBirth: masked.date_of_birth ?? "",
        address: masked.address ?? "",
        creditCard: masked.credit_card ?? "",
      });
      setStep("review");
    } catch {
      setError("The masking service is unavailable. Connect and try again.");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setError(""); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: plainForm.username,
          password: plainForm.password,
          email: plainForm.email,
          tel: plainForm.phone,
          date_of_birth: plainForm.dateOfBirth,
          address: plainForm.address,
          credit_card: plainForm.creditCard,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) { setError(getErrorMessage(data, "Account creation failed.")); return; }
      router.push("/Login");
    } catch {
      setError("Service offline. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayed = showPlain ? plainForm : maskedForm;
  const safeDisplayed = { ...displayed, password: "••••••••" };

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />
      <main className="soft-grid flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-14">
        <section className="enter-up w-full max-w-[32rem]">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/Login" className="flex items-center gap-2.5">
              <BrandMark size="sm" />
              <span className="text-[0.9375rem] font-bold text-[#0d1f1c]">MaskVault</span>
            </Link>
            <span className="badge badge-green">Protected flow</span>
          </div>

          {step === "input" ? (
            <>
              <p className="eyebrow">Create account</p>
              <h1 className="mt-3 text-[2.6rem] font-bold tracking-[-0.06em] leading-[1.1] text-[#0d1f1c]">
                Review before<br />we protect.
              </h1>
              <p className="mt-4 text-[0.9375rem] leading-7 text-[#52716a]">
                Paste your registration details. We analyze and mask sensitive patterns before finalizing the account.
              </p>

              <div className="mt-8">
                <label htmlFor="user-info-input" className="mb-2 flex items-baseline justify-between text-sm font-semibold text-[#0d1f1c]">
                  <span>Registration payload</span>
                  <button type="button" onClick={() => setRawInfo(EXAMPLE)} className="text-xs text-[#147a60] hover:underline">
                    Load sample
                  </button>
                </label>
                <div className="field-shell p-1.5 shadow-sm">
                  <textarea
                    id="user-info-input"
                    value={rawInfo}
                    onChange={(e) => setRawInfo(e.target.value)}
                    placeholder={EXAMPLE}
                    className="h-[15rem] w-full resize-none rounded-xl bg-transparent px-3.5 py-3 font-mono text-[0.875rem] leading-relaxed text-[#0d1f1c] outline-none placeholder:text-[#a0b5af]"
                  />
                </div>
                <p className="mt-2 text-[0.8125rem] text-[#7a9790]">
                  Line 1: Username · Line 2: Password · Remaining: Details
                </p>
              </div>

              {error && <Message text={error} />}
              <button type="button" onClick={prepareReview} disabled={loading} className="btn-primary w-full mt-7">
                {loading ? "Protecting details…" : "Continue to review"}
              </button>
              <div className="mt-8 text-center text-[0.9375rem] text-[#52716a]">
                Already have an account? <Link href="/Login" className="font-semibold text-[#147a60] hover:underline">Sign in</Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Protected review</p>
                  <h1 className="mt-3 text-[2.6rem] font-bold tracking-[-0.06em] leading-[1.1] text-[#0d1f1c]">
                    Confirm details.
                  </h1>
                </div>
                <span className={`badge shrink-0 mt-3 ${showPlain ? "badge-neutral" : "badge-green"}`}>
                  {showPlain ? "Unmasked view" : "Masked view"}
                </span>
              </div>
              <p className="mt-4 text-[0.9375rem] leading-7 text-[#52716a]">
                Sensitive values are masked by default. Verify the information before creating your account.
              </p>

              <div className="mt-8 flex items-center justify-between rounded-t-2xl border border-b-0 border-[#e0ebe5] bg-[#f5f9f7] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2f5ec] text-[#083a31]">
                    <ShieldIcon />
                  </div>
                  <div><p className="text-sm font-semibold text-[#0d1f1c]">Privacy preview</p><p className="text-xs text-[#7a9790]">View sensitive fields securely</p></div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlain((v) => !v)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#083a31] shadow-sm ring-1 ring-inset ring-[#e0ebe5] transition hover:bg-[#f5f9f7]"
                >
                  {showPlain ? "Mask values" : "Show values"}
                </button>
              </div>

              <dl className="card rounded-t-none divide-y divide-[#e0ebe5]">
                <ReviewRow label="Username" value={displayed.username} />
                <ReviewRow label="Email" value={displayed.email} mono />
                <ReviewRow label="Password" value={safeDisplayed.password} />
                <ReviewRow label="Date of birth" value={displayed.dateOfBirth} />
                <ReviewRow label="Phone" value={displayed.phone} mono />
                <ReviewRow label="Address" value={displayed.address} />
                <ReviewRow label="Card" value={displayed.creditCard} mono />
              </dl>

              {error && <Message text={error} />}

              <div className="mt-8 grid gap-3 lg:grid-cols-2">
                <button type="button" onClick={register} disabled={loading} className="btn-primary">
                  {loading ? "Creating…" : "Create account"}
                </button>
                <button type="button" onClick={() => { setStep("input"); setShowPlain(false); setError(""); }} className="btn-secondary">
                  Edit input
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#7a9790]">{label}</dt>
      <dd className={`truncate text-sm text-[#0d1f1c] ${mono ? "font-mono" : ""}`}>{value || "—"}</dd>
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#c0392b]">
      {text}
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