import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fallbackHeroBanners } from "@/data/fallbackContent";

const withTimeout = async <T,>(promise: Promise<T>, fallback: T, timeoutMs = 5000) =>
  Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);

export function useHeroBanners() {
  return useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const response = await withTimeout(
        supabase.from("hero_banners").select("*").eq("active", true).order("sort_order"),
        { data: fallbackHeroBanners, error: null },
      );

      if (response.error) {
        return fallbackHeroBanners;
      }

      return response.data && response.data.length > 0 ? response.data : fallbackHeroBanners;
    },
    placeholderData: fallbackHeroBanners,
  });
}

export function useAllHeroBanners() {
  return useQuery({
    queryKey: ["all-hero-banners"],
    queryFn: async () => {
      const response = await withTimeout(
        supabase.from("hero_banners").select("*").order("sort_order"),
        { data: fallbackHeroBanners, error: null },
      );

      if (response.error) {
        return fallbackHeroBanners;
      }

      return response.data && response.data.length > 0 ? response.data : fallbackHeroBanners;
    },
    placeholderData: fallbackHeroBanners,
  });
}
