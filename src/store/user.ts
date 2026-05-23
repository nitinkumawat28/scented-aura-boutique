import { create } from "zustand";

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
  login: (email: string, password?: string) => void;
  register: (firstName: string, lastName: string, email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  orders: [
    { 
      id: "OD1234567890", 
      date: "2026-04-12", 
      total: 10500, 
      status: "Delivered",
      items: [{ name: "Dark Amber", qty: 1, price: 10500 }]
    },
    { 
      id: "OD0987654321", 
      date: "2026-05-02", 
      total: 20500, 
      status: "Shipped",
      items: [{ name: "Heritage Rose", qty: 1, price: 20500 }]
    },
  ],
  login: (email) => set({ 
    user: { 
      id: "1", 
      firstName: "Guest", 
      lastName: "User", 
      gender: "Male",
      email, 
      mobile: "+91 9876543210",
      addresses: [
        { id: "a1", name: "Guest User", street: "123 Perfume Lane", city: "Mumbai", state: "Maharashtra", pincode: "400001", mobile: "9876543210" }
      ]
    } 
  }),
  register: (firstName, lastName, email) => set({
    user: {
      id: Date.now().toString(),
      firstName,
      lastName,
      gender: "",
      email,
      mobile: "",
      addresses: []
    }
  }),
  logout: () => set({ user: null }),
  updateProfile: (data) => set((state) => ({ 
    user: state.user ? { ...state.user, ...data } : null 
  })),
  addAddress: (address) => set((state) => ({
    user: state.user ? {
      ...state.user,
      addresses: [...state.user.addresses, { ...address, id: Date.now().toString() }]
    } : null
  }))
}));
