export default function AuthBrandPanel() {
  return (
    <aside className="w-full lg:w-1/2 bg-[#004421] flex items-center justify-center py-12 lg:py-0 min-h-[220px] lg:min-h-screen shrink-0">
      <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full bg-[#058c42] flex items-center justify-center select-none shadow-md transition-transform duration-300 hover:scale-105">
        <span className="text-2xl sm:text-3xl font-normal text-black tracking-wide">
          Logo
        </span>
      </div>
    </aside>
  );
}
