import { useState, useMemo } from "react";
import { getConversionFunnel, getPopularItems, getRevenueData, getSearchTerms, trackEvent } from "../../lib/analytics";
import { getNotificationLogs, getDefaultPreferences, savePreferences, NotificationPreferences } from "../../lib/notifications";
import { MENU_ITEMS, BRAND } from "../../data";
import { Shield, BarChart3, ShoppingBag, Bell, TrendingUp, DollarSign, Users, Clock, Search, Eye, Edit3, Trash2, ChefHat, LogOut, Smartphone, MessageSquare, Package, Flame, Truck, CheckCircle2, Sparkles } from "lucide-react";

type AdminTab = "overview" | "orders" | "analytics" | "notifications" | "menu";

interface AdminOrder { id:string; ref:string; customer:string; items:string; total:number; status:string; type:string; time:string; phone:string; }

const MOCK_ORDERS: AdminOrder[] = [
  { id:"o1", ref:"LAB-882041", customer:"Ahmed K.", items:"Kobeda x2, Chicken Wings", total:15.50, status:"confirmed", type:"collection", time:"2 min ago", phone:"+447700900001" },
  { id:"o2", ref:"LAB-771932", customer:"Sarah M.", items:"Mix Shawarma Meal", total:12.00, status:"preparing", type:"delivery", time:"8 min ago", phone:"+447700900002" },
  { id:"o3", ref:"LAB-660123", customer:"James P.", items:"Chicken Tikka & Kobeda", total:14.00, status:"firing", type:"collection", time:"15 min ago", phone:"+447700900003" },
  { id:"o4", ref:"LAB-559871", customer:"Fatima R.", items:"Large Donner, Garlic Bread", total:13.50, status:"ready", type:"delivery", time:"22 min ago", phone:"+447700900004" },
  { id:"o5", ref:"LAB-448760", customer:"Tom B.", items:"Pepperoni 14in, Milkshake", total:14.50, status:"delivered", type:"collection", time:"45 min ago", phone:"+447700900005" },
];

const STATUS_FLOW = ["confirmed","preparing","firing","ready","out_for_delivery","delivered","collected"];

const STATUS_COLORS: Record<string,string> = { confirmed:"bg-blue-500/15 text-blue-400 border-blue-500/30", preparing:"bg-yellow-500/15 text-yellow-400 border-yellow-500/30", firing:"bg-orange-500/15 text-orange-400 border-orange-500/30", ready:"bg-emerald-500/15 text-emerald-400 border-emerald-500/30", out_for_delivery:"bg-cyan-500/15 text-cyan-400 border-cyan-500/30", delivered:"bg-green-500/15 text-green-400 border-green-500/30", collected:"bg-green-500/15 text-green-400 border-green-500/30" };

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchQ, setSearchQ] = useState("");
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(getDefaultPreferences);
  const funnel = useMemo(() => getConversionFunnel(), []);
  const popularItems = useMemo(() => getPopularItems(), []);
  const searchTerms = useMemo(() => getSearchTerms(), []);
  const notifLogs = useMemo(() => getNotificationLogs(), []);

  const advanceOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const idx = STATUS_FLOW.indexOf(o.status);
      const next = idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : o.status;
      return { ...o, status: next };
    }));
  };

  const filteredOrders = orders.filter((o) => o.ref.toLowerCase().includes(searchQ.toLowerCase()) || o.customer.toLowerCase().includes(searchQ.toLowerCase()));

  const tabs: { id: AdminTab; label: string; icon: typeof Shield }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "menu", label: "Menu", icon: ChefHat },
  ];

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[120] flex">
      <div className="w-56 bg-[#0a0a0d] border-r border-white/10 flex-col shrink-0 hidden md:flex">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--app-primary)]" />
            <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Admin</span>
          </div>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{BRAND.name} Dashboard</p>
        </div>
        <nav className="flex-grow p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={"w-full px-4 py-2.5 rounded-lg text-left text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer " + (tab === t.id ? "bg-[var(--app-primary)]/15 text-[var(--app-primary)] border border-[var(--app-primary)]/20" : "text-gray-400 hover:text-white hover:bg-white/5")}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={onClose} className="w-full px-4 py-2.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer">
            <LogOut className="w-4 h-4" /> Close
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="flex md:hidden gap-2 mb-4 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={"px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer " + (tab === t.id ? "bg-[var(--app-primary)] text-black" : "bg-white/5 text-gray-400")}>{t.label}</button>
          ))}
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer bg-red-500/10 text-red-400">Close</button>
        </div>
        {tab === "overview" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: ShoppingBag, label: "Active Orders", value: orders.filter(o => !["delivered","collected"].includes(o.status)).length, color: "text-blue-400" },
                { icon: DollarSign, label: "Today Revenue", value: "£" + orders.reduce((s,o) => s + o.total, 0).toFixed(2), color: "text-emerald-400" },
                { icon: Users, label: "Customers", value: orders.length, color: "text-purple-400" },
                { icon: TrendingUp, label: "Conversion", value: funnel.viewToCartRate + "%", color: "text-[var(--app-primary)]" },
              ].map(stat => (
                <div key={stat.label} className="bg-[#0d0e17] border border-white/10 rounded-xl p-5 space-y-2">
                  <stat.icon className={"w-5 h-5 " + stat.color} />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-white">{String(stat.value)}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0d0e17] border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0,5).map(o => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[var(--app-primary)]">{o.ref}</span>
                      <span className="text-xs text-gray-400">{o.customer}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={"text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border " + (STATUS_COLORS[o.status] || "bg-gray-500/15 text-gray-400")}>{o.status.replace(/_/g," ")}</span>
                      <span className="text-xs font-bold text-white">{"£" + o.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {popularItems.length > 0 && (
              <div className="bg-[#0d0e17] border border-white/10 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Items</h3>
                <div className="space-y-2">
                  {popularItems.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-white">#{i+1} {item.name}</span>
                      <span className="text-xs font-mono text-[var(--app-primary)]">{item.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">Order Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="bg-[#0d0e17] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none w-64" />
              </div>
            </div>
            <div className="space-y-3">
              {filteredOrders.map(o => (
                <div key={o.id} className="bg-[#0d0e17] border border-white/10 rounded-xl p-5 hover:border-[var(--app-primary)]/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[var(--app-primary)]">{o.ref}</span>
                        <span className={"text-[9px] font-bold uppercase px-2 py-0.5 rounded border " + (STATUS_COLORS[o.status] || "bg-gray-500/15")}>{o.status.replace(/_/g," ")}</span>
                        <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">{o.type}</span>
                      </div>
                      <p className="text-xs text-white font-medium">{o.customer}</p>
                      <p className="text-xs text-gray-400">{o.items}</p>
                      <p className="text-[9px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {o.time}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-display text-xl font-bold text-white">{"£" + o.total.toFixed(2)}</span>
                      <button onClick={() => advanceOrder(o.id)} className="px-3 py-1.5 bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/30 text-[var(--app-primary)] rounded-lg text-[9px] font-bold uppercase hover:bg-[var(--app-primary)]/20 cursor-pointer">Advance</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "analytics" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { l: "View to Cart", v: funnel.viewToCartRate+"%", s: funnel.addToCart+" adds" },
                { l: "Cart to Checkout", v: funnel.cartToCheckoutRate+"%", s: funnel.checkoutStart+" starts" },
                { l: "Checkout Success", v: funnel.checkoutSuccessRate+"%", s: funnel.checkoutComplete+" done" },
              ].map(m => (
                <div key={m.l} className="bg-[#0d0e17] border border-white/10 rounded-xl p-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{m.l}</p>
                  <p className="font-display text-3xl font-bold text-[var(--app-primary)] mt-2">{m.v}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{m.s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "notifications" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">Notifications</h2>
            <div className="bg-[#0d0e17] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 cursor-pointer">
                  <input type="checkbox" checked={notifPrefs.smsEnabled} onChange={e => { const p = {...notifPrefs, smsEnabled: e.target.checked}; setNotifPrefs(p); savePreferences(p); }} className="accent-[var(--app-primary)]" />
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-white">SMS</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 cursor-pointer">
                  <input type="checkbox" checked={notifPrefs.whatsappEnabled} onChange={e => { const p = {...notifPrefs, whatsappEnabled: e.target.checked}; setNotifPrefs(p); savePreferences(p); }} className="accent-[var(--app-primary)]" />
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-white">WhatsApp</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Phone</label>
                <input type="text" placeholder="+44..." value={notifPrefs.phone} onChange={e => { const p = {...notifPrefs, phone: e.target.value}; setNotifPrefs(p); savePreferences(p); }} className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none" />
              </div>
            </div>
            <div className="bg-[#0d0e17] border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Log ({notifLogs.length})</h3>
              {notifLogs.length === 0 ? <p className="text-xs text-gray-500">No notifications yet.</p> : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notifLogs.slice().reverse().map(log => (
                    <div key={log.id} className="p-3 bg-black/20 rounded-lg border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {log.type === "sms" ? <Smartphone className="w-3 h-3 text-blue-400" /> : <MessageSquare className="w-3 h-3 text-emerald-400" />}
                          <span className="text-[9px] font-bold uppercase">{log.type}</span>
                          <span className="text-[9px] text-gray-500">{log.recipient}</span>
                        </div>
                        <span className="text-[9px] text-gray-500">{new Date(log.sentAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === "menu" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">Menu Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MENU_ITEMS.map(item => (
                <div key={item.id} className="bg-[#0d0e17] border border-white/10 rounded-xl p-4 flex gap-3 hover:border-[var(--app-primary)]/20 transition-colors">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-900">
                    <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-500">{item.category}</p>
                    <p className="text-xs font-bold text-[var(--app-primary)]">{"£" + item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white cursor-pointer"><Edit3 className="w-3 h-3" /></button>
                    <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
