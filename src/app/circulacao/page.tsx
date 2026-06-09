import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, Megaphone, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { PanelCard } from "@/components/ui/panel-card";
import {
  getCirculationRankings,
  getRankingMeta,
  money,
  publicLabel,
  type CirculationRankingItem,
  type NeighborhoodRankingItem,
  type RankingKind,
} from "@/lib/data/circulation";
import { getReviewOperationState, type ReviewQueueItem } from "@/lib/data/admin-review";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Circulacao politica | Territorio Tomado",
  description: "Rankings, cards e resumos publicos para rede, imprensa e mobilizacao sobre os imoveis ligados a CSN.",
  openGraph: {
    title: "Circulacao politica | Territorio Tomado",
    description: "Rankings e cards publicos com separacao entre dado oficial, estimado e revisao.",
    images: ["/circulacao/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Circulacao politica | Territorio Tomado",
    description: "Rankings e cards publicos com separacao entre dado oficial, estimado e revisao.",
    images: ["/circulacao/opengraph-image"],
  },
};

const rankingBlocks: Array<{
  kind: RankingKind;
  eyebrow: string;
  description: string;
  sourceTone: "yellow" | "blue" | "rust" | "neutral";
}> = [
  {
    kind: "top-iptu-2025",
    eyebrow: "dado oficial",
    description: "Maiores IPTUs 2025 observados na base. Bom para pauta de imprensa e comparacao publica.",
    sourceTone: "yellow",
  },
  {
    kind: "valor-venal-estimado",
    eyebrow: "dado estimado",
    description: "Maiores valores venais estimados, sempre marcados como estimativa e com status separado.",
    sourceTone: "blue",
  },
  {
    kind: "concentracao-bairros",
    eyebrow: "leitura territorial",
    description: "Bairros com maior concentracao de registros, para mobilizacao local e leitura popular.",
    sourceTone: "neutral",
  },
  {
    kind: "revisao-prioritaria",
    eyebrow: "dado em revisao",
    description: "Fila publica do que precisa checagem humana antes de virar afirmacao forte.",
    sourceTone: "rust",
  },
];

function bairroSlug(bairro: string) {
  return encodeURIComponent(
    bairro
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  );
}

function getItems(kind: RankingKind, rankings: Awaited<ReturnType<typeof getCirculationRankings>>) {
  if (kind === "top-iptu-2025") {
    return rankings.topIptu2025;
  }

  if (kind === "valor-venal-estimado") {
    return rankings.topValorVenal;
  }

  if (kind === "revisao-prioritaria") {
    return rankings.revisaoPrioritaria;
  }

  return rankings.bairrosConcentracao;
}

function metricFor(kind: RankingKind, item: CirculationRankingItem | NeighborhoodRankingItem) {
  if (kind === "concentracao-bairros") {
    return `${(item as NeighborhoodRankingItem).registros} registros`;
  }

  const property = item as CirculationRankingItem;

  if (kind === "top-iptu-2025") {
    return money(property.iptu2025);
  }

  if (kind === "valor-venal-estimado") {
    return money(property.valorVenal);
  }

  return `revisao ${publicLabel(property.prioridadeRevisao)}`;
}

function subjectFor(kind: RankingKind, item: CirculationRankingItem | NeighborhoodRankingItem) {
  return kind === "concentracao-bairros" ? (item as NeighborhoodRankingItem).bairro : (item as CirculationRankingItem).endereco;
}

function contextFor(kind: RankingKind, item: CirculationRankingItem | NeighborhoodRankingItem) {
  if (kind === "concentracao-bairros") {
    return (item as NeighborhoodRankingItem).resumo;
  }

  const property = item as CirculationRankingItem;
  return `${property.bairro} · localizacao ${publicLabel(property.localizacaoStatus)} · valor venal ${publicLabel(property.valorVenalStatus)}`;
}

function bairroHrefFromItem(item: CirculationRankingItem | NeighborhoodRankingItem) {
  return `/bairros/${bairroSlug("bairro" in item ? item.bairro : "")}`;
}

function reviewMetric(item: ReviewQueueItem) {
  const iptu = item.iptu_2025_observado ? money(item.iptu_2025_observado) : "IPTU em revisao";
  const venal = item.valor_venal_estimado ? money(item.valor_venal_estimado) : "venal em revisao";

  return `${iptu} · ${venal}`;
}

function RankingBlock({
  kind,
  eyebrow,
  description,
  sourceTone,
  rankings,
}: {
  kind: RankingKind;
  eyebrow: string;
  description: string;
  sourceTone: "yellow" | "blue" | "rust" | "neutral";
  rankings: Awaited<ReturnType<typeof getCirculationRankings>>;
}) {
  const meta = getRankingMeta(kind);
  const items = getItems(kind, rankings);

  return (
    <PanelCard
      eyebrow={eyebrow}
      title={meta.title}
      description={description}
      actions={
        <>
          <ButtonLink href={`/circulacao/share/ranking/${kind}/1x1`} variant="secondary" className="text-xs">
            card 1:1
          </ButtonLink>
          <ButtonLink href={`/circulacao/share/ranking/${kind}/9x16`} variant="ghost" className="text-xs">
            story
          </ButtonLink>
        </>
      }
      tone={kind === "revisao-prioritaria" ? "alert" : "default"}
      className="min-h-full"
    >
      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <article key={`${kind}-${subjectFor(kind, item)}-${index}`} className="border border-white/12 bg-black/18 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-paper/42">#{index + 1}</p>
                <h3 className="mt-1 font-display text-xl uppercase leading-6 tracking-[0.06em] text-paper">{subjectFor(kind, item)}</h3>
              </div>
              <Badge tone={sourceTone} variant="soft" className="shrink-0">
                {meta.sourceLabel}
              </Badge>
            </div>
            <p className="mt-3 font-display text-2xl uppercase leading-7 tracking-[0.06em] text-signal">{metricFor(kind, item)}</p>
            <p className="mt-2 text-sm leading-5 text-paper/62">{contextFor(kind, item)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {kind === "concentracao-bairros" ? (
                <>
                  <ButtonLink href={`/circulacao/share/bairro/${bairroSlug((item as NeighborhoodRankingItem).bairro)}/1x1`} variant="secondary" className="text-xs">
                    compartilhar
                  </ButtonLink>
                  <ButtonLink href={bairroHrefFromItem(item)} variant="ghost" className="text-xs">
                    abrir bairro
                  </ButtonLink>
                </>
              ) : (
                <>
                  <ButtonLink href={bairroHrefFromItem(item)} variant="secondary" className="text-xs">
                    ver bairro
                  </ButtonLink>
                  <ButtonLink href="/agir" variant="ghost" className="text-xs">
                    entrar na frente
                  </ButtonLink>
                </>
              )}
              <ButtonLink href={kind === "revisao-prioritaria" ? "/admin/revisao" : "/agir"} variant={kind === "revisao-prioritaria" ? "danger" : "ghost"} className="text-xs">
                {kind === "revisao-prioritaria" ? "ajudar revisao" : "ver acao aberta"}
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </PanelCard>
  );
}

export default async function CirculacaoPage() {
  const [rankings, reviewState] = await Promise.all([getCirculationRankings(), getReviewOperationState()]);

  return (
    <div className="mx-auto w-full max-w-[1500px] px-3 pb-10 sm:px-5 lg:px-8">
      <section className="grid border-x border-b border-white/14 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(9,12,13,0.88))] lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="px-6 py-7 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3 text-signal">
            <Megaphone className="h-6 w-6" strokeWidth={1.8} />
            <p className="text-[11px] font-black uppercase tracking-[0.24em]">Circulacao politica</p>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-none tracking-[0.07em] text-paper sm:text-6xl">
            Rankings curtos para rede, imprensa e mobilizacao.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-paper/70 sm:text-base">
            Esta pagina transforma a base em pecas publicas: o que e oficial aparece como oficial, o que e estimado aparece como estimado, e o que precisa revisao vira fila de checagem.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#rankings" variant="primary" className="text-xs">
              ver rankings
            </ButtonLink>
            <ButtonLink href="#cards" variant="secondary" className="text-xs">
              gerar cards
            </ButtonLink>
            <ButtonLink href="/agir" variant="ghost" className="text-xs">
              entrar na frente
            </ButtonLink>
            <ButtonLink href="/admin/revisao" variant="ghost" className="text-xs">
              ajudar revisao
            </ButtonLink>
          </div>
        </div>
        <aside className="border-t border-white/14 px-6 py-6 lg:border-t-0 lg:border-l">
          <div className="grid gap-3">
            {[
              ["oficial", "IPTU 2025 observado"],
              ["estimado", "valor venal declarado como estimativa"],
              ["revisao", "localizacao e prioridade sempre visiveis"],
            ].map(([label, value]) => (
              <div key={label} className="border border-white/12 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-signal">{label}</p>
                <p className="mt-2 text-sm leading-5 text-paper/72">{value}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section id="rankings" className="grid gap-4 border-x border-white/14 bg-[#080b0c] px-3 py-4 sm:px-4 lg:grid-cols-2">
        {rankingBlocks.map((block) => (
          <RankingBlock key={block.kind} rankings={rankings} {...block} />
        ))}
      </section>

      <section className="grid gap-4 border-x border-t border-white/14 bg-[linear-gradient(180deg,rgba(88,107,118,0.14),rgba(7,9,10,0.96))] px-3 py-4 sm:px-4 xl:grid-cols-[0.9fr_1.1fr]">
        <PanelCard
          eyebrow="rotina semanal"
          title="Da revisao para a pauta."
          description="A circulacao deixa de ser vitrine: ela mostra quais dados fechados podem virar bairro em foco, card, agenda ou pedido de acao."
          tone="strong"
          actions={
            <>
              <ButtonLink href="/admin/revisao" variant="secondary" className="text-xs">
                operar revisao
              </ButtonLink>
              <ButtonLink href="/agir" variant="ghost" className="text-xs">
                ver acoes
              </ButtonLink>
            </>
          }
        >
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border border-white/12 bg-black/20 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-signal">liberados mapa</p>
              <p className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-paper">{reviewState.metrics.releasedForMap}</p>
              <p className="mt-1 text-xs leading-5 text-paper/52">item com coordenada confirmada volta para leitura territorial.</p>
            </div>
            <div className="border border-white/12 bg-black/20 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-signal">viram pauta</p>
              <p className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-paper">{reviewState.weeklyFocus.circulationCandidates.length}</p>
              <p className="mt-1 text-xs leading-5 text-paper/52">casos com valor, bairro e localizacao prontos para texto curto.</p>
            </div>
            <div className="border border-white/12 bg-black/20 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-signal">bairros foco</p>
              <p className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-paper">{reviewState.weeklyFocus.neighborhoods.length}</p>
              <p className="mt-1 text-xs leading-5 text-paper/52">recorte territorial para reuniao, imprensa e mobilizacao.</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="fila que produz politica"
          title="O que pode virar card ou pauta agora"
          description="Lista curta para reuniao semanal: escolher caso, abrir bairro, gerar card e ligar a uma frente de acao."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {reviewState.weeklyFocus.circulationCandidates.slice(0, 6).map((item) => (
              <article key={`pauta-${item.inscricao_imobiliaria}`} className="border border-white/12 bg-black/18 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-signal">{item.bairro_oficial}</p>
                    <h3 className="mt-1 font-display text-xl uppercase leading-6 tracking-[0.06em] text-paper">{item.endereco_oficial}</h3>
                  </div>
                  <Badge tone={item.prioridade_revisao === "alta" ? "alert" : "neutral"} variant="soft">
                    {item.prioridade_revisao}
                  </Badge>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-paper/52">{reviewMetric(item)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ButtonLink href={`/bairros/${bairroSlug(item.bairro_oficial)}`} variant="secondary" className="text-xs">
                    bairro
                  </ButtonLink>
                  <ButtonLink href={`/circulacao/share/bairro/${bairroSlug(item.bairro_oficial)}/1x1`} variant="ghost" className="text-xs">
                    card bairro
                  </ButtonLink>
                  <ButtonLink href="/agir" variant="ghost" className="text-xs">
                    acao
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </PanelCard>
      </section>

      <section id="cards" className="grid gap-4 border-x border-t border-white/14 bg-[linear-gradient(180deg,rgba(13,20,22,0.9),rgba(7,9,10,0.96))] px-3 py-4 sm:px-4 lg:grid-cols-[0.86fr_1.14fr]">
        <PanelCard
          eyebrow="cards compartilhaveis"
          title="Pecas simples, nao dashboard."
          description="Cada card carrega uma tese curta, a origem do dado e o status de revisao quando necessario."
          actions={
            <ButtonLink href="/circulacao/opengraph-image" variant="ghost" className="text-xs">
              OG geral
            </ButtonLink>
          }
        >
          <div className="grid gap-3">
            {rankingBlocks.map((block) => {
              const meta = getRankingMeta(block.kind);
              return (
                <Link
                  key={block.kind}
                  href={`/circulacao/share/ranking/${block.kind}/1x1`}
                  className="group flex items-center justify-between gap-4 border border-white/12 bg-black/18 p-4 transition hover:border-signal/50 hover:bg-signal/10"
                >
                  <span>
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-signal">{meta.label}</span>
                    <span className="mt-1 block font-display text-xl uppercase tracking-[0.06em] text-paper">{meta.title}</span>
                  </span>
                  <Share2 className="h-5 w-5 shrink-0 text-paper/45 transition group-hover:text-signal" />
                </Link>
              );
            })}
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="resumos automaticos por bairro"
          title="Bairro vira unidade de circulacao."
          description="Textos curtos gerados a partir de concentracao, IPTU observado e valor venal estimado."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {rankings.bairrosConcentracao.slice(0, 6).map((bairro) => (
              <article key={bairro.bairro} className="flex min-h-48 flex-col justify-between border border-white/12 bg-black/18 p-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl uppercase leading-7 tracking-[0.07em] text-paper">{bairro.bairro}</h3>
                    <Badge tone="neutral" variant="soft">{`${bairro.registros} registros`}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-5 text-paper/68">{bairro.resumo}</p>
                  {bairro.estrategicos.length > 0 ? (
                    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-signal">imoveis estrategicos</p>
                      {bairro.estrategicos.map((item) => (
                        <div key={`${bairro.bairro}-${item.inscricao}`} className="border border-white/10 bg-black/20 p-2">
                          <p className="text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-paper">{item.endereco}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-paper/48">
                            oficial {money(item.iptu2025)} · estimado {money(item.valorVenal)} · revisao {publicLabel(item.prioridadeRevisao)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href={`/circulacao/share/bairro/${bairroSlug(bairro.bairro)}/1x1`} variant="secondary" className="text-xs">
                    compartilhar
                  </ButtonLink>
                  <ButtonLink href={`/bairros/${bairroSlug(bairro.bairro)}`} variant="ghost" className="text-xs">
                    abrir bairro
                  </ButtonLink>
                  <ButtonLink href="/agir" variant="ghost" className="text-xs">
                    ver acao
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </PanelCard>
      </section>

      <footer className="grid items-center gap-4 border border-white/14 bg-black/32 px-6 py-5 text-[11px] uppercase tracking-[0.16em] text-paper/56 sm:grid-cols-[auto_1fr_auto]">
        <FileText className="h-5 w-5 text-signal" />
        <p>
          Share packs disponiveis por ranking, bairro e imovel. Separacao preservada: oficial, estimado, revisao.
        </p>
        <Link href="/agir" className={cn("inline-flex items-center gap-2 text-signal hover:text-signal-light")}>
          agir agora <ArrowUpRight className="h-4 w-4" />
        </Link>
      </footer>
    </div>
  );
}
