import { useState, useEffect, useCallback } from "react";
import { useHeroBanners } from "@/hooks/useHeroBanners";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegion } from "@/context/RegionContext";

const HeroCarousel = () => {
  const { data: banners, isLoading } = useHeroBanners();
  const { region } = useRegion();
  const [current, setCurrent] = useState(0);

  // Use only real banners from Supabase. No fallback to Lovable images.
  const slides = banners && banners.length > 0 
    ? banners.map(b => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle || "",
        image_url: b.image_url,
      }))
    : [];

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent(c => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent(c => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Show loading state while banners are fetching
  if (isLoading) {
    return (
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] min-h-[400px] flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading premium experience...</p>
        </div>
      </section>
    );
  }

  // If no banners at all, show a nice placeholder message
  if (slides.length === 0) {
    return (
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] min-h-[400px] flex items-center justify-center bg-secondary overflow-hidden">
        <div className="text-center z-10">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4">
            TEMBO PREMIUM SPIRITS
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Premium handcrafted spirits from Lesotho
          </p>
          <Link 
            to="/shop" 
            className="mt-8 inline-block bg-primary text-primary-foreground px-10 py-4 rounded font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div 
          key={s.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img 
            src={s.image_url} 
            alt={s.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Tembo Premium Spirits</p>
        
        <h1 className="font-display text-2xl sm:text-4xl md:text-7xl font-bold text-white mb-4 max-w-3xl leading-tight">
          {slide.title}
        </h1>

        <p className="text-base sm:text-lg text-white/90 max-w-lg mb-8">
          {slide.subtitle || `Now delivering to ${region.name}.`}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded font-semibold uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors"
          >
            Explore Spirits
          </Link>
          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 border border-white/80 text-white px-8 py-3.5 rounded font-semibold uppercase text-sm tracking-wider hover:bg-white/10 transition-colors"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Navigation controls */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;