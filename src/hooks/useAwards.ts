import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAwards() {
  return useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}
