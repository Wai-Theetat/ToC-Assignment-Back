type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
};

const sizes = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export default function BrandMark({ size = "md", inverse = false }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid ${sizes[size]} shrink-0 place-items-center rounded-2xl ${
        inverse ? "bg-white text-[#083a31]" : "bg-[#083a31] text-white"
      }`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="h-[62%] w-[62%]">
        <path
          d="M16 3.5 26.5 8v7.1c0 6.3-4.4 11.4-10.5 13.4C9.9 26.5 5.5 21.4 5.5 15.1V8L16 3.5Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M10.5 16.1 14 19.6l7.7-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
