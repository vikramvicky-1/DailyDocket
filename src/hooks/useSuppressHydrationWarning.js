import { useEffect } from "react";

/**
 * Custom hook to suppress hydration warnings caused by browser extensions
 * that add attributes to DOM elements after server-side rendering
 */
export function useSuppressHydrationWarning() {
  useEffect(() => {
    // Suppress hydration warnings for known browser extension attributes
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(" ");

      // Suppress hydration warnings for browser extension attributes
      if (
        errorMessage.includes("tree hydrated but some attributes") &&
        (errorMessage.includes("cz-shortcut-listen") ||
          errorMessage.includes("data-extension") ||
          errorMessage.includes("data-adblock") ||
          errorMessage.includes("data-honey"))
      ) {
        return; // Suppress this specific error
      }

      originalError.apply(console, args);
    };

    // Cleanup function to restore original console.error
    return () => {
      console.error = originalError;
    };
  }, []);
}
