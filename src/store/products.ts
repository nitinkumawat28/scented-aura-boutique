import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts } from "@/data/products";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  category: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  intensity: string;
  image: string;
  stock?: number;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Partial<Product>) => void;
  updateProduct: (id: string | number, updates: Partial<Product>) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts.map(p => ({ ...p, stock: Math.floor(Math.random() * 50) + 10 })), // Initialize with mock stock
      addProduct: (p) => set((state) => ({ 
        products: [{ 
          id: Date.now(), 
          name: p.name || "Untitled Product", 
          price: p.price || 0, 
          category: p.category || "Oriental", 
          description: "A newly crafted exclusive fragrance.",
          notes: { top: ["New"], heart: ["Fragrance"], base: ["Blend"] },
          intensity: "Medium",
          image: p.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80",
          stock: p.stock || 0
        }, ...state.products] 
      })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
    }),
    {
      name: 'scented-aura-products',
    }
  )
);
