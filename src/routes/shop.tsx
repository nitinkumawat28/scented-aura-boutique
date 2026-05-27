import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProductStore } from "@/store/products";

export const Route = createFileRoute("/shop")({
  loader: async () => {
    // Prefetch products data in the background so it's ready before routing completes
    await useProductStore.getState().fetchProducts();
  },
  head: () => ({
    meta: [
      { title: "Shop — The Scented Aura" },
      { name: "description", content: "Browse our complete collection of handcrafted luxury perfumes." },
    ],
  }),
  component: ShopPage,
});

const sorts = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

function ShopPage() {
  const products = useProductStore((s) => s.products);
  const isLoading = useProductStore((s) => s.isLoading);
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("All");

  const priceRanges = ["All", "Under ₹3,000", "₹3,000 — ₹3,500", "Above ₹3,500"];

  // Memoize categories creation to prevent redundant maps/Sets on every render
  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((p) => p.category))];
  }, [products]);

  // Memoize sorting and filtering calculations to keep sorting dropdown and UI buttery smooth
  const filtered = useMemo(() => {
    let result = cat === "All" ? products : products.filter((p) => p.category === cat);
    
    // Apply Price Filter connected to Supabase prices
    if (priceFilter === "Under ₹3,000") {
      result = result.filter((p) => p.price < 3000);
    } else if (priceFilter === "₹3,000 — ₹3,500") {
      result = result.filter((p) => p.price >= 3000 && p.price <= 3500);
    } else if (priceFilter === "Above ₹3,500") {
      result = result.filter((p) => p.price > 3500);
    }

    // Apply Sorting
    return [...result].sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Newest") {
        return new Date((b as any).created_at || 0).getTime() - new Date((a as any).created_at || 0).getTime();
      }
      if (sort === "Featured") {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      return 0;
    });
  }, [products, cat, priceFilter, sort]);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          <span className="gold-divider mb-6">The Boutique</span>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            The <em className="font-serif italic">Collection</em>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground font-serif italic">
            A curated library of fragrances, each composed in small batches
            and finished entirely by hand.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-16">
          {/* Sidebar */}
          <aside className="space-y-10">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-foreground mb-5 pb-3 border-b border-border">
                Category
              </h3>
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => setCat(c)}
                      className={`text-sm transition-colors ${
                        cat === c
                          ? "text-foreground italic font-serif"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-foreground mb-5 pb-3 border-b border-border">
                Price
              </h3>
              <ul className="space-y-3">
                {priceRanges.map((range) => (
                  <li key={range}>
                    <button
                      onClick={() => setPriceFilter(range)}
                      className={`text-sm transition-colors cursor-pointer ${
                        priceFilter === range
                          ? "text-foreground italic font-serif"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {range}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="flex items-center justify-between pb-6 mb-10 border-b border-border">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {filtered.length} fragrances
              </span>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-transparent text-xs uppercase tracking-[0.2em] text-foreground hover:text-[var(--color-gold-hover)] transition-colors outline-none cursor-pointer"
                >
                  {sort}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-cream)] border border-border shadow-lg z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {sorts.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSort(s);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors ${
                            sort === s 
                              ? "text-[var(--color-gold-deep)] bg-muted/20 font-semibold" 
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="bg-muted/40 aspect-[4/5] w-full border border-border"></div>
                    <div className="h-3 bg-muted/40 w-1/4 mx-auto"></div>
                    <div className="h-5 bg-muted/40 w-2/3 mx-auto"></div>
                    <div className="h-4 bg-muted/40 w-1/3 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border bg-muted/10">
                <p className="font-serif italic text-muted-foreground text-lg">
                  No fragrances match your selection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
