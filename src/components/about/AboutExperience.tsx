import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type StorySlide = {
  id: string;
  title: string;
  text: string;
  imageSrc: string;
  eyebrow: string;
};

type WorldCard = {
  id: string;
  imageSrc: string;
  country: string;
  quote: string;
};

const aboutImageOrigin = new URL("../Tembo about/WhatsApp Image 2026-05-07 at 7.25.47 AM.jpeg", import.meta.url).href;
const aboutImageCraft = new URL("../Tembo about/WhatsApp Image 2026-05-07 at 7.26.00 AM.jpeg", import.meta.url).href;
const aboutImageTembo = new URL("../Tembo about/WhatsApp Image 2026-05-07 at 7.41.46 AM.jpeg", import.meta.url).href;
const aboutImageCulture = new URL("../Tembo about/WhatsApp Image 2026-05-07 at 7.41.46 AM (1).jpeg", import.meta.url).href;
const aboutImageLuxury = new URL("../Tembo about/WhatsApp Image 2026-05-07 at 7.43.48 AM.jpeg", import.meta.url).href;
const aboutImageIdentity = new URL("../Tembo about/WhatsApp Image 2026-05-07 at 7.43.49 AM.jpeg", import.meta.url).href;

const customerImage1 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.47 AM (1).jpeg", import.meta.url).href;
const customerImage2 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.49 AM.jpeg", import.meta.url).href;
const customerImage3 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.51 AM.jpeg", import.meta.url).href;
const customerImage4 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.53 AM.jpeg", import.meta.url).href;
const customerImage5 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.54 AM.jpeg", import.meta.url).href;
const customerImage6 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.55 AM.jpeg", import.meta.url).href;
const customerImage7 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.25.56 AM.jpeg", import.meta.url).href;
const customerImage8 = new URL("../Tembo customers/WhatsApp Image 2026-05-07 at 7.33.42 AM.jpeg", import.meta.url).href;

const storySlides: StorySlide[] = [
  {
    id: "origin",
    eyebrow: "Origin",
    title: "From the heart of Africa",
    text: "A calm beginning shaped by place, memory, and the quiet confidence of a premium African spirit.",
    imageSrc: aboutImageOrigin,
  },
  {
    id: "craft",
    eyebrow: "Craft",
    title: "Crafted with depth, tradition, and bold character",
    text: "Every expression carries patience, layered texture, and a deliberate finish that feels both modern and rooted.",
    imageSrc: aboutImageCraft,
  },
  {
    id: "tembo",
    eyebrow: "Tembo",
    title: "Tembo - strength, memory, legacy",
    text: "The elephant becomes a symbol of dignity and presence, guiding the brand with power that never needs to shout.",
    imageSrc: aboutImageTembo,
  },
  {
    id: "culture",
    eyebrow: "Culture",
    title: "Rooted in African excellence",
    text: "Tembo speaks through texture, hospitality, and heritage, celebrating a continent that defines luxury on its own terms.",
    imageSrc: aboutImageCulture,
  },
  {
    id: "luxury",
    eyebrow: "Luxury",
    title: "Refined for those who understand taste",
    text: "Soft gold light, minimal composition, and a measured sense of ceremony create an atmosphere of cinematic restraint.",
    imageSrc: aboutImageLuxury,
  },
  {
    id: "identity",
    eyebrow: "Identity",
    title: "Tembo Premium",
    text: "A signature identity shaped for modern palates, memorable occasions, and a global audience drawn to calm, powerful design.",
    imageSrc: aboutImageIdentity,
  },
];

const worldCards: WorldCard[] = [
  {
    id: "world-1",
    imageSrc: customerImage1,
    country: "Lesotho",
    quote: "A bottle that feels ceremonial before the first sip.",
  },
  {
    id: "world-2",
    imageSrc: customerImage2,
    country: "South Africa",
    quote: "Tembo carries warmth, polish, and a strong sense of place.",
  },
  {
    id: "world-3",
    imageSrc: customerImage3,
    country: "Kenya",
    quote: "Elegant enough for a celebration, relaxed enough for the afterglow.",
  },
  {
    id: "world-4",
    imageSrc: customerImage4,
    country: "Nigeria",
    quote: "You feel the confidence of the brand in every detail.",
  },
  {
    id: "world-5",
    imageSrc: customerImage5,
    country: "Ghana",
    quote: "Smooth, memorable, and beautifully presented from start to finish.",
  },
  {
    id: "world-6",
    imageSrc: customerImage6,
    country: "Botswana",
    quote: "The experience feels intimate, premium, and unmistakably African.",
  },
  {
    id: "world-7",
    imageSrc: customerImage7,
    country: "Namibia",
    quote: "A luxury mood that stays with you long after the evening ends.",
  },
  {
    id: "world-8",
    imageSrc: customerImage8,
    country: "Rwanda",
    quote: "Sophisticated storytelling in a bottle.",
  },
];

const createAmbientController = async () => {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0.035;
  master.connect(context.destination);

  const oscillators = [196, 246.94, 293.66].map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 1 ? 0.01 : 0.006;
    oscillator.connect(gain);
    gain.connect(master);

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = 0.08 + index * 0.03;
    lfoGain.gain.value = index === 1 ? 0.006 : 0.004;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    oscillator.start();
    lfo.start();

    return { oscillator, gain, lfo };
  });

  return {
    context,
    stop() {
      oscillators.forEach(({ oscillator, lfo }) => {
        oscillator.stop();
        lfo.stop();
      });
      master.disconnect();
      void context.close();
    },
  };
};

const AboutExperience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const audioControllerRef = useRef<Awaited<ReturnType<typeof createAmbientController>> | null>(null);
  const worldScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px), (prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(mediaQuery.matches);
    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % storySlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      audioControllerRef.current?.stop();
      audioControllerRef.current = null;
    };
  }, []);

  const activeSlide = storySlides[activeIndex];

  const goToSlide = (nextIndex: number) => {
    const max = storySlides.length - 1;
    if (nextIndex < 0) {
      setActiveIndex(max);
      return;
    }
    if (nextIndex > max) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex(nextIndex);
  };

  const handleSoundToggle = async () => {
    if (soundEnabled) {
      audioControllerRef.current?.stop();
      audioControllerRef.current = null;
      setSoundEnabled(false);
      return;
    }

    const controller = await createAmbientController();
    if (!controller) return;
    audioControllerRef.current = controller;
    setSoundEnabled(true);
  };

  const slideStyle = useMemo(
    () => ({
      transform: reducedMotion
        ? "none"
        : `translate3d(${parallax.x * 0.5}px, ${parallax.y * 0.5}px, 0) scale(1.03)`,
    }),
    [parallax.x, parallax.y, reducedMotion],
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      <section
        className="relative isolate overflow-hidden"
        onMouseMove={(event) => {
          if (reducedMotion) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 24;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
          setParallax({ x, y });
        }}
        onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (touchStartX === null || typeof endX !== "number") return;
          const delta = endX - touchStartX;
          if (Math.abs(delta) > 40) {
            goToSlide(delta < 0 ? activeIndex + 1 : activeIndex - 1);
          }
          setTouchStartX(null);
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.28),rgba(7,7,7,0.72))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.24),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(248,215,227,0.18),transparent_22%),radial-gradient(circle_at_bottom,rgba(139,94,60,0.26),transparent_35%)]" />

        <div className="relative min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, x: reducedMotion ? 0 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reducedMotion ? 0 : -28 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={activeSlide.imageSrc}
                alt={activeSlide.title}
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-1000"
                style={slideStyle}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.78),rgba(10,10,10,0.28),rgba(10,10,10,0.58))]" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.34em] text-white/80 backdrop-blur-xl">
                Tembo Story
              </div>
              <button
                type="button"
                onClick={handleSoundToggle}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-xl transition-colors hover:bg-white/15"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {soundEnabled ? "Sound On" : "Enable Sound"}
              </button>
            </div>

            <div className="grid items-end gap-8 pb-10 pt-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="max-w-3xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeSlide.id}-copy`}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#F5E6D3] backdrop-blur-xl">
                      {activeSlide.eyebrow}
                    </div>
                    <div className={`mt-6 max-w-3xl rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8 ${reducedMotion ? "" : "transition-all duration-700"}`}>
                      <h1 className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-7xl">
                        {activeSlide.title}
                      </h1>
                      <p className="mt-5 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
                        {activeSlide.text}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-white/12 bg-black/20 p-5 text-white/85 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C9A45C]">Brand Direction</p>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    Calm, cinematic, and rooted in African identity. Each slide is designed to feel light on clutter and rich in atmosphere.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToSlide(activeIndex - 1)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/15"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(activeIndex + 1)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/15"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pb-4">
              <div className="h-[2px] overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                  style={{ width: `${((activeIndex + 1) / storySlides.length) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {storySlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "w-10 bg-[#D4AF37]" : "w-3 bg-white/45 hover:bg-white/70"}`}
                    aria-label={`Go to ${slide.eyebrow}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.12),transparent_30%),linear-gradient(180deg,rgba(245,230,211,0.12),transparent_18%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Tembo Around The World</p>
              <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">Customers carrying the story forward</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                A warm, global view of how Tembo shows up in real moments, refined settings, and shared celebrations.
              </p>
            </div>
            <div className="hidden gap-3 sm:flex">
              <button
                type="button"
                onClick={() => worldScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => worldScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={worldScrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {worldCards.map((card) => (
              <article
                key={card.id}
                className="group min-w-[280px] max-w-[280px] snap-start overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_18px_48px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="relative h-[360px] overflow-hidden bg-secondary">
                  <img
                    src={card.imageSrc}
                    alt={card.country}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur-xl">
                    {card.country}
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-display text-2xl text-foreground">{card.country}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.quote}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutExperience;
