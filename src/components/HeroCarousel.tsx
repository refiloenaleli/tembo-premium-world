import { useState, useEffect, useCallback } from "react";
import { useHeroBanners } from "@/hooks/useHeroBanners";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegion } from "@/context/RegionContext";
import heroFallback1 from "@/assets/hero-1.jpg";
import heroFallback2 from "@/assets/hero-2.jpg";
import heroFallback3 from "@/assets/hero-3.jpg";

const fallbackSlides = [
  { id: "f1", title: "Discover Our Premium Collection", subtitle: "Handcrafted spirits born from rich heritage and passion for perfection.", image_url: heroFallback1 },
  { id: "f2", title: "Crafted With African Excellence", subtitle: "Traditional methods meet modern distillation for extraordinary flavour.", image_url: heroFallback2 },
  { id: "f3", title: "Celebrate Every Moment", subtitle: "Premium cocktails and spirits for life's finest occasions.", image_url: heroFallback3 },
];

const HeroCarousel = () => {
  const { data: banners } = useHeroBanners();
  const { region } = useRegion();
  const [current, setCurrent] = useState(0);

  const slides = banners && banners.length > 0
    ? banners.map(b => ({ id: b.id, title: b.title, subtitle: b.subtitle || "", image_url: b.image_url }))
    : fallbackSlides;

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {slides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
      ))}
      <div className="container mx-auto px-4 relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 animate-fade-in-up">Tembo Premium Spirits</p>
        <h1 className="font-display text-2xl sm:text-4xl md:text-7xl font-bold text-foreground mb-4 animate-fade-in-up max-w-3xl" style={{ animationDelay: "0.1s" }}>
          <span className="text-gradient-gold">{slide.title}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {slide.subtitle || `Now delivering to ${region.name}.`}
        </p>
        <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 sm:px-8 py-2.5 sm:py-3 rounded font-semibold uppercase text-xs sm:text-sm tracking-wider hover:bg-primary/90 transition-colors">
            Explore Spirits
          </Link>
          <Link to="/about" className="inline-flex items-center gap-2 border border-primary text-primary px-5 sm:px-8 py-2.5 sm:py-3 rounded font-semibold uppercase text-xs sm:text-sm tracking-wider hover:bg-primary/10 transition-colors">
            Our Story
          </Link>
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/50 rounded-full text-foreground hover:bg-background/80 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/50 rounded-full text-foreground hover:bg-background/80 transition-colors">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
