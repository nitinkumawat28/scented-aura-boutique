import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts } from "@/data/products";
import { productService } from "@/services/products";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  category: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  intensity: string;
  image: string;
  stock: number;
  featured: boolean;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts.map(p => ({ ...p, intensity: "Medium" })), // Fallback local data cache
      isLoading: false,
      error: null,
      
      fetchProducts: async () => {
        if (!isSupabaseConfigured) {
          console.warn("Supabase is not configured. Falling back to local data.");
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await productService.getProducts();
          if (data && data.length > 0) {
            set({ products: data, isLoading: false });
          } else {
            set({ isLoading: false });
          }

          // Enable Supabase Realtime postgres listener on public.products changes
          supabase
            .channel("realtime-products")
            .on("postgres_changes", { event: "*", schema: "public", table: "products" }, async (payload) => {
              console.log("Realtime products update received:", payload);
              try {
                const freshData = await productService.getProducts();
                if (freshData && freshData.length > 0) {
                  set({ products: freshData });
                }
              } catch (fetchErr) {
                console.error("Error refreshing realtime products data:", fetchErr);
              }
            })
            .subscribe();
        } catch (err: any) {
          console.error("Exception during fetching Supabase products:", err);
          set({ error: err.message || "Failed to fetch products", isLoading: false });
        }
      },

      addProduct: async (p) => {
        set({ isLoading: true, error: null });
        try {
          const created = await productService.createProduct(p);
          set((state) => ({
            products: [created, ...state.products],
            isLoading: false
          }));
        } catch (err: any) {
          console.error("Exception during inserting product:", err);
          set({ error: err.message || "Failed to add product", isLoading: false });
          throw err;
        }
      },

      updateProduct: async (id, updates) => {
        set({ isLoading: true, error: null });
        const previousProducts = get().products;

        // Optimistically update local state first for ultra-snappy UX
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } as Product : p)
        }));

        try {
          const updated = await productService.updateProduct(id, updates);
          set((state) => ({
            products: state.products.map(p => p.id === id ? updated : p),
            isLoading: false
          }));
        } catch (err: any) {
          console.error("Exception during updating product:", err);
          // Rollback to previous products list on failure
          set({ 
            products: previousProducts,
            error: err.message || "Failed to update product", 
            isLoading: false 
          });
          throw err;
        }
      },

      deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        const previousProducts = get().products;

        // Optimistic delete for ultra-snappy UX
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }));

        try {
          await productService.deleteProduct(id);
          set({ isLoading: false });
        } catch (err: any) {
          console.error("Exception during deleting product:", err);
          // Restore products state by rolling back to previous state
          set({ 
            products: previousProducts, 
            error: err.message || "Failed to delete product", 
            isLoading: false 
          });
          throw err;
        }
      },
    }),

    {
      name: 'scented-aura-products',
    }
  )
);
