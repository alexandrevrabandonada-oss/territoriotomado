"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Link2,
  Link2Off,
  Image as ImageIcon,
  Sliders,
  AlertCircle,
  UploadCloud,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import type { AdminCompleteBaseProperty } from "@/lib/data/admin-queries";
import type { AdminPropertyEditorData } from "@/lib/data/admin-queries";
import {
  linkPropertyToSignalAction,
  updatePropertyTitleAction,
  createAndLinkPropertyAction,
  deleteQuickImageAction,
  setQuickImageCoverAction
} from "@/lib/data/admin-actions";
import { uploadQuickImageAction } from "@/lib/data/admin-media-actions";

interface PropertiesMesaOperacionalProps {
  initialRecords: AdminCompleteBaseProperty[];
  editorialProperties: AdminPropertyEditorData[];
}

type FilterType =
  | "todos"
  | "vinculados"
  | "sem_vinculo"
  | "com_foto"
  | "sem_foto"
  | "publicados"
  | "rascunhos"
  | "prontos_mapa"
  | "prioridade_alta";

export function PropertiesMesaOperacional({
  initialRecords,
  editorialProperties
}: PropertiesMesaOperacionalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state for records list (to enable instant optimistic UI updates)
  const [records, setRecords] = useState<AdminCompleteBaseProperty[]>(initialRecords);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AdminCompleteBaseProperty | null>(null);

  // Quick form states
  const [quickTitle, setQuickTitle] = useState("");
  const [linkPropId, setLinkPropId] = useState("");
  const [newPropTitle, setNewPropTitle] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Find the currently open record inside the state to ensure we show fresh data
  const activeRecord = useMemo(() => {
    if (!selectedRecord) return null;
    return records.find((r) => r.inscricaoImobiliaria === selectedRecord.inscricaoImobiliaria) || selectedRecord;
  }, [selectedRecord, records]);

  // Open Drawer and initialize form fields
  const handleOpenDrawer = (record: AdminCompleteBaseProperty) => {
    setSelectedRecord(record);
    setQuickTitle(record.property?.title || "");
    setLinkPropId("");
    setNewPropTitle("");
    setUploadError("");
    setActionError("");
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecord(null);
  };

  // Helper to update a single record in the local state
  const updateLocalRecord = (inscricao: string, updatedFields: Partial<AdminCompleteBaseProperty>) => {
    setRecords((prev) =>
      prev.map((r) => (r.inscricaoImobiliaria === inscricao ? { ...r, ...updatedFields } : r))
    );
  };

  // 1. Link to an existing Property
  const handleLinkProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord || !linkPropId) return;

    setIsSubmitting(true);
    setActionError("");

    const result = await linkPropertyToSignalAction(activeRecord.inscricaoImobiliaria, linkPropId);
    
    if (result.success) {
      // Find the property we just linked
      const matchedProperty = editorialProperties.find((p) => p.id === linkPropId);
      if (matchedProperty) {
        updateLocalRecord(activeRecord.inscricaoImobiliaria, {
          propertyId: linkPropId,
          property: {
            id: matchedProperty.id,
            title: matchedProperty.title,
            slug: matchedProperty.slug,
            isPublic: matchedProperty.isPublic || false,
            images: [], // empty images initially, will fetch on next reload or render
          }
        });
      }
      setLinkPropId("");
      startTransition(() => {
        router.refresh();
      });
    } else {
      setActionError(result.error || "Erro ao vincular imóvel.");
    }
    setIsSubmitting(false);
  };

  // 2. Unlink Property
  const handleUnlinkProperty = async () => {
    if (!activeRecord) return;
    if (!confirm(`Deseja realmente desvincular o imóvel "${activeRecord.property?.title}"?`)) return;

    setIsSubmitting(true);
    setActionError("");

    const result = await linkPropertyToSignalAction(activeRecord.inscricaoImobiliaria, null);

    if (result.success) {
      updateLocalRecord(activeRecord.inscricaoImobiliaria, {
        propertyId: null,
        property: null
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setActionError(result.error || "Erro ao desvincular.");
    }
    setIsSubmitting(false);
  };

  // 3. Create a new Property and Link immediately
  const handleCreateAndLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord || !newPropTitle.trim()) return;

    setIsSubmitting(true);
    setActionError("");

    const result = await createAndLinkPropertyAction(activeRecord.inscricaoImobiliaria, newPropTitle.trim());

    if (result.success && result.propertyId) {
      updateLocalRecord(activeRecord.inscricaoImobiliaria, {
        propertyId: result.propertyId,
        property: {
          id: result.propertyId,
          title: newPropTitle.trim(),
          slug: newPropTitle.trim().toLowerCase().replace(/\s+/g, "-"),
          isPublic: false,
          images: []
        }
      });
      setQuickTitle(newPropTitle.trim());
      setNewPropTitle("");
      startTransition(() => {
        router.refresh();
      });
    } else {
      setActionError(result.error || "Erro ao criar e vincular.");
    }
    setIsSubmitting(false);
  };

  // 4. Update Title (Editorial Name)
  const handleUpdateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord || !activeRecord.property || !quickTitle.trim()) return;

    setIsSubmitting(true);
    setActionError("");

    const result = await updatePropertyTitleAction(activeRecord.property.id, quickTitle.trim());

    if (result.success) {
      updateLocalRecord(activeRecord.inscricaoImobiliaria, {
        property: {
          ...activeRecord.property,
          title: quickTitle.trim()
        }
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setActionError(result.error || "Erro ao atualizar nome.");
    }
    setIsSubmitting(false);
  };

  // 5. Simple Photo Upload to Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!activeRecord || !activeRecord.property || !file) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("property_id", activeRecord.property.id);
    formData.append("image_file", file);
    formData.append("caption", `Foto - ${activeRecord.enderecoOficial}`);
    formData.append("is_cover", "true"); // default upload as cover
    formData.append("is_public", "true");

    const result = await uploadQuickImageAction(formData);

    if (result.success && result.image) {
      const newImage = {
        id: result.image.id,
        imageUrl: result.image.image_url,
        storagePath: result.image.storage_path,
        isCover: result.image.is_cover ?? false,
        position: result.image.position ?? 0
      };

      // If this was cover, make all other images of this property non-cover
      const updatedImages = activeRecord.property.images.map((img) =>
        result.image.is_cover ? { ...img, isCover: false } : img
      );

      updateLocalRecord(activeRecord.inscricaoImobiliaria, {
        property: {
          ...activeRecord.property,
          images: [newImage, ...updatedImages]
        }
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setUploadError(result.error || "Erro ao enviar foto.");
    }
    setIsUploading(false);
    e.target.value = ""; // reset file input
  };

  // 6. Set Photo as Cover
  const handleSetCover = async (imageId: string) => {
    if (!activeRecord || !activeRecord.property) return;

    setIsSubmitting(true);
    const result = await setQuickImageCoverAction(activeRecord.property.id, imageId);

    if (result.success) {
      const updatedImages = activeRecord.property.images.map((img) => ({
        ...img,
        isCover: img.id === imageId
      }));
      updateLocalRecord(activeRecord.inscricaoImobiliaria, {
        property: {
          ...activeRecord.property,
          images: updatedImages
        }
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setActionError(result.error || "Erro ao definir capa.");
    }
    setIsSubmitting(false);
  };

  // 7. Delete Photo
  const handleDeletePhoto = async (imageId: string) => {
    if (!activeRecord || !activeRecord.property) return;
    if (!confirm("Deseja realmente excluir esta imagem?")) return;

    setIsSubmitting(true);
    const result = await deleteQuickImageAction(activeRecord.property.id, imageId);

    if (result.success) {
      const updatedImages = activeRecord.property.images.filter((img) => img.id !== imageId);
      updateLocalRecord(activeRecord.inscricaoImobiliaria, {
        property: {
          ...activeRecord.property,
          images: updatedImages
        }
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setActionError(result.error || "Erro ao excluir foto.");
    }
    setIsSubmitting(false);
  };

  // Filtered and searched records list
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // 1. Text Search Match
      const search = searchQuery.toLowerCase().trim();
      const matchText =
        !search ||
        rec.inscricaoImobiliaria.toLowerCase().includes(search) ||
        rec.enderecoOficial.toLowerCase().includes(search) ||
        rec.bairroOficial.toLowerCase().includes(search) ||
        (rec.property?.title && rec.property.title.toLowerCase().includes(search)) ||
        (rec.property?.slug && rec.property.slug.toLowerCase().includes(search));

      if (!matchText) return false;

      // 2. Quick Filters Match
      switch (activeFilter) {
        case "vinculados":
          return rec.propertyId !== null;
        case "sem_vinculo":
          return rec.propertyId === null;
        case "com_foto":
          return rec.propertyId !== null && (rec.property?.images?.length ?? 0) > 0;
        case "sem_foto":
          return rec.propertyId === null || (rec.property?.images?.length ?? 0) === 0;
        case "publicados":
          return rec.propertyId !== null && rec.property?.isPublic === true;
        case "rascunhos":
          return rec.propertyId !== null && rec.property?.isPublic === false;
        case "prontos_mapa":
          return rec.prontoParaMapa === true;
        case "prioridade_alta":
          return rec.prioridadeRevisao === "alta";
        case "todos":
        default:
          return true;
      }
    });
  }, [records, searchQuery, activeFilter]);

  // Statistics calculation for KPI cards
  const stats = useMemo(() => {
    const total = records.length;
    const linked = records.filter((r) => r.propertyId !== null).length;
    const unlinked = total - linked;
    const published = records.filter((r) => r.property?.isPublic === true).length;
    const drafts = records.filter((r) => r.property !== null && r.property?.isPublic === false).length;
    const readyForMap = records.filter((r) => r.prontoParaMapa === true).length;
    const priorityHigh = records.filter((r) => r.prioridadeRevisao === "alta").length;
    const hasPhoto = records.filter((r) => r.property !== null && (r.property?.images?.length ?? 0) > 0).length;

    return { total, linked, unlinked, published, drafts, readyForMap, priorityHigh, hasPhoto };
  }, [records]);

  // Dropdown list filtering to show only editorial properties that are NOT linked yet
  // plus the property linked to the active row if any (so it shows up in select)
  const availablePropertiesToLink = useMemo(() => {
    const alreadyLinkedIds = new Set(
      records.map((r) => r.propertyId).filter(Boolean) as string[]
    );
    
    return editorialProperties.filter((p) => {
      if (activeRecord && activeRecord.propertyId === p.id) {
        return true; // keep currently linked property in the option list
      }
      return !alreadyLinkedIds.has(p.id);
    });
  }, [records, editorialProperties, activeRecord]);

  return (
    <div className="space-y-4">
      {/* 1. Header operacional de estatísticas */}
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
        <MetricCard label="Base Total" value={stats.total} tone="default" compact />
        <MetricCard label="Vinculados" value={stats.linked} tone="blue" compact />
        <MetricCard label="Sem Vínculo" value={stats.unlinked} tone="rust" compact />
        <MetricCard label="Publicados" value={stats.published} tone="yellow" compact />
        <MetricCard label="Rascunhos" value={stats.drafts} tone="muted" compact />
        <MetricCard label="Pronto Mapa" value={stats.readyForMap} tone="steel" compact />
        <MetricCard label="Prioritários" value={stats.priorityHigh} tone="alert" compact />
        <MetricCard label="Com Foto" value={stats.hasPhoto} tone="default" compact />
      </div>

      {/* 2. Barra de busca e filtros rápidos */}
      <div className="tt-panel p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-paper/40" />
          <input
            type="text"
            placeholder="Pesquisar por nome editorial, inscrição, endereço ou bairro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tt-input pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtros rápidos horizontal scrollable */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] uppercase tracking-[0.18em] text-paper/40 mr-2">Filtros:</span>
          {(
            [
              { id: "todos", label: `Todos (${stats.total})` },
              { id: "vinculados", label: `Vinculados (${stats.linked})` },
              { id: "sem_vinculo", label: `Sem Vínculo (${stats.unlinked})` },
              { id: "com_foto", label: `Com Foto (${stats.hasPhoto})` },
              { id: "sem_foto", label: `Sem Foto (${stats.total - stats.hasPhoto})` },
              { id: "publicados", label: `Publicados (${stats.published})` },
              { id: "rascunhos", label: `Rascunhos (${stats.drafts})` },
              { id: "prontos_mapa", label: `Mapa (${stats.readyForMap})` },
              { id: "prioridade_alta", label: `Prioridade Alta (${stats.priorityHigh})` }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] border transition ${
                activeFilter === item.id
                  ? "bg-signal text-ink-deep border-signal"
                  : "bg-[rgba(18,24,28,0.6)] text-[#f2f4ef]/70 border-[rgba(144,164,174,0.22)] hover:border-[rgba(144,164,174,0.5)] hover:text-[#f2f4ef]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tabela Operacional Densa */}
      <div className="tt-table-container max-h-[75vh] overflow-auto">
        <table className="tt-table">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2.5">Foto</th>
              <th className="px-3 py-2.5">Nome Editorial</th>
              <th className="px-3 py-2.5">Inscrição</th>
              <th className="px-3 py-2.5">Endereço Oficial</th>
              <th className="px-3 py-2.5">Bairro</th>
              <th className="px-3 py-2.5 text-center">Status Final</th>
              <th className="px-3 py-2.5 text-center">Mapa</th>
              <th className="px-3 py-2.5 text-center">Prioridade</th>
              <th className="px-3 py-2.5 text-center">Vínculo</th>
              <th className="px-3 py-2.5 text-center">Publicado</th>
              <th className="px-3 py-2.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((row) => {
                const coverImage = row.property?.images?.find((img) => img.isCover) || row.property?.images?.[0];
                return (
                  <tr
                    key={row.inscricaoImobiliaria}
                    className="group"
                  >
                    {/* Foto */}
                    <td className="px-3 py-2 align-middle">
                      {coverImage ? (
                        <div className="relative h-9 w-9 overflow-hidden border border-concrete/22 bg-ink">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coverImage.imageUrl}
                            alt={row.property?.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-9 w-9 border border-concrete/10 bg-ink/40 flex items-center justify-center text-paper/20">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </td>

                    {/* Nome Editorial */}
                    <td
                      onClick={() => handleOpenDrawer(row)}
                      className="px-3 py-2 align-middle font-semibold text-paper hover:text-signal cursor-pointer"
                    >
                      {row.property ? (
                        <span className="uppercase tracking-[0.04em]">{row.property.title}</span>
                      ) : (
                        <span className="text-paper/40 italic">Não associado</span>
                      )}
                    </td>

                    {/* Inscrição */}
                    <td className="px-3 py-2 align-middle font-mono text-paper/70 tracking-wider">
                      {row.inscricaoImobiliaria}
                    </td>

                    {/* Endereço */}
                    <td className="px-3 py-2 align-middle text-paper/72 max-w-[200px] truncate">
                      {row.enderecoOficial}
                    </td>

                    {/* Bairro */}
                    <td className="px-3 py-2 align-middle text-paper/70">
                      {row.bairroOficial}
                    </td>

                    {/* Localização status final */}
                    <td className="px-3 py-2 align-middle text-center">
                      <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-sm bg-paper/6 text-paper/60">
                        {row.localizacaoStatusFinal || "Pendente"}
                      </span>
                    </td>

                    {/* Pronto para Mapa */}
                    <td className="px-3 py-2 align-middle text-center">
                      {row.prontoParaMapa ? (
                        <Badge tone="blue" className="text-[8px] px-1.5 py-0">Sim</Badge>
                      ) : (
                        <Badge tone="neutral" className="text-[8px] px-1.5 py-0 text-paper/40">Não</Badge>
                      )}
                    </td>

                    {/* Prioridade de revisão */}
                    <td className="px-3 py-2 align-middle text-center">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] uppercase font-extrabold tracking-wider ${
                          row.prioridadeRevisao === "alta"
                            ? "text-signal-light"
                            : row.prioridadeRevisao === "media"
                            ? "text-paper/70"
                            : "text-paper/35"
                        }`}
                      >
                        {row.prioridadeRevisao || "média"}
                      </span>
                    </td>

                    {/* Vínculo */}
                    <td className="px-3 py-2 align-middle text-center">
                      {row.property ? (
                        <span className="text-glass-cold flex items-center justify-center gap-1">
                          <Link2 className="h-3 w-3" />
                          <span className="uppercase text-[9px] font-bold">Sim</span>
                        </span>
                      ) : (
                        <span className="text-rust-light flex items-center justify-center gap-1">
                          <Link2Off className="h-3 w-3" />
                          <span className="uppercase text-[9px] font-bold">Não</span>
                        </span>
                      )}
                    </td>

                    {/* Publicado */}
                    <td className="px-3 py-2 align-middle text-center">
                      {row.property ? (
                        row.property.isPublic ? (
                          <Badge tone="yellow" className="text-[8px] px-1.5 py-0">Sim</Badge>
                        ) : (
                          <Badge tone="neutral" className="text-[8px] px-1.5 py-0 text-paper/50">Rascunho</Badge>
                        )
                      ) : (
                        <span className="text-paper/20">—</span>
                      )}
                    </td>

                    {/* Ação */}
                    <td className="px-3 py-2 align-middle text-right">
                      <button
                        onClick={() => handleOpenDrawer(row)}
                        className="inline-flex items-center gap-1 border border-[rgba(144,164,174,0.22)] bg-[rgba(18,24,28,0.45)] px-2.5 py-1 text-[10px] uppercase font-bold text-[#f2f4ef]/80 hover:border-signal hover:text-signal transition"
                      >
                        <Sliders className="h-3 w-3" />
                        Operar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-paper/45">
                  Nenhum registro encontrado correspondente aos critérios de busca ou filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Backdrop e Lateral Drawer */}
      {isDrawerOpen && activeRecord && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            onClick={handleCloseDrawer}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[var(--background-alt)] border-l border-line-strong shadow-panel backdrop-blur-md flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-[rgba(18,24,28,0.5)]">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-signal font-semibold">
                    Painel Operacional
                  </p>
                  <h3 className="font-display text-lg uppercase tracking-[0.08em] text-[#f2f4ef] truncate max-w-[300px]">
                    Inscrição: {activeRecord.inscricaoImobiliaria}
                  </h3>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-1.5 text-paper/60 hover:text-paper hover:bg-paper/10 transition rounded-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                {/* 1. Fiscal Info Card */}
                <div className="tt-card p-4 space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.18em] text-paper/50 font-bold border-b border-concrete/10 pb-1.5">
                    Dados Fiscais Territoriais
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="text-paper/45 uppercase text-[9px] tracking-wider">Endereço:</span>
                    <span className="col-span-2 text-paper/85 font-semibold text-[11px] leading-tight">
                      {activeRecord.enderecoOficial}
                    </span>

                    <span className="text-paper/45 uppercase text-[9px] tracking-wider">Bairro:</span>
                    <span className="col-span-2 text-paper/80 font-semibold text-[11px]">
                      {activeRecord.bairroOficial}
                    </span>

                    <span className="text-paper/45 uppercase text-[9px] tracking-wider">Localização:</span>
                    <span className="col-span-2 text-paper/80 font-mono text-[10px]">
                      {activeRecord.latitude ? `${activeRecord.latitude.toFixed(5)}, ${activeRecord.longitude?.toFixed(5)}` : "Não mapeado"}
                    </span>
                    
                    <span className="text-paper/45 uppercase text-[9px] tracking-wider">Status Mapa:</span>
                    <span className="col-span-2">
                      <Badge tone={activeRecord.prontoParaMapa ? "blue" : "neutral"} className="text-[8px] py-0 px-1">
                        {activeRecord.prontoParaMapa ? "Pronto no mapa" : "Pendente"}
                      </Badge>
                    </span>
                  </div>
                </div>

                {/* 2. Vínculo Editorial controller */}
                <div className="space-y-3 border-t border-concrete/12 pt-5">
                  <h4 className="text-[11px] uppercase tracking-[0.18em] text-paper/85 font-bold flex items-center gap-1.5">
                    <Link2 className="h-4 w-4 text-signal" />
                    Vínculo com Acervo Editorial
                  </h4>

                  {actionError && (
                    <div className="border border-rust/30 bg-rust/10 p-2 text-xs text-paper/90 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rust-light shrink-0" />
                      <span>{actionError}</span>
                    </div>
                  )}

                  {activeRecord.property ? (
                    // Linked view
                    <div className="space-y-4">
                      <div className="p-3 border border-glass/20 bg-steel/10 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wider text-glass-cold font-bold">
                            Ficha Vinculada
                          </p>
                          <p className="text-xs uppercase font-extrabold text-paper tracking-wide">
                            {activeRecord.property.title}
                          </p>
                        </div>
                        <button
                          onClick={handleUnlinkProperty}
                          disabled={isSubmitting}
                          className="tt-button tt-button-danger text-[9px] py-1 px-2.5 h-auto min-h-0"
                        >
                          <Link2Off className="h-3 w-3" />
                          Desvincular
                        </button>
                      </div>

                      {/* Rename Editorial Title */}
                      <form onSubmit={handleUpdateTitle} className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-wider text-paper/60 font-bold">
                          Editar Nome Editorial
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            required
                            placeholder="Nome de exibição no mapa..."
                            className="tt-input flex-1 py-1.5"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting || quickTitle.trim() === activeRecord.property.title}
                            className="tt-button tt-button-primary px-3 text-xs tracking-wider transition disabled:opacity-40 min-h-0 h-auto"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>

                      {/* Full editor link */}
                      <div className="pt-2">
                        <a
                          href={`/admin/imoveis/${activeRecord.property.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="tt-button tt-button-secondary w-full text-center"
                        >
                          Abrir Editor Editorial Completo
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    // Unlinked view: allow linking or creating
                    <div className="space-y-5 bg-ink/20 p-4 border border-concrete/10">
                      <p className="text-xs text-paper/62 leading-relaxed">
                        Este registro fiscal não possui ficha editorial vinculada. Escolha uma ficha existente ou crie uma nova para habilitar fotos e textos.
                      </p>

                      {/* A. Link to existing property dropdown */}
                      <form onSubmit={handleLinkProperty} className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-wider text-paper/60 font-bold">
                          Vincular a Ficha Existente
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={linkPropId}
                            onChange={(e) => setLinkPropId(e.target.value)}
                            className="tt-input flex-1 py-1.5"
                            required
                          >
                            <option value="">-- Selecione uma Ficha --</option>
                            {availablePropertiesToLink.map((prop) => (
                              <option key={prop.id} value={prop.id}>
                                {prop.title} ({prop.neighborhoodName || "Bairro N/A"})
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            disabled={isSubmitting || !linkPropId}
                            className="tt-button tt-button-primary px-3 text-xs tracking-wider transition disabled:opacity-40 min-h-0 h-auto"
                          >
                            Vincular
                          </button>
                        </div>
                      </form>

                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-concrete/10"></div>
                        <span className="flex-shrink mx-3 text-[8px] uppercase tracking-widest text-paper/30 font-bold">OU</span>
                        <div className="flex-grow border-t border-concrete/10"></div>
                      </div>

                      {/* B. Create new property and link */}
                      <form onSubmit={handleCreateAndLink} className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-wider text-paper/60 font-bold">
                          Criar Ficha Editorial Nova
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nome para novo imóvel editorial..."
                            value={newPropTitle}
                            onChange={(e) => setNewPropTitle(e.target.value)}
                            required
                            className="tt-input flex-1 py-1.5"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting || !newPropTitle.trim()}
                            className="tt-button tt-button-secondary px-3 text-xs tracking-wider transition disabled:opacity-40 min-h-0 h-auto"
                          >
                            Criar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* 3. Media management (only visible if linked) */}
                {activeRecord.property && (
                  <div className="space-y-4 border-t border-concrete/12 pt-5">
                    <h4 className="text-[11px] uppercase tracking-[0.18em] text-paper/85 font-bold flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-signal" />
                      Fotos Editorial / Capa
                    </h4>

                    {uploadError && (
                      <div className="border border-rust/35 bg-rust/10 p-2 text-xs text-paper/85 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rust-light shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    {/* Quick photo upload button */}
                    <div className="flex items-center justify-center border border-dashed border-concrete/18 bg-ink/10 p-4 hover:bg-ink/30 transition relative cursor-pointer group">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        disabled={isUploading || isSubmitting}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      <div className="text-center space-y-1.5 flex flex-col items-center pointer-events-none">
                        <UploadCloud className={`h-6 w-6 ${isUploading ? "animate-pulse text-signal" : "text-paper/40 group-hover:text-signal transition"}`} />
                        <p className="text-[10px] uppercase font-bold tracking-wider text-paper/70">
                          {isUploading ? "Enviando arquivo..." : "Clique para fazer Upload"}
                        </p>
                        <p className="text-[8px] uppercase tracking-wider text-paper/40">
                          JPEG, PNG ou WebP. Define como capa automaticamente.
                        </p>
                      </div>
                    </div>

                    {/* Image gallery grid inside drawer */}
                    {activeRecord.property.images && activeRecord.property.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {activeRecord.property.images.map((image) => (
                          <div
                            key={image.id}
                            className={`tt-card border p-1 relative flex flex-col justify-between group/img ${
                              image.isCover ? "border-signal" : "border-concrete/10"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image.imageUrl}
                              alt="Property Thumbnail"
                              className="h-24 w-full object-cover bg-ink"
                            />
                            
                            {image.isCover && (
                              <span className="absolute top-2 left-2 bg-signal text-ink-deep text-[8px] font-extrabold uppercase px-1 py-0.5 tracking-wider">
                                Capa
                              </span>
                            )}

                            {/* Image control buttons */}
                            <div className="flex mt-1.5 justify-between gap-1">
                              {!image.isCover ? (
                                <button
                                  onClick={() => handleSetCover(image.id)}
                                  disabled={isSubmitting || isUploading}
                                  className="tt-button tt-button-secondary text-[8px] py-1 flex-1 min-h-0 h-auto"
                                >
                                  Capa
                                </button>
                              ) : (
                                <span className="flex-1 bg-signal/15 text-signal text-[8px] font-bold uppercase py-1 tracking-wider text-center">
                                  Capa Ativa
                                </span>
                              )}
                              <button
                                onClick={() => handleDeletePhoto(image.id)}
                                disabled={isSubmitting || isUploading}
                                className="tt-button tt-button-danger text-[8px] py-1 px-2.5 min-h-0 h-auto"
                                title="Excluir Imagem"
                              >
                                <Trash2 className="h-3 w-3 text-center" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border border-concrete/8 bg-ink/10 text-paper/40 text-xs">
                        Nenhuma foto cadastrada neste imóvel.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer status bar */}
              <div className="px-5 py-3 border-t border-concrete/12 bg-concrete/5 flex items-center justify-between text-[10px] text-paper/40">
                <span>Inscrição Única</span>
                {isPending && <span className="animate-pulse text-signal uppercase tracking-wider">Sincronizando...</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
