import { notFound } from "next/navigation";
import { PropertyMediaManager } from "@/components/admin/property-media-manager";
import { PropertyActionLinksManager } from "@/components/admin/property-action-links-manager";
import { SectionHeader } from "@/components/ui/section-header";
import { PropertyEditorForm } from "@/components/admin/property-editor-form";
import { savePropertyAction } from "@/lib/data/admin-actions";
import { getAdminPropertyActions, getAdminPropertyById, getAdminPropertyOptions } from "@/lib/data/admin-queries";
import { getAdminPropertyMedia } from "@/lib/data/admin-media-queries";

export const dynamic = "force-dynamic";

interface AdminPropertyEditPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
}

export default async function AdminPropertyEditPage({ params, searchParams }: AdminPropertyEditPageProps) {
  const { id } = await params;
  const [property, options, media, actions] = await Promise.all([
    getAdminPropertyById(id),
    getAdminPropertyOptions(),
    getAdminPropertyMedia(id),
    getAdminPropertyActions(id),
  ]);

  if (!property) {
    notFound();
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const notice = resolvedSearchParams?.saved === "1" ? "Imovel atualizado com sucesso." : resolvedSearchParams?.error;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-5 sm:py-10 lg:px-8 lg:py-14">
      <SectionHeader
        eyebrow="editar imovel"
        title={property.title}
        description="Edicao direta do registro editorial, com publicacao controlada e sem CMS intermediario."
      />
      <PropertyEditorForm
        action={savePropertyAction}
        options={options}
        property={property}
        redirectTo={`/admin/imoveis/${property.id}`}
        heading="Registro existente"
        submitLabel="Salvar alteracoes"
        notice={notice}
      />
      <PropertyMediaManager propertyId={property.id} propertySlug={property.slug} propertyTitle={property.title} media={media} />
      <PropertyActionLinksManager propertyId={property.id} propertySlug={property.slug} propertyTitle={property.title} actions={actions} />
    </div>
  );
}
