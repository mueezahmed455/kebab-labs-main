import React, { useState, useMemo, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { CartItem } from "../types";
import { BRAND } from "../data";
import { Trash2, Plus, Minus, MapPin, Clock, Calendar, ShieldCheck, ShoppingBag, Sparkles, ClipboardCheck, X, Store, Truck, CreditCard, Smartphone } from "lucide-react";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function ShoppingCart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }: ShoppingCartProps) {
  const [takeawayMethod, setTakeawayMethod] = useState<"collection" | "delivery">("collection");
  const [address, setAddress] = useState(() => typeof window !== "undefined" ? localStorage.getItem("kebabLab_deliveryAddress") || "" : "");
  const [deliveryType, setDeliveryType] = useState<"ASAP" | "Schedule">("ASAP");
  const [scheduledTime, setScheduledTime] = useState("18:30");
  const [customPromoCode, setCustomPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckoutSubmitted, setIsCheckoutSubmitted] = useState(false);
  const [receiptCode, setReceiptCode] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      localStorage.setItem("kebabLab_deliveryAddress", address);
    }
  }, [address]);

  useEffect(() => {
    if (typeof window !== "undefined" && "PaymentRequest" in window) {
      try {
        const supportedInstruments = [{
          supportedMethods: "https://apple.com/apple-pay",
          data: {
            version: 3,
            merchantIdentifier: import.meta.env.VITE_APPLE_PAY_MERCHANT_ID || "merchant.com.kebablab",
            merchantCapabilities: ["supports3DS"],
            supportedNetworks: ["visa", "masterCard", "amex"],
            countryCode: "GB",
          },
        }];
        const details = { total: { label: "Test", amount: { currency: "GBP", value: "0.01" } } };
        const request = new PaymentRequest(supportedInstruments, details);
        request.canMakePayment().then((result) => {
          setApplePayAvailable(!!result);
        }).catch(() => setApplePayAvailable(false));
      } catch { setApplePayAvailable(false); }
    }
  }, []);

  const getItemPrice = (item: { price: number; sizes?: { l: string; p: number }[] }, selectedSize?: string) => {
    if (selectedSize && item.sizes && item.sizes.length > 0) {
      const matched = item.sizes.find((s) => s.l === selectedSize);
      if (matched) return matched.p;
    }
    return item.price;
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, current) => acc + getItemPrice(current.item, current.selectedSize) * current.quantity, 0);
  }, [cartItems]);

  const discountRatio = promoApplied ? 0.10 : 0;
  const discountAmount = subtotal * discountRatio;
  const serviceFee = takeawayMethod === "delivery" ? BRAND.delivery.fee : 0;
  const total = subtotal > 0 ? subtotal - discountAmount + serviceFee : 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = customPromoCode.trim().toUpperCase();
    if (["KEBAB10", "LAB10", "SKEWER"].includes(cleanCode)) {
      setPromoApplied(true);
    } else {
      alert("Invalid promo code. Try KEBAB10 or SKEWER!");
    }
  };

  const handleApplePay = async () => {
    if (cartItems.length === 0) return;
    setPaymentProcessing(true);
    try {
      const supportedInstruments = [{
        supportedMethods: "https://apple.com/apple-pay",
        data: {
          version: 3,
          merchantIdentifier: import.meta.env.VITE_APPLE_PAY_MERCHANT_ID || "merchant.com.kebablab",
          merchantCapabilities: ["supports3DS"],
          supportedNetworks: ["visa", "masterCard", "amex"],
          countryCode: "GB",
        },
      }];
      const details = {
        total: { label: "The Kebab Lab", amount: { currency: "GBP", value: total.toFixed(2) } },
        displayItems: cartItems.map((ci) => ({
          label: ci.item.name + (ci.selectedSize ? " (" + ci.selectedSize + ")" : "") + " x " + ci.quantity,
          amount: { currency: "GBP", value: (getItemPrice(ci.item, ci.selectedSize) * ci.quantity).toFixed(2) },
        })),
      };
      const request = new PaymentRequest(supportedInstruments, details);
      const paymentResponse = await request.show();
      const receipt = "LAB-" + Math.floor(100000 + Math.random() * 900000);
      setReceiptCode(receipt);
      setIsCheckoutSubmitted(true);
      await paymentResponse.complete("success");
    } catch (err) {
      console.error("Payment failed:", err);
      handleCheckoutSubmit();
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCheckoutSubmit = () => {
    if (cartItems.length === 0) return;
    const receipt = "LAB-" + Math.floor(100000 + Math.random() * 900000);
    setReceiptCode(receipt);
    setIsCheckoutSubmitted(true);
  };

  const handleResetCheckout = () => {
    setIsCheckoutSubmitted(false);
    onClearCart();
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col gap-10 select-none relative z-10">
      <div className="text-center md:text-left space-y-2 border-b border-[var(--app-primary)]/20 pb-4">
        <span className="text-[10px] bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20 text-[var(--app-primary)] px-3 py-1 rounded font-bold uppercase tracking-widest inline-block">Order Summary</span>
        <h2 className="font-display text-4xl text-[var(--app-primary)] font-bold tracking-tight">Your Order</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-panel text-center py-20 px-8 rounded-2xl border border-[var(--app-primary)]/15 space-y-6">
          <ShoppingBag className="w-16 h-16 text-[var(--app-primary)]/30 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider font-display">Your Basket is Empty</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto uppercase tracking-wider">Add some dishes to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-4">
            {cartItems.map(({ id, item, quantity, customNotes, selectedSize }) => (
              <div key={id} className="glass-panel rounded-2xl p-4 sm:p-5 flex gap-4 items-center border border-[var(--app-primary)]/10 hover:border-[var(--app-primary)]/40 transition-all bg-[#0a0b12]">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-950">
                  <img alt={item.name} src={item.imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow flex flex-col justify-between min-h-[80px]">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-display font-bold text-base text-[var(--app-primary)] leading-tight">{item.name}</h3>
                      {selectedSize && <span className="text-[9px] px-1.5 py-0.5 bg-[var(--app-primary)]/15 border border-[var(--app-primary)]/30 rounded text-[var(--app-primary)] font-bold mt-1 inline-block">{selectedSize}</span>}
                    </div>
                    <span className="font-bold text-[var(--app-primary)] text-sm">{(getItemPrice(item, selectedSize) * quantity).toFixed(2)}</span>
                  </div>
                  {customNotes && <p className="text-[10px] t
ext-gray-400 italic line-clamp-1 py-1 px-2 bg-neutral-900 rounded mt-1 w-fit">{customNotes}</p>}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-3 bg-[#07080f] rounded-lg px-2.5 py-1.5 border border-white/10">
                      <button onClick={() => onUpdateQuantity(id, -1)} className="hover:text-[var(--app-primary)] text-gray-400 p-0.5 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="font-mono text-sm text-white w-4 text-center">{quantity}</span>
                      <button onClick={() => onUpdateQuantity(id, 1)} className="hover:text-[var(--app-primary)] text-gray-400 p-0.5 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={() => onRemoveItem(id)} className="text-red-400 hover:text-red-500 p-2 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl p-5 border border-[var(--app-primary)]/10 space-y-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Order Type</span>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setTakeawayMethod("collection")} className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 border transition-all cursor-pointer ${takeawayMethod === "collection" ? "bg-[var(--app-primary)]/10 border-[var(--app-primary)] text-[var(--app-primary)]" : "bg-[#07080f]/40 border-white/10 text-gray-400"}`}>
                  <Store className="w-5 h-5" />Collection
                </button>
                <button onClick={() => setTakeawayMethod("delivery")} className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 border transition-all cursor-pointer ${takeawayMethod === "delivery" ? "bg-[var(--app-primary)]/10 border-[var(--app-primary)] text-[var(--app-primary)]" : "bg-[#07080f]/40 border-white/10 text-gray-400"}`}>
                  <Truck className="w-5 h-5" />Delivery
                </button>
              </div>
              {takeawayMethod === "delivery" && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-[9px] font-black text-[var(--app-primary)] uppercase tracking-widest block">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-primary)]" />
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your Burnley address" className="w-full bg-[#07080f] border border-white/10 focus:border-[var(--app-primary)] rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all" />
                  </div>
                  <p className="text-[10px] text-gray-500 italic">Delivery to BB10, BB11, BB12 postcodes.</p>
                </div>
              )}
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-[var(--app-primary)]/10 space-y-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Timing</span>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeliveryType("ASAP")} className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border transition-all cursor-pointer ${deliveryType === "ASAP" ? "bg-[var(--app-primary)]/10 border-[var(--app-primary)] text-[var(--app-primary)]" : "bg-[#07080f]/40 border-white/10 text-gray-400"}`}><Clock className="w-4 h-4" />ASAP</button>
                <button onClick={() => setDeliveryType("Schedule")} className={`py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border transition-all cursor-pointer ${deliveryType === "Schedule" ? "bg-[var(--app-primary)]/10 border-[var(--app-primary)] text-[var(--app-primary)]" : "bg-[#07080f]/40 border-white/10 text-gray-400"}`}><Calendar className="w-4 h-4" />Schedule</button>
              </div>
              {deliveryType === "Schedule" && (
                <select value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full bg-[#07080f] border border-white/10 rounded-xl py-3 px-3 text-xs text-white focus:outline-none cursor-pointer">
                  <option value="17:00">5:00 PM</option><option value="18:00">6:00 PM</option><option value="18:30">6:30 PM</option><option value="19:00">7:00 PM</option><option value="20:00">8:00 PM</option><option value="21:00">9:00 PM</option><option value="22:00">10:00 PM</option><option value="23:00">11:00 PM</option><option value="00:00">12:00 AM</option>
                </select>
              )}
            </div>

            <form onSubmit={handleApplyPromo} className="glass-panel rounded-2xl p-4 flex gap-3 items-center border border-[var(--app-primary)]/10">
              <input type="text" placeholder="PROMO CODE" value={customPromoCode} onChange={(e) => setCustomPromoCode(e.target.value)} disabled={promoApplied} className="flex-grow bg-[#07080f] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none disabled:opacity-50" />
              <button type="submit" disabled={promoApplied || !customPromoCode} className={`px-5 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer ${promoApplied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "gold-button"}`}>{promoApplied ? "Applied" : "Apply"}</button>
            </form>

            <div className="glass-panel rounded-2xl p-5 border border-[var(--app-primary)]/10 space-y-3.5 bg-neutral-950/40">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pb-2 border-b border-white/10">Summary</span>
              <div className="flex justify-between text-xs text-gray-300"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
              {promoApplied && <div className="flex justify-between text-xs text-emerald-400 font-bold"><span>Discount (10%)</span><span>-{discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-xs text-gray-300"><span>{takeawayMethod === "delivery" ? "Delivery" : "Collection"}</span><span>{serviceFee.toFixed(2)}</span></div>
              <div className="flex justify-between font-display text-xl text-[var(--app-primary)] font-bold pt-3.5 border-t border-white/10"><span>Total</span><span>{total.toFixed(2)}</span></div>
              <div className="pt-3 space-y-3">
                {applePayAvailable && (
                  <button type="button" onClick={handleApplePay} disabled={paymentProcessing} className="w-full py-4 rounded-xl bg-black border border-white/20 text-white font-bold text-xs uppercase tracking-[0.15em] transition-all hover:bg-neutral-900 flex justify-center items-center gap-2.5 cursor-pointer disabled:opacity-50">
                    <Smartphone className="w-4 h-4" />{paymentProcessing ? "Processing..." : "Pay with Apple Pay"}
                  </button>
                )}
                <button type="button" onClick={handleCheckoutSubmit} className="w-full py-4 rounded-xl bg-[var(--app-primary)] text-[#07080f] font-black text-xs uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_25px_rgba(197,160,89,0.3)] flex justify-center items-center gap-2.5 cursor-pointer">
                  <CreditCard className="w-4 h-4" /><span>{applePayAvailable ? "Pay at Collection" : "Place Order"}</span><Sparkles className="w-4 h-4 animate-spin" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCheckoutSubmitted && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(5,5,5,0.95)" }}>
          <div className="fixed inset-0 pointer-events-none z-[111]">
            <Confetti width={windowSize.width} height={windowSize.height} colors={["#C5A059", "#ffbf00", "#ffffff", "#171717"]} gravity={0.15} numberOfPieces={150} recycle={false} />
          </div>
          <div className="border border-[var(--app-primary)]/20 bg-[#050505] rounded-2xl w-full max-w-lg overflow-hidden glass-panel relative shadow-[0_0_80px_rgba(197,160,89,0.15)] p-6 sm:p-10 text-center space-y-6 z-[112]">
            <button onClick={handleResetCheckout} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800/60 border border-white/10 flex items-center justify-center text-white hover:text-[var(--app-primary)] cursor-pointer"><X className="w-4 h-4" /></button>
            <ClipboardCheck className="w-16 h-16 text-[var(--app-primary)] mx-auto mb-2" />
            <h3 className="font-display text-3xl font-bold text-white tracking-tight uppercase">Order Confirmed</h3>
            <p className="text-xs text-[var(--app-primary)] uppercase tracking-widest font-black">Your food is being prepared</p>
            <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 text-left space-y-4">
              <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-black">
                <span>Ref</span><span className="font-mono text-[var(--app-primary)] font-extrabold">{receiptCode}</span>
              </div>
              <div className="border-t border-white/10 my-1" />
              {cartItems.map(({ id, item, quantity, selectedSize }) => (
                <div key={id} className="flex justify-between text-xs text-white font-semibold">
                  <span>{item.name} {selectedSize ? "(" + selectedSize + ")" : ""} x {quantity}</span>
                  <span>{(getItemPrice(item, selectedSize) * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 my-1" />
              <div className="flex justify-between text-xs font-black text-[var(--app-primary)] uppercase tracking-widest">
                <span>Total</span><span>{total.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-[var(--app-primary)] uppercase tracking-widest font-black pt-2">
                {takeawayMethod === "collection" ? "Collection from: 123 Colne Road, BB10 1LN" : "Delivery to: " + address}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                {deliveryType === "ASAP" ? "Ready in 15-25 mins" : "Scheduled for " + scheduledTime}
              </p>
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--app-primary)]" /><span>Order sent to kitchen.</span>
            </div>
            <button onClick={handleResetCheckout} className="w-full gold-button py-4 rounded-xl font-bold text-xs uppercase tracking-widest">Place Another Order</button>
          </div>
        </div>
      )}
    </div>
  );
}
