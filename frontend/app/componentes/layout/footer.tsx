import Link from "next/link";
import { Leaf, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-elfo-verde-escuro text-elfo-off-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-elfo-verde-vivo" />
              <span className="text-xl font-display font-bold">Estes</span>
            </div>
            <p className="text-sm text-elfo-off-white/70 max-w-md leading-relaxed">
              Environmental citizenship platform that turns local waste into
              urgent solutions and guarantees human rights through open
              scientific evidence.
            </p>
            <p className="text-xs text-elfo-off-white/50 mt-4">
              Open source · MIT · Brazil
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-elfo-dourado mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/atlas" className="text-elfo-off-white/70 hover:text-elfo-verde-vivo">
                  Atlas (19 cases)
                </Link>
              </li>
              <li>
                <Link href="/explorar" className="text-elfo-off-white/70 hover:text-elfo-verde-vivo">
                  Scientific engine
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-elfo-off-white/70 hover:text-elfo-verde-vivo">
                  AI assistant
                </Link>
              </li>
              <li>
                <Link href="/medir" className="text-elfo-off-white/70 hover:text-elfo-verde-vivo">
                  Measure water
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-elfo-dourado mb-4">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contribuir" className="text-elfo-off-white/70 hover:text-elfo-verde-vivo">
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nataliaexe/Estes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-elfo-off-white/70 hover:text-elfo-verde-vivo inline-flex items-center gap-1"
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-elfo-dourado/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-elfo-off-white/50">
          <p>
            Made with <Heart className="inline w-3 h-3 text-red-400" /> for the
            Maxakali, Waimiri Atroari, Yanomami and all peoples who protect the
            forests.
          </p>
          <p>Solutions that grow from the root.</p>
        </div>
      </div>
    </footer>
  );
}
