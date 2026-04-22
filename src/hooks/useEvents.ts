import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbEvent = Tables<"events">;
export type DbEventImage = Tables<"event_images">;
export type DbEventSubscriber = Tables<"event_subscribers">;
export type EventWithImages = DbEvent & { event_images: DbEventImage[] };

async function fetchEvents(includeInactive = false) {
  let query = supabase
    .from("events")
    .select("*, event_images(*)")
    .order("sort_order")
    .order("start_at", { ascending: true, nullsFirst: false });

  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) {
    return [] as EventWithImages[];
  }

  return (data ?? []) as EventWithImages[];
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(false),
    placeholderData: [],
  });
}

export function useAllEvents() {
  return useQuery({
    queryKey: ["all-events"],
    queryFn: () => fetchEvents(true),
    placeholderData: [],
  });
}

export function useEventSubscribers() {
  return useQuery({
    queryKey: ["event-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) {
        return [] as DbEventSubscriber[];
      }

      return (data ?? []) as DbEventSubscriber[];
    },
    placeholderData: [],
  });
}
