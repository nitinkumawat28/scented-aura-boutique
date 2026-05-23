import { create } from "zustand";

interface WishlistState {
  items: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  items: [],
  toggle: (id) =>
    set((s) => ({
      items: s.items.includes(id)
        ? s.items.filter((i) => i !== id)
        : [...s.items, id],
    })),
  has: (id) => get().items.includes(id),
}));
