import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  useClubHouseCatalog,
  usePublishedClubHouseRatings,
  type ClubHouseRating,
} from "@/hooks/useClubHouse";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type RatingForm = {
  itemType: "cocktail" | "menu";
  itemId: string;
  rating: number;
  title: string;
  review: string;
};

const emptyRatingForm: RatingForm = {
  itemType: "cocktail",
  itemId: "",
  rating: 5,
  title: "",
  review: "",
};

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      size={16}
      className={index < rating ? "fill-primary text-primary" : "text-muted-foreground/40"}
    />
  ));

const ClubHouse = () => {
  const { data: catalog, isLoading } = useClubHouseCatalog();
  const { data: ratings } = usePublishedClubHouseRatings();
  const { data: settings } = useSiteSettings();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RatingForm>(emptyRatingForm);

  const ratingTargets = useMemo(() => {
    const cocktailTargets = (catalog?.cocktails ?? []).map((item) => ({
      id: item.id,
      label: item.title,
      type: "cocktail" as const,
    }));
    const menuTargets = (catalog?.menus ?? []).map((item) => ({
      id: item.id,
      label: item.title,
      type: "menu" as const,
    }));

    return [...cocktailTargets, ...menuTargets];
  }, [catalog]);

  const groupedRatings = useMemo(() => {
    const map = new Map<string, ClubHouseRating[]>();
    (ratings ?? []).forEach((rating) => {
      const key = `${rating.item_type}:${rating.item_id}`;
      const bucket = map.get(key) ?? [];
      bucket.push(rating);
      map.set(key, bucket);
    });
    return map;
  }, [ratings]);

  const averageRating = useMemo(() => {
    if (!ratings?.length) return null;
    const total = ratings.reduce((sum, entry) => sum + entry.rating, 0);
    return (total / ratings.length).toFixed(1);
  }, [ratings]);

  useEffect(() => {
    if (!form.itemId) {
      const firstTarget = ratingTargets.find((target) => target.type === form.itemType);
      if (firstTarget) {
        setForm((current) => ({ ...current, itemId: firstTarget.id }));
      }
    }
  }, [form.itemId, form.itemType, ratingTargets]);

  const syncSelectedTarget = (itemType: "cocktail" | "menu") => {
    const nextTarget = ratingTargets.find((target) => target.type === itemType);
    setForm((current) => ({
      ...current,
      itemType,
      itemId: nextTarget?.id ?? "",
    }));
  };

  const submitRating = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please sign in before rating the Tembo Club House experience.");
      return;
    }

    if (!form.itemId) {
      toast.error("Please choose a menu or cocktail to rate.");
      return;
    }

    setSubmitting(true);
    const displayName =
      user.user_metadata?.full_name?.toString().trim() ||
      user.email?.split("@")[0] ||
      "Tembo Guest";

    const { error } = await supabase.from("club_house_ratings").insert({
      user_id: user.id,
      display_name: displayName,
      item_type: form.itemType,
      item_id: form.itemId,
      rating: form.rating,
      title: form.title.trim() || null,
      review: form.review.trim() || null,
      published: false,
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setForm({
      ...emptyRatingForm,
      itemType: form.itemType,
      itemId: ratingTargets.find((target) => target.type === form.itemType)?.id ?? "",
    });
    toast.success("Thanks. Your rating has been sent to the admin for publishing.");
    queryClient.invalidateQueries({ queryKey: ["all-club-house-ratings"] });
  };

  const cocktails = catalog?.cocktails ?? [];
  const menus = catalog?.menus ?? [];

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="border-b border-border bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.16),_transparent_45%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.35))]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-primary">Tembo Private Club House</p>
            <h1 className="font-display text-4xl text-foreground sm:text-5xl">
              Tembo Private Club House
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {settings?.club_house_intro ||
                "Welcome to the Tembo Private Club House, where bold menus and signature cocktails come together for elevated private hosting."}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-foreground">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
                {settings?.club_house_address || "Private club house details coming soon"}
              </span>
              {averageRating && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
                  <span className="flex items-center gap-1">{renderStars(Math.round(Number(averageRating)))}</span>
                  <span>{averageRating}/5 guest rating</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Cocktails</p>
            <h2 className="font-display text-3xl text-foreground">Signature cocktails</h2>
          </div>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground">Loading club house cocktails...</p>
        ) : cocktails.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">
            No cocktails have been published yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cocktails.map((cocktail) => {
              const itemRatings = groupedRatings.get(`cocktail:${cocktail.id}`) ?? [];
              return (
                <article key={cocktail.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  {cocktail.image_url ? (
                    <img src={cocktail.image_url} alt={cocktail.title} className="h-64 w-full object-cover" />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-secondary text-sm uppercase tracking-[0.3em] text-muted-foreground">
                      Tembo Cocktail
                    </div>
                  )}
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="font-display text-2xl text-foreground">{cocktail.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {cocktail.description || "Description coming soon."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1 text-primary">
                        {renderStars(
                          itemRatings.length
                            ? Math.round(itemRatings.reduce((sum, entry) => sum + entry.rating, 0) / itemRatings.length)
                            : 0,
                        )}
                      </span>
                      <span className="text-muted-foreground">
                        {itemRatings.length} published rating{itemRatings.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-4 pb-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Menus</p>
          <h2 className="font-display text-3xl text-foreground">Curated private menus</h2>
        </div>
        {menus.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">
            No menus have been published yet.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {menus.map((menu) => (
              <article key={menu.id} className="grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[220px_1fr]">
                {menu.image_url ? (
                  <img src={menu.image_url} alt={menu.title} className="h-full min-h-56 w-full object-cover" />
                ) : (
                  <div className="flex min-h-56 items-center justify-center bg-secondary text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    Tembo Menu
                  </div>
                )}
                <div className="space-y-3 p-5">
                  <h3 className="font-display text-2xl text-foreground">{menu.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {menu.description || "Description coming soon."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-secondary/20">
        <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Guest Ratings</p>
              <h2 className="font-display text-3xl text-foreground">Published by the Tembo team</h2>
            </div>
            {(ratings ?? []).length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-background p-6 text-muted-foreground">
                Ratings will appear here after guests submit them and the admin publishes them.
              </p>
            ) : (
              <div className="grid gap-4">
                {ratings?.map((rating) => (
                  <article key={rating.id} className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{rating.display_name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {rating.item_type === "cocktail" ? "Cocktail" : "Menu"} review
                        </p>
                      </div>
                      <div className="flex items-center gap-1">{renderStars(rating.rating)}</div>
                    </div>
                    {rating.title && <h3 className="mt-4 text-lg font-semibold text-foreground">{rating.title}</h3>}
                    {rating.review && <p className="mt-2 text-sm leading-6 text-muted-foreground">{rating.review}</p>}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Rate Your Experience</p>
              <h2 className="font-display text-2xl text-foreground">Send a rating for review</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Guests can rate cocktails or menus. Ratings go live only after the admin publishes them.
              </p>
            </div>

            {!user && (
              <div className="mb-5 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground">
                Please <Link to="/auth" className="font-semibold text-primary underline-offset-4 hover:underline">sign in</Link> to submit a rating.
              </div>
            )}

            <form onSubmit={submitRating} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Item Type</label>
                <select
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  value={form.itemType}
                  onChange={(event) => syncSelectedTarget(event.target.value as "cocktail" | "menu")}
                >
                  <option value="cocktail">Cocktail</option>
                  <option value="menu">Menu</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Choose Item</label>
                <select
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  value={form.itemId}
                  onChange={(event) => setForm((current) => ({ ...current, itemId: event.target.value }))}
                >
                  <option value="">Select an item</option>
                  {ratingTargets
                    .filter((target) => target.type === form.itemType)
                    .map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Rating</label>
                <select
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  value={form.rating}
                  onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Title</label>
                <input
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Short headline for your review"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Review</label>
                <textarea
                  className="min-h-32 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  value={form.review}
                  onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))}
                  placeholder="Tell Tembo guests what stood out."
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !user}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Rating"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClubHouse;
