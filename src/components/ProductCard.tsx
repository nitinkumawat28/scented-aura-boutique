import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Product } from "@/store/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative overflow-hidden bg-[var(--color-cream)] aspect-[4/5] border border-border">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-foreground/85 to-transparent">
            <span className="text-[10px] tracking-[0.3em] uppercase text-cream">
              Discover →
            </span>
          </div>
        </div>
        <div className="text-center mt-6 space-y-1.5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-deep)]">
            {product.category}
          </p>
          <h3 className="font-display text-2xl text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground italic font-serif">
            {product.tagline}
          </p>
          <p className="text-sm text-foreground pt-2 tracking-wider">
            ₹{product.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
