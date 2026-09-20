import { ScrollReveal } from "../componentes/efeitos/ScrollReveal";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Heart, MessageCircle } from "lucide-react";

const noticias = [
  {
    id: 1,
    titulo: "Povo Maxakali (Tikmũ'ũn) - Estado de Coisas Inconstitucional",
    resumo: "Justiça Federal decreta intervenção urgente no Vale do Mucuri devido à mortalidade infantil 4x maior que a média brasileira.",
    data: "27/07/2026",
    local: "Vale do Mucuri, MG",
    categoria: "Indígenas",
    imagem: "https://images.pexels.com/photos/35358458/pexels-photo-35358458.jpeg",
    fonte: "G1, Fiocruz, Artigo19",
    likes: 234,
    comentarios: 45,
  },
  {
    id: 2,
    titulo: "Rio Alalaú Contaminado - Desastre Ambiental Waimiri Atroari",
    resumo: "Indígenas denunciam vazamento de rejeito de mineração com dezenas de animais mortos boiando no rio.",
    data: "05/2026",
    local: "Rio Alalaú, AM/RR",
    categoria: "Contaminação",
    imagem: "https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg",
    fonte: "Repórter Brasil, IBAMA",
    likes: 189,
    comentarios: 32,
  },
  {
    id: 3,
    titulo: "26 Assassinatos de Defensores Ambientais em Um Ano",
    resumo: "Brasil se torna o 2º país mais perigoso do mundo para ativistas ambientais, atrás apenas da Colômbia.",
    data: "17/09/2026",
    local: "PA e RO",
    categoria: "Direitos Humanos",
    imagem: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg",
    fonte: "Global Witness, Blog do Pedlowski",
    likes: 312,
    comentarios: 67,
  },
  {
    id: 4,
    titulo: "Focos de Queimada em Tempo Real - NASA FIRMS",
    resumo: "Monitoramento via satélite mostra aumento de 40% nos focos de queimada na Amazônia no último trimestre.",
    data: "20/09/2026",
    local: "Amazônia Legal",
    categoria: "Clima",
    imagem: "https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg",
    fonte: "NASA FIRMS, INPE",
    likes: 156,
    comentarios: 28,
  },
];

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-elfo-verde-escuro to-black text-elfo-off-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
              Notícias
            </p>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              Histórias que precisam ser contadas
            </h1>
            <p className="text-lg text-elfo-off-white/70 max-w-3xl">
              Acompanhe as últimas notícias sobre crises ambientais, comunidades 
              afetadas e soluções que estão sendo desenvolvidas.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {noticias.map((noticia, index) => (
            <ScrollReveal key={noticia.id} delay={index * 0.1}>
              <Link href={`/noticias/${noticia.id}`}>
                <article className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-elfo-verde-vivo/30 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-elfo-verde-escuro to-elfo-verde-vivo relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${noticia.imagem})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-elfo-verde-vivo/20 text-elfo-verde-vivo text-xs font-semibold rounded-full mb-2">
                        {noticia.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="font-display font-bold text-xl mb-3 group-hover:text-elfo-verde-vivo transition-colors">
                      {noticia.titulo}
                    </h2>
                    <p className="text-elfo-off-white/70 mb-4 line-clamp-2">
                      {noticia.resumo}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-elfo-off-white/50 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {noticia.data}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {noticia.local}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-xs text-elfo-off-white/60">
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          {noticia.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          {noticia.comentarios}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-elfo-verde-vivo text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Ler mais
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-sm text-elfo-off-white/50 mb-4">
              Fontes: G1, Fiocruz, Artigo19, Repórter Brasil, Global Witness, NASA FIRMS, INPE
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}