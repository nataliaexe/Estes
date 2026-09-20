"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Leaf, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contextos/AuthContext";
import { useI18n } from "../../lib/i18n/useI18n";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, sair } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [aberto, setAberto] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/atlas", label: t.nav.atlas },
    { href: "/noticias", label: t.nav.news },
    { href: "/explorar", label: t.nav.explore },
    { href: "/chat", label: t.nav.assistant },
    { href: "/medir", label: t.nav.measure },
    { href: "/contribuir", label: t.nav.contribute },
  ];

  function handleSair() {
    sair();
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 bg-elfo-verde-escuro/95 backdrop-blur-md border-b border-elfo-dourado/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf
              className="w-7 h-7 text-elfo-verde-vivo transition-transform group-hover:scale-110"
              strokeWidth={2.5}
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-display font-bold text-elfo-off-white tracking-tight">
                Estes
              </span>
              <span className="text-[10px] text-elfo-off-white/60 tracking-wider uppercase">
                {t.nav.tagline}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const ativo =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    ativo
                      ? "bg-elfo-verde-vivo/15 text-elfo-verde-vivo"
                      : "text-elfo-off-white/80 hover:text-elfo-off-white hover:bg-elfo-off-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Toggle idioma */}
            <button
              onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
              className="ml-2 px-2 py-1 rounded-lg text-xs font-bold text-elfo-off-white/70 hover:text-elfo-verde-vivo hover:bg-elfo-off-white/5 transition-all"
              title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
            >
              {locale.toUpperCase()}
            </button>

            {usuario ? (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  href="/perfil"
                  className="text-xs text-elfo-off-white/70 hover:text-elfo-verde-vivo flex items-center gap-1 transition-colors"
                >
                  <UserIcon size={14} />
                  {usuario.nome.split(" ")[0]}
                </Link>
                <button
                  onClick={handleSair}
                  className="p-2 rounded-lg text-elfo-off-white/70 hover:text-elfo-off-white hover:bg-elfo-off-white/5 transition-all"
                  title={t.nav.signOut}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/entrar"
                className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-elfo-verde-vivo text-elfo-verde-escuro hover:bg-elfo-verde-vivo/90 transition-all"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-elfo-off-white p-2"
            onClick={() => setAberto(!aberto)}
            aria-label="Menu"
          >
            {aberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {aberto && (
        <div className="md:hidden bg-elfo-verde-escuro border-t border-elfo-dourado/20">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium",
                  pathname === link.href
                    ? "bg-elfo-verde-vivo/15 text-elfo-verde-vivo"
                    : "text-elfo-off-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setLocale(locale === "pt" ? "en" : "pt");
                setAberto(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg text-sm font-bold text-elfo-verde-vivo"
            >
              {locale === "pt" ? "Switch to English" : "Mudar para Português"}
            </button>
            {usuario ? (
              <button
                onClick={() => {
                  handleSair();
                  setAberto(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-elfo-off-white/80"
              >
                {t.nav.signOut} ({usuario.nome.split(" ")[0]})
              </button>
            ) : (
              <Link
                href="/entrar"
                onClick={() => setAberto(false)}
                className="block px-4 py-2 rounded-lg text-sm font-semibold bg-elfo-verde-vivo text-elfo-verde-escuro text-center"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
