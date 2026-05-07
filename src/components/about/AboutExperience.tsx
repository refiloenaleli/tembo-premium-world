import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

type StorySlide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  imageSrc: string;
  mood: string;
  accent: string;
  glow: string;
  panelTone: string;
  detail: string;
  statLabel: string;
  statValue: string;
  videoSrc?: string | null;
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
    text: "Tembo begins with atmosphere before it becomes a bottle. Place, memory, and African presence shape the first impression long before the first pour.",
    imageSrc: aboutImageOrigin,
    mood: "Light, airy, elegant",
    accent: "#F5E6D3",
    glow: "rgba(245, 230, 211, 0.42)",
    panelTone: "rgba(255,255,255,0.10)",
    detail: "Soft mist, pale gold light, and the quiet silhouette of strength.",
    statLabel: "Origin",
    statValue: "Rooted",
  },
  {
    id: "craft",
    eyebrow: "Craft",
    title: "Crafted with depth, tradition, and bold character",
    text: "Each expression carries patience and deliberate structure, balancing modern refinement with a legacy of strong, memorable flavour.",
    imageSrc: aboutImageCraft,
    mood: "Fluid, warm, textural",
    accent: "#C9A45C",
    glow: "rgba(201, 164, 92, 0.45)",
    panelTone: "rgba(255,255,255,0.09)",
    detail: "Golden movement, slow richness, and a sense of precision without excess.",
    statLabel: "Craft",
    statValue: "Layered",
  },
  {
    id: "tembo",
    eyebrow: "Tembo",
    title: "Tembo - strength, memory, legacy",
    text: "The elephant is not decoration. It is presence, dignity, and lasting memory translated into a premium African identity that moves with confidence.",
    imageSrc: aboutImageTembo,
    mood: "Powerful, sculptural, calm",
    accent: "#D4AF37",
    glow: "rgba(212, 175, 55, 0.45)",
    panelTone: "rgba(255,255,255,0.08)",
    detail: "A quiet symbol of endurance, legacy, and unmistakable brand gravity.",
    statLabel: "Tembo",
    statValue: "Legacy",
  },
  {
    id: "culture",
    eyebrow: "Culture",
    title: "Rooted in African excellence",
    text: "Tembo honours African hospitality, style, and ambition with restraint. The language is premium, but the soul remains deeply connected to where it comes from.",
    imageSrc: aboutImageCulture,
    mood: "Textured, grounded, elevated",
    accent: "#8B5E3C",
    glow: "rgba(139, 94, 60, 0.42)",
    panelTone: "rgba(255,255,255,0.08)",
    detail: "Subtle cultural texture, bronze warmth, and a confident sense of belonging.",
    statLabel: "Culture",
    statValue: "African",
  },
  {
    id: "luxury",
    eyebrow: "Luxury",
    title: "Refined for those who understand taste",
    text: "Luxury here is cinematic and controlled. Soft reflections, gold atmosphere, and polished restraint make the experience feel composed rather than loud.",
    imageSrc: aboutImageLuxury,
    mood: "Polished, glowing, modern",
    accent: "#F8D7E3",
    glow: "rgba(248, 215, 227, 0.36)",
    panelTone: "rgba(255,255,255,0.11)",
    detail: "Light flares, premium edges, and warmth designed to feel intimate.",
    statLabel: "Luxury",
    statValue: "Refined",
  },
  {
    id: "identity",
    eyebrow: "Identity",
    title: "Tembo Premium",
    text: "A living luxury African brand with a strong visual signature, built for contemporary drinkers who respond to story, mood, and unmistakable identity.",
    imageSrc: aboutImageIdentity,
    mood: "Bold, clean, iconic",
    accent: "#FFFFFF",
    glow: "rgba(212, 175, 55, 0.34)",
    panelTone: "rgba(255,255,255,0.08)",
    detail: "A final frame that feels decisive, elegant, and fully Tembo.",
    statLabel: "Identity",
    statValue: "Tembo",
  },
];

const worldCards: WorldCard[] = [
  { id: "world-1", imageSrc: customerImage1, country: "Lesotho", quote: "Tembo feels ceremonial before the first sip." },
  { id: "world-2", imageSrc: customerImage2, country: "South Africa", quote: "The brand carries warmth, polish, and presence." },
  { id: "world-3", imageSrc: customerImage3, country: "Kenya", quote: "Elegant enough for celebration, calm enough for afterglow." },
  { id: "world-4", imageSrc: customerImage4, country: "Nigeria", quote: "Every detail feels intentional and premium." },
  { id: "world-5", imageSrc: customerImage5, country: "Ghana", quote: "Smooth, memorable, and beautifully presented." },
  { id: "world-6", imageSrc: customerImage6, country: "Botswana", quote: "A luxury mood that still feels personal." },
  { id: "world-7", imageSrc: customerImage7, country: "Namibia", quote: "The atmosphere stays with you after the evening ends." },
  { id: "world-8", imageSrc: customerImage8, country: "Rwanda", quote: "A bottle with storytelling built into it." },
];

const createAmbientController = async () => {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0.03;
  master.connect(context.destination);

  const tones = [174.61, 220, 261.63].map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 1 ? 0.008 : 0.005;
    oscillator.connect(gain);
    gain.connect(master);

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = 0.06 + index * 0.02;
    lfoGain.gain.value = index === 1 ? 0.006 : 0.0035;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    oscillator.start();
    lfo.start();

    return { oscillator, lfo };
  });

  return {
    stop() {
      tones.forEach(({ oscillator, lfo }) => {
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

  const slideStyle = useMemo(
    () => ({
      transform: reducedMotion
        ? "none"
        : `translate3d(${parallax.x * 0.45}px, ${parallax.y * 0.45}px, 0) scale(1.04)`,
    }),
    [parallax.x, parallax.y, reducedMotion],
  );

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

  return (
    <div className="min-h-screen bg-background pt-16">
      <section
        className="relative isolate overflow-hidden border-b border-white/10 bg-[#050505]"
        onMouseMove={(event) => {
          if (reducedMotion) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 26;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20;
          setParallax({ x, y });
        }}
        onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (touchStartX === null || typeof endX !== "number") return;
          const delta = endX - touchStartX;
          if (Math.abs(delta) > 36) {
            goToSlide(delta < 0 ? activeIndex + 1 : activeIndex - 1);
          }
          setTouchStartX(null);
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.74))]" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 12% 15%, ${activeSlide.glow}, transparent 28%), radial-gradient(circle at 85% 18%, rgba(248,215,227,0.12), transparent 22%), radial-gradient(circle at bottom, rgba(139,94,60,0.20), transparent 34%)`,
            ],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <div className="relative min-h-[calc(100vh-4rem)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto hidden max-w-7xl px-4 pt-6 sm:px-6 lg:block lg:px-8">
            <div className="max-w-xl rounded-[1.75rem] border border-white/10 bg-black/30 px-6 py-4 text-white/72 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#D4AF37]">About Tembo Premium</p>
              <p className="mt-2 text-sm leading-7">
                A cinematic African luxury story told in six moving chapters, designed to feel calm, immersive, and unmistakably premium.
              </p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.99 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {activeSlide.videoSrc && activeSlide.id === storySlides[activeIndex].id ? (
                <video
                  src={activeSlide.videoSrc}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={activeSlide.imageSrc}
                  alt={activeSlide.title}
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-1000"
                  style={slideStyle}
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(10,10,10,0.84),rgba(10,10,10,0.30),rgba(10,10,10,0.64))]" />
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

            <div className="grid items-end gap-8 pb-10 pt-8 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="max-w-3xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeSlide.id}-copy`}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : -18 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div
                      className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.32em] backdrop-blur-xl"
                      style={{ color: activeSlide.accent, background: activeSlide.panelTone }}
                    >
                      {activeSlide.eyebrow} / {activeIndex + 1} of {storySlides.length}
                    </div>
                    <div
                      className="mt-6 max-w-3xl rounded-[2rem] border border-white/12 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:p-8"
                      style={{ background: activeSlide.panelTone, boxShadow: `0 0 80px ${activeSlide.glow}` }}
                    >
                      <h1 className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-7xl">
                        {activeSlide.title}
                      </h1>
                      <p className="mt-5 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
                        {activeSlide.text}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.24em] text-white/70">
                        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">Luxury African Identity</span>
                        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">Cinematic Storytelling</span>
                        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">Modern Heritage</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid gap-4">
                <motion.div
                  key={`${activeSlide.id}-detail`}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                  className="rounded-[1.75rem] border border-white/12 bg-black/20 p-5 text-white/85 shadow-[0_18px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                >
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: activeSlide.accent }}>
                    Visual Direction
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/70">{activeSlide.detail}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">{activeSlide.statLabel}</p>
                      <p className="mt-2 font-display text-2xl text-white">{activeSlide.statValue}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Mood</p>
                      <p className="mt-2 text-sm leading-6 text-white/80">{activeSlide.mood}</p>
                    </div>
                  </div>
                </motion.div>

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
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: activeSlide.accent }}
                  animate={{ width: `${((activeIndex + 1) / storySlides.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {storySlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "w-12" : "w-3 bg-white/45 hover:bg-white/70"}`}
                    style={index === activeIndex ? { backgroundColor: slide.accent } : undefined}
                    aria-label={`Go to ${slide.eyebrow}`}
                  />
                ))}
              </div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">
                Swipe on mobile or use the arrows to move through the story.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.14),transparent_30%),linear-gradient(180deg,rgba(245,230,211,0.10),transparent_18%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Tembo Around The World</p>
              <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
                Customers carrying the story forward
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                A warmer horizontal story of where Tembo lands: celebrations, portraits, and premium moments across the continent.
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
                className="group min-w-[285px] max-w-[285px] snap-start overflow-hidden rounded-[1.85rem] border border-border bg-card shadow-[0_22px_54px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="relative h-[380px] overflow-hidden bg-secondary">
                  <img
                    src={card.imageSrc}
                    alt={card.country}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
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
