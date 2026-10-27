import Link from "next/link";
import { Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Solution Explorer - ESTES",
  description:
    "Explore potential interventions associated with a problem. Show material availability, implementation complexity, evidence strength, risks, and limitations.",
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-widest text-accent-secondary font-bold mb-3">
            Solution Explorer
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            Candidate Solutions
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Explore potential interventions associated with environmental problems.
            See material availability, implementation complexity, evidence strength,
            risks, limitations, and validation requirements.
          </p>
        </header>

        <div className="bg-bg-tertiary rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-accent-primary/20 rounded-xl">
              <Lightbulb className="text-accent-primary" size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Coming Soon
              </h2>
              <p className="text-text-secondary">
                This section will provide a comprehensive view of potential
                solutions with detailed comparison of materials, costs, complexity,
                and evidence levels.
              </p>
            </div>
          </div>
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-secondary font-medium"
          >
            Explore the Atlas for current solutions <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-amber-600 mt-1" size={20} />
            <div>
              <h3 className="font-display font-bold text-amber-900 mb-2">
                Important Note
              </h3>
              <p className="text-sm text-amber-800">
                Solutions are ranked by evidence level, not by fabricated metrics.
                We do not invent costs, effectiveness ratings, or deployment claims.
                All information is backed by scientific literature or experimental
                data.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              What to expect
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Solution comparison matrix</li>
              <li>• Material availability data</li>
              <li>• Implementation complexity scores</li>
              <li>• Risk assessment</li>
            </ul>
          </div>
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              Current capabilities
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Case-specific solutions</li>
              <li>• Three implementation levels</li>
              <li>• Evidence level indicators</li>
              <li>• Known limitations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
