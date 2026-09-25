"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "My Account", href: "/MainMenu" },
  { label: "Profile", href: "/Profile" },
  { label: "Transaction", href: "/Transaction" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    router.push("/Login");
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden flex items-center justify-between bg-green-200 px-4 py-3 sticky top-0 z-30 shadow-xs border-b border-green-300">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white font-medium text-xs shadow-xs">
            Logo
          </div>
          <span className="font-semibold text-gray-900 text-base">ToC Banking</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg text-gray-800 hover:bg-green-300/60 focus:outline-none transition-colors cursor-pointer"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-64 bg-green-200 p-6 shadow-xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-green-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white text-xs font-medium">
                Logo
              </div>
              <span className="font-semibold text-gray-900">Menu</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-700 hover:bg-green-300/50 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full px-5 py-3 text-base transition-colors ${
                    isActive
                      ? "bg-white text-green-900 shadow-sm font-medium"
                      : "text-green-950 hover:bg-white/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          className="text-left text-lg font-medium text-red-600 hover:text-red-700 py-3 cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            handleSignOut();
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col justify-between bg-green-200 px-6 py-10 min-h-screen sticky top-0 self-start">
        <div>
          <div className="mx-auto mb-10 flex h-32 w-32 items-center justify-center rounded-full bg-green-700 text-white shadow-inner">
            <span className="text-sm font-medium">Logo</span>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-5 py-3 text-base transition-colors ${
                    isActive
                      ? "bg-white text-green-900 shadow-sm font-medium"
                      : "text-green-950 hover:bg-white/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          className="text-left text-lg font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </aside>
    </>
  );
}