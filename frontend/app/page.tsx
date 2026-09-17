import Link from "next/link";
import MapaWrapper from "./componentes/MapaWrapper";

async function getDashboard() {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
      { cache: "no-store" }
    );
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const dados = await getDashboard();

  return (
    <div className="min-h-screen bg-terra-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-verde-900">
            Mapa de situações ambientais
          </h1>
          <p className="text-gray-600 mt-1">
            Veja o que está acontecendo na sua região e descubra como agir.
          </p>
        </header>

        {dados && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              valor={dados.total_casos}
              rotulo="Casos no Atlas"
              cor="verde"
            />
            <StatCard
              valor={Object.keys(dados.casos_por_uf).length}
              rotulo="Estados cobertos"
              cor="terra"
            />
            <StatCard
              valor={dados.casos_com_hardware}
              rotulo="Com hardware"
              cor="verde"
            />
            <StatCard
              valor={dados.total_noticias}
              rotulo="Notícias coletadas"
              cor="terra"
            />
          </div>
        )}

        <div className="h-[600px] rounded-xl overflow-hidden shadow-lg mb-8">
          <MapaWrapper />
        </div>

        <section className="grid md:grid-cols-2 gap-6">
          <Card
            titulo="Atlas Brasileiro"
            descricao="22 soluções que transformam recursos locais em respostas para problemas ambientais."
            href="/atlas"
            cta="Explorar Atlas"
          />
          <Card
            titulo="Assistente Estes"
            descricao="Descreva seu problema. A IA busca no Atlas + na web e sugere o que fazer."
            href="/chat"
            cta="Conversar com a IA"
          />
        </section>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Estes — plataforma de cidadania ambiental · open source · Brasil
          </p>
        </footer>
      </div>
    </div>
  );
}

function StatCard({
  valor,
  rotulo,
  cor,
}: {
  valor: number;
  rotulo: string;
  cor: "verde" | "terra";
}) {
  const bg = cor === "verde" ? "bg-verde-900" : "bg-terra-500";
  return (
    <div className={`${bg} text-white rounded-xl p-4 shadow`}>
      <div className="text-3xl font-bold">{valor}</div>
      <div className="text-xs mt-1 opacity-90">{rotulo}</div>
    </div>
  );
}

function Card({
  titulo,
  descricao,
  href,
  cta,
}: {
  titulo: string;
  descricao: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-xl p-6 shadow hover:shadow-xl transition"
    >
      <h2 className="text-xl font-bold text-verde-900 mb-2">{titulo}</h2>
      <p className="text-gray-600 text-sm mb-4">{descricao}</p>
      <span className="text-verde-700 font-semibold">{cta} →</span>
    </Link>
  );
}
