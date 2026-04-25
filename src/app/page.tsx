import { ArrowUpRight, FilePlus2, MapPinned, Send, ShieldAlert } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PropertyCard } from "@/components/properties/property-card";
import { ButtonLink } from "@/components/ui/button-link";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { neighborhoods, properties, propertyReports, siteContent } from "@/lib/data/mock-data";

export default function HomePage() {
  const primaryPaths = [
    {
      title: "Ver mapa",
      description: "Entrar pela leitura espacial, com foco nas concentracoes e nos vazios do territorio.",
      href: "/mapa",
      icon: MapPinned,
      variant: "primary" as const,
    },
    {
      title: "Explorar imoveis",
      description: "Percorrer o acervo como arquivo vivo de conflito, uso e prova publica.",
      href: "/imoveis",
      icon: ShieldAlert,
      variant: "secondary" as const,
    },
    {
      title: "Agir agora",
      description: "Abrir frentes publicas ja ligadas a fichas concretas do territorio.",
      href: "/agir",
      icon: ArrowUpRight,
      variant: "secondary" as const,
    },
    {
      title: "Enviar contribuicao",
      description: "Acrescentar memoria, imagem, documento ou denuncia para ampliar a prova publica.",
      href: "/enviar",
      icon: FilePlus2,
      variant: "ghost" as const,
    },
  ];

  const politicalHighlights = [
    "Memoria urbana organizada como acervo de disputa, nao como vitrine estetica.",
    "Leitura territorial com foco em status, criticidade, prova e mobilizacao possivel.",
    "Interface monumental, mas respiravel, para sustentar impacto politico sem cair em preto absoluto.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <section className="tt-hero tt-rule-grid relative overflow-hidden px-5 py-7 sm:px-6 md:px-8 md:py-9 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(169,188,196,0.16),transparent)]" />
        <div className="pointer-events-none absolute -right-12 top-10 h-44 w-44 rounded-full bg-steel/18 blur-3xl" />
        <div className="pointer-events-none absolute left-[18%] top-[56%] h-28 w-28 rounded-full bg-signal/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-[10%] w-px bg-concrete/18" />
        <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-concrete/16" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] xl:items-end">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Observatorio popular urbano"
              title={siteContent.name}
              description={siteContent.manifesto}
              variant="hero"
            />
            <p className="max-w-2xl text-sm uppercase tracking-[0.2em] text-glass/90 sm:text-base">{siteContent.subtitle}</p>
            <div className="grid gap-2 sm:grid-cols-3 xl:max-w-3xl">
              <MetricCard label="imoveis mapeados" value={properties.length} description="base territorial viva" compact tone="blue" />
              <MetricCard label="relatos em circulacao" value={propertyReports.length} description="memoria publica" compact tone="rust" />
              <MetricCard label="bairros em leitura" value={neighborhoods.length} description="escala politica" compact tone="yellow" />
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/mapa">Abrir mapa</ButtonLink>
              <ButtonLink href="/imoveis" variant="secondary">
                Explorar imoveis
              </ButtonLink>
              <ButtonLink href="/agir" variant="secondary">
                Agir agora <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/enviar" variant="ghost">
                Enviar contribuicao
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-3">
            <PanelCard
              density="compact"
              className="border-glass/28 bg-[linear-gradient(155deg,rgba(125,144,155,0.18),rgba(242,244,239,0.05))]"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-signal">Entrada politica</p>
                    <p className="max-w-md text-sm leading-6 text-paper/76">
                      A home continua sendo a fachada monumental do produto, mas agora respira mais e distribui melhor mapa, acervo, prova e acao.
                    </p>
                  </div>
                  <MapPinned className="mt-1 h-6 w-6 shrink-0 text-glass-cold" />
                </div>
                <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                  {politicalHighlights.map((item) => (
                    <div key={item} className="border border-concrete/14 bg-ink-alt/24 px-3 py-3 text-sm leading-6 text-paper/72">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </PanelCard>
            <div className="grid gap-3 sm:grid-cols-2">
              {primaryPaths.slice(0, 2).map((path) => {
                const Icon = path.icon;

                return (
                  <PanelCard
                    key={path.title}
                    variant="card"
                    density="compact"
                    className="border-concrete/18 bg-[linear-gradient(155deg,rgba(242,244,239,0.09),rgba(125,144,155,0.08))]"
                    actions={<Icon className="h-5 w-5 text-signal" />}
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.1em] text-paper">{path.title}</p>
                        <p className="mt-2 text-sm leading-6 text-paper/70">{path.description}</p>
                      </div>
                      <ButtonLink href={path.href} variant={path.variant} className="w-full text-xs sm:w-auto">
                        Abrir caminho
                      </ButtonLink>
                    </div>
                  </PanelCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(320px,1.08fr)]">
        <PanelCard
          className="border-steel/24 bg-[linear-gradient(155deg,rgba(125,144,155,0.15),rgba(211,217,213,0.06))]"
          eyebrow="Direcao visual"
          title="Monumental, mas respiravel"
          description="Concreto frio, vidro azulado, grafite mineral e amarelo VR Abandonada organizam a home como entrada politica. Ferrugem entra so como ponto de alerta e memoria de desgaste."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Hero menos opaco, com mais profundidade cromatica e mais leitura em camadas.",
              "Blocos principais mais densos e mais proximos, reduzindo vazios que quebravam ritmo.",
              "Metrica e destaque tratados como apoio narrativo, nao como grade de dashboard.",
              "Caminhos de entrada explicitos para mapa, acervo, acao e contribuicao publica.",
            ].map((item) => (
              <div key={item} className="border border-concrete/14 bg-concrete/8 px-4 py-3 text-sm leading-6 text-paper/72">
                {item}
              </div>
            ))}
          </div>
        </PanelCard>

        <div className="grid gap-3 sm:grid-cols-2">
          {primaryPaths.slice(2).map((path) => {
            const Icon = path.icon;

            return (
              <PanelCard
                key={path.title}
                variant="card"
                className="border-concrete/18 bg-[linear-gradient(155deg,rgba(169,188,196,0.12),rgba(242,244,239,0.06))]"
                actions={<Icon className="h-5 w-5 text-rust-light" />}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-paper">{path.title}</p>
                    <p className="mt-2 text-sm leading-6 text-paper/70">{path.description}</p>
                  </div>
                  <ButtonLink href={path.href} variant={path.variant} className="w-full text-xs sm:w-auto">
                    Abrir caminho
                  </ButtonLink>
                </div>
              </PanelCard>
            );
          })}
        </div>
      </section>

      <section className="mt-10 space-y-6 sm:mt-12">
        <SectionHeader
          eyebrow="imoveis em destaque"
          title="O acervo entra vivo ja na primeira dobra"
          description="A home continua monumental, mas ja entrega conflito concreto. Os cards abaixo puxam o usuario para a leitura territorial sem transformar a entrada em portal institucional."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {properties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} compact />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        <PanelCard
          className="border-concrete/18 bg-[linear-gradient(155deg,rgba(242,244,239,0.08),rgba(125,144,155,0.08))]"
          eyebrow="Chamada final"
          title="A cidade abandonada nao se explica sozinha"
          description="O produto entra pela politica: mapear, documentar, ler o dano e acionar resposta publica. A home precisa manter esse peso sem virar bloco de concreto morto."
          actions={
            <ButtonLink href="/mapa" className="text-xs">
              Ver mapa
            </ButtonLink>
          }
        >
          <p className="max-w-3xl text-sm leading-7 text-paper/72">
            Cada rota do app aprofunda um tipo de leitura, mas a entrada continua sendo este choque inicial entre monumentalidade, prova, memoria urbana e possibilidade de mobilizacao.
          </p>
        </PanelCard>

        <PanelCard variant="card" className="border-rust/20 bg-[linear-gradient(155deg,rgba(143,89,68,0.12),rgba(242,244,239,0.05))]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Send className="h-5 w-5 text-rust-light" />
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-paper">Memoria tambem entra por envio</p>
            </div>
            <p className="text-sm leading-6 text-paper/72">
              Quando a rede acrescenta documento, imagem ou relato, o acervo ganha lastro e a leitura do abandono deixa de ser abstrata.
            </p>
            <ButtonLink href="/enviar" variant="ghost" className="w-full text-xs sm:w-auto">
              Enviar contribuicao
            </ButtonLink>
          </div>
        </PanelCard>
      </section>
    </div>
  );
}
