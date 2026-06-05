export type AnalyticsEvent =
  | "page_view"
  | "menu_view"
  | "item_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_start"
  | "checkout_complete"
  | "promo_applied"
  | "search"
  | "upsell_shown"
  | "upsell_clicked"
  | "notification_sent"
  | "admin_login";

interface EventPayload {
  event: AnalyticsEvent;
  metadata?: Record<string, string | number | boolean>;
  timestamp?: string;
}

const EVENT_QUEUE: EventPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem("kl_session_id");
  if (!sid) {
    sid = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem("kl_session_id", sid);
  }
  return sid;
}

function persistLocal(event: EventPayload) {
  try {
    const stored = JSON.parse(localStorage.getItem("kl_analytics") || "[]");
    stored.push({ ...event, timestamp: event.timestamp || new Date().toISOString() });
    if (stored.length > 500) stored.splice(0, stored.length - 500);
    localStorage.setItem("kl_analytics", JSON.stringify(stored));
  } catch { /* ignore */ }
}

async function flushQueue() {
  if (EVENT_QUEUE.length === 0) return;
  const batch = EVENT_QUEUE.splice(0, EVENT_QUEUE.length);
  batch.forEach(persistLocal);
}

export function trackEvent(
  event: AnalyticsEvent,
  metadata?: Record<string, string | number | boolean>
) {
  const payload: EventPayload = {
    event,
    metadata: { ...(metadata || {}), device: getDeviceType(), session: getSessionId() },
    timestamp: new Date().toISOString(),
  };
  EVENT_QUEUE.push(payload);
  persistLocal(payload);
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushQueue, 2000);
}

export function getLocalAnalytics(): EventPayload[] {
  try { return JSON.parse(localStorage.getItem("kl_analytics") || "[]"); } catch { return []; }
}

export function getConversionFunnel() {
  const events = getLocalAnalytics();
  const count = (ev: AnalyticsEvent) => events.filter((e) => e.event === ev).length;
  const views = count("menu_view");
  const addToCart = count("add_to_cart");
  const checkoutStart = count("checkout_start");
  const checkoutComplete = count("checkout_complete");
  return {
    views, addToCart, checkoutStart, checkoutComplete,
    viewToCartRate: views > 0 ? ((addToCart / views) * 100).toFixed(1) : "0",
    cartToCheckoutRate: addToCart > 0 ? ((checkoutStart / addToCart) * 100).toFixed(1) : "0",
    checkoutSuccessRate: checkoutStart > 0 ? ((checkoutComplete / checkoutStart) * 100).toFixed(1) : "0",
  };
}

export function getRevenueData() {
  const events = getLocalAnalytics();
  const completions = events.filter((e) => e.event === "checkout_complete");
  const byDay: Record<string, { orders: number; revenue: number }> = {};
  completions.forEach((e) => {
    const day = (e.timestamp || "").slice(0, 10);
    if (!byDay[day]) byDay[day] = { orders: 0, revenue: 0 };
    byDay[day].orders += 1;
    byDay[day].revenue += Number(e.metadata?.total || 0);
  });
  return Object.entries(byDay).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date));
}

export function getPopularItems() {
  const events = getLocalAnalytics();
  const adds = events.filter((e) => e.event === "add_to_cart");
  const counts: Record<string, number> = {};
  adds.forEach((e) => {
    const name = String(e.metadata?.itemName || "Unknown");
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
}

export function getSearchTerms() {
  const events = getLocalAnalytics();
  const searches = events.filter((e) => e.event === "search");
  const terms: Record<string, number> = {};
  searches.forEach((e) => {
    const q = String(e.metadata?.query || "").toLowerCase().trim();
    if (q) terms[q] = (terms[q] || 0) + 1;
  });
  return Object.entries(terms).map(([term, count]) => ({ term, count })).sort((a, b) => b.count - a.count).slice(0, 15);
}
