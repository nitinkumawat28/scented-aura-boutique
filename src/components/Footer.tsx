import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-cream)] border-t border-border mt-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <div className="font-display text-xl tracking-[0.15em] text-foreground">
            THE SCENTED AURA
          </div>
          <div className="text-[10px] tracking-[0.4em] text-[var(--color-gold-deep)] mt-1">
            — HOUSE OF PERFUME —
          </div>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed font-serif italic">
            Handcrafted fragrances inspired by nature, elegance, and the
            unhurried beauty of timeless artistry.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-foreground mb-5">
            House
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
            <li><Link to="/shop" className="hover:text-foreground transition-colors">Collections</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Boutiques</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-foreground mb-5">
            Client Care
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><a className="hover:text-foreground transition-colors">Shipping</a></li>
            <li><a className="hover:text-foreground transition-colors">Returns</a></li>
            <li><a className="hover:text-foreground transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-foreground mb-5">
            The Journal
          </h4>
          <p className="text-sm text-muted-foreground mb-4 font-serif italic">
            Receive private editions, news, and rituals.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b border-foreground/40 focus-within:border-foreground transition-colors"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent py-2 text-sm placeholder:text-muted-foreground/70 outline-none"
            />
            <button className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold-deep)] hover:text-foreground transition-colors">
              Join
            </button>
          </form>
          <div className="flex gap-5 mt-8 text-foreground/70">
            <a aria-label="Instagram" className="hover:text-[var(--color-gold-hover)] transition-colors"><Instagram size={18} strokeWidth={1.3} /></a>
            <a aria-label="Facebook" className="hover:text-[var(--color-gold-hover)] transition-colors"><Facebook size={18} strokeWidth={1.3} /></a>
            <a aria-label="Twitter" className="hover:text-[var(--color-gold-hover)] transition-colors"><Twitter size={18} strokeWidth={1.3} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between text-xs text-muted-foreground tracking-wider">
          <span>© {new Date().getFullYear()} The Scented Aura · All rights reserved</span>
          <span className="mt-2 md:mt-0">Crafted in small batches · Paris</span>
        </div>
      </div>
    </footer>
  );
}
