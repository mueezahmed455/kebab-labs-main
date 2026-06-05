import { MenuItem, CartItem } from "../types";
import { MENU_ITEMS } from "../data";

export interface UpsellSuggestion {
  type: "combo" | "upgrade" | "addon" | "meal_deal";
  title: string;
  description: string;
  items: MenuItem[];
  originalTotal: number;
  bundlePrice: number;
  savings: number;
  emoji: string;
}

export const COMBO_RULES: {
  trigger: string[];
  suggestion: string[];
  type: UpsellSuggestion["type"];
  title: string;
  description: string;
  emoji: string;
  discountPercent: number;
}[] = [
  {
    trigger: ["k2"], suggestion: ["k2", "k5"], type: "combo",
    title: "Kobeda + Chicken Tikka Duo",
    description: "Pair your Kobeda with our signature Chicken Tikka for the ultimate charcoal experience.",
    emoji: "🔥", discountPercent: 10,
  },
  {
    trigger: ["k5"], suggestion: ["k5", "k2"], type: "combo",
    title: "Chicken Tikka + Kobeda Combo",
    description: "Complete your Chicken Tikka with a handcrafted Kobeda skewer.",
    emoji: "🍗", discountPercent: 10,
  },
  {
    trigger: ["d1", "d1b"], suggestion: ["k5", "k6"], type: "addon",
    title: "Add Charcoal Wings",
    description: "Triple-marinated wings are the perfect sidekick to your donner.",
    emoji: "🍖", discountPercent: 0,
  },
  {
    trigger: ["s1", "s2", "s3"], suggestion: ["e1", "dr1"], type: "meal_deal",
    title: "Upgrade to Meal Deal",
    description: "Add chips and a drink to your shawarma wrap and save!",
    emoji: "🎉", discountPercent: 15,
  },
  {
    trigger: ["b1", "b2", "b3", "b4"], suggestion: ["e6", "e14"], type: "addon",
    title: "Burger Upgrade Bundle",
    description: "Add crispy onion rings and extra sauce to complete your burger feast.",
    emoji: "🍔", discountPercent: 0,
  },
  {
    trigger: ["p1", "p1b", "p1c"], suggestion: ["gb2", "dr1"], type: "addon",
    title: "Pizza Night Bundle",
    description: "Cheesy garlic bread + drink to make it a proper pizza night.",
    emoji: "🍕", discountPercent: 10,
  },
  {
    trigger: ["ms1", "ms2", "ms3", "ms4"], suggestion: ["ic1", "ic2"], type: "addon",
    title: "Sweet Finish",
    description: "Add an ice cream tub to complement your milkshake.",
    emoji: "🍨", discountPercent: 0,
  },
  {
    trigger: ["e1", "e2", "e3"], suggestion: ["e7", "e12"], type: "addon",
    title: "Sides Mega Pack",
    description: "Mozzarella sticks + Halloumi fries make the ultimate sides combo.",
    emoji: "🍿", discountPercent: 5,
  },
];

export function getUpsellSuggestions(cartItems: CartItem[]): UpsellSuggestion[] {
  if (cartItems.length === 0) return [];
  const cartItemIds = new Set(cartItems.map((ci) => ci.item.id));
  const suggestions: UpsellSuggestion[] = [];
  const seen = new Set<string>();
  for (const rule of COMBO_RULES) {
    const hasTrigger = rule.trigger.some((id) => cartItemIds.has(id));
    if (!hasTrigger) continue;
    const suggestedItems = rule.suggestion
      .map((id) => MENU_ITEMS.find((m) => m.id === id))
      .filter((m): m is MenuItem => m !== undefined && !cartItemIds.has(m.id));
    if (suggestedItems.length === 0) continue;
    const key = rule.title;
    if (seen.has(key)) continue;
    seen.add(key);
    const originalTotal = suggestedItems.reduce((sum, item) => sum + item.price, 0);
    const bundlePrice = originalTotal * (1 - rule.discountPercent / 100);
    suggestions.push({
      type: rule.type, title: rule.title, description: rule.description,
      items: suggestedItems, originalTotal,
      bundlePrice: Math.round(bundlePrice * 100) / 100,
      savings: Math.round((originalTotal - bundlePrice) * 100) / 100,
      emoji: rule.emoji,
    });
  }
  return suggestions.slice(0, 3);
}
