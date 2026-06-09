import { ButtonLink } from "@/components/ui/button-link";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SidebarPanel } from "@/components/ui/sidebar-panel";
import { SectionHeader } from "@/components/ui/section-header";
import { getAdminSummary } from "@/lib/data/admin-queries";
import { getReviewOperationState } from "@/lib/data/admin-review";

export const dynamic = "force-dynamic";

function getOperationalStateTone(value: number, priority = false): "alert" | "yellow" | "default" {
  if (value > 0) {
    return priority ? "alert" : "yellow";
  }

  return "default";
}

export default async function AdminPage() {
  const [summary, reviewState] = await Promise.all([getAdminSummary(), getReviewOperationState()]);
  const draftProperties = Math.max(summary.totalProperties - summary.publishedProperties, 0);
  const pendingItems = [
    {
      label: "contribuicoes pendentes",
      value: summary.pendingReports,
      helper: "fila de moderacao",
      tone: getOperationalStateTone(summary.pendingReports, true),
    },
    {
      label: "imoveis em rascunho",
      value: draftProperties,
      helper: "cadastro sem publicacao",
      tone: getOperationalStateTone(draftProperties),
    },
    {
      label: "alta criticidade",
      value: summary.highCriticality,
      helper: "casos que pedem leitura",
      tone: getOperationalStateTone(summary.highCriticality),
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.18),rgba(20,25,29,0.96))] px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      >
        <SectionHeader
          eyebrow="sala de operacao"
          title="Admin operacional"
          description="Acervo, moderacao e publicacao com leitura seca de fila, estado e proximo passo."
          variant="compact"
        />
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ButtonLink href="/admin/contribuicoes" variant={summary.pendingReports > 0 ? "primary" : "secondary"} className="w-full text-xs sm:w-auto">
            Revisar pendencias
          </ButtonLink>
          <ButtonLink href="/admin/revisao" variant={reviewState.metrics.pending > 0 ? "primary" : "secondary"} className="w-full text-xs sm:w-auto">
            Operar revisao
          </ButtonLink>
          <ButtonLink href="/admin/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">
            Abrir acervo
          </ButtonLink>
        </div>
      </PanelCard>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="imoveis cadastrados" value={summary.totalProperties} compact tone="steel" description="base total do acervo" />
        <MetricCard label="imoveis publicados" value={summary.publishedProperties} compact tone="blue" description="visiveis no publico" />
        <MetricCard label="contribuicoes pendentes" value={summary.pendingReports} compact tone={summary.pendingReports > 0 ? "alert" : "default"} description="fila de moderacao" />
        <MetricCard label="revisao de dados" value={reviewState.metrics.pending} compact tone={reviewState.metrics.pending > 0 ? "alert" : "default"} description={`${reviewState.metrics.progressPercent}% da fila fechada`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <PanelCard
            tone={summary.pendingReports > 0 ? "alert" : "default"}
            density="compact"
            eyebrow="pendencias"
            title={summary.pendingReports > 0 ? "Fila operacional pedindo resposta" : "Fila sob controle"}
            description="Pendencias entram primeiro: moderacao, rascunhos e casos mais sensiveis para decisao editorial real."
            actions={
              <ButtonLink href="/admin/contribuicoes" variant={summary.pendingReports > 0 ? "primary" : "secondary"} className="w-full text-xs sm:w-auto">
                Abrir fila
              </ButtonLink>
            }
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {pendingItems.map((item) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  compact
                  tone={item.tone}
                  description={item.helper}
                />
              ))}
            </div>
          </PanelCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <PanelCard
              density="compact"
              eyebrow="revisao prioritaria"
              title="Fila de operacao cotidiana"
              description="Ambiguidades de localizacao, pendencias de mapa, valor venal em revisao manual e prioridade alta entram numa fila propria."
              actions={<ButtonLink href="/admin/revisao" variant={reviewState.metrics.pending > 0 ? "primary" : "secondary"} className="w-full text-xs sm:w-auto">Abrir revisao</ButtonLink>}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">pendentes</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{reviewState.metrics.pending}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">fecham ambiguidade e mapa</p>
                </div>
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">mapa melhorado</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{reviewState.metrics.readyForMapAfterReview}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">com coordenada confirmada</p>
                </div>
              </div>
            </PanelCard>

            <PanelCard
              density="compact"
              eyebrow="acervo"
              title="Gerenciar imoveis"
              description="Cadastro, edicao, publicacao e acesso direto ao editor completo de cada registro."
              actions={<ButtonLink href="/admin/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">Abrir imoveis</ButtonLink>}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">cadastro total</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{summary.totalProperties}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">registros no sistema</p>
                </div>
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">publicados</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{summary.publishedProperties}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">ja expostos no publico</p>
                </div>
              </div>
            </PanelCard>

            <PanelCard
              density="compact"
              eyebrow="moderacao"
              title="Revisar contribuicoes"
              description="Triagem manual de relatos, provas e anexos antes de vincular ou publicar qualquer item."
              actions={<ButtonLink href="/admin/contribuicoes" variant={summary.pendingReports > 0 ? "primary" : "secondary"} className="w-full text-xs sm:w-auto">Abrir fila</ButtonLink>}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">pendentes</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{summary.pendingReports}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">aguardando decisao</p>
                </div>
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">entrada total</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{summary.totalReports}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">contribuicoes registradas</p>
                </div>
              </div>
            </PanelCard>

            <PanelCard
              density="compact"
              eyebrow="mobilizacao"
              title="Acoes e frentes"
              description="As frentes ativas seguem ancoradas no editor do imovel, com CTA, prioridade e links publicos reais."
              actions={<ButtonLink href="/admin/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">Abrir editor de frentes</ButtonLink>}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">acoes ativas</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{summary.activeActions}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">frentes publicadas</p>
                </div>
                <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">alta criticidade</p>
                  <p className="mt-2 font-display text-xl uppercase text-paper">{summary.highCriticality}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">casos para acao imediata</p>
                </div>
              </div>
            </PanelCard>

            <PanelCard
              density="compact"
              eyebrow="acervo auxiliar"
              title="Midia e documentos"
              description="O gancho atual ja existe no editor do imovel: imagens, documentos e dossies entram direto por registro, sem CMS paralelo."
              actions={<ButtonLink href="/admin/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">Abrir editor de acervo</ButtonLink>}
            >
              <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">gancho existente</p>
                <p className="mt-2 text-sm leading-6 text-paper/72">Cada imovel ja possui editor com bloco de midia, documentos, referencias e links de apoio.</p>
              </div>
            </PanelCard>
          </div>
        </div>

        <div className="space-y-4">
          <SidebarPanel title="Comandos" dense tone="command">
            <div className="grid gap-2">
              <ButtonLink href="/admin/imoveis" variant="secondary" className="w-full">
                Gerir imoveis
              </ButtonLink>
              <ButtonLink href="/admin/contribuicoes" variant={summary.pendingReports > 0 ? "primary" : "secondary"} className="w-full">
                Revisar contribuicoes
              </ButtonLink>
              <ButtonLink href="/admin/revisao" variant={reviewState.metrics.pending > 0 ? "primary" : "secondary"} className="w-full">
                Operar revisao de dados
              </ButtonLink>
              <ButtonLink href="/enviar" variant="ghost" className="w-full">
                Ver formulario publico
              </ButtonLink>
            </div>
          </SidebarPanel>

          <SidebarPanel title="Leitura do sistema" dense tone="command">
            <div className="space-y-3">
              <div className="border border-concrete/14 bg-ink-alt/42 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">publicacao</p>
                <p className="mt-2 text-sm leading-6 text-paper/72">{summary.publishedProperties}/{summary.totalProperties} imoveis estao publicados no acervo publico.</p>
              </div>
              <div className="border border-concrete/14 bg-ink-alt/42 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">moderacao</p>
                <p className="mt-2 text-sm leading-6 text-paper/72">{summary.pendingReports > 0 ? "A fila pede decisao manual antes de qualquer publicacao." : "Sem contribuicoes pendentes neste momento."}</p>
              </div>
              <div className="border border-concrete/14 bg-ink-alt/42 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">revisao de base</p>
                <p className="mt-2 text-sm leading-6 text-paper/72">{reviewState.metrics.pending > 0 ? `${reviewState.metrics.pending} itens ainda precisam fechar endereco, bairro, localizacao ou estimativa.` : "Fila de revisao prioritaria zerada."}</p>
              </div>
              <div className="border border-concrete/14 bg-ink-alt/42 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">estrutura</p>
                <p className="mt-2 text-sm leading-6 text-paper/72">Sem permissao nova e sem CMS complexo: o fluxo continua nas rotas administrativas e ganchos ja existentes.</p>
              </div>
            </div>
          </SidebarPanel>
        </div>
      </div>
    </div>
  );
}
