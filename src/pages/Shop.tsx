import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts, type DbProduct } from "@/hooks/useProducts";
import { useProductGallery, type ProductGalleryAsset } from "@/hooks/useProductGallery";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type FallbackGalleryItem = {
  id: string;
  image_url: string;
  cocktail_name: string;
  caption: string;
};

const createGalleryCardDataUrl = (productName: string, cocktailName: string, caption: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0A0A0A" />
          <stop offset="45%" stop-color="#1A120B" />
          <stop offset="100%" stop-color="#2A1B3D" />
        </linearGradient>
        <radialGradient id="glow" cx="20%" cy="10%" r="90%">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#D4AF37" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <rect width="1200" height="900" fill="url(#glow)" />
      <rect x="48" y="48" width="1104" height="804" rx="36" fill="rgba(255,255,255,0.06)" stroke="rgba(212,175,55,0.26)" />
      <text x="84" y="120" fill="#D4AF37" font-size="26" letter-spacing="7" font-family="Arial, sans-serif">TEMBO SIGNATURE SERVE</text>
      <text x="84" y="215" fill="#FFFFFF" font-size="60" font-family="Georgia, serif">${productName}</text>
      <text x="84" y="315" fill="#F5E6D3" font-size="54" font-family="Georgia, serif">${cocktailName}</text>
      <text x="84" y="415" fill="#F8D7E3" font-size="30" font-family="Arial, sans-serif">${caption}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const fallbackGalleryBySlug: Record<string, Array<{ cocktail_name: string; caption: string }>> = {
  "watermelon-gin": [
    { cocktail_name: "Watermelon Sunset Spritz", caption: "A bright chilled serve with tonic, mint, and sunset citrus." },
    { cocktail_name: "Tembo Pink Fizz", caption: "Fresh bubbles, soft fruit, and a polished rose-gold finish." },
    { cocktail_name: "Summer Terrace Pour", caption: "A clean premium pour designed for long warm evenings." },
  ],
  "tropical-gin": [
    { cocktail_name: "Tropical Gold Collins", caption: "Botanicals, citrus, and a light sparkling lift." },
    { cocktail_name: "Island Bloom", caption: "A softer fruit-led serve with a luxurious aromatic profile." },
    { cocktail_name: "Tembo Palm Cooler", caption: "A refreshing premium mixed drink with sunny depth." },
  ],
  "soulicto-gin": [
    { cocktail_name: "Soulcito Star Martini", caption: "Silky texture with a bold, elegant finish." },
    { cocktail_name: "Midnight Gold Pour", caption: "A darker, moodier signature serve for evening hosting." },
    { cocktail_name: "Tembo Velvet Tonic", caption: "Minimal, refined, and built around clean character." },
  ],
  ginsky: [
    { cocktail_name: "Ginsky Legacy Sour", caption: "An expressive fusion serve with smooth layered warmth." },
    { cocktail_name: "Club House Old Fashioned", caption: "A richer cocktail built for slower premium sipping." },
    { cocktail_name: "Tembo Ember Highball", caption: "A crisp long drink with polished spice and lift." },
  ],
  "funga-caramel-brandy": [
    { cocktail_name: "Caramel Velvet", caption: "A warm dessert-style pour with smooth Tembo richness." },
    { cocktail_name: "Fireside Reserve", caption: "A darker celebratory serve with subtle golden sweetness." },
    { cocktail_name: "Tembo Nightcap", caption: "A luxurious end-of-evening brandy ritual." },
  ],
  "mshale-caramel-vodka": [
    { cocktail_name: "Caramel Espresso Tembo", caption: "A sleek after-dinner serve with bold roasted notes." },
    { cocktail_name: "Mshale Silk Martini", caption: "A smooth premium cocktail with soft caramel depth." },
    { cocktail_name: "Golden Cream Pour", caption: "An indulgent, lounge-ready signature serve." },
  ],
  "risasi-vanilla-whisky": [
    { cocktail_name: "Highveld Vanilla Sour", caption: "Fresh citrus and vanilla warmth in a refined whisky serve." },
    { cocktail_name: "Risasi Gold Highball", caption: "Clean lift, elegant spice, and a long luxurious finish." },
    { cocktail_name: "Tembo Reserve Night", caption: "A richer whisky experience designed for slow sipping." },
  ],
};

const Shop = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DbProduct | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const { data: products, isLoading } = useProducts();
  const { data: galleryAssets } = useProductGallery();
  const { addItem } = useCart();
  const { formatPrice } = useRegion();
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);

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

  const getGalleryItems = (product: DbProduct) => {
    const galleryItems = galleryByProduct.get(product.id) ?? [];

    if (galleryItems.length > 0) {
      return galleryItems;
    }

    const fallbackEntries = fallbackGalleryBySlug[product.slug] ?? [
      { cocktail_name: `${product.name} Signature Serve`, caption: "A premium Tembo presentation while gallery photos are being prepared." },
      { cocktail_name: `${product.name} House Cocktail`, caption: "A refined club-style serve built around this bottle." },
      { cocktail_name: `${product.name} Celebration Pour`, caption: "An elegant signature pour for premium occasions." },
    ];

    return fallbackEntries.map((entry, index) => ({
      id: `${product.slug}-fallback-${index}`,
      image_url: createGalleryCardDataUrl(product.name, entry.cocktail_name, entry.caption),
      cocktail_name: entry.cocktail_name,
      caption: entry.caption,
    })) as Array<ProductGalleryAsset | FallbackGalleryItem>;
  };

  const selectedGallery = selectedProduct ? getGalleryItems(selectedProduct) : [];

  useEffect(() => {
    setSelectedGalleryIndex(0);
    galleryScrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [selectedProduct]);

  const scrollGalleryBy = (direction: "prev" | "next") => {
    const container = galleryScrollRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>("[data-gallery-card='true']");
    const cardWidth = card?.offsetWidth ?? container.clientWidth * 0.82;
    const delta = direction === "next" ? cardWidth + 16 : -(cardWidth + 16);
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

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
                const galleryCount = getGalleryItems(product).length;

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
            <div className="grid max-h-[90vh] overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
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
                  className="max-h-[72vh] w-full object-contain"
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-primary">Cocktails & Serves</p>
                      <h3 className="mt-2 font-display text-2xl text-foreground">Scroll sideways to explore what this bottle becomes</h3>
                    </div>
                    {selectedGallery.length > 1 && (
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => scrollGalleryBy("prev")}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:border-primary"
                          aria-label="Previous gallery image"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollGalleryBy("next")}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:border-primary"
                          aria-label="Next gallery image"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Swipe or scroll horizontally to see cocktail photos and extra bottle visuals.
                  </div>

                  {selectedGallery.length > 0 ? (
                    <div className="space-y-4">
                      <div
                        ref={galleryScrollRef}
                        onScroll={(event) => {
                          const container = event.currentTarget;
                          const card = container.querySelector<HTMLElement>("[data-gallery-card='true']");
                          const cardWidth = card?.offsetWidth ?? container.clientWidth;
                          const nextIndex = Math.round(container.scrollLeft / (cardWidth + 16));
                          setSelectedGalleryIndex(Math.max(0, Math.min(selectedGallery.length - 1, nextIndex)));
                        }}
                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {selectedGallery.map((asset, index) => (
                          <article
                            key={asset.id}
                            data-gallery-card="true"
                            className="min-w-[82%] snap-center overflow-hidden rounded-[1.75rem] border border-border bg-card sm:min-w-[68%]"
                          >
                            <img
                              src={asset.image_url}
                              alt={asset.cocktail_name}
                              loading="lazy"
                              className="h-72 w-full object-cover"
                            />
                            <div className="space-y-2 p-5">
                              <p className="text-[11px] uppercase tracking-[0.28em] text-primary">Gallery {index + 1}</p>
                              <h4 className="font-display text-2xl text-foreground">{asset.cocktail_name}</h4>
                              <p className="text-sm leading-6 text-muted-foreground">
                                {asset.caption || "Signature Tembo serve."}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {selectedGallery.map((asset, index) => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => {
                                const container = galleryScrollRef.current;
                                const card = container?.querySelector<HTMLElement>("[data-gallery-card='true']");
                                if (!container || !card) return;
                                container.scrollTo({ left: index * (card.offsetWidth + 16), behavior: "smooth" });
                              }}
                              aria-label={`View gallery image ${index + 1}`}
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                index === selectedGalleryIndex ? "w-10 bg-primary" : "w-2.5 bg-border hover:bg-primary/60"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          {selectedGalleryIndex + 1} / {selectedGallery.length}
                        </p>
                      </div>
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
