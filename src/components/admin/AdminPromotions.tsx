import { useState } from "react";
import { useAllPromotions } from "@/hooks/usePromotions";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const AdminPromotions = () => {
  const { data: promotions, isLoading } = useAllPromotions();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", discount_percent: "0", active: "true" });

  const savePromo = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const data = { title: form.title, description: form.description, discount_percent: parseInt(form.discount_percent), active: form.active === "true" };
    if (editing) {
      const { error } = await supabase.from("promotions").update(data).eq("id", editing);
      if (error) { toast.error(error.message); return; }
      toast.success("Promotion updated!");
    } else {
      const { error } = await supabase.from("promotions").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Promotion created!");
    }
    setEditing(null); setCreating(false);
    setForm({ title: "", description: "", discount_percent: "0", active: "true" });
    queryClient.invalidateQueries({ queryKey: ["all-promotions"] });
    queryClient.invalidateQueries({ queryKey: ["promotions"] });
  };

  const deletePromo = async (id: string) => {
    await supabase.from("promotions").delete().eq("id", id);
    toast.success("Deleted");
    queryClient.invalidateQueries({ queryKey: ["all-promotions"] });
    queryClient.invalidateQueries({ queryKey: ["promotions"] });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Manage Promotions</h2>
        <button onClick={() => { setCreating(true); setEditing(null); setForm({ title: "", description: "", discount_percent: "0", active: "true" }); }} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold">
          <Plus size={14} /> New
        </button>
      </div>
      {(creating || editing) && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <div><label className="text-xs text-muted-foreground">Discount %</label><input type="number" min="0" max="100" className="w-24 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.discount_percent} onChange={e => setForm({ ...form, discount_percent: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm text-foreground mt-5"><input type="checkbox" checked={form.active === "true"} onChange={e => setForm({ ...form, active: String(e.target.checked) })} /> Active</label>
          </div>
          <div className="flex gap-2">
            <button onClick={savePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="bg-secondary text-foreground px-4 py-2 rounded text-sm border border-border">Cancel</button>
          </div>
        </div>
      )}
      {promotions?.map(promo => (
        <div key={promo.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="text-foreground font-semibold">{promo.title}</h3>
            <p className="text-sm text-muted-foreground">{promo.description}</p>
            <div className="flex gap-2 mt-1">
              {promo.discount_percent && promo.discount_percent > 0 && <span className="text-xs text-primary">{promo.discount_percent}% off</span>}
              <span className={`text-xs ${promo.active ? "text-green-500" : "text-destructive"}`}>{promo.active ? "Active" : "Inactive"}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setEditing(promo.id); setCreating(false); setForm({ title: promo.title, description: promo.description || "", discount_percent: String(promo.discount_percent || 0), active: String(promo.active) }); }} className="bg-secondary text-foreground px-3 py-1.5 rounded text-xs border border-border">Edit</button>
            <button onClick={() => deletePromo(promo.id)} className="text-destructive p-1.5"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      {(!promotions || promotions.length === 0) && !creating && <p className="text-muted-foreground text-sm">No promotions yet.</p>}
    </div>
  );
};

export default AdminPromotions;
