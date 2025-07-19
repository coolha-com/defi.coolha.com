'use client';

import { ThemeProvider } from "next-themes";

export function Theme({ children }: any) {
  return (
    <ThemeProvider defaultTheme = 'system' >
      {children}
    </ThemeProvider>
  )
}