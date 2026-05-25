import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, AlertCircle, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { useUser } from "@/store/user";

const ADDRESS_SUGGESTIONS = [
  {
    street: "18 Rue des Archives, Le Marais",
    city: "Paris",
    state: "Île-de-France",
    pincode: "75004"
  },
  {
    street: "Taj Mahal Palace Ground, Apollo Bunder",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  {
    street: "Amrita Shergill Marg, Chanakyapuri",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110021"
  },
  {
    street: "Umaid Bhawan Palace Area, Cantt Area",
    city: "Jodhpur",
    state: "Rajasthan",
    pincode: "342006"
  },
  {
    street: "MG Road, Victoria Road Crossing",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001"
  }
];

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Scented Aura" },
      { name: "description", content: "Complete your luxury fragrance order securely." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  
  // Zustand store hooks
  const cartItems = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const checkoutData = useCheckoutStore((s) => s.checkoutData);
  const setCheckoutData = useCheckoutStore((s) => s.setCheckoutData);
  const clearCheckout = useCheckoutStore((s) => s.clearCheckoutData);
  const user = useUser((s) => s.user);
  const addOrder = useUser((s) => s.addOrder);

  // Protected route validation
  if (!user) {
    return <Navigate to="/login" search={{ redirect: "/checkout" }} />;
  }

  // Local state for UI feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  
  // Address autocomplete local state
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  // Autocomplete filtering based on typed address
  const filteredSuggestions = ADDRESS_SUGGESTIONS.filter((s) =>
    s.street.toLowerCase().includes((checkoutData.address || "").toLowerCase()) ||
    s.city.toLowerCase().includes((checkoutData.address || "").toLowerCase())
  );

  // Calculate pricing
  const subtotal = cartItems.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const total = Math.max(0, subtotal + shipping - promoDiscount);

  // Sync user details if logged in and store is empty
  useEffect(() => {
    if (user) {
      const updates: Partial<typeof checkoutData> = {};
      if (!checkoutData.email && user.email) updates.email = user.email;
      if (!checkoutData.phone && user.mobile) updates.phone = user.mobile;
      
      if (user.addresses && user.addresses.length > 0) {
        const primaryAddr = user.addresses[0];
        if (!checkoutData.address && primaryAddr.street) updates.address = primaryAddr.street;
        if (!checkoutData.city && primaryAddr.city) updates.city = primaryAddr.city;
        if (!checkoutData.state && primaryAddr.state) updates.state = primaryAddr.state;
        if (!checkoutData.pincode && primaryAddr.pincode) updates.pincode = primaryAddr.pincode;
      }

      if (Object.keys(updates).length > 0) {
        setCheckoutData(updates);
      }
    }
  }, [user]);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!checkoutData.email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(checkoutData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!checkoutData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9\s+-]{10,15}$/.test(checkoutData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!checkoutData.address.trim()) {
      newErrors.address = "Shipping address is required";
    }

    if (!checkoutData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!checkoutData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!checkoutData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(checkoutData.pincode.trim())) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a code");
      return;
    }

    if (code === "AURA20" || code === "WELCOME20") {
      const discount = Math.round(subtotal * 0.2);
      setPromoDiscount(discount);
      setPromoSuccess(`Promo applied: 20% off (Saved ₹${discount})`);
    } else if (code === "LUXE10") {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoSuccess(`Promo applied: 10% off (Saved ₹${discount})`);
    } else {
      setPromoError("Invalid promo code");
    }
  };

  // Submit Order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      setErrors({ form: "Your cart is empty. Please add items before checking out." });
      return;
    }

    setIsSubmitting(true);

    try {
      // Persist order in Supabase & local state asynchronously
      await addOrder({
        total,
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price
        }))
      });

      // Generate visual order confirmation number
      const orderId = "OD" + Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setGeneratedOrderId(orderId);

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to place your order. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleCompleteFlow = () => {
    clearCart();
    clearCheckout();
    navigate({ to: "/shop" });
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-6 text-center animate-in fade-in duration-700">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full bg-[var(--color-gold)]/10 animate-ping" />
            <CheckCircle2 size={72} strokeWidth={1} className="relative text-[var(--color-gold-deep)] mx-auto" />
          </div>
          
          <span className="gold-divider mb-4">Olfactory Journey Awaits</span>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Thank you <em className="font-serif italic">for your order</em>
          </h1>
          
          <p className="font-serif text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Your request has been registered. Our perfumers are preparing your handcrafted parcel with the utmost care.
          </p>

          <div className="bg-background border border-border p-8 text-left mb-10 space-y-4 shadow-sm max-w-lg mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order Reference</span>
              <span className="font-display font-medium text-foreground tracking-wide">{generatedOrderId}</span>
            </div>
            
            <div className="space-y-1 text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-2">Delivery Details</span>
              <p className="font-medium text-foreground">{user ? `${user.firstName} ${user.lastName}` : "Valued Guest"}</p>
              <p className="text-muted-foreground">{checkoutData.address}</p>
              <p className="text-muted-foreground">{checkoutData.city}, {checkoutData.state} — <span className="font-medium text-foreground">{checkoutData.pincode}</span></p>
              <p className="text-muted-foreground mt-1">Phone: {checkoutData.phone}</p>
            </div>

            <div className="pt-3 border-t border-border/50 flex justify-between items-center text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Paid</span>
              <span className="font-display font-semibold text-[var(--color-gold-deep)] text-lg">₹{total}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={handleCompleteFlow} className="btn-luxury px-12">
              Continue Shopping
            </button>
            <Link to="/profile" onClick={() => { clearCart(); clearCheckout(); }} className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-transparent hover:border-foreground">
              Track in Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-10 flex items-center">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Basket
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_450px] gap-16 items-start">
          {/* Checkout Form */}
          <div className="space-y-12">
            <div>
              <span className="gold-divider mb-4">Secure Checkout</span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground">
                Shipping <em className="font-serif italic">&amp; Information</em>
              </h1>
            </div>

            {errors.form && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
                <AlertCircle size={16} />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Customer Information */}
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-foreground border-b border-border/50 pb-2">
                  Customer <em className="font-serif italic">Information</em>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({ email: e.target.value })}
                      placeholder="e.g. signature@scentedaura.com"
                      className={`w-full bg-transparent border-b ${errors.email ? "border-destructive" : "border-foreground/30 focus:border-foreground"} py-2 outline-none transition-colors text-foreground`}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className={`w-full bg-transparent border-b ${errors.phone ? "border-destructive" : "border-foreground/30 focus:border-foreground"} py-2 outline-none transition-colors text-foreground`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-foreground border-b border-border/50 pb-2">
                  Shipping <em className="font-serif italic">Address</em>
                </h2>

                {user?.addresses && user.addresses.length > 0 && (
                  <div className="bg-[var(--color-cream)] border border-border p-5 mb-2 shadow-sm animate-in fade-in duration-300">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3">
                      Suggested Addresses from Profile
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {user.addresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setCheckoutData({
                              address: addr.street,
                              city: addr.city,
                              state: addr.state,
                              pincode: addr.pincode,
                              phone: addr.mobile || checkoutData.phone,
                            });
                          }}
                          className="text-left p-4 bg-background hover:bg-[var(--color-secondary)]/10 border border-border hover:border-[var(--color-gold)] transition-all duration-300 cursor-pointer flex-1 min-w-[240px] max-w-sm rounded-sm shadow-sm group"
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
                              {addr.name}
                            </span>
                            <span className="text-[9px] font-semibold text-[var(--color-gold-deep)] uppercase tracking-wider group-hover:underline">
                              Use Address
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed truncate">
                            {addr.street}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={checkoutData.address}
                      onChange={(e) => {
                        setCheckoutData({ address: e.target.value });
                        setShowAddressSuggestions(true);
                      }}
                      onFocus={() => setShowAddressSuggestions(true)}
                      onBlur={() => {
                        // Delay closure slightly to allow onMouseDown clicks to register
                        setTimeout(() => setShowAddressSuggestions(false), 200);
                      }}
                      placeholder="e.g. Apartment, Suite, Villa, House No."
                      className={`w-full bg-transparent border-b ${errors.address ? "border-destructive" : "border-foreground/30 focus:border-foreground"} py-2 outline-none transition-colors text-foreground`}
                    />
                    
                    {/* Floating Autocomplete Dropdown */}
                    {showAddressSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 top-full bg-[var(--color-cream)] border border-border shadow-luxury mt-1 max-h-60 overflow-y-auto divide-y divide-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onMouseDown={() => {
                              setCheckoutData({
                                address: suggestion.street,
                                city: suggestion.city,
                                state: suggestion.state,
                                pincode: suggestion.pincode,
                              });
                              setShowAddressSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-[var(--color-secondary)]/20 transition-colors flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-foreground tracking-wide font-sans">
                              {suggestion.street}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">
                              {suggestion.city}, {suggestion.state} • {suggestion.pincode}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {errors.address && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({ city: e.target.value })}
                        placeholder="e.g. New Delhi"
                        className={`w-full bg-transparent border-b ${errors.city ? "border-destructive" : "border-foreground/30 focus:border-foreground"} py-2 outline-none transition-colors text-foreground`}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={checkoutData.state}
                        onChange={(e) => setCheckoutData({ state: e.target.value })}
                        placeholder="e.g. Delhi"
                        className={`w-full bg-transparent border-b ${errors.state ? "border-destructive" : "border-foreground/30 focus:border-foreground"} py-2 outline-none transition-colors text-foreground`}
                      />
                      {errors.state && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={checkoutData.pincode}
                        onChange={(e) => setCheckoutData({ pincode: e.target.value })}
                        placeholder="e.g. 110001"
                        maxLength={6}
                        className={`w-full bg-transparent border-b ${errors.pincode ? "border-destructive" : "border-foreground/30 focus:border-foreground"} py-2 outline-none transition-colors text-foreground`}
                      />
                      {errors.pincode && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Processing Olfactory Order...
                    </>
                  ) : (
                    <>
                      Place Order — ₹{total}
                      <Sparkles size={14} className="group-hover:rotate-12 transition-transform duration-300 text-[var(--color-gold)]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sticky Order Summary */}
          <aside className="bg-[var(--color-cream)] border border-border p-8 h-fit lg:sticky lg:top-32 space-y-8">
            <div>
              <h2 className="font-display text-2xl text-foreground">
                Order <em className="font-serif italic">Summary</em>
              </h2>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {cartItems.length} {cartItems.length === 1 ? "Exquisite Item" : "Exquisite Items"}
              </p>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="text-center py-6 border-b border-border/50">
                <p className="font-serif italic text-muted-foreground text-sm">
                  Your basket is currently empty.
                </p>
                <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold-deep)] hover:underline block mt-3">
                  Go back to boutique
                </Link>
              </div>
            ) : (
              <div className="max-h-[250px] overflow-y-auto pr-2 space-y-6 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-[var(--color-cream)] border border-border/50 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm text-foreground truncate">{item.name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                        {item.size} • Qty {item.qty}
                      </p>
                    </div>
                    <div className="text-right text-sm font-display text-foreground font-medium">
                      ₹{item.price * item.qty}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Code Input */}
            <div className="border-t border-border/50 pt-6">
              <div className="flex border-b border-border pb-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. AURA20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 text-foreground uppercase tracking-widest"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold-deep)] hover:text-foreground transition-colors font-medium ml-2"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <AlertCircle size={10} /> {promoError}
                </p>
              )}
              {promoSuccess && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                  <Sparkles size={10} className="text-emerald-500" /> {promoSuccess}
                </p>
              )}
            </div>

            {/* Pricing Details */}
            <dl className="space-y-3 text-sm border-t border-border/50 pt-6">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd>₹{subtotal}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Shipping</dt>
                <dd>₹{shipping}</dd>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <dt>Promo Discount</dt>
                  <dd>-₹{promoDiscount}</dd>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-border text-foreground font-display text-lg">
                <dt>Total</dt>
                <dd className="text-[var(--color-gold-deep)] font-semibold">₹{total}</dd>
              </div>
            </dl>

            <div className="text-center font-serif italic text-muted-foreground text-xs pt-2">
              All transactions are secured and encrypted.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
