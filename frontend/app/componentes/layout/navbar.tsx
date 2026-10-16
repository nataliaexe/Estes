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
    { href: "/evidence", label: t.nav.evidence },
    { href: "/laboratory", label: t.nav.laboratory },
    { href: "/solutions", label: t.nav.solutions },
    { href: "/data", label: t.nav.data },
    { href: "/explorar", label: t.nav.explore },
    { href: "/chat", label: t.nav.assistant },
    { href: "/contribuir", label: t.nav.contribute },
  ];

  function handleSair() {
    sair();
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf
              className="w-7 h-7 text-accent-primary transition-transform group-hover:scale-110"
              strokeWidth={2.5}
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-display font-bold text-text-primary tracking-tight">
                ESTES
              </span>
              <span className="text-[10px] text-text-secondary tracking-wider uppercase">
                {t.nav.tagline}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
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
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-text-primary/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Toggle idioma */}
            <button
              onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
              className="ml-2 px-2 py-1 rounded-lg text-xs font-bold text-text-secondary hover:text-accent-primary hover:bg-text-primary/5 transition-all"
              title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
            >
              {locale.toUpperCase()}
            </button>

            {usuario ? (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  href="/perfil"
                  className="text-xs text-text-secondary hover:text-accent-primary flex items-center gap-1 transition-colors"
                >
                  <UserIcon size={14} />
                  {usuario.nome.split(" ")[0]}
                </Link>
                <button
                  onClick={handleSair}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-all"
                  title={t.nav.signOut}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/entrar"
                className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-accent-primary text-bg-primary hover:bg-accent-primary/90 transition-all"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-text-primary p-2"
            onClick={() => setAberto(!aberto)}
            aria-label="Menu"
          >
            {aberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {aberto && (
        <div className="lg:hidden bg-bg-primary border-t border-border">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium",
                  pathname === link.href
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "text-text-secondary"
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
              className="block w-full text-left px-4 py-2 rounded-lg text-sm font-bold text-accent-primary"
            >
              {locale === "pt" ? "Switch to English" : "Mudar para Português"}
            </button>
            {usuario ? (
              <button
                onClick={() => {
                  handleSair();
                  setAberto(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-text-secondary"
              >
                {t.nav.signOut} ({usuario.nome.split(" ")[0]})
              </button>
            ) : (
              <Link
                href="/entrar"
                onClick={() => setAberto(false)}
                className="block px-4 py-2 rounded-lg text-sm font-semibold bg-accent-primary text-bg-primary text-center"
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
