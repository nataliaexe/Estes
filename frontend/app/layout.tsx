import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "./componentes/layout/navbar";
import { AuthProvider } from "./contextos/AuthContext";
import { I18nProvider } from "./lib/i18n/useI18n";
import { Footer } from "./componentes/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ESTES — Environmental Intelligence Platform",
    template: "%s · ESTES",
  },
  description:
    "Open-source environmental intelligence and research platform connecting local environmental problems, scientific evidence, materials, and candidate solutions with traceable sources.",
  keywords: [
    "environmental intelligence",
    "scientific research",
    "environmental monitoring",
    "evidence-based solutions",
    "open science",
    "Brazil",
  ],
  authors: [{ name: "ESTES Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <I18nProvider>
          <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        </I18nProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#263C30",
              color: "#EAE5D8",
              border: "1px solid rgba(167, 201, 160, 0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
