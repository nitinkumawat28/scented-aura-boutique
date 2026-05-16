import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

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
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

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
            — MAISON DE PARFUM —
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {links.map((l, i) => (
            <Link
              key={i}
              to={l.to}
              className="luxury-link text-foreground/80 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-foreground">
          <button aria-label="Search" className="hover:text-[var(--color-gold-hover)] transition-colors">
            <Search size={18} strokeWidth={1.4} />
          </button>
          <button aria-label="Account" className="hidden md:block hover:text-[var(--color-gold-hover)] transition-colors">
            <User size={18} strokeWidth={1.4} />
          </button>
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
              <Link key={i} to={l.to} className="luxury-link text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
