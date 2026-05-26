import { supabase, imageMap, retryRequest } from "@/lib/supabase";
import type { Product } from "@/store/products";

export const productService = {
  /**
   * Fetch all products from Supabase
   */
  async getProducts(): Promise<Product[]> {
    return retryRequest(async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map((p: any) => ({
        ...p,
        // Map static generated images locally if they match
        image: imageMap[p.image] || p.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80",
      })) as Product[];
    });
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return retryRequest(async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) return null;

      return {
        ...data,
        image: imageMap[data.image] || data.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80",
      } as Product;
    });
  },

  /**
   * Create a new product in Supabase
   */
  async createProduct(product: Partial<Product>): Promise<Product> {
    const id = (product.name || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);
    const newProduct = {
      id,
      name: product.name || "Untitled Product",
      price: product.price || 0,
      category: product.category || "Oriental",
      tagline: product.tagline || "Exquisite fragrance",
      description: product.description || "A newly crafted exclusive fragrance.",
      notes: product.notes || { top: ["New"], heart: ["Fragrance"], base: ["Blend"] },
      intensity: product.intensity || "Medium",
      image: product.image || "royal-oud",
      stock: product.stock || 50,
      featured: product.featured || false,
    };

    return retryRequest(async () => {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        image: imageMap[data.image] || data.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80",
      } as Product;
    });
  },

  /**
   * Update an existing product in Supabase
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return retryRequest(async () => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        image: imageMap[data.image] || data.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80",
      } as Product;
    });
  },

  /**
   * Delete a product from Supabase
   */
  async deleteProduct(id: string): Promise<void> {
    return retryRequest(async () => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    });
  }
};

