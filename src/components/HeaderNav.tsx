import { useEffect, useState } from "react";
import { ActiveTab } from "../types";
import { BRAND } from "../data";
import { ShoppingBag } from "lucide-react";
import LogoNanoBanaPro from "./LogoNanoBanaPro";

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
}

export default function HeaderNav({ activeTab, setActiveTab, cartCount }: HeaderNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home" as const, label: "Home" },
    { id: "menu" as const, label: "Menu" },
    { id: "story" as const, label: "Story" },
  ];

  return (
    <header
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] transition-all duration-500 ease-out rounded-full px-6 py-3 ${
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          : "bg-[#050505]/60 backdrop-blur-xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
      }`}
    >
      <div className="flex justify-between items-center gap-6 sm:gap-8">
        <nav className="flex gap-3 sm:gap-5 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative transition-all duration-300 cursor-pointer px-2 py-1 text-[11px] font-medium tracking-[0.05em] uppercase ${
                activeTab === item.id
                  ? "text-[var(--app-primary)]"
                  : "text-[#a3a3a3] hover:text-white"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--app-primary)] shadow-[0_0_8px_rgba(197,160,89,0.6)]" />
              )}
            </button>
          ))}
        </nav>
        <div onClick={() => setActiveTab("home")} className="cursor-pointer group select-none mx-1 sm:mx-3">
          <LogoNanoBanaPro size="sm" showText={false} />
        </div>
        <button
          onClick={() => setActiveTab("cart")}
          aria-label="Cart"
          className="cursor-pointer transition-all duration-300 flex items-center gap-2 group relative"
        >
          <span className={`text-[11px] font-medium tracking-[0.05em] uppercase transition-colors ${
            activeTab === "cart" ? "text-[var(--app-primary)]" : "text-[#a3a3a3] group-hover:text-white"
          }`}>
            <ShoppingBag className="w-4 h-4" />
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--app-primary)] text-[#050505] text-[8px] font-black min-w-[16px] h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(197,160,89,0.4)]">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
