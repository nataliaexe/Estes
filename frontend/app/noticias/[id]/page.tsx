import { ScrollReveal } from "../../componentes/efeitos/ScrollReveal";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

const noticiasDetalhes: Record<number, any> = {
  1: {
    id: 1,
    titulo: "Povo Maxakali (Tikmũ'ũn) - Estado de Coisas Inconstitucional",
    subtitulo: "Justiça Federal decreta intervenção urgente no Vale do Mucuri",
    data: "27/07/2026",
    local: "Vale do Mucuri, MG",
    categoria: "Indígenas",
    autor: "Repórter Brasil",
    imagem: "https://images.pexels.com/photos/35358458/pexels-photo-35358458.jpeg",
    fonte: "G1, Fiocruz, Artigo19",
    likes: 234,
    comentarios: 45,
    conteudo: `
      <p class="mb-4">A Justiça Federal decretou em julho de 2026 o "estado de coisas inconstitucional" para o povo Maxakali (Tikmũ'ũn), no Vale do Mucuri, Minas Gerais. A decisão reconhece a violação sistemática de direitos fundamentais desta comunidade indígena.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Os Números Alarmantes</h3>
      <p class="mb-4">A mortalidade infantil entre os Maxakali é quase <strong>4 vezes maior</strong> que a média brasileira. As crianças bebem córrego contaminado com agrotóxico, e o sistema de saúde não conta com intérpretes para a língua tikmũ'ũn.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Demandas da Comunidade</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Ampliação do território tradicional</li>
        <li>Água encanada e tratamento de esgoto</li>
        <li>Autonomia em saúde com intérpretes</li>
        <li>Proteção contra desmatamento e invasões</li>
      </ul>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Como o Estes Responde</h3>
      <p class="mb-4">O Caso #15 (biochar para solo com mercúrio) e o Caso #1 (sensor de eucalipto feito pela própria comunidade) oferecem soluções que podem ser implementadas localmente sem depender de infraestrutura externa.</p>
    `,
  },
  2: {
    id: 2,
    titulo: "Rio Alalaú Contaminado - Desastre Ambiental Waimiri Atroari",
    subtitulo: "Indígenas denunciam vazamento de rejeito de mineração",
    data: "05/2026",
    local: "Rio Alalaú, AM/RR",
    categoria: "Contaminação",
    autor: "Repórter Brasil",
    imagem: "https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg",
    fonte: "Repórter Brasil, IBAMA",
    likes: 189,
    comentarios: 32,
    conteudo: `
      <p class="mb-4">Indígenas do povo Waimiri Atroari denunciaram um desastre ambiental no rio Alalaú, na divisa entre Amazonas e Roraima. Dezenas de animais mortos foram encontrados boiando nas águas, e o IBAMA confirmou indícios de vazamento de rejeito de mineração de estanho.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Impacto na Segurança Alimentar</h3>
      <p class="mb-4">O comprometimento total da segurança alimentar do território coloca em risco a sobrevivência da comunidade. O rio era uma das principais fontes de proteína e água para o povo Waimiri Atroari.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Resposta do IBAMA</h3>
      <p class="mb-4">O órgão ambiental constatou ilícito e abriu processo administrativo. No entanto, a comunidade denuncia que as medidas são insuficientes e pedem intervenção mais urgente.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Soluções Estes</h3>
      <p class="mb-4">O Caso #3 (filtro de banana + babaçu) e o Caso #21 (monitoramento com drones) podem ajudar a filtrar água e monitorar a qualidade ambiental em tempo real.</p>
    `,
  },
  3: {
    id: 3,
    titulo: "26 Assassinatos de Defensores Ambientais em Um Ano",
    subtitulo: "Brasil é o 2º país mais perigoso para ativistas",
    data: "17/09/2026",
    local: "PA e RO",
    categoria: "Direitos Humanos",
    autor: "Global Witness",
    imagem: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg",
    fonte: "Global Witness, Blog do Pedlowski",
    likes: 312,
    comentarios: 67,
    conteudo: `
      <p class="mb-4">O Brasil registrou <strong>26 assassinatos</strong> de defensores da terra e do meio ambiente em um único ano, tornando-se o <strong>2º país mais perigoso do mundo</strong> para ativistas ambientais, atrás apenas da Colômbia.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Concentração no Norte</h3>
      <p class="mb-4">A maioria dos assassinatos ocorreu nos estados do Pará e Rondônia, regiões de intense conflito por terra e recursos naturais. Os alvos são principalmente líderes comunitários, indígenas e pequenos agricultores.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Impunidade</h3>
      <p class="mb-4">O relatório destaca que a impunidade é um dos principais fatores que contribuem para a continuidade desses crimes. Menos de 10% dos casos resultam em condenações.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Tecnologia como Proteção</h3>
      <p class="mb-4">O Caso #20 (reflorestamento com drones) e o Caso #22 (eDNA) oferecem tecnologias que podem ajudar a monitorar territórios remotamente e reduzir a exposição de ativistas a riscos.</p>
    `,
  },
  4: {
    id: 4,
    titulo: "Focos de Queimada em Tempo Real - NASA FIRMS",
    subtitulo: "Monitoramento via satélite mostra aumento de 40% na Amazônia",
    data: "20/09/2026",
    local: "Amazônia Legal",
    categoria: "Clima",
    autor: "NASA FIRMS",
    imagem: "https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg",
    fonte: "NASA FIRMS, INPE",
    likes: 156,
    comentarios: 28,
    conteudo: `
      <p class="mb-4">O monitoramento via satélite da NASA FIRMS (Fire Information for Resource Management System) mostrou um aumento de <strong>40% nos focos de queimada</strong> na Amazônia Legal no último trimestre, alarmando pesquisadores e autoridades ambientais.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Dados em Tempo Real</h3>
      <p class="mb-4">O sistema utiliza sensores a bordo dos satélites VIIRS e MODIS para detectar radiação térmica, permitindo identificar focos de incêndio com poucas horas de antecedência.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Integração com Estes</h3>
      <p class="mb-4">A plataforma Estes integra esses dados em tempo real, permitindo que comunidades saibam quando há focos de queimada próximos e possam se preparar ou agir preventivamente.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Soluções Locais</h3>
      <p class="mb-4">O Caso #7 (rede de sensores) e o Caso #14 (drones com nariz eletrônico) complementam o monitoramento satelital com dados em nível de solo, proporcionando uma visão mais completa.</p>
    `,
  },
};

export default function NoticiaDetalhePage({ params }: { params: { id: string } }) {
  const noticia = noticiasDetalhes[parseInt(params.id)];

  if (!noticia) {
    return (
      <div className="min-h-screen bg-elfo-verde-escuro text-elfo-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Link href="/noticias" className="text-elfo-verde-vivo hover:underline">
            Voltar para notícias
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
          <div className="aspect-video bg-gradient-to-br from-elfo-verde-escuro to-elfo-verde-vivo rounded-2xl overflow-hidden mb-8">
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
                <span className="text-elfo-dourado">Por</span>
                {noticia.autor}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <button className="flex items-center gap-2 text-elfo-off-white/70 hover:text-elfo-verde-vivo transition-colors">
                <Heart size={20} />
                {noticia.likes}
              </button>
              <button className="flex items-center gap-2 text-elfo-off-white/70 hover:text-elfo-verde-vivo transition-colors">
                <MessageCircle size={20} />
                {noticia.comentarios}
              </button>
              <button className="flex items-center gap-2 text-elfo-off-white/70 hover:text-elfo-verde-vivo transition-colors">
                <Share2 size={20} />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 text-elfo-off-white/70 hover:text-elfo-verde-vivo transition-colors">
                <Bookmark size={20} />
                Salvar
              </button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
              className="text-elfo-off-white/80 leading-relaxed"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-elfo-off-white/50 mb-4">
              Fontes: {noticia.fonte}
            </p>
            <Link 
              href="/noticias"
              className="inline-flex items-center gap-2 text-elfo-verde-vivo hover:text-elfo-verde-vivo/80 transition-colors"
            >
              Ver todas as notícias
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}