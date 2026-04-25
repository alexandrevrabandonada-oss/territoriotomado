import { SectionHeader } from "@/components/ui/section-header";
import { PropertyEditorForm } from "@/components/admin/property-editor-form";
import { savePropertyAction } from "@/lib/data/admin-actions";
import { getAdminPropertyOptions } from "@/lib/data/admin-queries";

export const dynamic = "force-dynamic";

interface NewPropertyPageProps {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
}

export default async function NewPropertyPage({ searchParams }: NewPropertyPageProps) {
  const options = await getAdminPropertyOptions();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const notice = resolvedSearchParams?.saved === "1" ? "Imovel criado com sucesso." : resolvedSearchParams?.error;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-5 sm:py-10 lg:px-8 lg:py-14">
      <SectionHeader
        eyebrow="novo imovel"
        title="Cadastro editorial minimo"
        description="Use este formulario para criar um registro real no Supabase com leitura publica, rascunho e publicacao controlada."
      />
      <PropertyEditorForm
        action={savePropertyAction}
        options={options}
        redirectTo="/admin/imoveis/novo"
        heading="Registro novo"
        submitLabel="Salvar imovel"
        notice={notice}
      />
    </div>
  );
}
