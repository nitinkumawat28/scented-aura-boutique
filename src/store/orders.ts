import { create } from "zustand";
import { persist } from "zustand/middleware";
import { orderService, Order } from "@/services/orders";
import { isSupabaseConfigured } from "@/lib/supabase";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        if (!isSupabaseConfigured) {
          console.warn("Supabase is not configured. Skipping orders fetch.");
          set({ isLoading: false });
          return;
        }

        const hasOrders = get().orders.length > 0;
        set({ isLoading: !hasOrders, error: null });
        try {
          const data = await orderService.getOrders();
          set({ orders: data, isLoading: false });
        } catch (err: any) {
          console.error("Exception during fetching orders:", err);
          set({ error: err.message || "Failed to fetch orders", isLoading: false });
        }
      },

      addOrder: async (order) => {
        set({ isLoading: true, error: null });
        try {
          const created = await orderService.createOrder(order);
          set((state) => ({
            orders: [created, ...state.orders],
            isLoading: false
          }));
        } catch (err: any) {
          console.error("Exception during adding order:", err);
          set({ error: err.message || "Failed to add order", isLoading: false });
        }
      },

      updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        // Optimistic update
        set((state) => ({
          orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
        }));

        try {
          const updated = await orderService.updateOrderStatus(id, status);
          set((state) => ({
            orders: state.orders.map(o => o.id === id ? updated : o),
            isLoading: false
          }));
        } catch (err: any) {
          console.error("Exception during updating order status:", err);
          // Re-fetch to restore state
          try {
            const data = await orderService.getOrders();
            set({ orders: data, error: err.message || "Failed to update order status", isLoading: false });
          } catch {
            set({ error: err.message || "Failed to update order status", isLoading: false });
          }
          throw err;
        }
      }
    }),
    {
      name: "scented-aura-orders",
    }
  )
);
