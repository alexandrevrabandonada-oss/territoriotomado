import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getAdminProperties } from "@/lib/data/admin-queries";

export const dynamic = "force-dynamic";

interface AdminPropertiesPageProps {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
}

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const propertyList = await getAdminProperties();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const saved = resolvedSearchParams?.saved === "1";
  const error = resolvedSearchParams?.error;
  const publishedCount = propertyList.filter((property) => property.isPublic).length;
  const draftCount = propertyList.length - publishedCount;

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-6">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.16),rgba(20,25,29,0.95))] px-4 py-3"
        contentClassName="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      >
        <SectionHeader
          eyebrow="acervo interno"
          title="Imoveis"
          description="Cadastro, leitura e publicacao em uma mesa seca de operacao editorial."
          variant="compact"
        />
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ButtonLink href="/admin" variant="secondary" className="w-full text-xs sm:w-auto">
            Voltar ao admin
          </ButtonLink>
          <ButtonLink href="/admin/imoveis/novo" className="w-full text-xs sm:w-auto">
            Novo imovel
          </ButtonLink>
        </div>
      </PanelCard>

      <div className="grid gap-2 sm:grid-cols-3">
        <MetricCard label="imoveis cadastrados" value={propertyList.length} compact tone="steel" />
        <MetricCard label="publicados" value={publishedCount} compact tone="blue" />
        <MetricCard label="rascunhos" value={draftCount} compact tone={draftCount > 0 ? "yellow" : "default"} />
      </div>

      {saved ? <div className="border border-signal/35 bg-signal/8 px-4 py-3 text-sm text-paper/80">Registro salvo com sucesso.</div> : null}
      {error ? <div className="border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-paper/80">{error}</div> : null}

      {propertyList.length > 0 ? (
        <PanelCard
          density="compact"
          eyebrow="quadro operacional"
          title="Registros do acervo"
          description="Tabela direta para leitura rapida, estado de publicacao e acesso ao editor de cada imovel."
        >
          <div className="overflow-x-auto overflow-y-hidden border border-concrete/18">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-concrete/12 text-[11px] uppercase tracking-[0.18em] text-paper/55">
                <tr>
                  <th className="px-3 py-3.5">Imovel</th>
                  <th className="px-3 py-3.5">Bairro</th>
                  <th className="px-3 py-3.5">Estado</th>
                  <th className="px-3 py-3.5">Publicacao</th>
                  <th className="px-3 py-3.5 text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {propertyList.map((property) => (
                  <tr key={property.id} className="border-t border-concrete/14 bg-concrete/6 text-paper/78">
                    <td className="px-3 py-3.5 align-top">
                      <div className="space-y-1">
                        <p className="font-semibold uppercase tracking-[0.06em] text-paper">{property.title}</p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-paper/45">{property.slug}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 align-top text-sm text-paper/72">{property.neighborhoodName}</td>
                    <td className="px-3 py-3.5 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Badge kind="status" value={property.status} />
                        <Badge kind="criticality" value={property.criticality} />
                      </div>
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      <Badge tone={property.isPublic ? "blue" : "neutral"}>{property.isPublic ? "publicado" : "rascunho"}</Badge>
                    </td>
                    <td className="px-3 py-3.5 align-top text-right">
                      <ButtonLink href={`/admin/imoveis/${property.id}`} variant="secondary" className="text-xs">
                        Editar
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      ) : (
        <EmptyState
          eyebrow="acervo vazio"
          title="Nenhum imovel cadastrado"
          description="O quadro ainda nao tem registros para operar. Crie o primeiro imovel para iniciar cadastro, publicacao e revisao interna."
          actionLabel="Criar primeiro imovel"
          actionHref="/admin/imoveis/novo"
        />
      )}
    </div>
  );
}
