import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getReviewOperationState, saveReviewAction, type ReviewQueueItem, type ReviewSortMode } from "@/lib/data/admin-review";

export const dynamic = "force-dynamic";

interface AdminReviewPageProps {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    ordenar?: string;
    bairro?: string;
  }>;
}

const locationStatusOptions = [
  ["localizacao_confirmada", "confirmada"],
  ["localizacao_aproximada", "aproximada"],
  ["localizacao_ambigua", "ambigua"],
  ["localizacao_pendente", "pendente"],
] as const;

const valueStatusOptions = [
  ["estimativa_confirmada", "confirmar estimativa"],
  ["estimativa_suspensa", "suspender estimativa"],
  ["revisao_manual", "manter revisao manual"],
] as const;

const decisionOptions = [
  ["confirmado", "confirmado"],
  ["suspenso", "suspenso"],
  ["manter_revisao", "manter em revisao"],
] as const;

const sortOptions: Array<{ value: ReviewSortMode; label: string; description: string }> = [
  { value: "inteligencia", label: "inteligencia", description: "impacto politico geral" },
  { value: "impacto_fiscal", label: "impacto fiscal", description: "IPTU + valor venal" },
  { value: "prioridade_revisao", label: "prioridade", description: "alta primeiro" },
  { value: "bairro", label: "bairro", description: "agrupamento territorial" },
  { value: "pronto_para_mapa", label: "mapa", description: "pendentes primeiro" },
];

function isReviewSortMode(value: string | undefined): value is ReviewSortMode {
  return Boolean(value && sortOptions.some((option) => option.value === value));
}

function formatMoney(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "sem dado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function reviewHref(params: { ordenar?: ReviewSortMode; bairro?: string }) {
  const search = new URLSearchParams();

  if (params.ordenar) {
    search.set("ordenar", params.ordenar);
  }

  if (params.bairro) {
    search.set("bairro", params.bairro);
  }

  const query = search.toString();
  return query ? `/admin/revisao?${query}` : "/admin/revisao";
}

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

function flagTone(flag: string): "alert" | "rust" | "yellow" | "neutral" {
  if (flag === "prioridade_revisao_alta") {
    return "alert";
  }

  if (flag === "localizacao_pendente") {
    return "rust";
  }

  if (flag === "localizacao_ambigua") {
    return "yellow";
  }

  return "neutral";
}

function ReviewForm({ item }: { item: ReviewQueueItem }) {
  const override = item.currentOverride;
  const defaultLocationStatus = override?.localizacaoStatus ?? (item.localizacao_status_final === "localizacao_pendente" ? "localizacao_pendente" : "localizacao_ambigua");
  const defaultValueStatus = override?.valorVenalStatus ?? (item.valor_venal_status === "revisao_manual" ? "revisao_manual" : "estimativa_confirmada");

  return (
    <form action={saveReviewAction} className="grid gap-3 tt-card p-3">
      <input type="hidden" name="redirect_to" value="/admin/revisao" />
      <input type="hidden" name="inscricao" value={item.inscricao_imobiliaria} />

      <div className="flex flex-wrap gap-2">
        {item.flags.map((flag) => (
          <Badge key={flag} tone={flagTone(flag)} variant="soft">
            {flag}
          </Badge>
        ))}
        {item.reviewed ? (
          <Badge tone="blue" variant="soft">
            revisado
          </Badge>
        ) : null}
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-paper/45">inscricao</p>
        <h3 className="mt-1 font-display text-2xl uppercase leading-7 tracking-[0.08em] text-paper">{item.inscricao_imobiliaria}</h3>
        <p className="mt-1 text-sm leading-5 text-paper/64">{item.endereco_oficial}</p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          confirmar endereco
          <input name="endereco_confirmado" defaultValue={override?.enderecoConfirmado ?? item.endereco_oficial} className="tt-input text-sm normal-case tracking-normal" />
        </label>
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          confirmar bairro
          <input name="bairro_confirmado" defaultValue={override?.bairroConfirmado ?? item.bairro_oficial} className="tt-input text-sm normal-case tracking-normal" />
        </label>
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          latitude
          <input name="latitude" defaultValue={override?.latitude ?? item.latitude ?? ""} inputMode="decimal" className="tt-input text-sm tracking-normal" />
        </label>
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          longitude
          <input name="longitude" defaultValue={override?.longitude ?? item.longitude ?? ""} inputMode="decimal" className="tt-input text-sm tracking-normal" />
        </label>
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          marcar localizacao
          <select name="localizacao_status" defaultValue={defaultLocationStatus} className="tt-input text-sm tracking-normal">
            {locationStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          valor venal
          <select name="valor_venal_status" defaultValue={defaultValueStatus} className="tt-input text-sm tracking-normal">
            {valueStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-2 md:grid-cols-[180px_180px_minmax(0,1fr)]">
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          decisao
          <select name="decisao" defaultValue={override?.decisao ?? "confirmado"} className="tt-input text-sm tracking-normal">
            {decisionOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          revisado por
          <input name="reviewer" defaultValue={override?.reviewer ?? "equipe"} className="tt-input text-sm normal-case tracking-normal" />
        </label>
        <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-paper/54">
          observacao
          <input name="observacao" defaultValue={override?.observacao ?? ""} placeholder="fonte, criterio ou proximo passo" className="tt-input text-sm normal-case tracking-normal" />
        </label>
      </div>

      <div className="grid gap-2 border-t border-line pt-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid gap-1 text-xs leading-5 text-paper/58 sm:grid-cols-3">
          <span>IPTU 2025: {formatMoney(item.iptu_2025_observado)}</span>
          <span>Valor venal: {formatMoney(item.valor_venal_estimado)}</span>
          <span>{item.publicImpact}</span>
        </div>
        <button type="submit" className="tt-button tt-button-primary justify-center text-xs">
          salvar revisao
        </button>
      </div>
    </form>
  );
}

function CompactReviewItem({ item }: { item: ReviewQueueItem }) {
  return (
    <article className="tt-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-signal">{item.bairro_oficial}</p>
          <p className="mt-1 text-sm font-semibold uppercase leading-5 tracking-[0.08em] text-paper">{item.endereco_oficial}</p>
        </div>
        <Badge tone={item.prioridade_revisao === "alta" ? "alert" : "neutral"} variant="soft">
          {item.prioridade_revisao}
        </Badge>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-paper/50">
        IPTU {formatMoney(item.iptu_2025_observado)} · venal {formatMoney(item.valor_venal_estimado)}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {item.canImproveMap ? <Badge tone="blue" variant="soft">melhora mapa</Badge> : null}
        {item.canResolveAmbiguity ? <Badge tone="yellow" variant="soft">resolve ambiguidade</Badge> : null}
        {item.canCirculate ? <Badge tone="neutral" variant="soft">pode circular</Badge> : null}
      </div>
    </article>
  );
}

export default async function AdminReviewPage({ searchParams }: AdminReviewPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sortMode = isReviewSortMode(resolvedSearchParams?.ordenar) ? resolvedSearchParams.ordenar : "inteligencia";
  const selectedNeighborhood = resolvedSearchParams?.bairro;
  const state = await getReviewOperationState({ sort: sortMode, bairro: selectedNeighborhood });
  const saved = resolvedSearchParams?.saved === "1";
  const error = resolvedSearchParams?.error;

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-6">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.16),rgba(20,25,29,0.95))] px-4 py-3"
        contentClassName="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      >
        <SectionHeader
          eyebrow="operacao de dados"
          title="Revisao prioritaria"
          description="Fila cotidiana para fechar ambiguidades, marcar localizacao e decidir se a estimativa pode circular."
          variant="compact"
        />
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ButtonLink href="/admin" variant="secondary" className="w-full text-xs sm:w-auto">
            Voltar ao admin
          </ButtonLink>
          <ButtonLink href="/mapa?revisao=alta" variant="ghost" className="w-full text-xs sm:w-auto">
            Ver no mapa
          </ButtonLink>
        </div>
      </PanelCard>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="fila foco" value={state.metrics.totalFocus} compact tone="steel" description="itens com revisao necessaria" />
        <MetricCard label="pendentes" value={state.metrics.pending} compact tone={state.metrics.pending > 0 ? "alert" : "default"} description="ainda sem decisao" />
        <MetricCard label="revisados" value={`${state.metrics.reviewed}`} compact tone="blue" description={`${state.metrics.progressPercent}% da fila`} />
        <MetricCard label="mapa melhorado" value={state.metrics.readyForMapAfterReview} compact tone="yellow" description="confirmados com coordenada" />
        <MetricCard label="prioridade alta" value={state.metrics.highPriority} compact tone="rust" description="casos mais urgentes" />
      </div>

      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="localizacao ambigua" value={state.metrics.ambiguousLocation} compact tone="yellow" />
        <MetricCard label="localizacao pendente" value={state.metrics.pendingLocation} compact tone="rust" />
        <MetricCard label="valor venal revisao manual" value={state.metrics.manualValueReview} compact tone="alert" />
        <MetricCard label="liberados mapa" value={state.metrics.releasedForMap} compact tone="blue" />
        <MetricCard label="ambiguidade fechada" value={state.metrics.resolvedAmbiguity} compact tone="yellow" />
        <MetricCard label="liberados circulacao" value={state.metrics.releasedForCirculation} compact tone="steel" />
      </div>

      {saved ? <div className="border border-signal/35 bg-signal/8 px-4 py-3 text-sm text-paper/80">Revisao salva e base publica revalidada.</div> : null}
      {error ? <div className="border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-paper/80">{error}</div> : null}

      <PanelCard
        density="compact"
        tone="strong"
        eyebrow="da revisao para a pauta"
        title="Rotina politica da semana"
        description="Fechar dado aqui precisa produzir consequencia publica: bairro em foco, item no mapa, card de circulacao ou chamada de acao."
        actions={
          <>
            <ButtonLink href="/circulacao" variant="secondary" className="w-full text-xs sm:w-auto">
              Ver circulacao
            </ButtonLink>
            <ButtonLink href="/agir" variant="ghost" className="w-full text-xs sm:w-auto">
              Ver acoes
            </ButtonLink>
          </>
        }
      >
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <div className="grid gap-3 md:grid-cols-2">
            {state.weeklyFocus.neighborhoods.map((group) => (
              <article key={group.bairro} className="tt-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-signal">bairro da semana</p>
                    <h3 className="mt-1 font-display text-2xl uppercase leading-7 tracking-[0.08em] text-paper">{group.bairro}</h3>
                  </div>
                  <Badge tone={group.highPriority > 0 ? "alert" : "neutral"} variant="soft">
                    {group.highPriority} alta
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] uppercase tracking-[0.14em] text-paper/56">
                  <span className="tt-chip px-3 py-2 text-center">{group.pending} pendentes</span>
                  <span className="tt-chip px-3 py-2 text-center">{group.releasedForMap} mapa</span>
                  <span className="tt-chip px-3 py-2 text-center">{group.circulationCandidates} pauta/card</span>
                  <span className="tt-chip px-3 py-2 text-center">{formatMoney(group.fiscalImpact)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ButtonLink href={reviewHref({ ordenar: "inteligencia", bairro: group.bairro })} variant="primary" className="text-xs">
                    revisar
                  </ButtonLink>
                  <ButtonLink href={`/bairros/${bairroSlug(group.bairro)}`} variant="secondary" className="text-xs">
                    bairro
                  </ButtonLink>
                  <ButtonLink href={`/mapa?bairro=${encodeURIComponent(group.bairro)}`} variant="ghost" className="text-xs">
                    mapa
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-3">
            <div className="tt-card p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-signal">recem-fechados</p>
              <div className="mt-3 space-y-2">
                {state.weeklyFocus.newlyClosed.length > 0 ? (
                  state.weeklyFocus.newlyClosed.slice(0, 4).map((item) => (
                    <div key={`closed-${item.inscricao_imobiliaria}`} className="tt-chip p-2">
                      <p className="text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-paper">{item.endereco_oficial}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-paper/48">{item.bairro_oficial} · {item.publicImpact}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-paper/62">Nenhum fechamento recente. Comece pelos bairros da semana.</p>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="tt-card p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-signal">liberados para mapa</p>
                <p className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-paper">{state.weeklyFocus.releasedForMap.length}</p>
                <ButtonLink href="/mapa" variant="secondary" className="mt-3 w-full justify-center text-xs">
                  publicar leitura no mapa
                </ButtonLink>
              </div>
              <div className="tt-card p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-signal">podem virar card ou pauta</p>
                <p className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-paper">{state.weeklyFocus.circulationCandidates.length}</p>
                <ButtonLink href="/circulacao" variant="secondary" className="mt-3 w-full justify-center text-xs">
                  preparar circulacao
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        density="compact"
        eyebrow="ordenacao operacional"
        title="Escolher por onde atacar"
        description="A fila muda conforme o objetivo politico do dia: mapa, bairro, pauta fiscal ou circulacao."
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {sortOptions.map((option) => (
              <ButtonLink
                key={option.value}
                href={reviewHref({ ordenar: option.value, bairro: selectedNeighborhood })}
                variant={sortMode === option.value ? "primary" : "secondary"}
                className="justify-center text-xs"
              >
                {option.label}
              </ButtonLink>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {selectedNeighborhood ? (
              <ButtonLink href={reviewHref({ ordenar: sortMode })} variant="ghost" className="text-xs">
                limpar bairro
              </ButtonLink>
            ) : null}
            <ButtonLink href="/circulacao" variant="ghost" className="text-xs">
              ver circulacao
            </ButtonLink>
          </div>
        </div>
      </PanelCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <PanelCard
          density="compact"
          eyebrow="fila de trabalho"
          title={selectedNeighborhood ? `Fechar ${selectedNeighborhood}` : "Fechar o que melhora mapa, narrativa e circulacao"}
          description="A fila agora considera ordenacao operacional, bairro e impacto publico. Salvar uma revisao registra historico e atualiza a camada aplicada."
        >
          <div className="grid gap-3">
            {state.items.map((item) => (
              <ReviewForm key={item.inscricao_imobiliaria} item={item} />
            ))}
          </div>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard density="compact" eyebrow="visao por bairro" title="Onde concentrar revisao" description="Bairros com mais pendencias aparecem primeiro.">
            <div className="space-y-3">
              {state.byNeighborhood.slice(0, 8).map((group) => (
                <article key={group.bairro} className="tt-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg uppercase tracking-[0.08em] text-paper">{group.bairro}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-paper/50">
                        {group.pending} pendentes · {group.readyForMap}/{group.total} no mapa
                      </p>
                    </div>
                    <Badge tone={group.highPriority > 0 ? "alert" : "neutral"} variant="soft">
                      {group.highPriority} alta
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-paper/48">impacto fiscal {formatMoney(group.fiscalImpact)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ButtonLink href={reviewHref({ ordenar: sortMode, bairro: group.bairro })} variant="secondary" className="text-xs">
                      revisar bairro
                    </ButtonLink>
                    <ButtonLink href={`/mapa?bairro=${encodeURIComponent(group.bairro)}`} variant="ghost" className="text-xs">
                      ver mapa
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </PanelCard>

          <PanelCard density="compact" eyebrow="impacto publico" title="O que melhora fora do admin" description="A revisao deve destravar mapa, narrativa territorial e cards publicos.">
            <div className="space-y-3 text-sm leading-6 text-paper/68">
              <p>{state.metrics.releasedForMap} item(ns) foram liberados para mapa por revisao confirmada com coordenada.</p>
              <p>{state.metrics.resolvedAmbiguity} item(ns) deixaram localizacao ambigua ou pendente.</p>
              <p>{state.metrics.releasedForCirculation} item(ns) ficaram aptos a circular com localizacao e estimativa decididas.</p>
            </div>
          </PanelCard>

          <PanelCard density="compact" eyebrow="historico" title="Ultimas revisoes" description="Trilha curta para auditoria do que mudou.">
            <div className="space-y-3">
              {state.history.length > 0 ? (
                state.history.map((entry) => (
                  <article key={entry.id} className="tt-card p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-signal">{entry.decisao}</p>
                    <p className="mt-1 font-semibold uppercase tracking-[0.08em] text-paper">{entry.inscricao}</p>
                    <p className="mt-1 text-xs leading-5 text-paper/58">{entry.bairroConfirmado} · {entry.localizacaoStatus} · {entry.valorVenalStatus}</p>
                    <p className="mt-2 text-[11px] text-paper/45">{new Date(entry.reviewedAt).toLocaleString("pt-BR")} por {entry.reviewer}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-paper/64">Nenhuma revisao registrada ainda.</p>
              )}
            </div>
          </PanelCard>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <PanelCard density="compact" eyebrow="maior impacto" title="Maiores imoveis para revisar" description="Ordenado por pressao fiscal combinada.">
          <div className="grid gap-3">
            {state.fiscalViews.biggestFiscalImpact.slice(0, 5).map((item) => (
              <CompactReviewItem key={`impact-${item.inscricao_imobiliaria}`} item={item} />
            ))}
          </div>
        </PanelCard>
        <PanelCard density="compact" eyebrow="maior IPTU" title="IPTU 2025 mais alto" description="Dado oficial observado com maior potencial de pauta.">
          <div className="grid gap-3">
            {state.fiscalViews.biggestIptu.slice(0, 5).map((item) => (
              <CompactReviewItem key={`iptu-${item.inscricao_imobiliaria}`} item={item} />
            ))}
          </div>
        </PanelCard>
        <PanelCard density="compact" eyebrow="maior valor venal" title="Estimativas mais fortes" description="Valor estimado alto exige decisao clara antes de circular.">
          <div className="grid gap-3">
            {state.fiscalViews.biggestEstimatedValue.slice(0, 5).map((item) => (
              <CompactReviewItem key={`venal-${item.inscricao_imobiliaria}`} item={item} />
            ))}
          </div>
        </PanelCard>
      </section>
    </div>
  );
}
