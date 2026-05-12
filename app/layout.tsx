import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeakTech",
  description: "Practice spoken English in tech scenarios with Techy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="pt-16 min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
