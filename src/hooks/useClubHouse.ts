import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ClubHouseCocktail = Tables<"club_house_cocktails">;
export type ClubHouseMenu = Tables<"club_house_menus">;
export type ClubHouseRating = Tables<"club_house_ratings">;

const sortByOrder = <T extends { sort_order: number; title: string }>(rows: T[] | null) =>
  (rows ?? []).sort((left, right) => left.sort_order - right.sort_order || left.title.localeCompare(right.title));

export function useClubHouseCocktails() {
  return useQuery({
    queryKey: ["club-house-cocktails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_house_cocktails")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllClubHouseCocktails() {
  return useQuery({
    queryKey: ["all-club-house-cocktails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_house_cocktails")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useClubHouseMenus() {
  return useQuery({
    queryKey: ["club-house-menus"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_house_menus")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllClubHouseMenus() {
  return useQuery({
    queryKey: ["all-club-house-menus"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_house_menus")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePublishedClubHouseRatings() {
  return useQuery({
    queryKey: ["club-house-ratings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_house_ratings")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllClubHouseRatings() {
  return useQuery({
    queryKey: ["all-club-house-ratings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_house_ratings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useClubHouseCatalog() {
  return useQuery({
    queryKey: ["club-house-catalog"],
    queryFn: async () => {
      const [{ data: cocktails, error: cocktailsError }, { data: menus, error: menusError }] = await Promise.all([
        supabase.from("club_house_cocktails").select("*").eq("active", true),
        supabase.from("club_house_menus").select("*").eq("active", true),
      ]);

      if (cocktailsError) throw cocktailsError;
      if (menusError) throw menusError;

      return {
        cocktails: sortByOrder(cocktails ?? []),
        menus: sortByOrder(menus ?? []),
      };
    },
  });
}
