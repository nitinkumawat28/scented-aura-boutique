import { supabase } from "@/lib/supabase";

export interface Order {
  id: string;
  customer: string;
  created_at: string;
  total: number;
  status: string;
  items: number;
}

export const orderService = {
  /**
   * Fetch all orders from Supabase
   */
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Create a new order in Supabase
   */
  async createOrder(order: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Update an order status in Supabase
   */
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
