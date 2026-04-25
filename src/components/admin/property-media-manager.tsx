import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { documentTypeOptions, getDocumentTypeLabel } from "@/lib/data/document-types";
import type { AdminPropertyMediaBundle } from "@/lib/data/admin-media-queries";
import {
  deletePropertyDocumentAction,
  deletePropertyImageAction,
  savePropertyDocumentAction,
  savePropertyImageAction,
  uploadPropertyDocumentAction,
  uploadPropertyImageAction,
} from "@/lib/data/admin-media-actions";

interface PropertyMediaManagerProps {
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  media: AdminPropertyMediaBundle;
}

export function PropertyMediaManager({ propertyId, propertySlug, propertyTitle, media }: PropertyMediaManagerProps) {
  const redirectTo = `/admin/imoveis/${propertyId}`;

  return (
    <section className="space-y-8 border border-paper/10 bg-paper/5 p-5 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-signal">midia editorial</p>
        <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-paper">Galeria, capa e documentos</h2>
        <p className="max-w-3xl text-sm leading-6 text-paper/65">
          Upload simples, ordem editorial e publicacao controlada. O que for publico aparece na ficha sem etapas extras.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="space-y-5 border border-paper/10 bg-ink/35 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg uppercase tracking-[0.12em] text-paper">Imagens</h3>
            <Badge tone="muted">{media.images.length}</Badge>
          </div>

          <form action={uploadPropertyImageAction} encType="multipart/form-data" className="space-y-4 border border-paper/10 bg-paper/4 p-4">
            <input type="hidden" name="property_id" value={propertyId} />
            <input type="hidden" name="redirect_to" value={redirectTo} />
            <input type="hidden" name="alt_fallback" value={propertyTitle} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Arquivo da imagem
                <input
                  name="image_file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="block w-full text-sm text-paper/70 file:mr-4 file:border-0 file:bg-paper/10 file:px-4 file:py-3 file:text-xs file:font-semibold file:uppercase file:tracking-[0.16em] file:text-paper hover:file:bg-paper/15"
                  required
                />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Legenda
                <input name="caption" className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Crédito / fonte
                <input name="credit" className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                Ordem
                <input name="position" type="number" min="0" step="1" defaultValue={0} className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" />
              </label>
              <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                <input name="is_cover" type="checkbox" className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
                Capa
              </label>
              <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                <input name="is_public" type="checkbox" defaultChecked className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
                Publicar
              </label>
            </div>
            <button type="submit" className="inline-flex items-center justify-center bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85">
              Enviar imagem
            </button>
          </form>

          <div className="space-y-4">
            {media.images.length > 0 ? (
              media.images.map((image) => (
                <article key={image.id} className="space-y-4 border border-paper/10 bg-paper/4 p-4">
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                    <div className="overflow-hidden border border-paper/10 bg-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.previewUrl} alt={image.altText} className="h-36 w-full object-cover" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={image.isCover ? "critical" : "muted"}>{image.isCover ? "capa" : "imagem"}</Badge>
                        <Badge tone={image.isPublic ? "default" : "muted"}>{image.isPublic ? "publica" : "oculta"}</Badge>
                      </div>
                      <p className="text-sm uppercase tracking-[0.12em] text-paper">{image.caption || image.altText}</p>
                      {image.credit ? <p className="text-xs uppercase tracking-[0.16em] text-paper/50">{image.credit}</p> : null}
                      <p className="text-xs uppercase tracking-[0.16em] text-paper/40">{image.storagePath ? "Storage" : "URL externa"}</p>
                    </div>
                  </div>

                  <form action={savePropertyImageAction} className="space-y-4 border-t border-paper/10 pt-4">
                    <input type="hidden" name="property_id" value={propertyId} />
                    <input type="hidden" name="image_id" value={image.id} />
                    <input type="hidden" name="redirect_to" value={redirectTo} />
                    <input type="hidden" name="alt_fallback" value={image.altText} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                        Legenda
                        <input
                          name="caption"
                          defaultValue={image.caption ?? image.altText}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                        Crédito / fonte
                        <input
                          name="credit"
                          defaultValue={image.credit ?? ""}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                        Ordem
                        <input
                          name="position"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={image.position}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                        />
                      </label>
                      <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                        <input name="is_cover" type="checkbox" defaultChecked={image.isCover} className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
                        Capa
                      </label>
                      <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                        <input name="is_public" type="checkbox" defaultChecked={image.isPublic} className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
                        Publica
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="inline-flex items-center justify-center bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85">
                        Salvar
                      </button>
                      <button
                        type="submit"
                        formAction={deletePropertyImageAction}
                        className="inline-flex items-center justify-center border border-paper/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-paper/75 transition hover:border-paper/30 hover:text-paper"
                      >
                        Excluir
                      </button>
                    </div>
                  </form>
                </article>
              ))
            ) : (
              <div className="border border-paper/10 bg-paper/4 p-4 text-sm text-paper/65">Nenhuma imagem cadastrada.</div>
            )}
          </div>
        </article>

        <article className="space-y-5 border border-paper/10 bg-ink/35 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg uppercase tracking-[0.12em] text-paper">Documentos</h3>
            <Badge tone="muted">{media.documents.length}</Badge>
          </div>

          <form action={uploadPropertyDocumentAction} encType="multipart/form-data" className="space-y-4 border border-paper/10 bg-paper/4 p-4">
            <input type="hidden" name="property_id" value={propertyId} />
            <input type="hidden" name="redirect_to" value={redirectTo} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Arquivo do documento
                <input
                  name="document_file"
                  type="file"
                  accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf"
                  className="block w-full text-sm text-paper/70 file:mr-4 file:border-0 file:bg-paper/10 file:px-4 file:py-3 file:text-xs file:font-semibold file:uppercase file:tracking-[0.16em] file:text-paper hover:file:bg-paper/15"
                  required
                />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Titulo
                <input name="title" className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" required />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                Tipo do documento
                <select name="document_type" className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" required>
                  {documentTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                Ordem
                <input name="position" type="number" min="0" step="1" defaultValue={0} className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Resumo curto
                <textarea name="summary" rows={3} className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                Source URL opcional
                <input name="source_url" type="url" className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal" />
              </label>
              <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                <input name="is_public" type="checkbox" className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
                Publico
              </label>
            </div>
            <button type="submit" className="inline-flex items-center justify-center bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85">
              Enviar documento
            </button>
          </form>

          <div className="space-y-4">
            {media.documents.length > 0 ? (
              media.documents.map((document) => (
                <article key={document.id} className="space-y-4 border border-paper/10 bg-paper/4 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={document.isPublic ? "default" : "muted"}>{document.isPublic ? "publico" : "privado"}</Badge>
                        <Badge tone="muted">{getDocumentTypeLabel(document.documentType)}</Badge>
                      </div>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-paper">{document.title}</h4>
                      <p className="text-xs uppercase tracking-[0.16em] text-paper/45">{document.fileName ?? "arquivo do documento"}</p>
                    </div>
                    {document.previewUrl ? (
                      <a href={document.previewUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-[0.16em] text-signal transition hover:text-signal-light">
                        Abrir
                      </a>
                    ) : null}
                  </div>

                  <form action={savePropertyDocumentAction} className="space-y-4 border-t border-paper/10 pt-4">
                    <input type="hidden" name="property_id" value={propertyId} />
                    <input type="hidden" name="document_id" value={document.id} />
                    <input type="hidden" name="redirect_to" value={redirectTo} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                        Titulo
                        <input
                          name="title"
                          defaultValue={document.title}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                        Tipo
                        <select
                          name="document_type"
                          defaultValue={document.documentType}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                          required
                        >
                          {documentTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                        Ordem
                        <input
                          name="position"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={document.position}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                        Resumo curto
                        <textarea
                          name="summary"
                          rows={3}
                          defaultValue={document.summary ?? ""}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65 sm:col-span-2">
                        Source URL opcional
                        <input
                          name="source_url"
                          type="url"
                          defaultValue={document.sourceUrl ?? ""}
                          className="w-full border border-paper/10 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                        />
                      </label>
                      <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                        <input name="is_public" type="checkbox" defaultChecked={document.isPublic} className="h-4 w-4 border border-paper/20 bg-ink text-signal focus:ring-signal" />
                        Publico
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="inline-flex items-center justify-center bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85">
                        Salvar
                      </button>
                      <button
                        type="submit"
                        formAction={deletePropertyDocumentAction}
                        className="inline-flex items-center justify-center border border-paper/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-paper/75 transition hover:border-paper/30 hover:text-paper"
                      >
                        Excluir
                      </button>
                    </div>
                  </form>
                </article>
              ))
            ) : (
              <div className="border border-paper/10 bg-paper/4 p-4 text-sm text-paper/65">Nenhum documento cadastrado.</div>
            )}
          </div>
        </article>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <ButtonLink href={`/imoveis/${propertySlug}`} variant="secondary">
          Ver ficha publica
        </ButtonLink>
      </div>
    </section>
  );
}
