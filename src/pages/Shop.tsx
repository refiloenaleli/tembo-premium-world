import { useMemo, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts, type DbProduct } from "@/hooks/useProducts";
import { useProductGallery, type ProductGalleryAsset } from "@/hooks/useProductGallery";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Shop = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DbProduct | null>(null);
  const { data: products, isLoading } = useProducts();
  const { data: galleryAssets } = useProductGallery();
  const { addItem } = useCart();
  const { formatPrice } = useRegion();

  const categories = ["all", "gin", "fusion", "brandy", "vodka", "whisky"];

  const galleryByProduct = useMemo(() => {
    const map = new Map<string, ProductGalleryAsset[]>();
    (galleryAssets ?? []).forEach((asset) => {
      const current = map.get(asset.product_id) ?? [];
      current.push(asset);
      map.set(asset.product_id, current);
    });
    return map;
  }, [galleryAssets]);

  const filtered = (products ?? []).filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product: DbProduct, size: "full" | "mini") => {
    addItem(product, size);
    toast.success(`${product.name} (${size === "full" ? "750ml" : "50ml"}) added to cart`);
  };

  const selectedGallery = selectedProduct ? (galleryByProduct.get(selectedProduct.id) ?? []) : [];

  return (
    <div className="pt-16">
      <div className="border-b border-border bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Collection</p>
          <h1 className="font-display text-4xl text-foreground">Premium Spirits</h1>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search spirits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={100}
            className="w-full rounded border border-border bg-secondary px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary sm:w-64"
          />
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading spirits...</div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{filtered.length} spirits found</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => {
                const galleryCount = (galleryByProduct.get(product.id) ?? []).length;

                return (
                  <div key={product.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-gold">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="relative block aspect-[2/3] w-full overflow-hidden bg-secondary text-left"
                    >
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-5 text-white">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/70">{product.category}</p>
                        <p className="mt-2 font-display text-2xl">{product.name}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/75">
                          Tap to enlarge bottle and view cocktails
                        </p>
                      </div>
                    </button>

                    <div className="space-y-3 p-5">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {galleryCount} cocktail image{galleryCount === 1 ? "" : "s"} available
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-primary">{formatPrice(product.price_full)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">750ml</span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product, "full")}
                            className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            <ShoppingBag size={14} /> Add
                          </button>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-2">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{formatPrice(product.price_mini)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">50ml</span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product, "mini")}
                            className="flex items-center gap-1 rounded border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
                          >
                            <ShoppingBag size={14} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">No spirits found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden border-border bg-background p-0">
          {selectedProduct && (
            <div className="grid max-h-[90vh] overflow-y-auto lg:grid-cols-[0.95fr_1.05fr]">
              <div className="sticky top-0 flex min-h-[24rem] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,173,72,0.18),_transparent_45%),linear-gradient(180deg,_rgba(17,17,17,0.95),_rgba(17,17,17,0.88))] p-8">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white"
                >
                  <X size={18} />
                </button>
                <img
                  src={selectedProduct.image_url || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">{selectedProduct.category}</p>
                  <h2 className="mt-3 font-display text-4xl text-foreground">{selectedProduct.name}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
                  <button
                    onClick={() => handleAddToCart(selectedProduct, "full")}
                    className="rounded-xl bg-primary px-4 py-3 text-left text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <span className="block text-xs uppercase tracking-[0.24em] opacity-80">750ml</span>
                    <span className="mt-2 block text-2xl font-semibold">{formatPrice(selectedProduct.price_full)}</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(selectedProduct, "mini")}
                    className="rounded-xl border border-border bg-secondary px-4 py-3 text-left text-foreground transition-colors hover:border-primary"
                  >
                    <span className="block text-xs uppercase tracking-[0.24em] text-muted-foreground">50ml</span>
                    <span className="mt-2 block text-2xl font-semibold">{formatPrice(selectedProduct.price_mini)}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary">Cocktails & Serves</p>
                    <h3 className="mt-2 font-display text-2xl text-foreground">Scroll through drinks made with this bottle</h3>
                  </div>

                  {selectedGallery.length > 0 ? (
                    <div className="space-y-4">
                      {selectedGallery.map((asset) => (
                        <article key={asset.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                          <img
                            src={asset.image_url}
                            alt={asset.cocktail_name}
                            loading="lazy"
                            className="h-72 w-full object-cover"
                          />
                          <div className="space-y-2 p-5">
                            <h4 className="font-display text-2xl text-foreground">{asset.cocktail_name}</h4>
                            <p className="text-sm leading-6 text-muted-foreground">
                              {asset.caption || "Signature Tembo serve."}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                      Cocktail images will appear here after the admin adds them for this bottle.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
