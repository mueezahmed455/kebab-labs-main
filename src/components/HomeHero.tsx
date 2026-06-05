import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, MapPin, Sparkles, Clock, Star, ChevronDown } from "lucide-react";
import { BRAND, isOpenNow } from "../data";
import LogoNanoBanaPro from "./LogoNanoBanaPro";

interface HomeHeroProps {
  onExploreMenu: () => void;
  onViewStory: () => void;
}

export default function HomeHero({ onExploreMenu, onViewStory }: HomeHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(isOpenNow());
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse);
    setIsOpen(isOpenNow());
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const parallax = (factor: number) => `translateY(${scrollY * factor}px)`;
  const tilt3d = `perspective(1200px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`;

  return (
    <div
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-[#050505] text-[#F4F4F4] select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Parallax Background Layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: parallax(-0.15) }}>
        <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-[var(--app-primary)]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[140px]" />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ transform: parallax(-0.08) }}>
        <div className="absolute bottom-[10%] left-[30%] w-[800px] h-[400px] bg-[var(--app-primary)]/[0.02] rounded-full blur-[160px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(197,160,89,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: parallax(-0.05),
        }}
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 lg:px-16 pt-28 pb-20">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-16 animate-fade-in">
          <div className="flex items-center gap-6 opacity-80">
            <span className="w-12 h-[1px] bg-white/40" />
            <span className="font-sans text-[11px] tracking-[0.05em] text-[#ededed] uppercase font-semibold">
              {BRAND.tagline} • EST. 2021
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {isOpen ? "OPEN NOW • 4PM-12:40AM" : "CLOSED • REOPENS 4PM"}
            </span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[calc(100vh-220px)]">
          {/* Left: Typography */}
          <div className="col-span-1 lg:col-span-6 flex flex-col justify-center text-left max-w-2xl py-12 lg:py-0" style={{ transform: parallax(0.02) }}>
            <div className="space-y-2 mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                <Flame className="w-3 h-3 animate-pulse" />
                Clay Oven Specialist • Burnley BB10
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] font-black tracking-tight mb-10">
              <span className="block" style={{ transform: parallax(0.01), textShadow: "0 0 80px rgba(197,160,89,0.15)" }}>
                The Kebab
              </span>
              <span className="block italic font-light text-[var(--app-primary)]" style={{ transform: parallax(-0.01), textShadow: "0 0 60px rgba(197,160,89,0.25)" }}>
                Lab
              </span>
            </h1>

            <p className="font-sans text-[15px] sm:text-[17px] text-[#a3a3a3] max-w-md leading-relaxed mb-12 tracking-[0.01em]">
              Premium charcoal-fired kebabs, artisan shawarma, stone-baked pizza and more. Order online for delivery or collection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreMenu}
                className="group w-full sm:w-auto px-10 py-4 font-sans text-xs tracking-[0.15em] uppercase font-bold bg-[var(--app-primary)] text-[#050505] hover:shadow-[0_0_40px_rgba(197,160,89,0.3)] transition-all duration-500 rounded-full flex items-center justify-center gap-3"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onViewStory}
                className="w-full sm:w-auto px-10 py-4 font-sans text-xs tracking-[0.1em] uppercase font-medium bg-transparent border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-500 rounded-full flex items-center justify-center text-[#a3a3a3] hover:text-white"
              >
                Our Story
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5">
              {[
                { label: "Delivery", value: BRAND.delivery.time + " min", icon: MapPin },
                { label: "Rating", value: "4.9/5", icon: Star },
                { label: "Open Till", value: "12:40 AM", icon: Clock },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <stat.icon className="w-3 h-3 text-[var(--app-primary)]" />
                    <span className="text-[9px] text-[#a3a3a3] uppercase tracking-widest font-bold">{stat.label}</span>
                  </div>
                  <span className="font-display text-lg text-white font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Image Card */}
          <div className="col-span-1 lg:col-span-6 flex justify-center mt-12 lg:mt-0">
            <div
              className="relative w-full max-w-[560px] rounded-2xl overflow-hidden transition-transform duration-300 ease-out"
              style={{ transform: tilt3d, transformStyle: "preserve-3d" }}
            >
              <div className="aspect-[4/5] relative">
                <img
                  alt="Premium charcoal-fired kebab"
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=90"
                  className="w-full h-full object-cover filter contrast-110 saturate-75 brightness-90"
                  referrerPolicy="no-referrer"
                />
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 to-transparent" />
                <div className="absolute top-6 right-6 bg-[var(--app-primary)] text-[#050505] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  820°C Clay Oven
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-[var(--app-primary)] uppercase tracking-widest font-bold">Tonight’s Special</p>
                        <p className="text-sm text-white font-bold mt-0.5">Double Kobeda Feast</p>
                      </div>
                      <span className="font-display text-xl text-[var(--app-primary)] font-bold">£12.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[8px] text-on-surface-variant/50 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant/30" />
        </div>
      </div>
    </div>
  );
}
