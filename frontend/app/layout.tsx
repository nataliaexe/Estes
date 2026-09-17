import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estes — Plataforma de Cidadania Ambiental",
  description:
    "Transforma recursos locais em soluções ambientais e garante direitos por meio de evidência científica.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <nav className="bg-verde-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">Estes</span>
              <span className="text-xs text-verde-100 hidden sm:inline">
                cidadania ambiental
              </span>
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-verde-100">
                Mapa
              </Link>
              <Link href="/atlas" className="hover:text-verde-100">
                Atlas
              </Link>
              <Link href="/chat" className="hover:text-verde-100">
                Assistente
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
