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
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (settings) {
      setWhatsapp(settings.whatsapp_number || "");
      setEmail(settings.contact_email || "");
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
