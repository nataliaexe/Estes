import Link from "next/link";
import { BookOpen, Search, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Evidence Explorer - ESTES",
  description:
    "Search and inspect scientific publications, patents, datasets, and other sources with source attribution and relevance.",
};

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-widest text-accent-secondary font-bold mb-3">
            Evidence Explorer
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            Scientific Sources
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Search and inspect scientific publications, patents, datasets, and
            other sources. See source attribution, publication metadata, relevance,
            and the relationship between evidence and claims.
          </p>
        </header>

        <div className="bg-bg-tertiary rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-accent-primary/20 rounded-xl">
              <BookOpen className="text-accent-primary" size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Coming Soon
              </h2>
              <p className="text-text-secondary">
                This section will provide advanced search across 250 million
                papers from Semantic Scholar, Crossref, and OpenAlex, with
                filtering by evidence level, date, and relevance.
              </p>
            </div>
          </div>
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-secondary font-medium"
          >
            Try the Scientific Engine instead <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              What to expect
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Advanced semantic search</li>
              <li>• DOI-based citation tracking</li>
              <li>• Evidence level filtering</li>
              <li>• Source provenance visualization</li>
            </ul>
          </div>
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              Current capabilities
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Material exploration</li>
              <li>• Case-specific evidence</li>
              <li>• Real-time paper search</li>
              <li>• DOI verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
