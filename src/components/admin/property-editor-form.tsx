import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import type { AdminPropertyEditorData, AdminPropertyFormOptions } from "@/lib/data/admin-queries";
import type { Property } from "@/types/domain";
import { Badge } from "@/components/ui/badge";

interface PropertyEditorFormProps {
  action: (formData: FormData) => Promise<void>;
  options: AdminPropertyFormOptions;
  property?: AdminPropertyEditorData | null;
  redirectTo: string;
  heading: string;
  submitLabel: string;
  notice?: string;
}

const propertyTypeLabels: Record<NonNullable<Property["propertyType"]>, string> = {
  clube: "Clube",
  galpao: "Galpao",
  "casa-tecnica": "Casa tecnica",
  terreno: "Terreno",
  outro: "Outro",
};

export function PropertyEditorForm({ action, options, property, redirectTo, heading, submitLabel, notice }: PropertyEditorFormProps) {
  const isPublic = property?.isPublic ?? true;

  return (
    <form action={action} className="space-y-6 border border-paper/10 bg-paper/5 p-5 sm:p-6 lg:p-8">
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <input type="hidden" name="property_id" value={property?.id ?? ""} />
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-signal">{heading}</p>
          <p className="text-sm text-paper/65">Preenchimento direto, sem camadas extras de CMS.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge tone={property?.inscricaoImobiliaria ? "blue" : "rust"}>{property?.inscricaoImobiliaria ? "vinculo oficial" : "sem inscricao"}</Badge>
          <Badge tone={isPublic ? "default" : "muted"}>{isPublic ? "publicado" : "rascunho"}</Badge>
        </div>
      </div>

      {notice ? <div className="border border-signal/35 bg-signal/8 px-4 py-3 text-sm text-paper/80">{notice}</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Titulo
          <input name="title" defaultValue={property?.title ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Slug
          <input name="slug" defaultValue={property?.slug ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Endereco
          <input name="address" defaultValue={property?.address ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          inscricao_imobiliaria oficial
          <input
            name="inscricao_imobiliaria"
            list="fiscal-signal-options"
            defaultValue={property?.inscricaoImobiliaria ?? ""}
            className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
            placeholder="ex.: 1.110.0007/000-0"
          />
          <datalist id="fiscal-signal-options">
            {options.fiscalSignals.map((signal) => (
              <option key={signal.inscricao} value={signal.inscricao}>
                {`${signal.bairro} - ${signal.endereco}${signal.propertyId && signal.propertyId !== property?.id ? " - ja vinculado" : ""}`}
              </option>
            ))}
          </datalist>
          <span className="block text-[11px] normal-case leading-5 tracking-normal text-paper/48">
            Use a inscricao da base fiscal final. Corrigir este campo faz ficha, mapa, revisao e circulacao priorizarem o mesmo registro remoto.
          </span>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Bairro
          <select name="neighborhood_id" defaultValue={property?.neighborhoodId ?? options.neighborhoods[0]?.id ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required>
            {options.neighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            Latitude
            <input name="latitude" type="number" step="0.000001" defaultValue={property?.lat ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            Longitude
            <input name="longitude" type="number" step="0.000001" defaultValue={property?.lng ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
          </label>
        </div>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Tipo
          <select name="property_type" defaultValue={property?.propertyType ?? "outro"} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required>
            {options.propertyTypes.map((type) => (
              <option key={type} value={type}>
                {propertyTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Status
          <select name="current_status" defaultValue={property?.status ?? "vazio"} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required>
            {options.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Criticidade
          <select name="criticality" defaultValue={property?.criticality ?? "media"} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required>
            {options.criticalities.map((criticality) => (
              <option key={criticality} value={criticality}>
                {criticality}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            localizacao_status_final
            <select name="localizacao_status_final" defaultValue={property?.locationStatus ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal">
              <option value="">derivar automaticamente</option>
              <option value="confirmada">confirmada</option>
              <option value="aproximada">aproximada</option>
              <option value="ambigua">ambigua</option>
              <option value="pendente">pendente</option>
            </select>
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            pronto_para_mapa
            <select name="pronto_para_mapa" defaultValue={typeof property?.readyForMap === "boolean" ? (property.readyForMap ? "sim" : "nao") : ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal">
              <option value="">derivar automaticamente</option>
              <option value="sim">sim</option>
              <option value="nao">nao</option>
            </select>
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            prioridade_revisao
            <select name="prioridade_revisao" defaultValue={property?.priorityReview ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal">
              <option value="">derivar automaticamente</option>
              <option value="alta">alta</option>
              <option value="media">media</option>
              <option value="baixa">baixa</option>
            </select>
          </label>
        </div>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Resumo
          <textarea name="excerpt" defaultValue={property?.excerpt ?? ""} rows={3} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Descricao
          <textarea name="description" defaultValue={property?.description ?? ""} rows={5} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Contexto historico
          <textarea name="historical_context" defaultValue={property?.historicalContext ?? ""} rows={4} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Potencial de uso social
          <textarea name="social_use_potential" defaultValue={property?.socialUsePotential ?? ""} rows={4} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" required />
        </label>
        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            Entrar na frente
            <input
              name="mission_url"
              type="url"
              defaultValue={property?.missionUrl ?? ""}
              className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
              placeholder="https://..."
            />
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            Ir para comunidade
            <input
              name="community_url"
              type="url"
              defaultValue={property?.communityUrl ?? ""}
              className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
              placeholder="https://..."
            />
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            Ver dossiê
            <input
              name="dossier_url"
              type="url"
              defaultValue={property?.dossierUrl ?? ""}
              className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
              placeholder="https://..."
            />
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
            Referência externa
            <input
              name="external_reference_url"
              type="url"
              defaultValue={property?.externalReferenceUrl ?? ""}
              className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
              placeholder="https://..."
            />
          </label>
        </div>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Uso atual
          <input name="current_use" defaultValue={property?.currentUse ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Area estimada
          <input name="area_estimate" defaultValue={property?.areaEstimate ?? ""} className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal" />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Notas legais
          <textarea
            name="legal_notes"
            defaultValue={(property?.legalNotes ?? []).join("\n")}
            rows={4}
            className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
            placeholder="Uma nota por linha"
          />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Tags
          <input
            name="tags"
            defaultValue={(property?.tags ?? []).join(", ")}
            className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
            placeholder="Separadas por virgula"
          />
        </label>
        <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          <input name="is_public" type="checkbox" defaultChecked={isPublic} className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
          Publicado
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-paper/10 pt-5">
        <button type="submit" className="inline-flex items-center justify-center bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85">
          {submitLabel}
        </button>
        <ButtonLink href="/admin/imoveis" variant="secondary">
          Voltar
        </ButtonLink>
        <Link href="/mapa" className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55 transition hover:text-paper">
          Ver mapa
        </Link>
      </div>
    </form>
  );
}
