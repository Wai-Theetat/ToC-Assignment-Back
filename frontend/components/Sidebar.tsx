"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandMark from "@/components/BrandMark";

const NAV_ITEMS = [
  {
    label: "Dashboard", href: "/MainMenu",
    icon: <svg className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
  {
    label: "Transactions", href: "/Transaction",
    icon: <svg className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none"><path d="M8 6h14M8 12h14M8 18h14M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
  {
    label: "Profile", href: "/Profile",
    icon: <svg className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
  },
];

const UserCard = ({ username }: { username: string }) => (
  <div className="flex items-center gap-3 rounded-xl border border-[#e0ebe5] bg-[#f5f9f7] p-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e2f5ec] text-sm font-bold text-[#083a31]">
      {username[0]?.toUpperCase() ?? "U"}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-[#0d1f1c]">{username}</p>
      <p className="text-xs text-[#7a9790]">Protected account</p>
    </div>
  </div>
);

const NavList = ({ pathname, close }: { pathname: string, close: () => void }) => (
  <nav className="flex flex-col gap-1" aria-label="Primary navigation">
    {NAV_ITEMS.map(({ label, href, icon }) => {
      const active = pathname === href;
      return (
        <Link key={href} href={href} onClick={close} aria-current={active ? "page" : undefined} className={`nav-item ${active ? "active" : ""}`}>
          {icon} <span>{label}</span>
        </Link>
      );
    })}
  </nav>
);

const SignOut = ({ handle }: { handle: () => void }) => (
  <button type="button" onClick={handle} className="nav-item w-full justify-start text-left text-[#c0392b] hover:!bg-[#fef2f2] hover:!text-[#c0392b]">
    <svg className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
    <span>Sign out</span>
  </button>
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [username] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("username") ?? "";
    return "";
  });

  const close = () => { setOpen(false); triggerRef.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const handleSignOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    router.push("/Login");
  };

  return (
    <>
      <aside className="sidebar sticky top-0 hidden h-screen w-60 shrink-0 flex-col md:flex">
        <div className="flex h-[60px] items-center gap-2.5 border-b border-[#e0ebe5] px-5">
          <BrandMark size="sm" />
          <span className="text-sm font-bold tracking-tight text-[#0d1f1c]">MaskVault</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5 gap-6">
          {username && <UserCard username={username} />}
          <NavList pathname={pathname} close={close} />
        </div>
        <div className="border-t border-[#e0ebe5] px-3 py-4">
          <SignOut handle={handleSignOut} />
          <p className="mt-3 px-3 text-[0.7rem] leading-5 text-[#a0b5af]">All activity is audit-logged</p>
        </div>
      </aside>

      <header className="sidebar fixed inset-x-0 top-0 z-40 flex h-[56px] items-center justify-between border-b border-[#e0ebe5] px-4 md:hidden">
        <Link href="/MainMenu" className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="text-sm font-bold tracking-tight text-[#0d1f1c]">MaskVault</span>
        </Link>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-label="Open navigation" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0ebe5] text-[#52716a] transition hover:bg-[#f5f9f7]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </header>
      <div className="h-[56px] md:hidden" />

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden" onClick={close} aria-hidden />
          <div ref={drawerRef} tabIndex={-1} className="sidebar enter-fade fixed inset-y-0 right-0 z-50 flex w-72 flex-col shadow-2xl outline-none md:hidden">
            <div className="flex h-[56px] items-center justify-between border-b border-[#e0ebe5] px-5">
              <span className="text-sm font-bold text-[#0d1f1c]">Menu</span>
              <button type="button" onClick={close} aria-label="Close navigation" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0ebe5] text-[#52716a] hover:bg-[#f5f9f7]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5 gap-6">
              {username && <UserCard username={username} />}
              <NavList pathname={pathname} close={close} />
            </div>
            <div className="border-t border-[#e0ebe5] px-3 py-4">
              <SignOut handle={handleSignOut} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
