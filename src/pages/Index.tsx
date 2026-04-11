import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { usePromotions } from "@/hooks/usePromotions";
import { useAwards } from "@/hooks/useAwards";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { useRegion } from "@/context/RegionContext";
import { ArrowRight, Truck, Shield, Award, Leaf, Beaker, MapPin } from "lucide-react";
import awardPlaceholder from "@/assets/award-placeholder.jpg";

const Index = () => {
  const { region } = useRegion();
  const { data: products, isLoading } = useProducts();
  const { data: promotions } = usePromotions();
  const { data: awards } = useAwards();
  const featured = products?.filter((p) => p.featured) ?? [];

  return (
    <div className="pt-16">
      <HeroCarousel />

      {/* Promotions Banner */}
      {promotions && promotions.length > 0 && (
        <section className="bg-primary py-3">
          <div className="container mx-auto px-4 text-center">
            {promotions.map((promo) => (
              <div key={promo.id} className="text-primary-foreground">
                <span className="font-semibold">{promo.title}</span>
                {promo.description && <span className="ml-2 text-sm opacity-90">— {promo.description}</span>}
                {promo.discount_percent && promo.discount_percent > 0 && (
                  <span className="ml-2 font-bold">{promo.discount_percent}% OFF</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-6">
              <Award className="text-primary mx-auto mb-3 w-7 h-7 sm:w-9 sm:h-9" />
              <h3 className="font-display text-sm sm:text-lg text-foreground mb-2">Award Winning</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Internationally recognised spirits with multiple awards for excellence.</p>
            </div>
            <div className="text-center p-3 sm:p-6">
              <Leaf className="text-primary mx-auto mb-3 w-7 h-7 sm:w-9 sm:h-9" />
              <h3 className="font-display text-sm sm:text-lg text-foreground mb-2">Natural Ingredients</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Only the finest natural botanicals and flavours sourced from Africa.</p>
            </div>
            <div className="text-center p-3 sm:p-6">
              <Beaker className="text-primary mx-auto mb-3 w-7 h-7 sm:w-9 sm:h-9" />
              <h3 className="font-display text-sm sm:text-lg text-foreground mb-2">Expert Distillation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Master distillers with decades of experience crafting premium spirits.</p>
            </div>
            <div className="text-center p-3 sm:p-6">
              <MapPin className="text-primary mx-auto mb-3 w-7 h-7 sm:w-9 sm:h-9" />
              <h3 className="font-display text-sm sm:text-lg text-foreground mb-2">Nationwide Delivery</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Delivered to your door across multiple regions and countries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Bestsellers</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Featured Spirits</h2>
            <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
          </div>
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading spirits...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/shop" className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded font-semibold uppercase text-sm tracking-wider hover:bg-primary/10 transition-colors">
              View All Spirits <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      {awards && awards.length > 0 && (
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Recognition</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground">Award-Winning Spirits</h2>
              <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our spirits have been recognised at international competitions for their exceptional quality and flavour.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {awards.map(award => (
                <div key={award.id} className="text-center bg-card border border-border rounded-lg p-6">
                  <img
                    src={award.image_url || awardPlaceholder}
                    alt={award.title}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="font-display text-sm text-primary mb-1">{award.title}</h3>
                  <p className="text-xs text-muted-foreground">{award.product_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collection Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Our Range</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Premium Spirit Categories</h2>
            <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { name: "Gin", count: "4 Varieties" },
              { name: "Brandy", count: "1 Variety" },
              { name: "Whisky", count: "1 Variety" },
              { name: "Vodka", count: "1 Variety" },
              { name: "Fusion", count: "1 Variety" },
            ].map((cat) => (
              <div key={cat.name} className="text-center p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                <h3 className="font-display text-lg text-primary">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Worldwide</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">We Deliver To Your Region</h2>
            <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
          </div>
          <div className="bg-card border border-border rounded-lg p-8 max-w-lg mx-auto text-center">
            <p className="text-4xl mb-3">{region.flag}</p>
            <h3 className="font-display text-xl text-foreground">{region.name}</h3>
            <p className="text-muted-foreground text-sm mt-2">{region.deliveryInfo}</p>
            <p className="text-muted-foreground text-sm">Estimated: {region.deliveryDays}</p>
            <p className="text-primary font-semibold mt-3">Prices shown in {region.currency} ({region.currencySymbol})</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
