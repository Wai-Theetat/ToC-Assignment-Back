import BrandMark from "@/components/BrandMark";

export default function AuthBrandPanel() {
  return (
    <aside className="auth-panel relative hidden overflow-hidden lg:flex lg:w-[42%] lg:shrink-0">
      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-12 py-10 xl:px-16 xl:py-14">
        <div className="flex items-center gap-3 text-white">
          <BrandMark inverse />
          <div>
            <p className="text-lg font-semibold tracking-[-0.03em]">MaskVault</p>
            <p className="text-sm text-emerald-100/75">Secure Data Masking</p>
          </div>
        </div>

        <div className="max-w-md">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1.5 text-sm text-emerald-50">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Controlled access for sensitive data
          </div>
          <h2 className="text-balance text-[2.7rem] font-semibold leading-[1.08] tracking-[-0.055em] text-white xl:text-6xl">
            Keep private data private.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-emerald-50/76">
            Protect customer details with policy-driven masking before your team views, tests, or shares data.
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-emerald-100/65">
            ปกป้องข้อมูลสำคัญ ด้วยการปกปิดข้อมูลที่ควบคุมได้
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-white/15 pt-7 text-emerald-50/80">
          <SecurityPoint label="Role-based access" />
          <SecurityPoint label="Data masking" />
          <SecurityPoint label="Activity logged" />
        </div>
      </div>
      <DataRibbon />
    </aside>
  );
}

function SecurityPoint({ label }: { label: string }) {
  return (
    <div className="text-sm leading-5">
      <svg className="mb-2 h-5 w-5 text-emerald-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity=".65" />
      </svg>
      {label}
    </div>
  );
}

function DataRibbon() {
  return (
    <div className="pointer-events-none absolute -right-28 bottom-16 w-[34rem] rotate-[-15deg] opacity-70" aria-hidden="true">
      <div className="space-y-3 rounded-[2rem] border border-white/15 bg-[#0d4d40]/70 p-7 shadow-2xl backdrop-blur-sm">
        <DataLine label="Account" raw="1234 •••• 3344" masked="•••• •••• 3344" />
        <DataLine label="Email" raw="s••••••@example.test" masked="s••••••@example.test" />
        <DataLine label="Phone" raw="093-•••-7894" masked="XXX-XXX-7894" />
      </div>
    </div>
  );
}

function DataLine({ label, raw, masked }: { label: string; raw: string; masked: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_1fr] items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-emerald-100/65">{label}</span>
      <span className="text-sm text-emerald-50/45 line-through">{raw}</span>
      <span className="rounded-lg bg-emerald-200/12 px-2.5 py-1.5 font-mono text-xs text-emerald-100">{masked}</span>
    </div>
  );
}
