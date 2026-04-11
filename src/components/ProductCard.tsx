import { DbProduct } from "@/hooks/useProducts";
import { useRegion } from "@/context/RegionContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: DbProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { formatPrice } = useRegion();
  const { addItem } = useCart();

  const handleAddToCart = (size: "full" | "mini") => {
    addItem(product, size);
    toast.success(`${product.name} (${size === "full" ? "750ml" : "50ml"}) added to cart`);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded font-semibold uppercase tracking-wider">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-display text-lg text-foreground mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(product.rating || 0) ? "text-primary" : "text-muted"}>★</span>
          ))}
          <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">{formatPrice(product.price_full)}</span>
              <span className="text-xs text-muted-foreground ml-1">750ml</span>
            </div>
            <button
              onClick={() => handleAddToCart("full")}
              className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag size={14} /> Add
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <div>
              <span className="text-sm font-semibold text-foreground">{formatPrice(product.price_mini)}</span>
              <span className="text-xs text-muted-foreground ml-1">50ml</span>
            </div>
            <button
              onClick={() => handleAddToCart("mini")}
              className="flex items-center gap-1 bg-secondary text-foreground px-3 py-1.5 rounded text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border"
            >
              <ShoppingBag size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
