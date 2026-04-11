import { useState } from "react";
import { useAwards } from "@/hooks/useAwards";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

const AdminAwards = () => {
  const { data: awards, isLoading } = useAwards();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ product_name: "", title: "", image_url: "" });

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    const { error } = await supabase.from("awards").insert({
      product_name: form.product_name,
      title: form.title,
      image_url: form.image_url,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Award added!");
    setCreating(false);
    setForm({ product_name: "", title: "", image_url: "" });
    queryClient.invalidateQueries({ queryKey: ["awards"] });
  };

  const remove = async (id: string) => {
    await supabase.from("awards").delete().eq("id", id);
    toast.success("Award deleted");
    queryClient.invalidateQueries({ queryKey: ["awards"] });
  };

  const uploadImage = async (file: File) => {
    const path = `awards/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: publicUrl }));
    toast.success("Image uploaded!");
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Awards</h2>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold">
          <Plus size={14} /> New Award
        </button>
      </div>

      {creating && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Product Name (e.g. Soulicto Gin)" value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} />
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Award Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          <label className="flex items-center gap-2 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors w-fit">
            <Upload size={14} /> Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
            <button onClick={() => setCreating(false)} className="bg-secondary text-foreground px-4 py-2 rounded text-sm border border-border">Cancel</button>
          </div>
        </div>
      )}

      {awards?.map(a => (
        <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          {a.image_url && <img src={a.image_url} alt={a.title} className="w-14 h-14 object-cover rounded" />}
          <div className="flex-1">
            <h3 className="text-foreground font-semibold">{a.title}</h3>
            <p className="text-xs text-muted-foreground">{a.product_name}</p>
          </div>
          <button onClick={() => remove(a.id)} className="text-destructive p-1.5"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  );
};

export default AdminAwards;
