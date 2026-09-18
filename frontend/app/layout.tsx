import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "./componentes/layout/navbar";
import { AuthProvider } from "./contextos/AuthContext";
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
    default: "Estes — Soluções que nascem da raiz",
    template: "%s · Estes",
  },
  description:
    "Plataforma de cidadania ambiental que transforma resíduos locais em soluções urgentes e garante direitos humanos por meio de evidência científica aberta.",
  keywords: [
    "ambiente",
    "sustentabilidade",
    "indígenas",
    "direitos humanos",
    "ciência aberta",
    "Brasil",
  ],
  authors: [{ name: "Natalia" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#114224",
              color: "#EAE5D8",
              border: "1px solid rgba(166, 138, 66, 0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
