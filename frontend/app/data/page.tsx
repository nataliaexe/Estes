import Link from "next/link";
import { Database, ArrowRight, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Environmental Data - ESTES",
  description:
    "Visualize available time series, measurements, indicators, and environmental APIs with units, time ranges, and provenance.",
};

export default function DataPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-widest text-accent-secondary font-bold mb-3">
            Environmental Data
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            Data Visualization
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Visualize available time series, measurements, indicators, and
            environmental APIs. Always display units, time ranges, provenance,
            and relevant data-quality limitations.
          </p>
        </header>

        <div className="bg-bg-tertiary rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-accent-primary/20 rounded-xl">
              <Database className="text-accent-primary" size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Coming Soon
              </h2>
              <p className="text-text-secondary">
                This section will provide interactive data visualizations for
                environmental indicators, time series data, and real-time API
                integrations.
              </p>
            </div>
          </div>
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-secondary font-medium"
          >
            Explore the Atlas for current data <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-bg-secondary rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-accent-secondary" size={20} />
              <h3 className="font-display font-bold text-lg text-text-primary">
                NASA FIRMS
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              Live fire hotspot data from NASA satellites. Updated every 60
              seconds.
            </p>
            <p className="text-xs text-text-muted">
              Provenance: NASA FIRMS API
            </p>
          </div>
          <div className="bg-bg-secondary rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-accent-secondary" size={20} />
              <h3 className="font-display font-bold text-lg text-text-primary">
                Open-Meteo
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              Climate data and air quality measurements. Historical and forecast
              data available.
            </p>
            <p className="text-xs text-text-muted">
              Provenance: Open-Meteo API
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              What to expect
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Interactive time series charts</li>
              <li>• Multi-source data comparison</li>
              <li>• Data quality indicators</li>
              <li>• Downloadable datasets</li>
            </ul>
          </div>
          <div className="bg-bg-tertiary rounded-xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg text-text-primary mb-3">
              Current capabilities
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Case-specific measurements</li>
              <li>• Real-time fire hotspots</li>
              <li>• Climate and air quality</li>
              <li>• Map-based visualization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
