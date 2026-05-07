import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SeasonalTheme = Tables<"seasonal_themes">;

const toDateString = (value: Date) => value.toISOString().slice(0, 10);

const isWithinRange = (theme: SeasonalTheme, today: string) => {
  if (!theme.start_date && !theme.end_date) return false;
  if (theme.start_date && today < theme.start_date) return false;
  if (theme.end_date && today > theme.end_date) return false;
  return true;
};

export function resolveActiveTheme(themes: SeasonalTheme[], now = new Date()) {
  const today = toDateString(now);
  const enabled = themes.filter((theme) => theme.active);
  const manual = enabled
    .filter((theme) => theme.manual_override)
    .sort((left, right) => left.sort_order - right.sort_order || left.name.localeCompare(right.name));

  if (manual.length > 0) {
    return manual[0];
  }

  const scheduled = enabled
    .filter((theme) => isWithinRange(theme, today))
    .sort((left, right) => left.sort_order - right.sort_order || left.name.localeCompare(right.name));

  return scheduled[0] ?? null;
}

export function useSeasonalThemes() {
  return useQuery({
    queryKey: ["seasonal-themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasonal_themes")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        return [] as SeasonalTheme[];
      }

      return (data ?? []) as SeasonalTheme[];
    },
    placeholderData: [],
  });
}
