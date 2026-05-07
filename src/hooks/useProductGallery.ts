import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ProductGalleryAsset = Tables<"product_gallery_assets">;

export function useProductGallery() {
  return useQuery({
    queryKey: ["product-gallery-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_gallery_assets")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        return [] as ProductGalleryAsset[];
      }

      return (data ?? []) as ProductGalleryAsset[];
    },
    placeholderData: [],
  });
}
