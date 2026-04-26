import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const email = settings?.contact_email || "nqobin31@gmail.com";
  const waNumber = (settings?.whatsapp_number || "+27 73 315 9993").replace(/[^0-9]/g, "");
  const address = settings?.club_house_address || "94a Sandton Drive, Parkmore, Sandton, Johannesburg";

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img src="/images/misc/tembo-logo.jpg" alt="Tembo" className="h-10 w-10 rounded-full object-cover" />
              <h3 className="font-display text-xl font-bold text-foreground">TEMBO</h3>
            </div>
            <p className="text-sm text-muted-foreground">Premium handcrafted spirits born from rich heritage and passion for perfection.</p>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/shop" className="block text-sm text-muted-foreground transition-colors hover:text-primary">Shop</Link>
              <Link to="/events" className="block text-sm text-muted-foreground transition-colors hover:text-primary">Tembo Events</Link>
              <Link to="/club-house" className="block text-sm text-muted-foreground transition-colors hover:text-primary">Private Club House</Link>
              <Link to="/about" className="block text-sm text-muted-foreground transition-colors hover:text-primary">About Us</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground transition-colors hover:text-primary">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground">Contact</h4>
            <div className="space-y-2">
              <a href={`mailto:${email}`} className="block text-sm text-muted-foreground transition-colors hover:text-primary">{email}</a>
              <p className="text-sm text-muted-foreground">{address}</p>
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground">Legal</h4>
            <p className="mb-2 text-sm text-muted-foreground">Must be of legal drinking age.</p>
            <p className="text-sm text-muted-foreground">Drink Responsibly.</p>
            <p className="mt-4 text-sm text-muted-foreground">(c) {new Date().getFullYear()} Tembo Premium Spirits. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
