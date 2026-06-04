"use client";

import { useEffect, useRef } from "react";

export function useUnsavedChanges(isDirty: boolean) {
  const isDirtyRef = useRef(isDirty);

  // Warn user if they try to close the tab/window with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Prevent navigation within the app if there are unsaved changes
  useEffect(() => {
    const original = window.history.pushState.bind(window.history);

    window.history.pushState = function (
      ...args: Parameters<typeof window.history.pushState>
    ) {
      if (isDirtyRef.current) return;
      return original(...args);
    };

    return () => {
      window.history.pushState = original;
    };
  }, []);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);
}
