import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const email = settings?.contact_email || "tembopremium56@gmail.com";
  const waNumber = (settings?.whatsapp_number || "+26659385613").replace(/[^0-9]/g, "");

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/misc/tembo-logo.jpg" alt="Tembo" className="h-10 w-10 rounded-full object-cover" />
              <h3 className="font-display text-xl font-bold text-foreground">TEMBO</h3>
            </div>
            <p className="text-sm text-muted-foreground">Premium handcrafted spirits born from rich heritage and passion for perfection.</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/shop" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Shop</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-3">Contact</h4>
            <div className="space-y-2">
              <a href={`mailto:${email}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{email}</a>
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-3">Legal</h4>
            <p className="text-sm text-muted-foreground mb-2">Must be of legal drinking age.</p>
            <p className="text-sm text-muted-foreground">Drink Responsibly.</p>
            <p className="text-sm text-muted-foreground mt-4">© {new Date().getFullYear()} Tembo Premium Spirits. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
