import { Link } from "react-router-dom";
import { ArrowRight, Award, Beaker, Leaf, MapPin } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import awardPlaceholder from "@/assets/award-placeholder.jpg";
import { useProducts } from "@/hooks/useProducts";
import { usePromotions } from "@/hooks/usePromotions";
import { useAwards } from "@/hooks/useAwards";
import { useRegion } from "@/context/RegionContext";

const Index = () => {
  const { region } = useRegion();
  const { data: products, isLoading } = useProducts();
  const { data: promotions } = usePromotions();
  const { data: awards } = useAwards();
  const featured = (products ?? []).filter((product) => product.featured).slice(0, 4);

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,173,72,0.18),_transparent_45%)]" />
        <div className="container relative mx-auto px-4 py-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <img
              src="/images/misc/tembo-logo.jpg"
              alt="Tembo Premium"
              className="h-28 w-28 rounded-full border border-primary/40 object-cover shadow-gold sm:h-32 sm:w-32"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-primary">Tembo Signature</p>
              <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">Tembo Premium</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.35em] text-muted-foreground sm:text-base">We are mwasi.</p>
            </div>
          </div>
        </div>
      </section>

      <HeroCarousel />

      {promotions && promotions.length > 0 && (
        <section className="bg-primary py-3">
          <div className="container mx-auto px-4 text-center">
            {promotions.map((promo) => (
              <div key={promo.id} className="text-primary-foreground">
                <span className="font-semibold">{promo.title}</span>
                {promo.description && <span className="ml-2 text-sm opacity-90">- {promo.description}</span>}
                {promo.discount_percent && promo.discount_percent > 0 && (
                  <span className="ml-2 font-bold">{promo.discount_percent}% OFF</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-border bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            <div className="p-3 text-center sm:p-6">
              <Award className="mx-auto mb-3 h-7 w-7 text-primary sm:h-9 sm:w-9" />
              <h3 className="mb-2 font-display text-sm text-foreground sm:text-lg">Award Winning</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">Internationally recognised spirits with multiple awards for excellence.</p>
            </div>
            <div className="p-3 text-center sm:p-6">
              <Leaf className="mx-auto mb-3 h-7 w-7 text-primary sm:h-9 sm:w-9" />
              <h3 className="mb-2 font-display text-sm text-foreground sm:text-lg">Natural Ingredients</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">Only the finest natural botanicals and flavours sourced from Africa.</p>
            </div>
            <div className="p-3 text-center sm:p-6">
              <Beaker className="mx-auto mb-3 h-7 w-7 text-primary sm:h-9 sm:w-9" />
              <h3 className="mb-2 font-display text-sm text-foreground sm:text-lg">Expert Distillation</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">Master distillers with decades of experience crafting premium spirits.</p>
            </div>
            <div className="p-3 text-center sm:p-6">
              <MapPin className="mx-auto mb-3 h-7 w-7 text-primary sm:h-9 sm:w-9" />
              <h3 className="mb-2 font-display text-sm text-foreground sm:text-lg">Nationwide Delivery</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">Delivered to your door across multiple regions and countries.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Bestsellers</p>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">Featured Spirits</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />
          </div>
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading spirits...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10">
              View All Spirits <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Recognition</p>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">Tembo Awards</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our spirits have been recognised for their exceptional quality and craftsmanship.
            </p>
          </div>
          {awards && awards.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {awards.map((award) => (
                <div key={award.id} className="rounded-lg border border-border bg-card p-6 text-center">
                  <img
                    src={award.image_url || awardPlaceholder}
                    alt={award.title}
                    className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
                    loading="lazy"
                  />
                  <h3 className="mb-1 font-display text-sm text-primary">{award.title}</h3>
                  <p className="text-xs text-muted-foreground">{award.product_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-card px-8 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Awards added from the admin dashboard will appear here on the home page.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Range</p>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">The Tembo Collection</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 sm:gap-4">
            {[
              "Watermelon Gin",
              "Tropical Gin",
              "Soulicto Gin",
              "Ginsky",
              "Funga Caramel Brandy",
              "Mshale Caramel Vodka",
              "Risasi Vanilla Whisky",
            ].map((name) => (
              <div key={name} className="rounded-lg border border-border bg-card p-5 text-center transition-colors hover:border-primary">
                <h3 className="font-display text-base text-primary">{name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Worldwide</p>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">We Deliver To Your Region</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />
          </div>
          <div className="mx-auto max-w-lg rounded-lg border border-border bg-card p-8 text-center">
            <p className="mb-3 text-4xl">{region.flag}</p>
            <h3 className="font-display text-xl text-foreground">{region.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{region.deliveryInfo}</p>
            <p className="text-sm text-muted-foreground">Estimated: {region.deliveryDays}</p>
            <p className="mt-3 font-semibold text-primary">Prices shown in {region.currency} ({region.currencySymbol})</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
