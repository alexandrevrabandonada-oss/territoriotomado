import type {
  Neighborhood,
  Profile,
  Property,
  PropertyAction,
  PropertyDocument,
  PropertyImage,
  PropertyReport,
  PropertyTimelineItem,
  ReuseProposal,
} from "@/types/domain";

export const siteContent = {
  name: "Territorio Tomado",
  subtitle: "Mapa Popular dos Imoveis da CSN em Volta Redonda",
  manifesto:
    "Mapear, documentar e ativar disputa social sobre imoveis ligados a CSN em Volta Redonda, conectando memoria historica, prova documental, leitura territorial e acao coletiva.",
};

export const neighborhoods: Neighborhood[] = [
  {
    id: "n1",
    name: "Vila Santa Cecilia",
    slug: "vila-santa-cecilia",
    description: "Area central com forte marca operaria e concentracao de equipamentos historicos.",
  },
  {
    id: "n2",
    name: "Aterrado",
    slug: "aterrado",
    description: "Eixo de servicos e vazios urbanos sob pressao imobiliaria e institucional.",
  },
  {
    id: "n3",
    name: "Conforto",
    slug: "conforto",
    description: "Bairro estrategico na leitura da expansao industrial e dos lotes subutilizados.",
  },
];

export const properties: Property[] = [
  {
    id: "p1",
    slug: "antigo-clube-csn-santa-cecilia",
    title: "Antigo Clube CSN Santa Cecilia",
    address: "Rua 14, Vila Santa Cecilia, Volta Redonda",
    neighborhoodId: "n1",
    status: "vazio",
    criticality: "alta",
    lat: -22.5195,
    lng: -44.1034,
    excerpt: "Complexo ocioso em area consolidada, com memoria coletiva forte e potencial de uso publico.",
    description:
      "Imovel de grande porte, desativado ha anos, cercado por equipamentos urbanos e por relatos recorrentes de abandono, depredacao e perda de funcao social.",
    currentUse: "Sem uso regular identificado",
    areaEstimate: "8.500 m2",
    legalNotes: [
      "Documentacao fundiaria em consolidacao",
      "Ha indicios de passivo de manutencao",
    ],
    tags: ["memoria operaria", "vazio urbano", "equipamento coletivo"],
  },
  {
    id: "p2",
    slug: "galpao-logistico-aterrado",
    title: "Galpao Logistico Aterrado",
    address: "Avenida Paulo de Frontin, Aterrado, Volta Redonda",
    neighborhoodId: "n2",
    status: "em-disputa",
    criticality: "media",
    lat: -22.5248,
    lng: -44.0992,
    excerpt: "Galpao subutilizado em corredor urbano sensivel, alvo de debate entre reuso social e especulacao.",
    description:
      "Estrutura robusta, com localizacao privilegiada, cercada por vazios e fluxos intensos. O territorio aponta para uso misto com centralidade comunitaria.",
    currentUse: "Uso eventual para armazenamento",
    areaEstimate: "5.100 m2",
    legalNotes: [
      "Necessita verificar contratos ativos",
      "Interesse publico mapeado por organizacoes locais",
    ],
    tags: ["reuso adaptativo", "corredor urbano", "disputa territorial"],
  },
  {
    id: "p3",
    slug: "casa-tecnica-conforto",
    title: "Casa Tecnica Conforto",
    address: "Rua Nossa Senhora da Conceicao, Conforto, Volta Redonda",
    neighborhoodId: "n3",
    status: "uso-institucional",
    criticality: "baixa",
    lat: -22.5312,
    lng: -44.1098,
    excerpt: "Imovel com uso residual e baixo grau de transparencia publica sobre sua funcao atual.",
    description:
      "Edificacao de menor escala, com valor documental e potencial de abrir debate sobre inventario completo dos ativos ligados a CSN.",
    currentUse: "Apoio tecnico-administrativo",
    areaEstimate: "680 m2",
    legalNotes: ["Necessario consolidar historico de destinacao do lote"],
    tags: ["inventario", "transparencia", "uso institucional"],
  },
];

export const propertyImages: PropertyImage[] = [
  {
    id: "i1",
    propertyId: "p1",
    src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
    alt: "Fachada desgastada de edificio industrial",
    credit: "Unsplash",
  },
  {
    id: "i2",
    propertyId: "p1",
    src: "https://images.unsplash.com/photo-1523419409543-a5e549c1f8b1?auto=format&fit=crop&w=1200&q=80",
    alt: "Interior amplo de espaco abandonado",
    credit: "Unsplash",
  },
  {
    id: "i3",
    propertyId: "p2",
    src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    alt: "Galpao urbano em area central",
    credit: "Unsplash",
  },
  {
    id: "i4",
    propertyId: "p3",
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    alt: "Casa antiga em tecido urbano consolidado",
    credit: "Unsplash",
  },
];

export const propertyDocuments: PropertyDocument[] = [
  {
    id: "d1",
    propertyId: "p1",
    title: "Levantamento Preliminar de Titularidade",
    type: "fundiario",
    year: 2024,
    summary: "Compila matriculas, referencias cruzadas e lacunas documentais sobre o imovel.",
  },
  {
    id: "d2",
    propertyId: "p1",
    title: "Memoria Oral do Clube",
    type: "memoria",
    year: 2025,
    summary: "Relatos de ex-frequentadores e moradores sobre usos sociais passados do espaco.",
  },
  {
    id: "d3",
    propertyId: "p2",
    title: "Mapa de Pressao Imobiliaria",
    type: "analise territorial",
    year: 2025,
    summary: "Aponta transformacoes recentes do entorno e interesse privado na area.",
  },
  {
    id: "d4",
    propertyId: "p3",
    title: "Ficha de Inventario Tecnico",
    type: "inventario",
    year: 2023,
    summary: "Documento-base para rastrear estado fisico, uso atual e historico resumido.",
  },
];

export const propertyTimeline: PropertyTimelineItem[] = [
  {
    id: "t1",
    propertyId: "p1",
    year: "1958",
    title: "Implantacao do equipamento",
    description: "Espaco passa a integrar a infraestrutura de sociabilidade ligada ao ciclo industrial.",
  },
  {
    id: "t2",
    propertyId: "p1",
    year: "1993",
    title: "Mudanca de gestao e perda de centralidade",
    description: "O imovel inicia processo de esvaziamento e manutencao irregular.",
  },
  {
    id: "t3",
    propertyId: "p2",
    year: "2019",
    title: "Ativacao parcial para estoque",
    description: "Uso esporadico sem consolidar funcao urbana permanente.",
  },
  {
    id: "t4",
    propertyId: "p3",
    year: "2022",
    title: "Reabertura administrativa limitada",
    description: "Retomada parcial de atividades internas, sem abertura publica clara.",
  },
];

export const propertyReports: PropertyReport[] = [
  {
    id: "r1",
    propertyId: "p1",
    author: "Moradora da Vila",
    status: "aprovado",
    excerpt: "O local esta fechado ha anos e segue se deteriorando, apesar do seu valor para o bairro.",
    createdAt: "2026-03-04",
  },
  {
    id: "r2",
    propertyId: "p2",
    author: "Coletivo de Mobilidade",
    status: "pendente",
    excerpt: "A area poderia receber um uso comunitario articulado com o terminal e equipamentos do entorno.",
    createdAt: "2026-03-21",
  },
  {
    id: "r3",
    propertyId: "p3",
    author: "Pesquisador local",
    status: "aprovado",
    excerpt: "Falta transparencia sobre a destinacao atual e sobre o inventario patrimonial do lote.",
    createdAt: "2026-02-11",
  },
];

export const propertyActions: PropertyAction[] = [
  {
    id: "a1",
    propertyId: "p1",
    title: "Mutirao de memoria e mapeamento",
    kind: "mutirao",
    ctaLabel: "Entrar no mutirao",
    href: "/agir",
    description: "Convocacao para coletar relatos, fotografias e referencias documentais do antigo clube.",
  },
  {
    id: "a2",
    propertyId: "p2",
    title: "Ato por transparencia sobre ativos urbanos",
    kind: "ato",
    ctaLabel: "Ver mobilizacao",
    href: "/agir",
    description: "Agenda publica para pressionar pela divulgacao de dados e destinacao social do galpao.",
  },
  {
    id: "a3",
    propertyId: "p3",
    title: "Oficina de propostas de reuso",
    kind: "oficina",
    ctaLabel: "Participar da oficina",
    href: "/agir",
    description: "Sessao aberta para pensar usos civicos e comunitarios para imoveis subutilizados.",
  },
];

export const reuseProposals: ReuseProposal[] = [
  {
    id: "u1",
    propertyId: "p1",
    title: "Centro popular de memoria operaria",
    description: "Espaco expositivo, arquivo comunitario e programacao cultural de base territorial.",
    supporters: 184,
  },
  {
    id: "u2",
    propertyId: "p2",
    title: "Mercado solidario e hub de mobilidade",
    description: "Uso misto com feira, servicos urbanos e apoio a deslocamentos cotidianos.",
    supporters: 127,
  },
  {
    id: "u3",
    propertyId: "p3",
    title: "Casa de apoio tecnico para lutas urbanas",
    description: "Base compartilhada para assessoria, acervo e reunioes de coletivos locais.",
    supporters: 63,
  },
];

export const profiles: Profile[] = [
  {
    id: "profile-1",
    fullName: "Equipe Territorio Tomado",
    role: "admin",
  },
  {
    id: "profile-2",
    fullName: "Moderacao Comunitaria",
    role: "moderador",
  },
];