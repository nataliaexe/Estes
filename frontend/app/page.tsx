"use client";

import { useI18n } from "./lib/i18n/useI18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-slate-100">
            {t.home.hero.title1}
            <br />
            <span className="text-green-600 dark:text-green-400">
              {t.home.hero.title2}
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            {t.home.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/investigar/nova"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {t.home.hero.ctaPrimary}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/casos"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {t.home.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-slate-100">
            {t.home.howItWorks.title}
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12">
            {t.home.howItWorks.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: t.home.howItWorks.step1.title,
                desc: t.home.howItWorks.step1.desc,
              },
              {
                step: "2",
                title: t.home.howItWorks.step2.title,
                desc: t.home.howItWorks.step2.desc,
              },
              {
                step: "3",
                title: t.home.howItWorks.step3.title,
                desc: t.home.howItWorks.step3.desc,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
