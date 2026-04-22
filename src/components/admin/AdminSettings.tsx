import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [shopifyVariantMap, setShopifyVariantMap] = useState("{}");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (settings) {
      setWhatsapp(settings.whatsapp_number || "");
      setEmail(settings.contact_email || "");
      setAddress(settings.club_house_address || "");
      setShopifyDomain(settings.shopify_store_domain || "");
      setShopifyVariantMap(settings.shopify_variant_map || "{}");
    }
  }, [settings]);

  const saveSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    toast.success("Setting updated!");
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) { toast.error("Enter an email"); return; }
    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke("add-admin", {
        body: { email: newAdminEmail.trim() },
      });
      if (error) { toast.error("Failed to add admin"); return; }
      if (data?.error) { toast.error(data.error); return; }
      toast.success(data?.message || "Admin added!");
      setNewAdminEmail("");
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg text-foreground">Site Settings</h2>
      
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">WhatsApp Number</label>
          <div className="flex gap-2">
            <input className="flex-1 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            <button onClick={() => saveSetting("whatsapp_number", whatsapp)} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Contact Email</label>
          <div className="flex gap-2">
            <input className="flex-1 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={() => saveSetting("contact_email", email)} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Tembo Club House Address</label>
          <div className="flex gap-2">
            <input className="flex-1 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={address} onChange={e => setAddress(e.target.value)} />
            <button onClick={() => saveSetting("club_house_address", address)} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Shopify Store Domain</label>
          <div className="flex gap-2">
            <input className="flex-1 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="your-store.myshopify.com" value={shopifyDomain} onChange={e => setShopifyDomain(e.target.value)} />
            <button onClick={() => saveSetting("shopify_store_domain", shopifyDomain)} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Shopify Variant Map JSON</label>
          <textarea
            className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm min-h-40"
            value={shopifyVariantMap}
            onChange={e => setShopifyVariantMap(e.target.value)}
            placeholder={`{\n  "watermelon-gin": { "full": "1234567890", "mini": "1234567891" },\n  "tropical-gin": { "full": "1234567892", "mini": "1234567893" }\n}`}
          />
          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Use Shopify variant IDs, keyed by Tembo product slug and bottle size. This powers the secure Shopify checkout redirect.
            </p>
            <button
              onClick={() => {
                try {
                  JSON.parse(shopifyVariantMap || "{}");
                } catch {
                  toast.error("Shopify variant map must be valid JSON");
                  return;
                }
                saveSetting("shopify_variant_map", shopifyVariantMap);
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-foreground font-semibold flex items-center gap-2"><UserPlus size={16} /> Add Admin</h3>
        <p className="text-xs text-muted-foreground">The person must first create an account on the website. Then enter their email below.</p>
        <div className="flex gap-2">
          <input className="flex-1 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="User email address" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
          <button onClick={addAdmin} disabled={adding} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
            {adding ? "Adding..." : "Add Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
