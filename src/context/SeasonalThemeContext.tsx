import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useSeasonalThemes, resolveActiveTheme, type SeasonalTheme } from "@/hooks/useSeasonalThemes";

type SeasonalThemeContextValue = {
  themes: SeasonalTheme[];
  activeTheme: SeasonalTheme | null;
  previewTheme: SeasonalTheme | null;
  previewThemeId: string | null;
  setPreviewThemeId: (value: string | null) => void;
  effectiveTheme: SeasonalTheme | null;
  isMobileEffectsReduced: boolean;
};

const SeasonalThemeContext = createContext<SeasonalThemeContextValue | null>(null);

const setThemeVariables = (theme: SeasonalTheme | null) => {
  const root = document.documentElement;

  if (!theme) {
    root.style.removeProperty("--seasonal-accent");
    root.style.removeProperty("--seasonal-glow");
    root.style.removeProperty("--seasonal-gradient");
    root.style.removeProperty("--seasonal-overlay-opacity");
    return;
  }

  root.style.setProperty("--seasonal-accent", theme.accent_color);
  root.style.setProperty("--seasonal-glow", theme.glow_color);
  root.style.setProperty("--seasonal-gradient", theme.background_gradient);
  root.style.setProperty("--seasonal-overlay-opacity", String(theme.overlay_opacity));
};

export const SeasonalThemeProvider = ({ children }: PropsWithChildren) => {
  const { data: themes } = useSeasonalThemes();
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [isMobileEffectsReduced, setIsMobileEffectsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)");
    const sync = () => setIsMobileEffectsReduced(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  const activeTheme = useMemo(() => resolveActiveTheme(themes ?? []), [themes]);
  const previewTheme = useMemo(
    () => (themes ?? []).find((theme) => theme.id === previewThemeId) ?? null,
    [previewThemeId, themes],
  );
  const effectiveTheme = previewTheme ?? activeTheme;

  useEffect(() => {
    setThemeVariables(effectiveTheme);
    return () => setThemeVariables(null);
  }, [effectiveTheme]);

  const value = useMemo(
    () => ({
      themes: themes ?? [],
      activeTheme,
      previewTheme,
      previewThemeId,
      setPreviewThemeId,
      effectiveTheme,
      isMobileEffectsReduced,
    }),
    [themes, activeTheme, previewTheme, previewThemeId, effectiveTheme, isMobileEffectsReduced],
  );

  return <SeasonalThemeContext.Provider value={value}>{children}</SeasonalThemeContext.Provider>;
};

export const useSeasonalTheme = () => {
  const context = useContext(SeasonalThemeContext);
  if (!context) {
    throw new Error("useSeasonalTheme must be used within SeasonalThemeProvider");
  }
  return context;
};
