import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X, Heart, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUser } from "@/store/user";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishlistCount = useWishlist((s) => s.items.length);
  const user = useUser((s) => s.user);
  const isAdmin = useUser((s) => s.isAdmin);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/90 backdrop-blur-md border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="flex-1 md:flex-none text-center md:text-left">
          <div className="font-display text-xl md:text-2xl tracking-[0.15em] text-foreground">
            THE SCENTED AURA
          </div>
          <div className="hidden md:block text-[10px] tracking-[0.4em] text-[var(--color-gold-deep)] mt-0.5">
            — HOUSE OF PERFUME —
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {links.map((l, i) => (
            <Link
              key={i}
              to={l.to}
              preload="intent"
              className="luxury-link text-foreground/80 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-foreground">
          {searchOpen ? (
            <form onSubmit={(e) => { e.preventDefault(); navigate({ to: '/shop' }); setSearchOpen(false); }} className="flex items-center border-b border-foreground/50 pb-1 mr-2 animate-in fade-in slide-in-from-right-4">
               <input autoFocus type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-32 md:w-48 text-foreground" />
               <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
            </form>
          ) : (
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="hover:text-[var(--color-gold-hover)] transition-colors">
              <Search size={18} strokeWidth={1.4} />
            </button>
          )}
          {isAdmin && (
            <Link to="/admin" aria-label="Admin Dashboard" className="hidden md:block hover:text-[var(--color-gold-hover)] transition-colors">
              <Settings size={18} strokeWidth={1.4} />
            </Link>
          )}
          <Link to={user ? "/profile" : "/login"} aria-label="Account" className="hidden md:block hover:text-[var(--color-gold-hover)] transition-colors">
            <User size={18} strokeWidth={1.4} />
          </Link>
          <Link to="/wishlist" className="relative hover:text-[var(--color-gold-hover)] transition-colors" aria-label="Wishlist">
            <Heart size={18} strokeWidth={1.4} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-[var(--color-gold-deep)] text-cream rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-[var(--color-gold-hover)] transition-colors" aria-label="Cart">
            <ShoppingBag size={18} strokeWidth={1.4} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-foreground text-cream rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-ivory/95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {links.map((l, i) => (
              <Link key={i} to={l.to} preload="intent" className="luxury-link text-foreground">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-border/60 my-2" />
            <Link 
              to={user ? "/profile" : "/login"} 
              className="luxury-link flex items-center gap-3 text-foreground/90 hover:text-foreground font-serif italic text-sm"
            >
              <User size={16} strokeWidth={1.4} /> {user ? "My Profile" : "Sign In / Register"}
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="luxury-link flex items-center gap-3 text-foreground/90 hover:text-foreground font-serif italic text-sm"
              >
                <Settings size={16} strokeWidth={1.4} /> Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
