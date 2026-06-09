"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PROPERTY_DOC_BUCKET, PROPERTY_IMAGE_BUCKET } from "@/lib/data/media-constants";
import {
  getContributionEditorialDestinationLabel,
  inferContributionMediaTarget,
  isContributionEditorialDestination,
} from "@/lib/data/contribution-editorial";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PropertyReportType } from "@/types/domain";

interface ContributionModerationRow {
  id: string;
  property_id: string | null;
  report_type: PropertyReportType;
  editorial_destination: "relato_publico" | "timeline" | "media" | null;
  title: string | null;
  content: string;
  author_name: string | null;
  contact: string | null;
  source_url: string | null;
  reference_hint: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_mime_type: string | null;
  attachment_size: number | null;
  moderation_status: "pendente" | "aprovado" | "rejeitado";
  rejection_reason: string | null;
  reviewed_at: string | null;
}

function requireAdminClient() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada.");
  }

  return supabase;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key) === "on" || getString(formData, key) === "true";
}

function getOptionalEnum(formData: FormData, key: string, allowed: string[]) {
  const value = getString(formData, key);
  return value && allowed.includes(value) ? value : null;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function buildStoragePath(folder: string, fileName: string) {
  return `moderation/${folder}/${Date.now()}-${randomUUID()}-${sanitizeFileName(fileName)}`;
}

async function getContributionById(supabase: ReturnType<typeof requireAdminClient>, reportId: string): Promise<ContributionModerationRow | null> {
  const { data, error } = await supabase
    .from("property_reports")
    .select(
      "id, property_id, report_type, editorial_destination, title, content, author_name, contact, source_url, reference_hint, attachment_path, attachment_name, attachment_mime_type, attachment_size, moderation_status, rejection_reason, reviewed_at",
    )
    .eq("id", reportId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getNextPosition(
  supabase: ReturnType<typeof requireAdminClient>,
  table: "property_images" | "property_documents" | "property_timeline",
  propertyId: string,
) {
  const { data, error } = await supabase
    .from(table)
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.position ?? -1) + 1;
}

async function hasCoverImage(supabase: ReturnType<typeof requireAdminClient>, propertyId: string) {
  const { data, error } = await supabase
    .from("property_images")
    .select("id")
    .eq("property_id", propertyId)
    .eq("is_cover", true)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).length > 0;
}

async function createImageFromContribution(supabase: ReturnType<typeof requireAdminClient>, report: NonNullable<Awaited<ReturnType<typeof getContributionById>>>, propertyId: string) {
  const position = await getNextPosition(supabase, "property_images", propertyId);
  const coverExists = await hasCoverImage(supabase, propertyId);
  const altText = report.title || report.reference_hint || report.content.slice(0, 120) || "Imagem editorial";
  if (report.attachment_path && report.attachment_name && report.attachment_mime_type) {
    if (!report.attachment_mime_type.startsWith("image/")) {
      throw new Error("Anexo precisa ser uma imagem para virar imagem editorial.");
    }

    const download = await supabase.storage.from("report-attachments").download(report.attachment_path);

    if (download.error || !download.data) {
      throw new Error(download.error?.message ?? "Nao foi possivel ler o anexo da contribuicao.");
    }

    const storagePath = buildStoragePath("images", report.attachment_name);
    const upload = await supabase.storage.from(PROPERTY_IMAGE_BUCKET).upload(
      storagePath,
      new Uint8Array(await download.data.arrayBuffer()),
      {
        contentType: report.attachment_mime_type,
        upsert: false,
      },
    );

    if (upload.error) {
      throw new Error(upload.error.message);
    }

    const { data: publicUrl } = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(storagePath);
    const { data: inserted, error } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        image_url: publicUrl.publicUrl,
        alt_text: altText,
        caption: report.title || null,
        credit: report.author_name || report.contact || null,
        storage_path: storagePath,
        is_public: true,
        is_cover: !coverExists,
        position,
        source_report_id: report.id,
      })
      .select("id")
      .single();

    if (error || !inserted?.id) {
      await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([storagePath]);
      throw new Error(error?.message ?? "Nao foi possivel criar a imagem editorial.");
    }

    return {
      storagePath,
      insertedId: inserted.id,
    };
  }

  if (!report.source_url) {
    throw new Error("Contribuicao sem anexo ou link nao pode virar imagem.");
  }

  const { data: inserted, error } = await supabase
    .from("property_images")
    .insert({
      property_id: propertyId,
      image_url: report.source_url,
      alt_text: altText,
      caption: report.title || null,
      credit: report.author_name || report.contact || null,
      storage_path: null,
      is_public: true,
      is_cover: !coverExists,
      position,
      source_report_id: report.id,
    })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    throw new Error(error?.message ?? "Nao foi possivel criar a imagem editorial.");
  }

  return {
    storagePath: null,
    insertedId: inserted.id,
  };
}

async function createDocumentFromContribution(
  supabase: ReturnType<typeof requireAdminClient>,
  report: NonNullable<Awaited<ReturnType<typeof getContributionById>>>,
  propertyId: string,
) {
  const targetDocumentType =
    report.report_type === "relato"
      ? "memoria"
      : report.report_type === "denuncia"
        ? "oficio"
        : report.report_type === "atualizacao"
          ? "analise territorial"
          : "outro";

  const position = await getNextPosition(supabase, "property_documents", propertyId);
  const basePayload = {
    property_id: propertyId,
    title: report.title || report.reference_hint || "Documento editorial",
    summary: report.content.slice(0, 220),
    document_type: targetDocumentType,
    published_year: null,
    document_url: report.source_url || null,
    storage_path: null as string | null,
    file_name: report.attachment_name || null,
    source_url: report.source_url || null,
    is_public: true,
    position,
    source_report_id: report.id,
  };

  if (report.attachment_path && report.attachment_name && report.attachment_mime_type) {
    const download = await supabase.storage.from("report-attachments").download(report.attachment_path);

    if (download.error || !download.data) {
      throw new Error(download.error?.message ?? "Nao foi possivel ler o anexo da contribuicao.");
    }

    const storagePath = buildStoragePath("docs", report.attachment_name);
    const upload = await supabase.storage.from(PROPERTY_DOC_BUCKET).upload(
      storagePath,
      new Uint8Array(await download.data.arrayBuffer()),
      {
        contentType: report.attachment_mime_type,
        upsert: false,
      },
    );

    if (upload.error) {
      throw new Error(upload.error.message);
    }

    const { data: inserted, error } = await supabase
      .from("property_documents")
      .insert({
        ...basePayload,
        document_url: null,
        storage_path: storagePath,
      })
      .select("id")
      .single();

    if (error || !inserted?.id) {
      await supabase.storage.from(PROPERTY_DOC_BUCKET).remove([storagePath]);
      throw new Error(error?.message ?? "Nao foi possivel criar o documento editorial.");
    }

    return {
      storagePath,
      insertedId: inserted.id,
    };
  }

  const { data: inserted, error } = await supabase.from("property_documents").insert(basePayload).select("id").single();

  if (error || !inserted?.id) {
    throw new Error(error?.message ?? "Nao foi possivel criar o documento editorial.");
  }

  return {
    storagePath: null,
    insertedId: inserted.id,
  };
}

async function createTimelineFromContribution(
  supabase: ReturnType<typeof requireAdminClient>,
  report: NonNullable<Awaited<ReturnType<typeof getContributionById>>>,
  propertyId: string,
) {
  const position = await getNextPosition(supabase, "property_timeline", propertyId);
  const { data, error } = await supabase
    .from("property_timeline")
    .insert({
      property_id: propertyId,
      event_year: null,
      title: report.title || "Registro editorial",
      description: report.content,
      position,
      source_report_id: report.id,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(error?.message ?? "Nao foi possivel criar o item de timeline.");
  }

  return data.id;
}

function redirectWithError(target: string, message: string): never {
  redirect(`${target}?error=${encodeURIComponent(message)}`);
}

export async function savePropertyAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const inscricaoImobiliaria = getString(formData, "inscricao_imobiliaria") || null;
  const address = getString(formData, "address");
  const neighborhoodId = getString(formData, "neighborhood_id");
  const propertyType = getString(formData, "property_type");
  const currentStatus = getString(formData, "current_status");
  const criticality = getString(formData, "criticality");
  const excerpt = getString(formData, "excerpt");
  const description = getString(formData, "description");
  const historicalContext = getString(formData, "historical_context");
  const socialUsePotential = getString(formData, "social_use_potential");
  const currentUse = getString(formData, "current_use");
  const areaEstimate = getString(formData, "area_estimate");
  const missionUrl = getString(formData, "mission_url");
  const communityUrl = getString(formData, "community_url");
  const dossierUrl = getString(formData, "dossier_url");
  const externalReferenceUrl = getString(formData, "external_reference_url");
  const locationStatusFinal = getOptionalEnum(formData, "localizacao_status_final", ["confirmada", "aproximada", "ambigua", "pendente"]);
  const priorityReview = getOptionalEnum(formData, "prioridade_revisao", ["alta", "media", "baixa"]);
  const readyForMapRaw = getString(formData, "pronto_para_mapa");
  const readyForMap = readyForMapRaw === "" ? null : readyForMapRaw === "sim";
  const latitude = getNumber(formData, "latitude");
  const longitude = getNumber(formData, "longitude");
  const isPublic = getBoolean(formData, "is_public");
  const legalNotes = getString(formData, "legal_notes")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const tags = getString(formData, "tags")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const { data: currentProperty } = propertyId
    ? await supabase.from("properties").select("slug, inscricao_imobiliaria").eq("id", propertyId).maybeSingle()
    : { data: null };
  const previousSlug = currentProperty?.slug ?? null;
  const previousInscricao = currentProperty?.inscricao_imobiliaria ?? null;

  if (!title || !slug || !address || !neighborhoodId || !propertyType || !currentStatus || !criticality || !excerpt || !description) {
    redirectWithError(target, "Preencha os campos obrigatorios.");
  }

  if (latitude === null || longitude === null) {
    redirectWithError(target, "Coordenadas invalidas.");
  }

  const basePayload = {
    title,
    slug,
    inscricao_imobiliaria: inscricaoImobiliaria,
    address,
    neighborhood_id: neighborhoodId,
    property_type: propertyType,
    current_status: currentStatus,
    criticality,
    excerpt,
    description,
    historical_context: historicalContext,
    social_use_potential: socialUsePotential,
    current_use: currentUse,
    area_estimate: areaEstimate,
    mission_url: missionUrl || null,
    community_url: communityUrl || null,
    dossier_url: dossierUrl || null,
    external_reference_url: externalReferenceUrl || null,
    latitude,
    longitude,
    legal_notes: legalNotes,
    tags,
    is_public: isPublic,
  };
  const payload = {
    ...basePayload,
    localizacao_status_final: locationStatusFinal,
    prioridade_revisao: priorityReview,
    pronto_para_mapa: readyForMap,
  };

  let savedId = propertyId;

  if (propertyId) {
    const { error } = await supabase.from("properties").update(payload).eq("id", propertyId);

    if (error) {
      const retry = await supabase.from("properties").update(basePayload).eq("id", propertyId);

      if (retry.error) {
        redirectWithError(target, error.message);
      }
    }
  } else {
    const { data, error } = await supabase.from("properties").insert(payload).select("id").single();
    let insertedData = data;

    if (error) {
      const retry = await supabase.from("properties").insert(basePayload).select("id").single();

      if (retry.error) {
        redirectWithError(target, error.message);
      }

      insertedData = retry.data;
    }

    const insertedId = insertedData?.id;

    if (!insertedId) {
      redirectWithError(target, "Nao foi possivel criar o imovel.");
    }

    savedId = insertedId;
  }

  if (savedId) {
    if (previousInscricao && previousInscricao !== inscricaoImobiliaria) {
      await supabase.from("property_fiscal_signals").update({ property_id: null }).eq("inscricao_imobiliaria", previousInscricao).eq("property_id", savedId);
    }

    if (inscricaoImobiliaria) {
      const { error: linkError } = await supabase
        .from("property_fiscal_signals")
        .update({ property_id: savedId })
        .eq("inscricao_imobiliaria", inscricaoImobiliaria);

      if (linkError) {
        redirectWithError(target, `Imovel salvo, mas falhou ao vincular inscricao: ${linkError.message}`);
      }
    }
  }

  revalidatePath("/admin/imoveis");
  revalidatePath("/admin");
  revalidatePath("/imoveis");
  revalidatePath("/mapa");
  revalidatePath(`/imoveis/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/imoveis/${previousSlug}`);
  }

  redirect(`${savedId ? `/admin/imoveis/${savedId}` : target}?saved=1`);
}

export async function savePropertyActionLinksAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const actionId = getString(formData, "action_id");
  const missionUrl = getString(formData, "mission_url");
  const communityUrl = getString(formData, "community_url");
  const dossierUrl = getString(formData, "dossier_url");
  const externalReferenceUrl = getString(formData, "external_reference_url");

  if (!propertyId || !actionId) {
    redirectWithError(target, "Ação inválida.");
  }

  const { data: propertyRow, error: propertyError } = await supabase
    .from("properties")
    .select("slug, neighborhoods(slug)")
    .eq("id", propertyId)
    .maybeSingle();

  if (propertyError) {
    redirectWithError(target, propertyError.message);
  }

  const { error } = await supabase
    .from("property_actions")
    .update({
      mission_url: missionUrl || null,
      community_url: communityUrl || null,
      dossier_url: dossierUrl || null,
      external_reference_url: externalReferenceUrl || null,
    })
    .eq("id", actionId)
    .eq("property_id", propertyId);

  if (error) {
    redirectWithError(target, error.message);
  }

  const neighborhoodRecord = Array.isArray(propertyRow?.neighborhoods) ? propertyRow?.neighborhoods[0] : propertyRow?.neighborhoods;

  revalidatePath("/agir");
  revalidatePath("/imoveis");
  if (propertyRow?.slug) {
    revalidatePath(`/imoveis/${propertyRow.slug}`);
  }
  if (neighborhoodRecord?.slug) {
    revalidatePath(`/bairros/${neighborhoodRecord.slug}`);
  }

  redirect(`${target}?saved=1`);
}

export async function moderateContributionAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/contribuicoes";
  const reportId = getString(formData, "report_id");
  const decision = getString(formData, "decision");
  const propertyId = getString(formData, "property_id");
  const editorialDestination = getString(formData, "editorial_destination");
  const rejectionReason = getString(formData, "rejection_reason");

  if (!reportId || !["aprovado", "rejeitado"].includes(decision)) {
    redirectWithError(target, "Contribuicao invalida.");
  }

  if (decision === "rejeitado" && !rejectionReason) {
    redirectWithError(target, "Informe um motivo simples para a rejeicao.");
  }

  const currentReport = await getContributionById(supabase, reportId);

  if (!currentReport) {
    redirectWithError(target, "Contribuicao nao encontrada.");
  }

  const contribution = currentReport;

  const nextPropertyId = propertyId || contribution.property_id || null;

  if (decision === "aprovado" && !nextPropertyId) {
    redirectWithError(target, "Selecione um imovel para aprovar esta contribuicao.");
  }

  if (decision === "aprovado" && !isContributionEditorialDestination(editorialDestination)) {
    redirectWithError(target, "Selecione o destino editorial da aprovacao.");
  }

  const resolvedPropertyId = nextPropertyId as string;

  let createdImageStoragePath: string | null = null;
  let createdDocumentStoragePath: string | null = null;
  let createdImageId: string | null = null;
  let createdDocumentId: string | null = null;
  let createdTimelineId: string | null = null;

  try {
    if (decision === "aprovado") {
      const destination = editorialDestination as "relato_publico" | "timeline" | "media";

      if (destination === "timeline") {
        createdTimelineId = await createTimelineFromContribution(supabase, contribution, resolvedPropertyId);
      } else if (destination === "media") {
        const mediaTarget = inferContributionMediaTarget({
          reportType: contribution.report_type,
          attachmentMimeType: contribution.attachment_mime_type,
          sourceUrl: contribution.source_url,
        });

        if (!mediaTarget) {
          throw new Error("Nao foi possivel inferir se o anexo vira imagem ou documento.");
        }

        if (mediaTarget === "image") {
          const imageResult = await createImageFromContribution(supabase, contribution, resolvedPropertyId);
          createdImageStoragePath = imageResult.storagePath;
          createdImageId = imageResult.insertedId;
        } else {
          const documentResult = await createDocumentFromContribution(supabase, contribution, resolvedPropertyId);
          createdDocumentStoragePath = documentResult.storagePath;
          createdDocumentId = documentResult.insertedId;
        }
      }
    }
  } catch (error) {
    if (createdTimelineId) {
      await supabase.from("property_timeline").delete().eq("id", createdTimelineId);
    }

    if (createdImageId) {
      await supabase.from("property_images").delete().eq("id", createdImageId);
    }

    if (createdDocumentId) {
      await supabase.from("property_documents").delete().eq("id", createdDocumentId);
    }

    if (createdImageStoragePath) {
      await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([createdImageStoragePath]);
    }

    if (createdDocumentStoragePath) {
      await supabase.storage.from(PROPERTY_DOC_BUCKET).remove([createdDocumentStoragePath]);
    }

    redirectWithError(target, error instanceof Error ? error.message : "Nao foi possivel concluir a decisao editorial.");
  }

  const payload: Record<string, string | null> = {
    moderation_status: decision,
    property_id: nextPropertyId,
    editorial_destination: decision === "aprovado" ? editorialDestination : null,
    rejection_reason: decision === "rejeitado" ? rejectionReason : null,
    reviewed_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("property_reports").update(payload).eq("id", reportId);

  if (error) {
    if (createdTimelineId) {
      await supabase.from("property_timeline").delete().eq("id", createdTimelineId);
    }

    if (createdImageId) {
      await supabase.from("property_images").delete().eq("id", createdImageId);
    }

    if (createdDocumentId) {
      await supabase.from("property_documents").delete().eq("id", createdDocumentId);
    }

    if (createdImageStoragePath) {
      await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([createdImageStoragePath]);
    }

    if (createdDocumentStoragePath) {
      await supabase.storage.from(PROPERTY_DOC_BUCKET).remove([createdDocumentStoragePath]);
    }

    redirectWithError(target, error.message);
  }

  revalidatePath("/admin/contribuicoes");
  revalidatePath("/admin");
  if (decision === "aprovado" && nextPropertyId) {
    const { data: propertyRow } = await supabase.from("properties").select("slug").eq("id", resolvedPropertyId).maybeSingle();

    if (propertyRow?.slug) {
      revalidatePath(`/imoveis/${propertyRow.slug}`);
    }
  }

  const successUrl =
    decision === "aprovado"
      ? `${target}?saved=1&destino=${encodeURIComponent(getContributionEditorialDestinationLabel(editorialDestination || ""))}`
      : `${target}?saved=1`;

  redirect(successUrl);
}

function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function linkPropertyToSignalAction(inscricaoImobiliaria: string, propertyId: string | null) {
  try {
    const supabase = requireAdminClient();
    
    if (!propertyId) {
      // Unlinking
      const { data: signal } = await supabase
        .from("property_fiscal_signals")
        .select("property_id")
        .eq("inscricao_imobiliaria", inscricaoImobiliaria)
        .maybeSingle();
      
      if (signal?.property_id) {
        await supabase.from("properties").update({ inscricao_imobiliaria: null }).eq("id", signal.property_id);
      }
      
      await supabase.from("property_fiscal_signals").update({ property_id: null }).eq("inscricao_imobiliaria", inscricaoImobiliaria);
      
      revalidatePath("/admin/imoveis");
      revalidatePath("/admin");
      revalidatePath("/imoveis");
      return { success: true };
    }

    // Linking to propertyId
    // Clear any existing signal linked to propertyId
    await supabase.from("property_fiscal_signals").update({ property_id: null }).eq("property_id", propertyId);
    
    // Clear any existing property linked to inscricaoImobiliaria
    await supabase.from("properties").update({ inscricao_imobiliaria: null }).eq("inscricao_imobiliaria", inscricaoImobiliaria);

    // Set new links
    await supabase.from("property_fiscal_signals").update({ property_id: propertyId }).eq("inscricao_imobiliaria", inscricaoImobiliaria);
    await supabase.from("properties").update({ inscricao_imobiliaria: inscricaoImobiliaria }).eq("id", propertyId);

    revalidatePath("/admin/imoveis");
    revalidatePath("/admin");
    revalidatePath("/imoveis");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido ao vincular.";
    return { success: false, error: message };
  }
}

export async function updatePropertyTitleAction(propertyId: string, title: string) {
  try {
    const supabase = requireAdminClient();
    const slug = slugify(title);
    
    const { error } = await supabase
      .from("properties")
      .update({ title, slug })
      .eq("id", propertyId);

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: prop } = await supabase.from("properties").select("slug").eq("id", propertyId).maybeSingle();
    
    revalidatePath("/admin/imoveis");
    revalidatePath("/admin");
    revalidatePath("/imoveis");
    if (prop?.slug) {
      revalidatePath(`/imoveis/${prop.slug}`);
    }
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar título.";
    return { success: false, error: message };
  }
}

export async function createAndLinkPropertyAction(inscricaoImobiliaria: string, title: string) {
  try {
    const supabase = requireAdminClient();
    const slug = slugify(title);

    const { data: signal, error: signalError } = await supabase
      .from("property_fiscal_signals")
      .select("*")
      .eq("inscricao_imobiliaria", inscricaoImobiliaria)
      .maybeSingle();

    if (signalError || !signal) {
      return { success: false, error: signalError?.message || "Sinal fiscal não encontrado." };
    }

    const { data: nbhList } = await supabase
      .from("neighborhoods")
      .select("id, name")
      .order("name", { ascending: true });

    let neighborhoodId = null;
    if (nbhList && nbhList.length > 0) {
      if (signal.bairro_oficial) {
        const normalizedBairro = signal.bairro_oficial.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        const match = nbhList.find((n) => {
          const normalizedName = n.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
          return normalizedName === normalizedBairro || normalizedName.includes(normalizedBairro) || normalizedBairro.includes(normalizedName);
        });
        if (match) {
          neighborhoodId = match.id;
        }
      }
      if (!neighborhoodId) {
        neighborhoodId = nbhList[0].id;
      }
    }

    if (!neighborhoodId) {
      return { success: false, error: "Nenhum bairro cadastrado no sistema para associar." };
    }

    const { data: newProp, error: insertError } = await supabase
      .from("properties")
      .insert({
        title,
        slug,
        inscricao_imobiliaria: inscricaoImobiliaria,
        address: signal.endereco_oficial ?? "Endereço em revisão",
        neighborhood_id: neighborhoodId,
        property_type: "outro",
        status: "vazio",
        criticality: "media",
        is_public: false,
        latitude: signal.latitude ?? 0,
        longitude: signal.longitude ?? 0,
        localizacao_status_final: signal.localizacao_status_final,
        pronto_para_mapa: signal.pronto_para_mapa,
        prioridade_revisao: signal.prioridade_revisao,
        excerpt: "Registro fiscal importado da base patrimonial.",
        description: `Imóvel cadastrado a partir do sinal fiscal de inscrição ${inscricaoImobiliaria}.`,
      })
      .select("id")
      .single();

    if (insertError || !newProp) {
      return { success: false, error: insertError?.message ?? "Falha ao criar o imóvel editorial." };
    }

    await supabase
      .from("property_fiscal_signals")
      .update({ property_id: newProp.id })
      .eq("inscricao_imobiliaria", inscricaoImobiliaria);

    revalidatePath("/admin/imoveis");
    revalidatePath("/admin");
    revalidatePath("/imoveis");
    return { success: true, propertyId: newProp.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar e vincular imóvel.";
    return { success: false, error: message };
  }
}

export async function deleteQuickImageAction(propertyId: string, imageId: string) {
  try {
    const supabase = requireAdminClient();
    
    const { data: row } = await supabase
      .from("property_images")
      .select("storage_path")
      .eq("id", imageId)
      .eq("property_id", propertyId)
      .maybeSingle();

    if (row?.storage_path) {
      await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([row.storage_path]);
    }

    const { error } = await supabase
      .from("property_images")
      .delete()
      .eq("id", imageId)
      .eq("property_id", propertyId);

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: prop } = await supabase.from("properties").select("slug").eq("id", propertyId).maybeSingle();

    revalidatePath("/admin/imoveis");
    revalidatePath("/admin");
    revalidatePath("/imoveis");
    if (prop?.slug) {
      revalidatePath(`/imoveis/${prop.slug}`);
    }
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao excluir imagem.";
    return { success: false, error: message };
  }
}

export async function setQuickImageCoverAction(propertyId: string, imageId: string) {
  try {
    const supabase = requireAdminClient();
    
    await supabase.from("property_images").update({ is_cover: false }).eq("property_id", propertyId);
    const { error } = await supabase.from("property_images").update({ is_cover: true }).eq("id", imageId);

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: prop } = await supabase.from("properties").select("slug").eq("id", propertyId).maybeSingle();

    revalidatePath("/admin/imoveis");
    revalidatePath("/admin");
    revalidatePath("/imoveis");
    if (prop?.slug) {
      revalidatePath(`/imoveis/${prop.slug}`);
    }
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao definir imagem como capa.";
    return { success: false, error: message };
  }
}
