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
  t: WidenStrings<typeof dict["pt"]>;
};

type WidenStrings<T> = {
  [K in keyof T]: T[K] extends string ? string : WidenStrings<T[K]>;
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "estes_locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "pt" || saved === "en") {
        setLocaleState(saved);
      } else if (navigator.language.split("-")[0] === "en") {
        setLocaleState("en");
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: dict[locale] as WidenStrings<typeof dict.pt> }}
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
