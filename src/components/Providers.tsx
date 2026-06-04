"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";

// Dynamically import ThemeToggle to avoid hydration issues since it uses client-side hooks
const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle").then((m) => m.ThemeToggle),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}
