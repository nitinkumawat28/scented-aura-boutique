import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-perfume.png";
import storyImg from "@/assets/brand-story.jpg";
import { ProductCard } from "@/components/ProductCard";
import { useProductStore } from "@/store/products";

import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Scented Aura — Timeless Luxury Fragrance" },
      { name: "description", content: "Discover handcrafted luxury perfumes inspired by elegance, nature, and timeless sophistication." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const isLoading = useProductStore((s) => s.isLoading);
  const displayProducts = products.slice(0, 4);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[var(--color-ivory)]" />
        <div className="mx-auto max-w-[1400px] w-full px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="gold-divider mb-8">House of Perfume</span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground">
              Discover the
              <br />
              Essence of
              <br />
              <em className="font-serif italic text-[var(--color-gold-hover)]">
                Timeless Luxury
              </em>
            </h1>
            <p className="mt-8 max-w-md text-base md:text-lg text-muted-foreground font-serif italic leading-relaxed">
              Crafted fragrances inspired by elegance, nature, and the
              quiet sophistication of an evening unfolding in candlelight.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-luxury">
                Explore Collection
              </Link>
              <Link to="/shop" className="btn-outline-luxury">
                Shop Luxury Scents
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={heroImg}
                alt="Luxury perfume bottle with botanicals"
                width={1536}
                height={1920}
                className="w-full h-full object-cover animate-float-slow"
              />
              <div className="absolute -bottom-4 -left-4 hidden md:block">
                <div className="bg-[var(--color-cream)] border border-border px-6 py-4 shadow-[var(--shadow-soft)]">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold-deep)]">
                    New · 2026
                  </p>
                  <p className="font-display text-lg text-foreground">Royal Oud</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20"
          >
            <span className="gold-divider mb-6">The Collection</span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Signature <em className="font-serif italic">Fragrances</em>
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground font-serif italic">
              Each bottle composed by hand in our Parisian atelier — a private
              chapter of scent waiting to be written upon your skin.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-muted/40 aspect-[4/5] w-full border border-border"></div>
                  <div className="h-3 bg-muted/40 w-1/4 mx-auto"></div>
                  <div className="h-5 bg-muted/40 w-2/3 mx-auto"></div>
                  <div className="h-4 bg-muted/40 w-1/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif italic text-muted-foreground text-lg">
                No signature fragrances found in the boutique at this moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {displayProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-20">
            <Link to="/shop" className="luxury-link text-foreground">
              View Full Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-32 bg-[var(--color-secondary)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] overflow-hidden"
          >
            <img
              src={storyImg}
              alt="Artisan perfumer at work"
              loading="lazy"
              width={1080}
              height={1536}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 }}
          >
            <span className="gold-divider mb-6">Our Story</span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-foreground">
              The art of slow
              <br />
              <em className="font-serif italic text-[var(--color-gold-hover)]">
                perfumery
              </em>
            </h2>
            <p className="mt-8 text-muted-foreground leading-loose font-serif text-lg">
              Inside a sunlit atelier tucked behind a wrought-iron gate, our
              perfumer macerates rare absolutes for months at a time. Each
              composition is an unhurried conversation between botanical
              materials, vintage glass, and a single quiet hand.
            </p>
            <p className="mt-5 text-muted-foreground leading-loose font-serif text-lg">
              Nothing is rushed. Nothing is ordinary. Everything is made to
              be remembered.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 mt-10 luxury-link text-foreground">
              Read Our Story <ArrowRight size={14} strokeWidth={1.4} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="gold-divider mb-6">The Journal</span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Letters from the <em className="font-serif italic">atelier</em>
          </h2>
          <p className="mt-5 text-muted-foreground font-serif italic">
            Private editions, scent rituals, and quiet news — never more than
            once a month.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex max-w-md mx-auto border-b border-foreground"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent py-3 placeholder:text-muted-foreground/70 outline-none text-sm"
            />
            <button className="text-xs uppercase tracking-[0.25em] px-4 text-foreground hover:text-[var(--color-gold-hover)] transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
