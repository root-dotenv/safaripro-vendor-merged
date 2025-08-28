// - - - src/hooks/useFormPersistence.ts
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * A custom hook to persist react-hook-form state to sessionStorage.
 * @param storageKey A unique key to store the form data in sessionStorage.
 * @param formInstance The instance of the form returned by useForm().
 */
export const useFormPersistence = (
  storageKey: string,
  formInstance: UseFormReturn<any>
) => {
  const { watch, reset } = formInstance;

  // Load from sessionStorage on initial mount
  useEffect(() => {
    const savedData = sessionStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Use reset to populate the form with the stored data
        reset(parsedData);
      } catch (error) {
        console.error("Failed to parse form data from sessionStorage", error);
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [storageKey, reset]);

  // Save to sessionStorage on every change
  useEffect(() => {
    // watch() subscribes to all form changes
    const subscription = watch((value) => {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    });

    // Unsubscribe on component unmount
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);
};
