import Link from "next/link";
import { Leaf, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-bg-secondary text-text-primary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-accent-primary" />
              <span className="text-xl font-display font-bold">ESTES</span>
            </div>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              Open-source environmental intelligence and research platform
              connecting local environmental problems, scientific evidence,
              materials, and candidate solutions with traceable sources.
            </p>
            <p className="text-xs text-text-muted mt-4">
              Open source · MIT · Brazil
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-accent-secondary mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/atlas" className="text-text-secondary hover:text-accent-primary">
                  Environmental Atlas
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="text-text-secondary hover:text-accent-primary">
                  Evidence Explorer
                </Link>
              </li>
              <li>
                <Link href="/laboratory" className="text-text-secondary hover:text-accent-primary">
                  Research Laboratory
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-text-secondary hover:text-accent-primary">
                  Solution Explorer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-accent-secondary mb-4">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contribuir" className="text-text-secondary hover:text-accent-primary">
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nataliaexe/Estes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-primary inline-flex items-center gap-1"
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>
            Made with <Heart className="inline w-3 h-3 text-red-400" /> for the
            Maxakali, Waimiri Atroari, Yanomami and all peoples who protect the
            forests.
          </p>
          <p>Environmental intelligence for action.</p>
        </div>
      </div>
    </footer>
  );
}
