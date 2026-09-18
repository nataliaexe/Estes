import { BorderGlow } from "./BorderGlow";
import { BookOpen, Camera, Shield } from "lucide-react";

const PILARES = [
  {
    icone: BookOpen,
    titulo: "Motor do Conhecimento",
    descricao:
      "22 casos no Atlas + busca científica em 4 bases (Semantic Scholar, Crossref, OpenAlex, Tavily). Cada afirmação tem fonte.",
    cor: "#4BF98D",
  },
  {
    icone: Camera,
    titulo: "Camada de Validação",
    descricao:
      "Funciona sem hardware. A pessoa fotografa uma tira reagente com o celular e a IA classifica o nível de contaminação.",
    cor: "#A68A42",
  },
  {
    icone: Shield,
    titulo: "Escudo de Direitos",
    descricao:
      "Se os dados indicam violação grave, a IA gera uma denúncia formal com evidências para MPF, IBAMA, FUNAI ou SESAI.",
    cor: "#7F1D1D",
  },
];

export function TresPilares() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4">
            Três pilares, uma só plataforma
          </h2>
          <p className="text-lg text-elfo-cinza max-w-2xl mx-auto">
            Do problema à solução, da ciência ao direito.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILARES.map((p, i) => (
            <BorderGlow key={i} cor={p.cor}>
              <div className="p-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${p.cor}20` }}
                >
                  <p.icone size={28} style={{ color: p.cor }} />
                </div>
                <h3 className="font-display font-bold text-2xl text-elfo-verde-escuro mb-3">
                  {p.titulo}
                </h3>
                <p className="text-elfo-cinza leading-relaxed">
                  {p.descricao}
                </p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
