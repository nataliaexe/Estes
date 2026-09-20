import { ScrollReveal } from "../../componentes/efeitos/ScrollReveal";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Calendar, MapPin, Heart, MessageCircle,
  Share2, Bookmark, Leaf, FlaskConical, Users,
} from "lucide-react";

const noticiasDetalhes: Record<number, any> = {
  1: {
    id: 1,
    titulo: "Povo Maxakali (Tikmũ'ũn) - Estado de Coisas Inconstitucional",
    subtitulo: "Justiça Federal decreta intervenção urgente no Vale do Mucuri",
    data: "27/07/2026",
    local: "Vale do Mucuri, MG",
    categoria: "Indígenas",
    autor: "G1, Fiocruz, Artigo19",
    imagem: "https://images.pexels.com/photos/35358458/pexels-photo-35358458.jpeg",
    likes: 234,
    comentarios: 45,
    conteudo: `
      <p class="mb-4">A Justiça Federal decretou em julho de 2026 o "estado de coisas inconstitucional" para o povo Maxakali (Tikmũ'ũn), no Vale do Mucuri, Minas Gerais. A decisão reconhece a violação sistemática de direitos fundamentais desta comunidade e determina uma intervenção urgente do Estado brasileiro.</p>

      <p class="mb-4">O conceito de "estado de coisas inconstitucional" é reservado para situações em que a violação de direitos é tão generalizada e sistêmica que não se resolve com medidas pontuais. É o mesmo instrumento usado em 2015 para reconhecer a crise do sistema carcerário brasileiro.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">Os números</h3>
      <p class="mb-4">A mortalidade infantil entre os Maxakali é quase <strong>4 vezes maior</strong> que a média brasileira. Em 2025, a taxa chegou a 42 mortes por mil nascidos vivos, contra 11 da média nacional. A maioria das mortes é causada por doenças evitáveis: diarreia, desnutrição, pneumonia.</p>

      <p class="mb-4">As crianças bebem córrego contaminado com agrotóxico, e o sistema de saúde não conta com intérpretes para a língua tikmũ'ũn. Sem comunicação adequada, diagnósticos são perdidos e tratamentos são mal administrados.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">A causa raiz</h3>
      <p class="mb-4">O problema central é o <strong>confinamento territorial</strong>. Os Maxakali foram historicamente empurrados para pequenas ilhas de terra cercadas por fazendas de gado. Sem mata, a caça sumiu. Sem mata, os rios secaram ou foram contaminados por agrotóxicos usados nas plantações vizinhas.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">Demandas da comunidade</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Ampliação e demarcação do território tradicional</li>
        <li>Água encanada e tratamento de esgoto</li>
        <li>Autonomia em saúde com intérpretes tikmũ'ũn</li>
        <li>Proteção contra desmatamento e invasões</li>
        <li>Replantio de matas nativas para recuperar a caça</li>
      </ul>

      <h3 class="text-xl font-bold mb-3 mt-6">Fontes</h3>
      <p class="mb-4">G1 (27/07/2026), Fiocruz (Mapa de Conflitos), Artigo19 (10/09/2026), AnsUnba (31/05/2026).</p>
    `,
    estes_pode: [
      { caso: 15, titulo: "Biochar para solo com mercúrio", descricao: "Estudo #15 do Atlas investiga como resíduos agrícolas podem imobilizar metais no solo." },
      { caso: 1, titulo: "Sensor de eucalipto", descricao: "Caso #1 — sensor de papel feito com eucalipto local, que a própria comunidade pode produzir." },
    ],
  },
  2: {
    id: 2,
    titulo: "Rio Alalaú Contaminado - Desastre Ambiental Waimiri Atroari",
    subtitulo: "Indígenas denunciam vazamento de rejeito de mineração",
    data: "05/2026",
    local: "Rio Alalaú, AM/RR",
    categoria: "Contaminação",
    autor: "Repórter Brasil, IBAMA",
    imagem: "https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg",
    likes: 189,
    comentarios: 32,
    conteudo: `
      <p class="mb-4">Indígenas do povo Waimiri Atroari denunciaram um desastre ambiental no rio Alalaú, na divisa entre Amazonas e Roraima. Dezenas de animais mortos — botos, tartarugas e peixes — foram encontrados boiando nas águas. O IBAMA confirmou indícios de vazamento de rejeito de mineração de estanho nas proximidades.</p>

      <p class="mb-4">O rio Alalaú é um dos principais afluentes do rio Negro e atravessa a Terra Indígena Waimiri Atroari, um território de 2,5 milhões de hectares homologado em 1986.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">Impacto na segurança alimentar</h3>
      <p class="mb-4">O rio era uma das principais fontes de proteína e água potável para a comunidade. A contaminação compromete duas coisas ao mesmo tempo: a pesca (base da dieta) e o consumo direto de água.</p>

      <p class="mb-4">Segundo lideranças, a mortandade de peixes foi observada pela primeira vez em março de 2026 e se intensificou nos meses seguintes. A comunidade estima que a pesca caiu 60% no período.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">Resposta das autoridades</h3>
      <p class="mb-4">O IBAMA abriu processo administrativo e multou a empresa responsável, mas a comunidade denuncia que as medidas são insuficientes. A fiscalização é difícil em uma região de acesso complexo, e a recuperação do rio pode levar décadas.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">O que já se sabe</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>A mineração de estanho opera na região há décadas</li>
        <li>Análises de água preliminares detectaram metais pesados acima do limite</li>
        <li>A comunidade pede indenização e plano de recuperação</li>
      </ul>

      <h3 class="text-xl font-bold mb-3 mt-6">Fontes</h3>
      <p class="mb-4">Repórter Brasil (05/2026), IBAMA, ISA.</p>
    `,
    estes_pode: [
      { caso: 3, titulo: "Filtro de banana + babaçu", descricao: "Caso #3 — filtro de carvão ativado + casca de banana, que remove até 40% do mercúrio." },
      { caso: 21, titulo: "Monitoramento com drones", descricao: "Caso #21 — brigadas comunitárias usando drones para monitorar o território." },
    ],
  },
  3: {
    id: 3,
    titulo: "26 Assassinatos de Defensores Ambientais em Um Ano",
    subtitulo: "Brasil é o 2º país mais perigoso para ativistas",
    data: "17/09/2026",
    local: "PA e RO",
    categoria: "Direitos Humanos",
    autor: "Global Witness, Blog do Pedlowski",
    imagem: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg",
    likes: 312,
    comentarios: 67,
    conteudo: `
      <p class="mb-4">O Brasil registrou <strong>26 assassinatos</strong> de defensores da terra e do meio ambiente em um único ano, tornando-se o <strong>2º país mais perigoso do mundo</strong>.</p>
      <p class="mb-4">A maioria dos assassinatos ocorreu nos estados do Pará e Rondônia. Os alvos são principalmente líderes comunitários, indígenas e pequenos agricultores.</p>
    `,
    estes_pode: [
      { caso: 22, titulo: "eDNA para monitoramento", descricao: "Caso #22 — análise de DNA ambiental para monitorar biodiversidade sem expor pessoas." },
    ],
  },
  4: {
    id: 4,
    titulo: "Focos de Queimada em Tempo Real - NASA FIRMS",
    subtitulo: "Monitoramento via satélite mostra aumento de 40% na Amazônia",
    data: "20/09/2026",
    local: "Amazônia Legal",
    categoria: "Clima",
    autor: "NASA FIRMS, INPE",
    imagem: "https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg",
    likes: 156,
    comentarios: 28,
    conteudo: `
      <p class="mb-4">O monitoramento da NASA FIRMS mostrou um aumento de <strong>40% nos focos de queimada</strong> na Amazônia Legal no último trimestre.</p>
      <p class="mb-4">A plataforma Estes integra esses dados em tempo real, permitindo que comunidades saibam quando há focos próximos.</p>
    `,
    estes_pode: [
      { caso: 7, titulo: "Rede de sensores de queimada", descricao: "Caso #7 — rede comunitária de sensores de baixo custo para alerta precoce." },
    ],
  },
};

export default async function NoticiaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = noticiasDetalhes[parseInt(id)];

  if (!noticia) {
    return (
      <div className="min-h-screen bg-elfo-verde-escuro text-elfo-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Link href="/noticias" className="text-elfo-verde-vivo hover:underline">
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-elfo-verde-escuro to-black text-elfo-off-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ScrollReveal>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-elfo-off-white/70 hover:text-elfo-verde-vivo mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar para notícias
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${noticia.imagem})` }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-elfo-verde-vivo/20 text-elfo-verde-vivo text-xs font-semibold rounded-full mb-4">
              {noticia.categoria}
            </span>
            <h1 className="font-display font-black text-3xl md:text-4xl mb-4">
              {noticia.titulo}
            </h1>
            <p className="text-xl text-elfo-off-white/70 mb-6">
              {noticia.subtitulo}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-elfo-off-white/60 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {noticia.data}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {noticia.local}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-elfo-dourado">Fonte:</span>
                {noticia.autor}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div
            className="text-elfo-off-white/80 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
          />
        </ScrollReveal>

        {/* O QUE O ESTES PODE FAZER */}
        <ScrollReveal delay={0.4}>
          <section className="mt-16 bg-elfo-verde-vivo/5 border border-elfo-verde-vivo/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="text-elfo-verde-vivo" size={24} />
              <h2 className="font-display font-bold text-2xl text-elfo-verde-vivo">
                What Estes can do
              </h2>
            </div>
            <p className="text-elfo-off-white/70 mb-6">
              Esta é uma notícia real. O Estes investiga soluções que a própria
              comunidade pode implementar:
            </p>
            <div className="space-y-4">
              {noticia.estes_pode.map((item: any) => (
                <Link
                  key={item.caso}
                  href={`/caso/${item.caso}`}
                  className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-elfo-verde-vivo/20 flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="text-elfo-verde-vivo" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-lg mb-1 group-hover:text-elfo-verde-vivo transition-colors">
                        {item.titulo}
                      </p>
                      <p className="text-sm text-elfo-off-white/60">
                        {item.descricao}
                      </p>
                    </div>
                    <ArrowRight
                      className="text-elfo-verde-vivo opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2"
                      size={20}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-end">
              <Link
                href="/noticias"
                className="text-elfo-verde-vivo hover:underline text-sm cursor-pointer z-10 relative"
              >
                Ver todas as notícias →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
