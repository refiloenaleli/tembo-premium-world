import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { MessageCircle, Check, Truck, XCircle } from "lucide-react";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const waNumber = (settings?.whatsapp_number || "+26659385613").replace(/[^0-9]/g, "");

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order marked as ${status}`);
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading orders...</div>;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Orders</h2>
      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-foreground font-semibold">{order.customer_name}</h3>
                  <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  {order.customer_phone && <p className="text-sm text-muted-foreground">{order.customer_phone}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Region: {order.region_id.toUpperCase()} · {order.currency} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  {order.notes && <p className="text-xs text-muted-foreground mt-1 italic">{order.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">{order.currency} {order.total_amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    order.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                    order.status === "shipped" ? "bg-blue-500/20 text-blue-400" :
                    order.status === "done" ? "bg-primary/20 text-primary" :
                    order.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${order.customer_name}, regarding your Tembo order #${order.id.slice(0,8)} (${order.currency} ${order.total_amount}). `)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-[#25D366] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle size={12} /> WhatsApp Customer
                </a>
                <a
                  href={`mailto:${order.customer_email}?subject=Your Tembo Order %23${order.id.slice(0,8)}&body=Hi ${order.customer_name},%0A%0ARegarding your order of ${order.currency} ${order.total_amount}.%0A%0A`}
                  className="flex items-center gap-1 bg-secondary text-foreground px-3 py-1.5 rounded text-xs font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Email Customer
                </a>
                {order.status === "pending" && (
                  <button onClick={() => updateStatus(order.id, "confirmed")} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-green-700 transition-colors">
                    <Check size={12} /> Confirm
                  </button>
                )}
                {order.status === "confirmed" && (
                  <button onClick={() => updateStatus(order.id, "shipped")} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 transition-colors">
                    <Truck size={12} /> Mark Shipped
                  </button>
                )}
                {(order.status === "shipped" || order.status === "confirmed") && (
                  <button onClick={() => updateStatus(order.id, "done")} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary/90 transition-colors">
                    <Check size={12} /> Mark Done
                  </button>
                )}
                {order.status !== "cancelled" && order.status !== "done" && (
                  <button onClick={() => updateStatus(order.id, "cancelled")} className="flex items-center gap-1 text-destructive px-3 py-1.5 rounded text-xs border border-destructive/30 hover:bg-destructive/10 transition-colors">
                    <XCircle size={12} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No orders yet.</p>
      )}
    </div>
  );
};

export default AdminOrders;
