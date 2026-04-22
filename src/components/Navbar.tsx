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
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src="/images/misc/tembo-logo.jpg" alt="Tembo Premium" className="h-10 w-10 rounded-full border border-primary/30 object-cover shadow-gold sm:h-12 sm:w-12" />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold tracking-[0.08em] text-foreground sm:text-xl sm:tracking-[0.14em]">Tembo Premium</p>
            <p className="hidden text-[10px] uppercase tracking-[0.28em] text-primary sm:block sm:text-xs">We are mwasi.</p>
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

        <div className="hidden items-center gap-1 md:flex">
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
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="p-2 text-muted-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="space-y-4 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Display</p>
                <p className="text-sm text-foreground">Theme and currency</p>
              </div>
              <ThemeToggle />
            </div>
            <RegionSelector triggerClassName="w-full max-w-none justify-between h-10 px-3 text-xs" />
          </div>

          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
              className="block px-6 py-3 text-sm uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="block w-full px-6 py-3 text-left text-sm uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="block px-6 py-3 text-sm uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          )}
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
