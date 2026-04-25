import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { FilterGroup } from "@/components/ui/filter-group";
import type { PublishedPropertyOption } from "@/lib/data/public-queries";
import { contributionReportOptions, contributionReportLabelByValue } from "@/lib/data/contribution-options";
import { submitContributionAction } from "@/lib/data/contribution-actions";

interface ContributionIntakeFormProps {
  properties: PublishedPropertyOption[];
  defaultPropertyId?: string;
  notice?: string;
  sent?: boolean;
}

export function ContributionIntakeForm({ properties, defaultPropertyId, notice, sent }: ContributionIntakeFormProps) {
  return (
    <form action={submitContributionAction} encType="multipart/form-data" className="tt-panel space-y-5 p-5 sm:p-6 lg:p-7">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-signal">participacao moderada</p>
          <p className="max-w-2xl text-sm text-paper/65">
            Todo envio entra como pendente. A equipe revisa antes de qualquer publicacao ou uso no acervo.
          </p>
        </div>
        <Badge kind="moderation" value={sent ? "aprovado" : "pendente"}>{sent ? "enviado" : "pendente"}</Badge>
      </div>

      {notice ? <div className="border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-paper/80">{notice}</div> : null}
      {sent ? <div className="border border-signal/35 bg-signal/8 px-4 py-3 text-sm text-paper/80">Contribuicao recebida. Ela entrou na fila de moderacao.</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <FilterGroup label="Tipo de envio">
          <select name="report_type" defaultValue="foto" className="tt-input px-4 py-3 text-sm" required>
            {contributionReportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="block text-[11px] font-normal uppercase tracking-[0.16em] text-paper/45">
            {contributionReportOptions.map((option) => contributionReportLabelByValue[option.value]).join(" | ")}
          </span>
        </FilterGroup>

        <FilterGroup label="Imovel relacionado">
          <select
            name="property_id"
            defaultValue={defaultPropertyId ?? ""}
            className="tt-input px-4 py-3 text-sm"
          >
            <option value="">Sem vinculo exato, para triagem posterior</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title} - {property.neighborhoodName}
              </option>
            ))}
          </select>
        </FilterGroup>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Nome ou coletivo
          <input name="author_name" className="tt-input px-4 py-3 text-sm" placeholder="Opcional" />
        </label>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
          Contato
          <input name="contact" className="tt-input px-4 py-3 text-sm" placeholder="Opcional" />
        </label>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Titulo curto
          <input name="title" className="tt-input px-4 py-3 text-sm" placeholder="Ex.: Foto da fachada em abril de 2026" required />
        </label>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Relato, atualização ou prova
          <textarea
            name="content"
            rows={6}
            className="tt-input px-4 py-3 text-sm"
            placeholder="Descreva o que aconteceu, o que mudou ou o que o arquivo comprova."
            required
          />
        </label>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Pista para triagem
          <textarea
            name="reference_hint"
            rows={3}
            className="tt-input px-4 py-3 text-sm"
            placeholder="Rua, esquina, marco visual, nome alternativo ou qualquer pista que ajude a localizar."
          />
        </label>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Link de referencia
          <input
            name="source_url"
            type="url"
            className="tt-input px-4 py-3 text-sm"
            placeholder="https://"
          />
        </label>

        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 lg:col-span-2">
          Anexo
          <input
            name="attachment"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            className="block w-full text-sm text-paper/70 file:mr-4 file:border file:border-glass/34 file:bg-steel/20 file:px-4 file:py-3 file:text-xs file:font-semibold file:uppercase file:tracking-[0.16em] file:text-paper hover:file:bg-steel/30"
          />
          <span className="block text-[11px] font-normal uppercase tracking-[0.16em] text-paper/45">JPEG, PNG, WebP ou PDF ate 12 MB. O arquivo fica privado ate a moderacao.</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-concrete/16 pt-5">
        <button type="submit" className="tt-button tt-button-primary">
          Enviar para moderacao
        </button>
        <ButtonLink href="/imoveis" variant="secondary">
          Ver imoveis
        </ButtonLink>
      </div>
    </form>
  );
}
