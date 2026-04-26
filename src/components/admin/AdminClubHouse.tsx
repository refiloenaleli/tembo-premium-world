import { useState, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useAllClubHouseCocktails,
  useAllClubHouseMenus,
  useAllClubHouseRatings,
  type ClubHouseCocktail,
  type ClubHouseMenu,
} from "@/hooks/useClubHouse";

type ManagedItem = ClubHouseCocktail | ClubHouseMenu;

type ItemForm = {
  title: string;
  description: string;
  image_url: string;
  active: boolean;
  sort_order: string;
};

const emptyForm: ItemForm = {
  title: "",
  description: "",
  image_url: "",
  active: true,
  sort_order: "0",
};

const itemToForm = (item: ManagedItem): ItemForm => ({
  title: item.title,
  description: item.description || "",
  image_url: item.image_url || "",
  active: item.active,
  sort_order: String(item.sort_order ?? 0),
});

const ratingStars = (count: number) => "★".repeat(count) + "☆".repeat(Math.max(0, 5 - count));

const AdminClubHouse = () => {
  const { data: cocktails, isLoading: cocktailsLoading } = useAllClubHouseCocktails();
  const { data: menus, isLoading: menusLoading } = useAllClubHouseMenus();
  const { data: ratings, isLoading: ratingsLoading } = useAllClubHouseRatings();
  const queryClient = useQueryClient();

  const [cocktailForm, setCocktailForm] = useState<ItemForm>(emptyForm);
  const [menuForm, setMenuForm] = useState<ItemForm>(emptyForm);
  const [editingCocktailId, setEditingCocktailId] = useState<string | null>(null);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["club-house-cocktails"] });
    queryClient.invalidateQueries({ queryKey: ["all-club-house-cocktails"] });
    queryClient.invalidateQueries({ queryKey: ["club-house-menus"] });
    queryClient.invalidateQueries({ queryKey: ["all-club-house-menus"] });
    queryClient.invalidateQueries({ queryKey: ["club-house-catalog"] });
    queryClient.invalidateQueries({ queryKey: ["club-house-ratings"] });
    queryClient.invalidateQueries({ queryKey: ["all-club-house-ratings"] });
  };

  const uploadImage = async (
    file: File,
    setForm: Dispatch<SetStateAction<ItemForm>>,
    folder: "cocktails" | "menus",
  ) => {
    const path = `club-house/${folder}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setForm((current) => ({ ...current, image_url: data.publicUrl }));
    toast.success("Image uploaded");
  };

  const saveItem = async (table: "club_house_cocktails" | "club_house_menus", form: ItemForm, editingId: string | null) => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      active: form.active,
      sort_order: Number.parseInt(form.sort_order, 10) || 0,
    };

    const response = editingId
      ? await supabase.from(table).update(payload).eq("id", editingId)
      : await supabase.from(table).insert(payload);

    if (response.error) {
      toast.error(response.error.message);
      return false;
    }

    refresh();
    toast.success(editingId ? "Item updated" : "Item created");
    return true;
  };

  const deleteItem = async (table: "club_house_cocktails" | "club_house_menus", id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }

    refresh();
    toast.success("Item deleted");
  };

  const toggleRatingPublished = async (id: string, published: boolean) => {
    const { error } = await supabase
      .from("club_house_ratings")
      .update({ published: !published })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    refresh();
    toast.success(!published ? "Rating published" : "Rating hidden");
  };

  const renderManager = (
    title: string,
    description: string,
    table: "club_house_cocktails" | "club_house_menus",
    items: ManagedItem[] | undefined,
    loading: boolean,
    form: ItemForm,
    setForm: Dispatch<SetStateAction<ItemForm>>,
    editingId: string | null,
    setEditingId: Dispatch<SetStateAction<string | null>>,
    folder: "cocktails" | "menus",
  ) => (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-xl text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={16} /> New
        </button>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-secondary/20 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Title</label>
            <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Sort Order</label>
            <input type="number" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Description</label>
          <textarea className="min-h-28 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Image URL</label>
            <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.image_url} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} />
          </div>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
              <Upload size={15} />
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={(event) => { if (event.target.files?.[0]) uploadImage(event.target.files[0], setForm, folder); }} />
            </label>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
          Publish on the Tembo Private Club House page
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              const saved = await saveItem(table, form, editingId);
              if (saved) {
                setEditingId(null);
                setForm(emptyForm);
              }
            }}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            {editingId ? "Update" : "Save"}
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !items?.length ? (
        <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">No items added yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="grid gap-4 rounded-xl border border-border bg-secondary/10 p-4 lg:grid-cols-[96px_1fr_auto]">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="h-24 w-24 rounded-lg object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-secondary text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  No image
                </div>
              )}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.active ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
                    {item.active ? "Published" : "Hidden"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description || "No description added yet."}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setForm(itemToForm(item));
                  }}
                  className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(table, item.id)}
                  className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderManager(
        "Club House Cocktails",
        "Add the cocktails that should appear on the Tembo Private Club House page.",
        "club_house_cocktails",
        cocktails,
        cocktailsLoading,
        cocktailForm,
        setCocktailForm,
        editingCocktailId,
        setEditingCocktailId,
        "cocktails",
      )}

      {renderManager(
        "Club House Menus",
        "Add menu cards with titles, descriptions, and images for private experiences.",
        "club_house_menus",
        menus,
        menusLoading,
        menuForm,
        setMenuForm,
        editingMenuId,
        setEditingMenuId,
        "menus",
      )}

      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="font-display text-xl text-foreground">Ratings Moderation</h2>
          <p className="text-sm text-muted-foreground">
            Guests can submit ratings, and you decide which ones are published on the page.
          </p>
        </div>

        {ratingsLoading ? (
          <p className="text-muted-foreground">Loading ratings...</p>
        ) : !ratings?.length ? (
          <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            No ratings have been submitted yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {ratings.map((rating) => (
              <article key={rating.id} className="rounded-xl border border-border bg-secondary/10 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{rating.display_name}</p>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {rating.item_type}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rating.published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {rating.published ? "Published" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-primary">{ratingStars(rating.rating)}</p>
                    {rating.title && <p className="text-base font-semibold text-foreground">{rating.title}</p>}
                    {rating.review && <p className="text-sm leading-6 text-muted-foreground">{rating.review}</p>}
                  </div>
                  <button
                    onClick={() => toggleRatingPublished(rating.id, rating.published)}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    <Check size={16} />
                    {rating.published ? "Hide" : "Publish"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClubHouse;
