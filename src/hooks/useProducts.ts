import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order");

      if (error) {
        throw error;
      }

      return (data as DbProduct[] | null) ?? [];
    },
    placeholderData: [],
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order");

      if (error) {
        throw error;
      }

      return (data as DbProduct[] | null) ?? [];
    },
    placeholderData: [],
  });
}
