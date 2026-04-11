import { useState } from "react";
import { useAllHeroBanners } from "@/hooks/useHeroBanners";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

const AdminBanners = () => {
  const { data: banners, isLoading } = useAllHeroBanners();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", sort_order: "0" });

  const saveBanner = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const { error } = await supabase.from("hero_banners").insert({
      title: form.title,
      subtitle: form.subtitle,
      image_url: form.image_url,
      sort_order: parseInt(form.sort_order),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Banner added!");
    setCreating(false);
    setForm({ title: "", subtitle: "", image_url: "", sort_order: "0" });
    queryClient.invalidateQueries({ queryKey: ["all-hero-banners"] });
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from("hero_banners").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Banner deleted");
    queryClient.invalidateQueries({ queryKey: ["all-hero-banners"] });
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
  };

  const uploadImage = async (file: File) => {
    const path = `banners/${Date.now()}-${file.name}`;
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
        <h2 className="font-display text-lg text-foreground">Hero Banners</h2>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold">
          <Plus size={14} /> New Banner
        </button>
      </div>

      {creating && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Title (displayed on hero)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
          <input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          <label className="flex items-center gap-2 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors w-fit">
            <Upload size={14} /> Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
          </label>
          <div className="flex gap-2">
            <button onClick={saveBanner} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
            <button onClick={() => setCreating(false)} className="bg-secondary text-foreground px-4 py-2 rounded text-sm border border-border">Cancel</button>
          </div>
        </div>
      )}

      {banners?.map(b => (
        <div key={b.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <img src={b.image_url} alt={b.title} className="w-24 h-14 object-cover rounded" />
          <div className="flex-1">
            <h3 className="text-foreground font-semibold">{b.title}</h3>
            <p className="text-xs text-muted-foreground">{b.subtitle}</p>
          </div>
          <button onClick={() => deleteBanner(b.id)} className="text-destructive p-1.5"><Trash2 size={14} /></button>
        </div>
      ))}

      {(!banners || banners.length === 0) && !creating && (
        <p className="text-muted-foreground text-sm">No banners yet. Default images will be used.</p>
      )}
    </div>
  );
};

export default AdminBanners;
