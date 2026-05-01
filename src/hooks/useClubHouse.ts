import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ClubHouseCocktail = Tables<"club_house_cocktails">;
export type ClubHouseMenu = Tables<"club_house_menus">;
export type ClubHouseRating = Tables<"club_house_ratings">;

export const isClubHouseFallbackId = (id: string) => id.startsWith("fallback-");

const fallbackCocktails: ClubHouseCocktail[] = [
  {
    id: "fallback-cocktail-1",
    title: "Watermelon Gin Cocktail",
    description: "Tembo printed menu favourite from the Gin Selection.",
    image_url: null,
    active: true,
    sort_order: 10,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-cocktail-2",
    title: "Tropical Gin",
    description: "Tembo printed menu favourite from the Gin Selection.",
    image_url: null,
    active: true,
    sort_order: 20,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-cocktail-3",
    title: "Tropical Cocktail",
    description: "Tembo printed menu favourite from the Gin Selection.",
    image_url: null,
    active: true,
    sort_order: 30,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-cocktail-4",
    title: "Soulcito Gin",
    description: "Tembo printed menu favourite from the Gin Selection.",
    image_url: null,
    active: true,
    sort_order: 40,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-cocktail-5",
    title: "The Caramel Dom Pedro",
    description: "Blend 3 scoops Vanilla Ice Cream, 1 shot Heavy Cream, 1 shot Mshale Caramel Vodka, 1 shot Funga Caramel Brandy. Top with crumbled Cadbury Flake.",
    image_url: null,
    active: true,
    sort_order: 50,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-cocktail-6",
    title: "The Highveld Vanilla Sour",
    description: "Shake 2 shots Risasi Vanilla Whiskey, 1 shot Fresh Lemon Juice, 1/2 shot Simple Syrup, 1 Egg White with ice. Strain. Garnish: Lemon wheel.",
    image_url: null,
    active: true,
    sort_order: 60,
    created_at: "",
    updated_at: "",
  },
];

const fallbackMenus: ClubHouseMenu[] = [
  {
    id: "fallback-menu-1",
    title: "Tembo's Refined Cocktail Selection",
    description:
      "GIN SELECTION\n- Watermelon Gin Cocktail\n- Tropical Gin\n- Tropical Cocktail\n- Soulcito Gin\n\nWHISKEY & VODKA SELECTION\n- Risasi - Vanilla Whiskey\n- Ginsky\n- Mshale Caramel Vodka (straight or desert)\n- Whisky Granite\n\nFRUIT & FUSION SLASHES\n- Mshale Strawberry Slash\n- Mshale Apple Slash\n- Soulcito Fusion\n\nUNDERTAKER EXCLUSIVE\n- 1 tot of Ginsky / 2 tot of Ginsky\n- 1 tot of Soulcito / 2 tot of Soulcito\n- 1 tot of Funga / 3 tot of Funga\n- 4 tot of RISASI dashed with Ginger Ale",
    image_url: null,
    active: true,
    sort_order: 10,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-menu-2",
    title: "Africa's Favorite: The Tembo Collection",
    description:
      "1. THE CARAMEL DOM PEDRO\nBlend 3 scoops Vanilla Ice Cream, 1 shot Heavy Cream, 1 shot Mshale Caramel Vodka, 1 shot Funga Caramel Brandy. Top with crumbled Cadbury Flake.\n\n2. THE HIGHVELD VANILLA SOUR\nShake 2 shots Risasi Vanilla Whiskey, 1 shot Fresh Lemon Juice, 1/2 shot Simple Syrup, 1 Egg White with ice. Strain. Garnish: Lemon wheel.\n\n3. THE SUNSET WATERMELON SPRITZ\n2 shots Watermelon Gin in ice-filled glass. Top with 1/2 Tonic Water, 1/2 Soda Water. Garnish: Watermelon slice, fresh Mint.\n\n4. THE CARAMEL ESPRESSO MARTINI\nShake 2 shots Mshale Caramel Vodka, 1 shot cold Espresso, 1/2 shot Sugar Syrup hard with ice. Strain. Garnish: 3 coffee beans.\n\n5. THE TROPICAL 'GIN-JITO'\nMuddle Lime wedges and Mint with Simple Syrup in glass. Add ice, 2 shots Tropical Gin. Top with Soda Water. Stir.\n\n6. THE SOULCITO PINEAPPLE-STAR MARTINI\nShake 1 shot Soulcito, 1 shot Ginsky, 1 shot Pineapple juice, 1 shot Passion Fruit Pulp with ice. Strain. Garnish: Pineapple wedge. Serve with a sidecar shot of MCC.",
    image_url: null,
    active: true,
    sort_order: 20,
    created_at: "",
    updated_at: "",
  },
];

const isMissingClubHouseTable = (error: { code?: string } | null) => error?.code === "42P01";

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

      if (isMissingClubHouseTable(error)) return fallbackCocktails;
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

      if (isMissingClubHouseTable(error)) return fallbackCocktails;
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

      if (isMissingClubHouseTable(error)) return fallbackMenus;
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

      if (isMissingClubHouseTable(error)) return fallbackMenus;
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

      if (isMissingClubHouseTable(error)) return [];
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

      if (isMissingClubHouseTable(error)) return [];
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

      if (isMissingClubHouseTable(cocktailsError) || isMissingClubHouseTable(menusError)) {
        return {
          cocktails: sortByOrder(fallbackCocktails),
          menus: sortByOrder(fallbackMenus),
        };
      }

      if (cocktailsError) throw cocktailsError;
      if (menusError) throw menusError;

      return {
        cocktails: sortByOrder(cocktails ?? []),
        menus: sortByOrder(menus ?? []),
      };
    },
  });
}
