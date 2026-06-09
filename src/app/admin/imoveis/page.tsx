import { ButtonLink } from "@/components/ui/button-link";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getAdminCompleteBaseProperties, getAdminProperties } from "@/lib/data/admin-queries";
import { PropertiesMesaOperacional } from "@/components/admin/properties-mesa-operacional";

export const dynamic = "force-dynamic";

interface AdminPropertiesPageProps {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
}

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const [completeBaseList, allEditorialProperties] = await Promise.all([
    getAdminCompleteBaseProperties(),
    getAdminProperties()
  ]);

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const saved = resolvedSearchParams?.saved === "1";
  const error = resolvedSearchParams?.error;

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-6">
      {/* 1. Header principal da Mesa Operacional */}
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.16),rgba(20,25,29,0.95))] px-4 py-3"
        contentClassName="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      >
        <SectionHeader
          eyebrow="base patrimonial unificada"
          title="Mesa Operacional de Imóveis"
          description="Controle e revisão de todos os 197 registros fiscais, mapeamento rápido e conexões de fotos ao acervo editorial."
          variant="compact"
        />
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ButtonLink href="/admin" variant="secondary" className="w-full text-xs sm:w-auto">
            Voltar ao admin
          </ButtonLink>
          <ButtonLink href="/admin/imoveis/novo" className="w-full text-xs sm:w-auto">
            Novo imóvel editorial
          </ButtonLink>
        </div>
      </PanelCard>

      {/* 2. Alertas de Sucesso/Erro */}
      {saved ? (
        <div className="border border-signal/35 bg-signal/8 px-4 py-3 text-sm text-paper/80 font-bold uppercase tracking-wider text-center">
          Operação concluída com sucesso.
        </div>
      ) : null}
      {error ? (
        <div className="border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-paper/80 font-bold uppercase tracking-wider text-center">
          {error}
        </div>
      ) : null}

      {/* 3. Painel da Mesa Operacional com Busca, Filtros e Drawer */}
      <PropertiesMesaOperacional
        initialRecords={completeBaseList}
        editorialProperties={allEditorialProperties}
      />
    </div>
  );
}
