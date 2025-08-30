// // - - - src/store/onboarding.store.ts
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// interface OnboardingState {
//   currentStep: number;
//   vendorId: string | null;
//   hotelId: string | null;
//   setVendorId: (id: string) => void;
//   setHotelId: (id: string) => void;
//   goToNextStep: () => void;
//   goToPreviousStep: () => void;
//   resetOnboarding: () => void;
// }

// const initialState = {
//   currentStep: 1,
//   vendorId: null,
//   hotelId: null,
// };

// export const useOnboardingStore = create<OnboardingState>()(
//   persist(
//     (set) => ({
//       ...initialState,
//       setVendorId: (id) => set({ vendorId: id }),
//       setHotelId: (id) => set({ hotelId: id }),
//       goToNextStep: () =>
//         set((state) => ({ currentStep: state.currentStep + 1 })),
//       goToPreviousStep: () =>
//         set((state) => ({ currentStep: state.currentStep - 1 })),
//       resetOnboarding: () => {
//         set(initialState);
//         sessionStorage.removeItem("onboarding-storage");
//       },
//     }),
//     {
//       name: "onboarding-storage",
//       storage: createJSONStorage(() => sessionStorage),
//     }
//   )
// );

// src/store/onboarding.store.ts
import type { OnboardingState, ServiceType } from "@/pages/onboarding/vendor";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// --- MODIFIED: The interface now includes the new properties ---
interface IOnboardingState extends OnboardingState {
  serviceType: ServiceType | null;
  setServiceType: (service: ServiceType | null) => void;
}

// --- MODIFIED: Add serviceType to the initial state ---
const initialState = {
  currentStep: 1,
  vendorId: null,
  hotelId: null,
  serviceType: null,
};

export const useOnboardingStore = create<IOnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setVendorId: (id) => set({ vendorId: id }),
      setHotelId: (id) => set({ hotelId: id }),
      // --- NEW: Add the setter for serviceType ---
      setServiceType: (service) => set({ serviceType: service }),
      goToNextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),
      // --- IMPROVED: Prevent step from going below 1 ---
      goToPreviousStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        })),
      resetOnboarding: () => {
        set(initialState);
        // This is a good practice to ensure the storage is clean
        sessionStorage.removeItem("onboarding-storage");
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
