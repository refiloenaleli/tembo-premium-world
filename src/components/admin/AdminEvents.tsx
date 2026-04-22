import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BellRing, MapPinned, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAllEvents, useEventSubscribers, type DbEventImage, type EventWithImages } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";

type EventForm = {
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  location_name: string;
  location_url: string;
  active: boolean;
  sort_order: string;
  images: Array<{
    id?: string;
    image_url: string;
    caption: string;
    image_type: "promo" | "gallery";
    sort_order: string;
  }>;
};

const emptyForm: EventForm = {
  name: "",
  description: "",
  start_at: "",
  end_at: "",
  location_name: "",
  location_url: "",
  active: true,
  sort_order: "0",
  images: [],
};

function toDateInputValue(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function eventToForm(event: EventWithImages): EventForm {
  return {
    name: event.name,
    description: event.description || "",
    start_at: toDateInputValue(event.start_at),
    end_at: toDateInputValue(event.end_at),
    location_name: event.location_name || "",
    location_url: event.location_url || "",
    active: Boolean(event.active),
    sort_order: String(event.sort_order ?? 0),
    images: (event.event_images || []).map((image) => ({
      id: image.id,
      image_url: image.image_url,
      caption: image.caption || "",
      image_type: image.image_type as "promo" | "gallery",
      sort_order: String(image.sort_order ?? 0),
    })),
  };
}

const AdminEvents = () => {
  const { data: events, isLoading } = useAllEvents();
  const { data: subscribers } = useEventSubscribers();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<EventForm>(emptyForm);

  const activeSubscribers = useMemo(
    () => (subscribers ?? []).filter((subscriber) => subscriber.active),
    [subscribers],
  );

  const resetForm = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyForm);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (event: EventWithImages) => {
    setEditingId(event.id);
    setIsCreating(false);
    setForm(eventToForm(event));
  };

  const addImageRow = () => {
    setForm((current) => ({
      ...current,
      images: [
        ...current.images,
        { image_url: "", caption: "", image_type: "promo", sort_order: String(current.images.length) },
      ],
    }));
  };

  const updateImage = (index: number, key: keyof EventForm["images"][number], value: string) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [key]: value } : image,
      ),
    }));
  };

  const removeImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const uploadImage = async (index: number, file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    updateImage(index, "image_url", data.publicUrl);
    toast.success("Event image uploaded");
  };

  const saveEvent = async () => {
    if (!form.name.trim()) {
      toast.error("Event name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      start_at: form.start_at || null,
      end_at: form.end_at || null,
      location_name: form.location_name.trim() || null,
      location_url: form.location_url.trim() || null,
      active: form.active,
      sort_order: Number.parseInt(form.sort_order, 10) || 0,
    };

    let eventId = editingId;

    if (editingId) {
      const { error } = await supabase.from("events").update(payload).eq("id", editingId);
      if (error) {
        toast.error(error.message);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) {
        toast.error(error?.message || "Unable to create event");
        return;
      }

      eventId = data.id;
    }

    if (!eventId) {
      toast.error("Unable to save event images");
      return;
    }

    const { error: deleteImagesError } = await supabase
      .from("event_images")
      .delete()
      .eq("event_id", eventId);

    if (deleteImagesError) {
      toast.error(deleteImagesError.message);
      return;
    }

    const imagesPayload = form.images
      .filter((image) => image.image_url.trim())
      .map((image) => ({
        event_id: eventId,
        image_url: image.image_url.trim(),
        caption: image.caption.trim() || null,
        image_type: image.image_type,
        sort_order: Number.parseInt(image.sort_order, 10) || 0,
      }));

    if (imagesPayload.length > 0) {
      const { error: insertImagesError } = await supabase
        .from("event_images")
        .insert(imagesPayload);

      if (insertImagesError) {
        toast.error(insertImagesError.message);
        return;
      }
    }

    toast.success(editingId ? "Event updated" : "Event created");
    resetForm();
    queryClient.invalidateQueries({ queryKey: ["all-events"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Event deleted");
    queryClient.invalidateQueries({ queryKey: ["all-events"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const sendNotification = async (eventId: string) => {
    if (!session?.access_token) {
      toast.error("Please sign in again");
      return;
    }

    const { data, error } = await supabase.functions.invoke("notify-event-subscribers", {
      body: { eventId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const sent = Number(data?.sent || 0);
    const failed = Number(data?.failed || 0);

    if (failed > 0) {
      toast.success(`${data?.message || "Notification run completed"}: ${sent} sent, ${failed} failed`);
    } else {
      toast.success(`${data?.message || "Notification sent"}${sent > 0 ? `: ${sent} sent` : ""}`);
    }

    queryClient.invalidateQueries({ queryKey: ["event-subscribers"] });
  };

  const formatWhen = (event: EventWithImages) => {
    if (!event.start_at) return "Date to be announced";
    return new Date(event.start_at).toLocaleString();
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-lg text-foreground">Tembo Events</h2>
          <p className="text-sm text-muted-foreground">
            Manage upcoming and previous events, promotions, galleries, and subscriber notifications.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            {activeSubscribers.length} active subscriber{activeSubscribers.length === 1 ? "" : "s"}
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      {(isCreating || editingId) && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Event Name</label>
              <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Sort Order</label>
              <input type="number" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Start Date</label>
              <input type="datetime-local" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">End Date</label>
              <input type="datetime-local" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Location Name</label>
              <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="Location will be added soon" value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Live Location URL</label>
              <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="https://maps.google.com/..." value={form.location_url} onChange={(e) => setForm({ ...form, location_url: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Description</label>
            <textarea className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Publish this event on the website
          </label>

          <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Event Images</h3>
                <p className="text-sm text-muted-foreground">Add promo images for upcoming events and gallery images for past events.</p>
              </div>
              <button onClick={addImageRow} className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                Add Image
              </button>
            </div>

            {form.images.map((image, index) => (
              <div key={`${image.id || "new"}-${index}`} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1.4fr_1fr_120px_120px_auto]">
                <input className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="Image URL" value={image.image_url} onChange={(e) => updateImage(index, "image_url", e.target.value)} />
                <input className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" placeholder="Caption" value={image.caption} onChange={(e) => updateImage(index, "caption", e.target.value)} />
                <select className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={image.image_type} onChange={(e) => updateImage(index, "image_type", e.target.value)}>
                  <option value="promo">Promo</option>
                  <option value="gallery">Gallery</option>
                </select>
                <input type="number" className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={image.sort_order} onChange={(e) => updateImage(index, "sort_order", e.target.value)} />
                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                    <Upload size={14} />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(index, e.target.files[0]); }} />
                  </label>
                  <button onClick={() => removeImage(index)} className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {form.images.length === 0 && (
              <p className="text-sm text-muted-foreground">No images added yet.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={saveEvent} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              Save Event
            </button>
            <button onClick={resetForm} className="rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events?.map((event) => {
          const images = (event.event_images || []) as DbEventImage[];

          return (
            <div key={event.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-2xl text-foreground">{event.name}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.active ? "bg-primary/20 text-primary" : "bg-destructive/15 text-destructive"}`}>
                      {event.active ? "Published" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatWhen(event)}</p>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{event.description || "No description added yet."}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <MapPinned size={15} className="text-primary" />
                      {event.location_name?.trim() || "Location will be added soon"}
                    </span>
                    {event.location_url && (
                      <a href={event.location_url} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                        Open live location
                      </a>
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {images.length} image{images.length === 1 ? "" : "s"} attached
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => startEdit(event)} className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                    Edit
                  </button>
                  <button onClick={() => sendNotification(event.id)} className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
                    <BellRing size={16} /> Notify Subscribers
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {(!events || events.length === 0) && (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No events yet. Create your first Tembo event to populate the events page.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display text-xl text-foreground">Subscribers</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          People who signed up on the Tembo Events page will appear here for email notifications.
        </p>
        <div className="mt-4 space-y-3">
          {subscribers?.map((subscriber) => (
            <div key={subscriber.id} className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{subscriber.name || "Subscriber"}</p>
                <p className="text-sm text-muted-foreground">{subscriber.email}</p>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {subscriber.last_notified_at ? `Last notified ${new Date(subscriber.last_notified_at).toLocaleDateString()}` : "Not notified yet"}
              </div>
            </div>
          ))}
          {(!subscribers || subscribers.length === 0) && (
            <p className="text-sm text-muted-foreground">No event subscribers yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
