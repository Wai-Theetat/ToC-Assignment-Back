"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import BrandMark from "@/components/BrandMark";
import { API_URL, getErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter your username and password to continue.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object") {
        setError(getErrorMessage(data, "We could not sign you in. Try again."));
        return;
      }
      const result = data as { user_id?: number; username?: string };
      if (typeof result.user_id !== "number" || typeof result.username !== "string") {
        setError("The sign-in response was incomplete. Try again.");
        return;
      }
      localStorage.setItem("user_id", String(result.user_id));
      localStorage.setItem("username", result.username);
      router.push("/MainMenu");
    } catch {
      setError("The secure service is unavailable. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <main className="soft-grid relative flex min-w-0 flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
        {/* floating accent */}
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#dff3e9]/40 blur-3xl" aria-hidden />

        <section className="enter-up relative w-full max-w-[26rem]">
          {/* Mobile brand */}
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/Login" className="flex items-center gap-2.5">
              <BrandMark size="sm" />
              <span className="text-sm font-bold tracking-tight text-[#0d1f1c]">MaskVault</span>
            </Link>
            <span className="badge badge-green">Production</span>
          </div>

          {/* Heading */}
          <p className="eyebrow">Secure access</p>
          <h1 className="mt-3 text-[2.6rem] font-bold tracking-[-0.06em] text-[#0d1f1c] leading-[1.1]">
            Welcome<br />back.
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-7 text-[#52716a]">
            Sign in to access privacy-protected banking data with regex masking.
          </p>

          <form className="mt-9 space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div>
              <label htmlFor="login-username" className="mb-2 block text-sm font-semibold text-[#0d1f1c]">
                Username
              </label>
              <div className="field-shell">
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="h-[3.25rem] w-full rounded-[0.9rem] bg-transparent px-4 text-[0.9375rem] text-[#0d1f1c] outline-none placeholder:text-[#a0b5af]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-[#0d1f1c]">
                Password
              </label>
              <div className="field-shell flex items-center pr-1.5">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-[3.25rem] min-w-0 flex-1 bg-transparent pl-4 text-[0.9375rem] text-[#0d1f1c] outline-none placeholder:text-[#a0b5af]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#147a60] transition hover:bg-[#f0f8f4]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#c0392b]" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
                </svg>
                <p className="text-sm leading-6 text-[#c0392b]">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : "Sign in securely"}
            </button>
          </form>

          <div className="mt-8 border-t border-[#e0ebe5] pt-6 text-sm text-[#52716a]">
            <p>
              No account?{" "}
              <Link href="/SignUp" className="font-semibold text-[#147a60] underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-[#7a9790]">
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 1a4 4 0 0 0-4 4v1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4Zm0 1.5A2.5 2.5 0 0 1 10.5 5v1h-5V5A2.5 2.5 0 0 1 8 2.5ZM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
              </svg>
              Authorized users only · all access is logged
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
