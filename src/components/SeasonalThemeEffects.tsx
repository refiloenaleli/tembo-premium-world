import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSeasonalTheme } from "@/context/SeasonalThemeContext";

const SeasonalThemeEffects = () => {
  const { effectiveTheme, isMobileEffectsReduced, previewTheme } = useSeasonalTheme();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudioEnabled(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [effectiveTheme?.id]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const particles = useMemo(() => {
    const count = isMobileEffectsReduced ? 8 : 18;
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: `${(index * 97) % 100}%`,
      size: 6 + (index % 4) * 5,
      duration: 12 + (index % 5) * 3,
      delay: (index % 6) * 0.8,
    }));
  }, [isMobileEffectsReduced]);

  if (!effectiveTheme) return null;

  const showParticles = !isMobileEffectsReduced;
  const showVideo = !isMobileEffectsReduced && Boolean(effectiveTheme.video_url);
  const showAudioToggle = Boolean(effectiveTheme.ambient_audio_url);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key={effectiveTheme.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background: effectiveTheme.background_gradient,
              opacity: effectiveTheme.overlay_opacity,
            }}
          />

          {effectiveTheme.overlay_image_url && (
            <motion.img
              key={`${effectiveTheme.id}-overlay`}
              src={effectiveTheme.overlay_image_url}
              alt={effectiveTheme.name}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: isMobileEffectsReduced ? 0.12 : 0.2, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
            />
          )}

          {effectiveTheme.flag_overlay_url && (
            <img
              src={effectiveTheme.flag_overlay_url}
              alt={`${effectiveTheme.name} flag overlay`}
              loading="lazy"
              className="absolute right-0 top-0 h-48 w-48 object-contain opacity-15"
            />
          )}

          {showVideo && effectiveTheme.video_url && (
            <video
              key={`${effectiveTheme.id}-video`}
              src={effectiveTheme.video_url}
              className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
          )}

          {showParticles &&
            particles.map((particle) => (
              <motion.span
                key={`${effectiveTheme.id}-${particle.id}`}
                className="absolute rounded-full"
                style={{
                  left: particle.left,
                  bottom: "-10%",
                  width: particle.size,
                  height: particle.size,
                  background:
                    effectiveTheme.particle_style === "snow"
                      ? "rgba(255,255,255,0.7)"
                      : effectiveTheme.particle_style === "rose"
                        ? "rgba(248,215,227,0.55)"
                        : `${effectiveTheme.glow_color}66`,
                  boxShadow: `0 0 22px ${effectiveTheme.glow_color}`,
                }}
                animate={{
                  y: ["0%", "-120vh"],
                  x: [0, particle.id % 2 === 0 ? 18 : -18, 0],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
        </motion.div>
      </AnimatePresence>

      {effectiveTheme.promo_message && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-4xl rounded-full border border-white/10 bg-background/75 px-5 py-3 text-center shadow-[0_12px_48px_rgba(0,0,0,0.16)] backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: effectiveTheme.accent_color }}>
              {previewTheme ? "Theme Preview" : effectiveTheme.name}
            </p>
            <p className="mt-1 text-sm text-foreground">{effectiveTheme.promo_message}</p>
          </motion.div>
        </div>
      )}

      {showAudioToggle && effectiveTheme.ambient_audio_url && (
        <button
          type="button"
          onClick={() => {
            if (!audioEnabled) {
              const audio = new Audio(effectiveTheme.ambient_audio_url || "");
              audio.loop = true;
              audio.volume = 0.18;
              void audio.play();
              audioRef.current = audio;
              setAudioEnabled(true);
              return;
            }

            audioRef.current?.pause();
            audioRef.current = null;
            setAudioEnabled(false);
          }}
          className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-foreground shadow-lg backdrop-blur-xl"
        >
          {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          {audioEnabled ? "Theme Sound On" : "Enable Theme Sound"}
        </button>
      )}
    </>
  );
};

export default SeasonalThemeEffects;
