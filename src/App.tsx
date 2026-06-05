import { useState, useEffect } from "react";
import { MenuItem, CartItem, ActiveTab } from "./types";
import { MENU_ITEMS } from "./data";
import HeaderNav from "./components/HeaderNav";
import HomeHero from "./components/HomeHero";
import MenuBrowser from "./components/MenuBrowser";
import ShoppingCart from "./components/ShoppingCart";
import StoryAndKitchen from "./components/StoryAndKitchen";
import FeedbackDialog from "./components/FeedbackDialog";
import OrderStatusTracker from "./components/OrderStatusTracker";
import LoyaltyTracker from "./components/LoyaltyTracker";
import { Instagram3DGrid } from "./components/Instagram3DGrid";
import FooterOrderStatusTracker from "./components/FooterOrderStatusTracker";
import ParticleCanvas from "./components/ParticleCanvas";
import CursorGlow from "./components/CursorGlow";
import { User, MapPin, History, X, Star, RefreshCw } from "lucide-react";
import HeroVisuals3D from "./components/HeroVisuals3D";
import AccessibilityPanel from "./components/AccessibilityPanel";
import AdminDashboard from "./components/admin/AdminDashboard";
import { trackEvent } from "./lib/analytics";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedbackDialogState, setFeedbackDialogState] = useState<{ isOpen: boolean; txId: string }>({ isOpen: false, txId: "" });
  const [submittedFeedback, setSubmittedFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedCart = localStorage.getItem("kebab_labs_cart");
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (err) { console.error("Failed to load saved cart:", err); }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("kebab_labs_cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (item: MenuItem, customNotes?: string, selectedSize?: string) => {
    const sizeToSelect = selectedSize || (item.sizes && item.sizes.length > 0 ? item.sizes[0].l : undefined);
    const existingIndex = cartItems.findIndex(
      (ci) => ci.item.id === item.id && ci.customNotes === customNotes && ci.selectedSize === sizeToSelect
    );
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      saveCart([...cartItems, { id: `${item.id}-${Date.now()}`, item, quantity: 1, customNotes: customNotes || "", selectedSize: sizeToSelect }]);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    const updated = cartItems
      .map((ci) => ci.id === cartItemId ? { ...ci, quantity: Math.max(1, ci.quantity + delta) } : ci)
      .filter((ci) => ci.quantity > 0);
    saveCart(updated);
  };

  const handleRemoveItem = (cartItemId: string) => saveCart(cartItems.filter((ci) => ci.id !== cartItemId));
  const handleClearCart = () => saveCart([]);

  const handleReorder = (txId: string) => {
    let itemsToAdd: { id: string; qty: number }[] = [];
    if (txId === "TX-409192") itemsToAdd = [{ id: "k2", qty: 3 }];
    else if (txId === "TX-209415") itemsToAdd = [{ id: "c3", qty: 1 }];

    setCartItems(prev => {
      let newCart = [...prev];
      itemsToAdd.forEach(itemData => {
        const menuItem = MENU_ITEMS.find(m => m.id === itemData.id);
        if (menuItem) {
          const sizeToSelect = menuItem.sizes && menuItem.sizes.length > 0 ? menuItem.sizes[0].l : undefined;
          const existingIndex = newCart.findIndex(
            (ci) => ci.item.id === menuItem.id && ci.selectedSize === sizeToSelect && (!ci.customNotes)
          );
          if (existingIndex >= 0) {
            newCart[existingIndex] = { ...newCart[existingIndex], quantity: newCart[existingIndex].quantity + itemData.qty };
          } else {
            newCart.push({ id: `${menuItem.id}-${Date.now()}-${Math.random()}`, item: menuItem, quantity: itemData.qty, customNotes: "", selectedSize: sizeToSelect });
          }
        }
      });
      localStorage.setItem("kebab_labs_cart", JSON.stringify(newCart));
      return newCart;
    });
    setActiveTab("cart");
    setProfileOpen(false);
  };

  const cartCount = cartItems.reduce((acc, current) => acc + current.quantity, 0);
  const cartItemIds = new Set<string>(cartItems.map((ci) => ci.item.id));

  return (
    <div className="min-h-screen bg-background text-on-background font-sans flex flex-col justify-between antialiased selection:bg-primary/25 selection:text-primary relative pb-20 md:pb-0">
      {/* Global 3D Effects */}
      <ParticleCanvas />
      <HeroVisuals3D />
      <CursorGlow />

      {/* Ambient smoke background */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0">
        <div className="absolute -top-[50%] left-[20%] w-[1200px] h-[600px] bg-primary/5 rounded-full blur-[180px] origin-center -rotate-45" />
        <div className="absolute -top-[30%] -right-[10%] w-[1000px] h-[500px] bg-error-container/5 rounded-full blur-[180px]" />
      </div>

      <HeaderNav activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} />

      <main className="flex-grow w-full relative z-10">
        {activeTab === "home" && (
          <div className="animate-cinematic-reveal space-y-24">
            <HomeHero onExploreMenu={() => setActiveTab("menu")} onViewStory={() => setActiveTab("story")} />
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
              <Instagram3DGrid />
            </div>
          </div>
        )}
        {activeTab === "menu" && (
          <div className="animate-cinematic-reveal">
            <MenuBrowser onAddToCart={handleAddToCart} cartItemIds={cartItemIds} />
          </div>
        )}
        {activeTab === "cart" && (
          <div className="animate-cinematic-reveal">
            <ShoppingCart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} onAddItem={(item) => handleAddToCart(item)} />
          </div>
        )}
        {activeTab === "admin" && (
          <div className="animate-cinematic-reveal">
            <AdminDashboard onClose={() => setActiveTab("home")} />
          </div>
        )}
        {activeTab === "story" && (
          <div className="animate-cinematic-reveal">
            <StoryAndKitchen />
          </div>
        )}
      </main>

      <footer className="relative bg-surface border-t border-primary-container/10 py-10 z-25 mt-16 select-none bg-neutral-950/80 backdrop-blur-xl shrink-0">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center gap-8">
          <div className="w-full max-w-2xl mb-4">
            <FooterOrderStatusTracker />
          </div>
          <div className="flex flex-col md:flex-row w-full justify-between items-center gap-6">
            <div className="font-sans font-semibold text-[10px] sm:text-xs text-on-surface-variant/75 uppercase tracking-[0.2em] text-center md:text-left select-none leading-relaxed">
              {new Date().getFullYear()} KEBAB LABS EXQUISITE MEDITERRANEAN DINING ALL LABORATORY RIGHTS COMMITTED.
            </div>
            <div className="flex flex-wrap justify-center gap-8 font-sans font-bold text-[10px] tracking-wider uppercase text-on-surface-variant/80">
              <button onClick={() => setActiveTab("menu")} className="hover:text-primary transition-colors cursor-pointer">ORDER TAKEAWAY</button>
              <button onClick={() => setActiveTab("story")} className="hover:text-primary transition-colors cursor-pointer">Location</button>
              <button onClick={() => setProfileOpen(true)} className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"><User className="w-3.5 h-3.5" /><span>Profile</span></button>
            </div>
          </div>
        </div>
      </footer>

      {profileOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant/30 rounded-2xl w-full max-w-md overfl
ow-hidden glass-panel relative shadow-2xl animate-fade-in p-6 sm:p-8 space-y-6">
            <button onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800/60 border border-outline-variant/20 flex items-center justify-center text-on-surface hover:text-primary cursor-pointer"><X className="w-4 h-4" /></button>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center mx-auto text-primary"><User className="w-8 h-8" /></div>
              <h3 className="font-display text-xl font-bold text-on-surface">Artisan Protocol Pass</h3>
              <p className="text-[10px] text-primary uppercase tracking-widest font-semibold">Gourmet Member</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-outline-variant/15 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant/60">Status</span>
                <span className="text-emerald-400 font-bold font-mono text-[11px] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />STABLE</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant/60">Zone</span>
                <span className="text-on-surface font-semibold font-mono text-[11px] flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />Burnley BB10</span>
              </div>
              <OrderStatusTracker />
              <LoyaltyTracker />
            </div>
          </div>
        </div>
      )}

      <AccessibilityPanel />

      <FeedbackDialog isOpen={feedbackDialogState.isOpen} transactionId={feedbackDialogState.txId} onClose={() => setFeedbackDialogState({ isOpen: false, txId: "" })} onSubmit={() => { setSubmittedFeedback(prev => ({ ...prev, [feedbackDialogState.txId]: true })); }} />
    </div>
  );
}
