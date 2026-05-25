import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CheckoutData {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutState {
  checkoutData: CheckoutData;
  setCheckoutData: (data: Partial<CheckoutData>) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      checkoutData: {
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
      setCheckoutData: (data) =>
        set((s) => ({ checkoutData: { ...s.checkoutData, ...data } })),
      clearCheckoutData: () =>
        set({
          checkoutData: {
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
          },
        }),
    }),
    {
      name: "scented-aura-checkout",
    }
  )
);
