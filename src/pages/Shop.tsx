import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

const Shop = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts();

  const categories = ["all", "gin", "brandy", "whisky", "vodka"];

  const filtered = (products ?? []).filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-16">
      <div className="bg-secondary border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Our Collection</p>
          <h1 className="font-display text-4xl text-foreground">Premium Spirits</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
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
            className="bg-secondary border border-border text-foreground rounded px-4 py-2 text-sm w-full sm:w-64 outline-none focus:border-primary transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading spirits...</div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} spirits found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No spirits found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
