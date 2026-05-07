import { lazy, Suspense } from "react";
import { useSeasonalTheme } from "@/context/SeasonalThemeContext";

const SeasonalThemeEffects = lazy(() => import("@/components/SeasonalThemeEffects"));

const SeasonalThemeLayer = () => {
  const { effectiveTheme } = useSeasonalTheme();

  if (!effectiveTheme) return null;

  return (
    <Suspense fallback={null}>
      <SeasonalThemeEffects />
    </Suspense>
  );
};

export default SeasonalThemeLayer;
