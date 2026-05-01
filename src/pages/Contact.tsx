import { useState } from "react";
import { useRegion } from "@/context/RegionContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { region } = useRegion();
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const contactEmail = settings?.contact_email || "nqobin31@gmail.com";
  const whatsappNumber = settings?.whatsapp_number || "+27 73 315 9993";
  const clubHouseAddress = settings?.club_house_address || "94a Sandton Drive, Parkmore, Sandton, Johannesburg";
  const clubHouseMapUrl =
    settings?.club_house_map_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clubHouseAddress)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
      region_id: region.id,
    });

    if (error) {
      toast.error("We could not send your message right now. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Thank you! Your message has been sent to the Tembo team.");
      setForm({ name: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  const waNumber = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-secondary border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Get In Touch</p>
          <h1 className="font-display text-4xl text-foreground">Contact Us</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl text-foreground mb-6">Order & Delivery</h2>
            <p className="text-muted-foreground mb-6">
              Place your order through our shop and we'll contact you to arrange delivery to {region.name} {region.flag}.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <a href={`mailto:${contactEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{contactEmail}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">{whatsappNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Tembo Club House</p>
                  <p className="text-sm text-muted-foreground">{clubHouseAddress}</p>
                  <a
                    href={clubHouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex text-sm text-primary transition-colors hover:text-primary/80"
                  >
                    Open live location
                  </a>
                  <p className="text-sm text-muted-foreground">Delivering to {region.name} {region.flag} in {region.deliveryDays}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            <textarea placeholder="Your Message / Order Details *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} maxLength={1000} className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
