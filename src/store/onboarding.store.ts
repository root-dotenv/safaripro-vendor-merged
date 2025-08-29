import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingState {
  currentStep: number;
  vendorId: string | null;
  hotelId: string | null;
  setVendorId: (id: string) => void;
  setHotelId: (id: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetOnboarding: () => void;
}

const initialState = {
  currentStep: 1,
  vendorId: null,
  hotelId: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setVendorId: (id) => set({ vendorId: id }),
      setHotelId: (id) => set({ hotelId: id }),
      goToNextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),
      goToPreviousStep: () =>
        set((state) => ({ currentStep: state.currentStep - 1 })),
      resetOnboarding: () => {
        set(initialState);
        sessionStorage.removeItem("onboarding-storage");
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
