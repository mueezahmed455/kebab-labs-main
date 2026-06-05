import type { IncomingMessage, ServerResponse } from "http";

const SQUARE_API = "https://connect.squareup.com/v2/payments";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN || "";
const LOCATION = process.env.SQUARE_LOCATION_ID || "";

function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => { try { resolve(JSON.parse(body)); } catch { reject(new Error("Invalid JSON")); } });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }
  if (req.method !== "POST") { res.writeHead(405); res.end(JSON.stringify({ error: "Method not allowed" })); return; }
  if (!TOKEN || !LOCATION) { res.writeHead(500); res.end(JSON.stringify({ error: "Square not configured" })); return; }

  const reqBody = (req as unknown as { body?: Record<string, unknown> }).body;
  const parsed = reqBody || await parseBody(req);
  const { sourceId, amount, currency, orderId, note } = parsed;
  if (!sourceId || !amount) { res.writeHead(400); res.end(JSON.stringify({ error: "Missing sourceId or amount" })); return; }

  try {
    const response = await fetch(SQUARE_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "Square-Version": "2024-01-18" },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: crypto.randomUUID(),
        amount_money: { amount: Math.round((amount as number) * 100), currency: currency || "GBP" },
        location_id: LOCATION,
        reference_id: orderId || undefined,
        note: note || undefined,
      }),
    });
    const data = await response.json();
    if (!response.ok) { res.writeHead(response.status); res.end(JSON.stringify({ error: (data as { errors?: { detail: string }[] }).errors?.[0]?.detail || "Payment failed" })); return; }
    res.writeHead(200); res.end(JSON.stringify({ payment: (data as { payment: unknown }).payment }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.writeHead(500); res.end(JSON.stringify({ error: msg }));
  }
}
