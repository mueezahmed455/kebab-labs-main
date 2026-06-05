export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  grade?: string;
  accent?: string;
  imgUrl: string;
  altText: string;
  calories?: number;
  temp?: string;
  sizes?: { l: string; p: number }[];
  badge?: string;
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  customNotes?: string;
  selectedSize?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  timeSlot: string;
  tableArea: "VIP Vault" | "Cyber Bar" | "Main Deck" | "Zen Garden";
  dietaryRestrictions?: string;
  specialRequests?: string;
}

export type ActiveTab = "home" | "menu" | "cart" | "story";
