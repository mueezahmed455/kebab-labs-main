import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LogoNanoBanaPro({ className = "", showText = true, size = "md" }: LogoProps) {
  // Dimensions based on size configurations
  const dimensions = {
    sm: { box: "w-8 h-8", svg: "w-4 h-4", title: "text-lg", sub: "text-[7px]" },
    md: { box: "w-10 h-10", svg: "w-5 h-5", title: "text-xl", sub: "text-[8px]" },
    lg: { box: "w-14 h-14", svg: "w-7 h-7", title: "text-3xl", sub: "text-[10px]" }
  }[size];

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      {/* High-fidelity glass-pill container */}
      <div className={`relative ${dimensions.box} rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-primary group-hover:border-primary/50 transition-all duration-500 ease-in-out`}>
        {/* Sleek Minimalist Monogram / Geometric Kebab Logo */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          className={`${dimensions.svg} text-[#e5e5e5]`}
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* Abstract Geometric Mark - Precision & Science */}
          <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke="var(--app-primary)" strokeWidth="6" />
          <path d="M50 15 L50 85" stroke="var(--app-primary)" strokeWidth="6" />
          <path d="M15 50 L85 50" stroke="var(--app-primary)" strokeWidth="6" />
          <circle cx="50" cy="50" r="10" fill="var(--app-bg)" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-display tracking-wider text-white uppercase font-normal leading-none ${dimensions.title}`}>
              Kebab <span className="text-primary italic">Labs</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
