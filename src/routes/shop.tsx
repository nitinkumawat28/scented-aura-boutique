import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProductStore } from "@/store/products";

export const Route = createFileRoute("/shop")({
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
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let filtered = cat === "All" ? products : products.filter((p) => p.category === cat);
  filtered = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    return 0;
  });

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
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Under ₹15,000</button></li>
                <li><button className="hover:text-foreground transition-colors">₹15,000 — ₹20,000</button></li>
                <li><button className="hover:text-foreground transition-colors">Above ₹20,000</button></li>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
