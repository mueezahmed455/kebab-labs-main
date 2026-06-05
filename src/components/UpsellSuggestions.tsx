import { useMemo } from "react";
import { CartItem } from "../types";
import { getUpsellSuggestions, UpsellSuggestion } from "../lib/upsells";
import { trackEvent } from "../lib/analytics";
import { Sparkles, Plus, TrendingUp, Tag, Gift, ShoppingBag } from "lucide-react";

interface Props {
  cartItems: CartItem[];
  onAddItem: (item: import("../types").MenuItem) => void;
}

const TYPE_CONFIG: Record<UpsellSuggestion["type"], { icon: typeof Sparkles; gradient: string; badge: string }> = {
  combo: { icon: Sparkles, gradient: "from-amber-500/20 to-orange-500/20", badge: "COMBO" },
  upgrade: { icon: TrendingUp, gradient: "from-blue-500/20 to-cyan-500/20", badge: "UPGRADE" },
  addon: { icon: Plus, gradient: "from-purple-500/20 to-pink-500/20", badge: "ADD-ON" },
  meal_deal: { icon: Gift, gradient: "from-emerald-500/20 to-teal-500/20", badge: "DEAL" },
};

export default function UpsellSuggestions({ cartItems, onAddItem }: Props) {
  const suggestions = useMemo(() => getUpsellSuggestions(cartItems), [cartItems]);

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2">
        <Sparkles className="w-4 h-4 text-[var(--app-primary)] animate-pulse" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Smart Suggestions</span>
      </div>
      {suggestions.map((suggestion, idx) => {
        const config = TYPE_CONFIG[suggestion.type];
        const Icon = config.icon;
        return (
          <div
            key={idx}
            className={"rounded-xl border border-[var(--app-primary)]/15 p-4 bg-gradient-to-r " + config.gradient + " hover:border-[var(--app-primary)]/40 transition-all"}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{suggestion.emoji}</span>
                  <h4 className="text-xs font-bold text-white">{suggestion.title}</h4>
                  <span className="text-[8px] bg-[var(--app-primary)]/20 text-[var(--app-primary)] px-1.5 py-0.5 rounded font-bold tracking-wider">{config.badge}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">{suggestion.description}</p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1">
                    {suggestion.items.map((item) => (
                      <span key={item.id} className="text-[9px] text-gray-500 bg-black/30 px-1.5 py-0.5 rounded">{item.name}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1.5">
                  {suggestion.savings > 0 && (
                    <span className="text-[9px] text-gray-500 line-through">£{suggestion.originalTotal.toFixed(2)}</span>
                  )}
                  <span className="text-sm font-bold text-[var(--app-primary)]">£{suggestion.bundlePrice.toFixed(2)}</span>
                  {suggestion.savings > 0 && (
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Save £{suggestion.savings.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  suggestion.items.forEach((item) => onAddItem(item));
                  trackEvent("upsell_clicked", { title: suggestion.title, type: suggestion.type, savings: suggestion.savings });
                }}
                className="shrink-0 w-10 h-10 rounded-full bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/30 flex items-center justify-center text-[var(--app-primary)] hover:bg-[var(--app-primary)] hover:text-[#050505] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
