"use client";

import { useSuppressHydrationWarning } from "../hooks/useSuppressHydrationWarning";

/**
 * Client component that suppresses hydration warnings caused by browser extensions
 * This component should be included early in the component tree to catch hydration warnings
 */
export default function HydrationWarningSupressor({ children }) {
  useSuppressHydrationWarning();

  return children;
}
