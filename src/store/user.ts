import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "";
  email: string;
  mobile: string;
  addresses: Address[];
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { name: string; qty: number; price: number }[];
}

interface UserState {
  user: User | null;
  orders: Order[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Promise<void>;
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
}

export const useUser = create<UserState>((set, get) => ({
  user: null,
  orders: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),

  login: async (email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || "",
    });

    set({ isLoading: false });
    if (error) {
      throw new Error(error.message);
    }
  },

  register: async (firstName, lastName, email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password: password || "",
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          addresses: [],
          mobile: "",
          gender: "",
        },
      },
    });

    set({ isLoading: false });
    if (error) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signOut();
    set({ isLoading: false, user: null, orders: [] });
    if (error) {
      throw new Error(error.message);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    const user = get().user;
    if (!user) {
      set({ isLoading: false });
      throw new Error("No active authenticated user session.");
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: data.firstName !== undefined ? data.firstName : user.firstName,
        last_name: data.lastName !== undefined ? data.lastName : user.lastName,
        gender: data.gender !== undefined ? data.gender : user.gender,
        mobile: data.mobile !== undefined ? data.mobile : user.mobile,
      },
    });

    set({ isLoading: false });
    if (error) {
      throw new Error(error.message);
    }

    // Instantly update local state for responsive UI
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  addAddress: async (address) => {
    set({ isLoading: true });
    const user = get().user;
    if (!user) {
      set({ isLoading: false });
      throw new Error("No active authenticated user session.");
    }

    const currentAddresses = user.addresses || [];
    const newAddresses = [
      ...currentAddresses,
      { ...address, id: Date.now().toString() },
    ];

    const { error } = await supabase.auth.updateUser({
      data: {
        addresses: newAddresses,
      },
    });

    set({ isLoading: false });
    if (error) {
      throw new Error(error.message);
    }

    // Instantly update local state for responsive UI
    set((state) => ({
      user: state.user ? { ...state.user, addresses: newAddresses } : null,
    }));
  },

  addOrder: async (orderData) => {
    const user = get().user;
    const customerName = user ? `${user.firstName} ${user.lastName}` : "Valued Guest";
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000).toString();

    const newSupabaseOrder = {
      id: orderId,
      customer: customerName,
      total: orderData.total,
      status: "Confirmed",
      items: orderData.items.reduce((acc, i) => acc + i.qty, 0),
      products: orderData.items.map((item) => ({
        id: item.name.toLowerCase().replace(/ /g, "-"),
        name: item.name,
        price: item.price,
        qty: item.qty,
        size: "100ml",
      })),
    };

    // Insert order to Supabase orders table
    const { error } = await supabase.from("orders").insert([newSupabaseOrder]);

    if (error) {
      console.error("Exception persisting checkout order in Supabase:", error);
    }

    // Push to store's local order list
    const newLocalOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      total: orderData.total,
      status: "Confirmed",
      items: orderData.items,
    };

    set((state) => ({
      orders: [newLocalOrder, ...state.orders],
    }));
  },
}));
