import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — The Scented Aura" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 500 : 0;

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="gold-divider mb-6">Your Basket</span>
          <h1 className="font-display text-5xl text-foreground">
            Shopping <em className="font-serif italic">Basket</em>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif italic text-muted-foreground text-lg">
              Your bag is quiet. Choose something exquisite.
            </p>
            <Link to="/shop" className="btn-luxury mt-10 inline-flex">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-16">
            <div className="space-y-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-border items-start"
                >
                  <div className="w-20 sm:w-[100px] aspect-[4/5] bg-[var(--color-cream)] overflow-hidden border border-border flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col sm:flex-row flex-1 justify-between gap-3 sm:gap-6 w-full">
                    <div>
                      <h3 className="font-display text-lg sm:text-2xl text-foreground leading-tight">{item.name}</h3>
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1.5 sm:mt-2">
                        {item.size}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground mt-1 sm:mt-3">₹{item.price}</p>
                      <div className="flex items-center border border-border w-fit mt-3 sm:mt-5 bg-background">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="px-2.5 py-1.5 sm:px-3 sm:py-2 hover:text-[var(--color-gold-hover)] transition-colors cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus size={11} strokeWidth={1.4} />
                        </button>
                        <span className="px-2 text-xs sm:text-sm w-8 text-center text-foreground font-medium">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="px-2.5 py-1.5 sm:px-3 sm:py-2 hover:text-[var(--color-gold-hover)] transition-colors cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus size={11} strokeWidth={1.4} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col justify-between sm:items-end items-center sm:text-right border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0 w-full sm:w-auto">
                      <button
                        onClick={() => remove(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 order-2 sm:order-1 cursor-pointer"
                        aria-label="Remove"
                      >
                        <X size={16} strokeWidth={1.4} />
                      </button>
                      <p className="font-display text-base sm:text-lg text-foreground order-1 sm:order-2">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-[var(--color-cream)] border border-border p-8 h-fit lg:sticky lg:top-32">
              <h2 className="font-display text-2xl text-foreground mb-8">
                Order <em className="font-serif italic">Summary</em>
              </h2>

              <div className="flex border-b border-border pb-3 mb-6">
                <input
                  placeholder="Promotion code"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
                <button className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold-deep)] hover:text-foreground">
                  Apply
                </button>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd>₹{subtotal}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Shipping</dt>
                  <dd>₹{shipping}</dd>
                </div>
                <div className="flex justify-between pt-4 border-t border-border text-foreground font-display text-lg">
                  <dt>Total</dt>
                  <dd>₹{subtotal + shipping}</dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn-luxury w-full mt-8 text-center block">
                Proceed to Checkout
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-6 font-serif italic">
                Complimentary samples enclosed with every order.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
