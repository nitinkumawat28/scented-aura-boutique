import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/store/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isEager = index < 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isEager ? { opacity: 1, y: 0 } : undefined}
      whileInView={!isEager ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: isEager ? index * 0.05 : 0, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative overflow-hidden bg-[var(--color-cream)] aspect-[4/5] border border-border">
          {/* Subtle shimmer skeleton loader behind the image */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted/5 via-muted/15 to-muted/5 animate-pulse" />
          )}
          <img
            src={product.image}
            alt={product.name}
            loading={isEager ? "eager" : "lazy"}
            fetchPriority={isEager ? "high" as any : "auto" as any}
            width={600}
            height={750}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105 group-active:scale-[1.03] ${
              isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-[6px]"
            }`}
          />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-foreground/85 to-transparent">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-cream">
              Discover →
            </span>
          </div>
        </div>
        <div className="text-center mt-3 sm:mt-6 space-y-1 sm:space-y-1.5 px-1 sm:px-2">
          <p className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[var(--color-gold-deep)]">
            {product.category}
          </p>
          <h3 className="font-display text-sm xs:text-base sm:text-xl md:text-2xl text-foreground line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground italic font-serif line-clamp-1">
            {product.tagline}
          </p>
          <p className="text-xs sm:text-sm text-foreground pt-1 sm:pt-2 tracking-wider">
            ₹{product.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
