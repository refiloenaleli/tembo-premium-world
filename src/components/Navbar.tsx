import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, User, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import RegionSelector from "./RegionSelector";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/images/misc/tembo-logo.jpg" alt="Tembo Premium" className="h-12 w-12 rounded-full border border-primary/30 object-cover shadow-gold" />
          <div className="leading-tight">
            <p className="font-display text-lg font-bold tracking-[0.14em] text-foreground sm:text-xl">Tembo Premium</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary sm:text-xs">We are mwasi.</p>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm tracking-wide uppercase transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <ThemeToggle />
          <RegionSelector />
          {isAdmin && (
            <Link to="/admin" className="p-2 text-primary hover:text-primary/80 transition-colors" title="Admin">
              <Shield size={20} />
            </Link>
          )}
          {user ? (
            <button onClick={() => signOut()} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Sign Out">
              <User size={20} />
            </button>
          ) : (
            <Link to="/auth" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <User size={20} />
            </Link>
          )}
          <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
              className="block px-6 py-3 text-sm uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-6 py-3 text-sm uppercase tracking-wide text-primary hover:bg-secondary transition-colors">
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
