import Link from "next/link";
import { FlaskConical, ArrowRight, Beaker } from "lucide-react";

export const metadata = {
  title: "Research Laboratory - ESTES",
  description:
    "Explore research lines, materials, methods, protocols, variables, hypotheses, and recorded progress.",
};

export default function LaboratoryPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-widest text-accent-secondary font-bold mb-3">
            Research Laboratory
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            Research Lines
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Explore research lines, materials, methods, protocols, variables,
            hypotheses, and recorded progress. Features Quantum Cell and other
            ongoing investigations.
          </p>
        </header>

        <div className="bg-bg-tertiary rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-accent-primary/20 rounded-xl">
              <FlaskConical className="text-accent-primary" size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Coming Soon
              </h2>
              <p className="text-text-secondary">
                This section will provide detailed views of research lines including
                materials characterization, experimental protocols, variables, and
                progress tracking.
              </p>
            </div>
          </div>
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-secondary font-medium"
          >
            Explore the Atlas for current research <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-bg-secondary rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-secondary/20 rounded-xl">
              <Beaker className="text-accent-secondary" size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Quantum Cell Research Line
              </h2>
              <p className="text-text-secondary mb-4">
                Investigation of eucalyptus-cellulose-derived carbon quantum dots
                for optical water sensing. This is a research line within ESTES,
                not a separate product.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4">
                <p className="text-sm text-amber-900 font-semibold mb-1">
                  Current Stage
                </p>
                <p className="text-sm text-amber-800">
                  Protocol development and initial characterization. No experimental
                  results are available yet. This is a research hypothesis, not a
                  validated solution.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              What to expect
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Research line tracking</li>
              <li>• Material characterization data</li>
              <li>• Experimental protocols</li>
              <li>• Progress visualization</li>
            </ul>
          </div>
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              Current capabilities
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Case-specific protocols</li>
              <li>• Three implementation levels</li>
              <li>• Evidence attribution</li>
              <li>• Known limitations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
