import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, MapPin, Bell, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvents } from "@/hooks/useEvents";

const Events = () => {
  const { data: events, isLoading } = useEvents();
  const [subscriberName, setSubscriberName] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const source = events ?? [];

    return source.reduce(
      (acc, event) => {
        const comparisonDate = event.end_at || event.start_at;

        if (comparisonDate && new Date(comparisonDate) < now) {
          acc.pastEvents.push(event);
        } else {
          acc.upcomingEvents.push(event);
        }

        return acc;
      },
      { upcomingEvents: [] as typeof source, pastEvents: [] as typeof source },
    );
  }, [events]);

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subscriberEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("subscribe-event-notifications", {
      body: {
        name: subscriberName.trim(),
        email: subscriberEmail.trim(),
      },
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(data?.message || "You are subscribed");
    setSubscriberName("");
    setSubscriberEmail("");
  };

  const renderEventCard = (event: NonNullable<typeof events>[number], mode: "upcoming" | "past") => {
    const sortedImages = [...(event.event_images || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const filteredImages = sortedImages.filter((image) => image.image_type === (mode === "upcoming" ? "promo" : "gallery"));
    const images = filteredImages.length > 0 ? filteredImages : sortedImages;

    return (
      <article key={event.id} className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid min-h-[280px] grid-cols-1 sm:grid-cols-2">
            {images.length > 0 ? (
              images.slice(0, 4).map((image) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={image.caption || event.name}
                  className="h-full min-h-[180px] w-full object-cover"
                  loading="lazy"
                />
              ))
            ) : (
              <div className="col-span-full flex min-h-[280px] items-center justify-center bg-secondary text-sm text-muted-foreground">
                Event photos will be added soon.
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
              {mode === "upcoming" ? "Upcoming Event" : "Previous Event"}
            </p>
            <h2 className="font-display text-3xl text-foreground">{event.name}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {event.description || "More details about this Tembo event will be shared soon."}
            </p>

            <div className="mt-6 space-y-3 text-sm text-foreground">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                <span>{event.start_at ? new Date(event.start_at).toLocaleString() : "Date to be announced"}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{event.location_name?.trim() || "Location will be added soon"}</span>
              </div>
            </div>

            {event.location_url && (
              <a
                href={event.location_url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                View live location <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,173,72,0.18),_transparent_45%)]" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-primary">Tembo Events</p>
            <h1 className="font-display text-4xl text-foreground md:text-6xl">Where Tembo moments become memories.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Discover the experiences we have already shared, see what is coming next, and subscribe for email alerts on upcoming Tembo events.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Stay In The Loop</p>
            <h2 className="mt-3 font-display text-3xl text-foreground">Get upcoming event notifications by email.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Subscribe once and we will notify you when the next Tembo event is announced or updated.
            </p>
          </div>

          <form onSubmit={subscribe} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-primary/15 p-3 text-primary">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Event Email Alerts</h3>
                <p className="text-sm text-muted-foreground">Receive upcoming event updates.</p>
              </div>
            </div>
            <div className="space-y-3">
              <input className="w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground" placeholder="Your name" value={subscriberName} onChange={(e) => setSubscriberName(e.target.value)} />
              <input type="email" className="w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground" placeholder="Email address" value={subscriberEmail} onChange={(e) => setSubscriberEmail(e.target.value)} />
              <button disabled={submitting} className="w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Upcoming</p>
          <h2 className="mt-2 font-display text-3xl text-foreground">What's coming next</h2>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading events...</p>
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-8">
            {upcomingEvents.map((event) => renderEventCard(event, "upcoming"))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            No upcoming events have been published yet.
          </div>
        )}
      </section>

      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Previous Events</p>
            <h2 className="mt-2 font-display text-3xl text-foreground">Moments we've already shared</h2>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : pastEvents.length > 0 ? (
            <div className="space-y-8">
              {pastEvents.map((event) => renderEventCard(event, "past"))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
              Past event galleries will appear here once events have been added.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
