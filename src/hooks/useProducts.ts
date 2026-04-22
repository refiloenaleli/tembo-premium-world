import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { expectedProductConfig, fallbackProducts, TEMBO_SMALL_BOTTLE_PRICE } from "@/data/fallbackContent";

export type DbProduct = Tables<"products">;

const withTimeout = async <T,>(promise: Promise<T>, fallback: T, timeoutMs = 5000) =>
  Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);

const resolveProductConfig = (product: DbProduct) => {
  const direct = expectedProductConfig[product.slug as keyof typeof expectedProductConfig];
  if (direct) return direct;

  const normalizedName = product.name.trim().toLowerCase();
  const aliases: Record<string, keyof typeof expectedProductConfig> = {
    "funga brandy": "funga-caramel-brandy",
    "mshale brandy": "mshale-caramel-vodka",
    "risasi whisky": "risasi-vanilla-whisky",
  };

  const aliasKey = aliases[normalizedName];
  return aliasKey ? expectedProductConfig[aliasKey] : undefined;
};

const normalizeProducts = (products: DbProduct[]) =>
  products.map((product) => {
    const expected = resolveProductConfig(product);

    return {
      ...product,
      name: expected?.name || product.name,
      subtitle: expected?.subtitle || product.subtitle,
      category: expected?.category || product.category,
      price_full: expected?.price_full ?? product.price_full,
      price_mini: TEMBO_SMALL_BOTTLE_PRICE,
    };
  });

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await withTimeout(
        supabase.from("products").select("*").eq("active", true).order("sort_order"),
        { data: fallbackProducts, error: null },
      );

      if (response.error) {
        return normalizeProducts(fallbackProducts);
      }

      const products = (response.data as DbProduct[] | null) ?? fallbackProducts;
      return normalizeProducts(products.length > 0 ? products : fallbackProducts);
    },
    placeholderData: fallbackProducts,
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await withTimeout(
        supabase.from("products").select("*").order("sort_order"),
        { data: fallbackProducts, error: null },
      );

      if (response.error) {
        return normalizeProducts(fallbackProducts);
      }

      const products = (response.data as DbProduct[] | null) ?? fallbackProducts;
      return normalizeProducts(products.length > 0 ? products : fallbackProducts);
    },
    placeholderData: fallbackProducts,
  });
}
