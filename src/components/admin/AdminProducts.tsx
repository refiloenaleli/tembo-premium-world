import { useState } from "react";
import { useAllProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";

const AdminProducts = () => {
  const { data: products, isLoading } = useAllProducts();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const startEdit = (product: NonNullable<typeof products>[0]) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      subtitle: product.subtitle || "",
      category: product.category,
      description: product.description || "",
      price_full: String(product.price_full),
      price_mini: String(product.price_mini),
      abv: product.abv || "",
      rating: String(product.rating || 0),
      featured: String(product.featured),
      active: String(product.active),
      image_url: product.image_url || "",
    });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: form.name, subtitle: form.subtitle, category: form.category,
        description: form.description, price_full: parseFloat(form.price_full),
        price_mini: parseFloat(form.price_mini), abv: form.abv,
        rating: parseFloat(form.rating), featured: form.featured === "true",
        active: form.active === "true", image_url: form.image_url,
      })
      .eq("id", id);
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Product updated!");
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleImageUpload = async (productId: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `${productId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Upload failed"); return; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("products").update({ image_url: publicUrl }).eq("id", productId);
    toast.success("Image updated!");
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    if (editing === productId) setForm(prev => ({ ...prev, image_url: publicUrl }));
  };

  if (isLoading) return <div className="text-muted-foreground">Loading products...</div>;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Manage Products</h2>
      {products?.map((product) => (
        <div key={product.id} className="bg-card border border-border rounded-lg p-4">
          {editing === product.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Name</label><input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Subtitle</label><input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Category</label>
                  <select className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="gin">Gin</option><option value="brandy">Brandy</option><option value="whisky">Whisky</option><option value="vodka">Vodka</option>
                  </select>
                </div>
                <div><label className="text-xs text-muted-foreground">ABV</label><input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.abv} onChange={e => setForm({ ...form, abv: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Price (750ml)</label><input type="number" step="0.01" className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.price_full} onChange={e => setForm({ ...form, price_full: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Price (50ml)</label><input type="number" step="0.01" className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.price_mini} onChange={e => setForm({ ...form, price_mini: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Rating</label><input type="number" step="0.1" min="0" max="5" className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} /></div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.featured === "true"} onChange={e => setForm({ ...form, featured: String(e.target.checked) })} /> Featured</label>
                  <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.active === "true"} onChange={e => setForm({ ...form, active: String(e.target.checked) })} /> Active</label>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground">Description</label><textarea className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="text-xs text-muted-foreground">Image URL</label><input className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
              <label className="flex items-center gap-2 bg-secondary border border-border text-foreground rounded px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors w-fit">
                <Upload size={14} /> Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(product.id, e.target.files[0]); }} />
              </label>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(product.id)} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold">Save</button>
                <button onClick={() => setEditing(null)} className="bg-secondary text-foreground px-4 py-2 rounded text-sm border border-border">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 items-start">
              <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-16 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-foreground">{product.name}</h3>
                  {!product.active && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">Inactive</span>}
                  {product.featured && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Featured</span>}
                </div>
                <p className="text-sm text-muted-foreground">{product.category} · R{product.price_full} / R{product.price_mini}</p>
              </div>
              <button onClick={() => startEdit(product)} className="bg-secondary text-foreground px-3 py-1.5 rounded text-xs font-semibold border border-border hover:bg-muted transition-colors">Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
