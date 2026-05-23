import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/store/wishlist";
import { useProductStore } from "@/store/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — The Scented Aura" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const products = useProductStore((s) => s.products);
  const items = useWishlist((s) => s.items);
  const wishlistedProducts = products.filter((p) => items.includes(p.id));

  return (
    <div className="pt-32 pb-24 min-h-[70vh]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="gold-divider mb-6">Your Favourites</span>
          <h1 className="font-display text-5xl text-foreground">
            Your <em className="font-serif italic">Wishlist</em>
          </h1>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif italic text-muted-foreground text-lg">
              Your wishlist is empty. Discover your signature scent.
            </p>
            <Link to="/shop" className="btn-luxury mt-10 inline-flex">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {wishlistedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
