import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAllProducts } from "@/hooks/useProducts";
import { useProductGallery, type ProductGalleryAsset } from "@/hooks/useProductGallery";
import { supabase } from "@/integrations/supabase/client";

type GalleryFormItem = {
  id?: string;
  image_url: string;
  cocktail_name: string;
  caption: string;
  sort_order: string;
};

const emptyGalleryItem = (): GalleryFormItem => ({
  image_url: "",
  cocktail_name: "",
  caption: "",
  sort_order: "0",
});

const AdminProducts = () => {
  const { data: products, isLoading } = useAllProducts();
  const { data: galleryAssets } = useProductGallery();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [galleryForm, setGalleryForm] = useState<GalleryFormItem[]>([]);

  const galleryByProduct = useMemo(() => {
    const map = new Map<string, ProductGalleryAsset[]>();
    (galleryAssets ?? []).forEach((asset) => {
      const current = map.get(asset.product_id) ?? [];
      current.push(asset);
      map.set(asset.product_id, current);
    });
    return map;
  }, [galleryAssets]);

  const startEdit = (product: NonNullable<typeof products>[0]) => {
    const productGallery = galleryByProduct.get(product.id) ?? [];
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
    setGalleryForm(
      productGallery.map((item) => ({
        id: item.id,
        image_url: item.image_url,
        cocktail_name: item.cocktail_name,
        caption: item.caption || "",
        sort_order: String(item.sort_order ?? 0),
      })),
    );
  };

  const resetEditor = () => {
    setEditing(null);
    setForm({});
    setGalleryForm([]);
  };

  const saveEdit = async (id: string) => {
    const validGalleryItems = galleryForm.filter((item) => item.image_url.trim() && item.cocktail_name.trim());

    if (validGalleryItems.length > 0 && validGalleryItems.length < 3) {
      toast.error("Please add at least 3 cocktail images for this bottle.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        subtitle: form.subtitle,
        category: form.category,
        description: form.description,
        price_full: Number.parseFloat(form.price_full),
        price_mini: Number.parseFloat(form.price_mini),
        abv: form.abv,
        rating: Number.parseFloat(form.rating),
        featured: form.featured === "true",
        active: form.active === "true",
        image_url: form.image_url,
      })
      .eq("id", id);

    if (error) {
      toast.error(`Failed: ${error.message}`);
      return;
    }

    const { error: deleteGalleryError } = await supabase
      .from("product_gallery_assets")
      .delete()
      .eq("product_id", id);

    if (deleteGalleryError) {
      toast.error(deleteGalleryError.message);
      return;
    }

    const galleryPayload = validGalleryItems
      .map((item) => ({
        product_id: id,
        image_url: item.image_url.trim(),
        cocktail_name: item.cocktail_name.trim(),
        caption: item.caption.trim() || null,
        sort_order: Number.parseInt(item.sort_order, 10) || 0,
      }));

    if (galleryPayload.length > 0) {
      const { error: insertGalleryError } = await supabase
        .from("product_gallery_assets")
        .insert(galleryPayload);

      if (insertGalleryError) {
        toast.error(insertGalleryError.message);
        return;
      }
    }

    toast.success("Product updated");
    resetEditor();
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product-gallery-assets"] });
  };

  const handleImageUpload = async (productId: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${productId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (uploadError) {
      toast.error("Upload failed");
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("products").update({ image_url: publicUrl }).eq("id", productId);
    toast.success("Bottle image updated");
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    if (editing === productId) setForm((prev) => ({ ...prev, image_url: publicUrl }));
  };

  const handleGalleryUpload = async (index: number, file: File) => {
    if (!editing) return;
    const path = `${editing}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("product-gallery").upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-gallery").getPublicUrl(path);

    setGalleryForm((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, image_url: publicUrl } : item,
      ),
    );
    toast.success("Cocktail image uploaded");
  };

  if (isLoading) return <div className="text-muted-foreground">Loading products...</div>;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Manage Products</h2>
      {products?.map((product) => {
        const galleryCount = (galleryByProduct.get(product.id) ?? []).length;

        return (
          <div key={product.id} className="rounded-lg border border-border bg-card p-4">
            {editing === product.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div><label className="text-xs text-muted-foreground">Name</label><input className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><label className="text-xs text-muted-foreground">Subtitle</label><input className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
                  <div><label className="text-xs text-muted-foreground">Category</label>
                    <select className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="gin">Gin</option>
                      <option value="fusion">Fusion</option>
                      <option value="brandy">Brandy</option>
                      <option value="vodka">Vodka</option>
                      <option value="whisky">Whisky</option>
                    </select>
                  </div>
                  <div><label className="text-xs text-muted-foreground">ABV</label><input className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.abv} onChange={(e) => setForm({ ...form, abv: e.target.value })} /></div>
                  <div><label className="text-xs text-muted-foreground">Price (750ml)</label><input type="number" step="0.01" className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.price_full} onChange={(e) => setForm({ ...form, price_full: e.target.value })} /></div>
                  <div><label className="text-xs text-muted-foreground">Price (50ml)</label><input type="number" step="0.01" className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.price_mini} onChange={(e) => setForm({ ...form, price_mini: e.target.value })} /></div>
                  <div><label className="text-xs text-muted-foreground">Rating</label><input type="number" step="0.1" min="0" max="5" className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.featured === "true"} onChange={(e) => setForm({ ...form, featured: String(e.target.checked) })} /> Featured</label>
                    <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.active === "true"} onChange={(e) => setForm({ ...form, active: String(e.target.checked) })} /> Active</label>
                  </div>
                </div>
                <div><label className="text-xs text-muted-foreground">Description</label><textarea className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Bottle Image URL</label><input className="w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                  <Upload size={14} /> Upload Bottle Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(product.id, e.target.files[0]); }} />
                </label>

                <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Cocktail Gallery</h3>
                      <p className="text-sm text-muted-foreground">
                        Add at least 3 images per bottle so shoppers can open the bottle, then scroll through matching drinks and cocktails.
                      </p>
                    </div>
                    <button
                      onClick={() => setGalleryForm((current) => [...current, { ...emptyGalleryItem(), sort_order: String(current.length) }])}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <Plus size={14} /> Add Cocktail Image
                    </button>
                  </div>

                  {galleryForm.length === 0 && (
                    <p className="text-sm text-muted-foreground">No cocktail images added yet.</p>
                  )}

                  {galleryForm.map((item, index) => (
                    <div key={`${item.id || "new"}-${index}`} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1.1fr_1fr_1fr_110px_auto]">
                      <input className="rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="Image URL" value={item.image_url} onChange={(e) => setGalleryForm((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, image_url: e.target.value } : entry))} />
                      <input className="rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="Cocktail name" value={item.cocktail_name} onChange={(e) => setGalleryForm((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, cocktail_name: e.target.value } : entry))} />
                      <input className="rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="Caption" value={item.caption} onChange={(e) => setGalleryForm((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, caption: e.target.value } : entry))} />
                      <input type="number" className="rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={item.sort_order} onChange={(e) => setGalleryForm((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, sort_order: e.target.value } : entry))} />
                      <div className="flex items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                          <Upload size={14} />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleGalleryUpload(index, e.target.files[0]); }} />
                        </label>
                        <button onClick={() => setGalleryForm((current) => current.filter((_, entryIndex) => entryIndex !== index))} className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => saveEdit(product.id)} className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
                  <button onClick={resetEditor} className="rounded border border-border bg-secondary px-4 py-2 text-sm text-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="h-24 w-16 rounded object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-foreground">{product.name}</h3>
                    {!product.active && <span className="rounded bg-destructive/20 px-2 py-0.5 text-xs text-destructive">Inactive</span>}
                    {product.featured && <span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">Featured</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{product.category} - R{product.price_full} / R{product.price_mini}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {galleryCount} cocktail image{galleryCount === 1 ? "" : "s"} linked
                  </p>
                </div>
                <button onClick={() => startEdit(product)} className="rounded border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted">Edit</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminProducts;
