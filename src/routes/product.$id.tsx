import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useProductStore } from "@/store/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    return { id: params.id };
  },
  head: ({ params }) => ({
    meta: [
      { title: `Luxury Fragrance — The Scented Aura` },
      { name: "description", content: "Discover handcrafted luxury perfumes." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useLoaderData();
  const product = useProductStore((s) => s.products.find(p => p.id.toString() === id));
  const products = useProductStore((s) => s.products);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const hasWishlisted = useWishlist((s) => s.has(id));

  if (!product) {
    return (
      <div className="pt-48 pb-24 text-center">
        <p className="font-serif italic text-muted-foreground text-lg animate-pulse">
          Unveiling olfactory notes...
        </p>
      </div>
    );
  }

  const onAdd = () => {
    for (let i = 0; i < qty; i++) {
      add({ id: product.id, name: product.name, price: product.price, image: product.image, size: "100ml" });
    }
  };


  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-10">
          <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-foreground">Shop</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] bg-[var(--color-cream)] overflow-hidden border border-border"
          >
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1280}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:pt-8"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--color-gold-deep)]">
              {product.category}
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-foreground mt-4">
              {product.name}
            </h1>
            <p className="mt-3 font-serif italic text-muted-foreground">
              {product.tagline}
            </p>
            <div className="mt-8 h-px w-16 bg-[var(--color-gold)]" />
            <p className="mt-8 text-lg font-serif text-muted-foreground leading-loose">
              {product.description}
            </p>
            <p className="mt-10 text-2xl font-display text-foreground tracking-wider">
              ₹{product.price}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
              <div className="flex justify-center items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:text-[var(--color-gold-hover)] transition-colors"
                  aria-label="Decrease"
                >
                  <Minus size={14} strokeWidth={1.4} />
                </button>
                <span className="px-4 text-sm tracking-wider w-10 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 hover:text-[var(--color-gold-hover)] transition-colors"
                  aria-label="Increase"
                >
                  <Plus size={14} strokeWidth={1.4} />
                </button>
              </div>
              <button onClick={onAdd} className="btn-luxury flex-1">
                <ShoppingBag size={14} strokeWidth={1.4} />
                Add to Cart
              </button>
            </div>

            <button 
              onClick={() => toggleWishlist(product.id)}
              className="mt-4 luxury-link text-foreground inline-flex items-center gap-2"
            >
              <Heart size={14} strokeWidth={1.4} fill={hasWishlisted ? "currentColor" : "none"} /> 
              {hasWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>

            {/* Notes */}
            <div className="mt-16 space-y-8">
              <h3 className="font-display text-2xl text-foreground">
                Olfactory <em className="italic font-serif">Pyramid</em>
              </h3>
              {(["top", "heart", "base"] as const).map((k) => (
                <div key={k} className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-2 sm:gap-6 items-start py-5 border-t border-border">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)]">
                    {k === "top" ? "Top" : k === "heart" ? "Heart" : "Base"}
                  </p>
                  <p className="font-serif italic text-muted-foreground text-sm sm:text-base md:text-lg">
                    {product.notes[k].join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <span className="gold-divider mb-6">You may also like</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              You may also <em className="font-serif italic">cherish</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.filter((p) => p.id !== product.id).slice(0, 3).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
