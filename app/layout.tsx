import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ApiProvider } from "@/components/api-provider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasko",
  description: "Plan, prioritize, and accomplish your tasks with ease",
  generator: "app",
  icons: {
    icon: [
      {
        url: "/icon.svg?v=tasko",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="tasko-theme">
          <ApiProvider>{children}</ApiProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
