import { supabase } from "./supabase";
import { BRAND } from "../data";

export interface NotificationPreferences {
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  orderConfirmation: boolean;
  orderStatusUpdates: boolean;
  promotions: boolean;
  phone: string;
}

export interface NotificationLog {
  id: string;
  type: "sms" | "whatsapp";
  recipient: string;
  message: string;
  status: "sent" | "delivered" | "failed" | "pending";
  orderId?: string;
  sentAt: string;
}

export type OrderStatus =
  | "confirmed" | "preparing" | "firing"
  | "ready" | "out_for_delivery" | "delivered" | "collected";

const STATUS_MESSAGES: Record<OrderStatus, { sms: string; whatsapp: string }> = {
  confirmed: { sms: "Order at {brand} confirmed! Ref: {ref}.", whatsapp: "Order Confirmed! Ref: {ref}. Total: {total}. Firing up the clay oven!" },
  preparing: { sms: "Order {ref} being prepared at {brand}.", whatsapp: "Preparing Your Order. {ref} is being assembled now." },
  firing: { sms: "Order {ref} now in the 820C clay oven!", whatsapp: "In the Clay Oven! {ref} is being charcoal-fired." },
  ready: { sms: "Order {ref} ready for {method} at {brand}.", whatsapp: "Order Ready! {ref} is prepared and waiting." },
  out_for_delivery: { sms: "Order {ref} on its way! ETA: {eta}.", whatsapp: "Out for Delivery! {ref} left our kitchen. ETA: {eta}" },
  delivered: { sms: "Order {ref} delivered. Enjoy!", whatsapp: "Delivered! {ref} has arrived. Enjoy your meal!" },
  collected: { sms: "Order {ref} collected. Enjoy!", whatsapp: "Collected! {ref} picked up. Enjoy!" },
};

function buildMessage(status: OrderStatus, channel: "sms" | "whatsapp", vars: Record<string, string>): string {
  let msg = STATUS_MESSAGES[status][channel];
  msg = msg.replace("{brand}", BRAND.name);
  msg = msg.replace("{ref}", vars.ref || "");
  msg = msg.replace("{total}", vars.total || "");
  msg = msg.replace("{method}", vars.method || "collection");
  msg = msg.replace("{eta}", vars.eta || "30-45 minutes");
  return msg;
}

export async function sendOrderNotification(
  status: OrderStatus, phone: string, orderRef: string,
  preferences: NotificationPreferences,
  vars: Record<string, string> = {}
): Promise<boolean> {
  const allVars = { ref: orderRef, ...vars };
  const logs: NotificationLog[] = JSON.parse(localStorage.getItem("kl_notifications") || "[]");
  if (preferences.smsEnabled) {
    logs.push({ id: "sms-" + Date.now(), type: "sms", recipient: phone, message: buildMessage(status, "sms", allVars), status: "sent", orderId: orderRef, sentAt: new Date().toISOString() });
  }
  if (preferences.whatsappEnabled) {
    logs.push({ id: "wa-" + Date.now(), type: "whatsapp", recipient: phone, message: buildMessage(status, "whatsapp", allVars), status: "sent", orderId: orderRef, sentAt: new Date().toISOString() });
  }
  if (logs.length > 200) logs.splice(0, logs.length - 200);
  localStorage.setItem("kl_notifications", JSON.stringify(logs));
  const sb = supabase;
  if (sb) {
    try {
      await sb.from("notification_logs").insert(logs.filter(l => l.orderId === orderRef).map(l => ({ type: l.type, recipient: l.recipient, message: l.message, status: l.status, order_id: l.orderId, sent_at: l.sentAt })));
    } catch { /* log locally only */ }
  }
  return true;
}

export function getNotificationLogs(): NotificationLog[] {
  try { return JSON.parse(localStorage.getItem("kl_notifications") || "[]"); } catch { return []; }
}

export function getDefaultPreferences(): NotificationPreferences {
  try { const saved = localStorage.getItem("kl_notif_prefs"); if (saved) return JSON.parse(saved); } catch { /* ignore */ }
  return { smsEnabled: false, whatsappEnabled: false, orderConfirmation: true, orderStatusUpdates: true, promotions: false, phone: "" };
}

export function savePreferences(prefs: NotificationPreferences) {
  localStorage.setItem("kl_notif_prefs", JSON.stringify(prefs));
}
