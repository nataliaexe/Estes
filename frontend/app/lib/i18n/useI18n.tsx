"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { dict, Locale } from "./dict";

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof dict["pt"];
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "estes_locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "pt" || saved === "en") {
      setLocaleState(saved);
    } else {
      // Detecta idioma do browser
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") setLocaleState("en");
    }
    setHydrated(true);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: dict[locale] as any }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
