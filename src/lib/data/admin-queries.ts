import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Criticality, Property, PropertyReportStatus, PropertyReportType, PropertyType } from "@/types/domain";
import type { ContributionEditorialDestination } from "@/lib/data/contribution-editorial";

export interface AdminNeighborhoodOption {
  id: string;
  name: string;
}

export interface AdminPropertyRow {
  id: string;
  slug: string;
  title: string;
  address: string;
  neighborhood_id: string;
  excerpt: string | null;
  description: string | null;
  historical_context: string | null;
  social_use_potential: string | null;
  current_use: string | null;
  area_estimate: string | null;
  current_status: Property["status"];
  criticality: Criticality;
  property_type: PropertyType;
  latitude: number;
  longitude: number;
  legal_notes: string[] | null;
  tags: string[] | null;
  is_public: boolean;
  mission_url: string | null;
  community_url: string | null;
  dossier_url: string | null;
  external_reference_url: string | null;
  neighborhoods?: {
    id: string;
    name: string;
  } | Array<{
    id: string;
    name: string;
  }> | null;
}

export interface AdminPropertyEditorData extends Property {
  id: string;
}

export interface AdminPropertyFormOptions {
  neighborhoods: AdminNeighborhoodOption[];
  propertyTypes: PropertyType[];
  statuses: Property["status"][];
  criticalities: Criticality[];
}

export interface AdminContributionPropertyOption {
  id: string;
  title: string;
  slug: string;
  neighborhoodName: string;
}

export interface AdminPropertyActionRow {
  id: string;
  property_id: string;
  title: string;
  kind: string;
  cta_label: string;
  href: string;
  description: string | null;
  is_priority: boolean | null;
  is_public: boolean | null;
  position: number;
  mission_url: string | null;
  community_url: string | null;
  dossier_url: string | null;
  external_reference_url: string | null;
}

export interface AdminPropertyActionData {
  id: string;
  propertyId: string;
  title: string;
  kind: string;
  ctaLabel: string;
  href: string;
  description: string;
  isPriority: boolean;
  isPublic: boolean;
  position: number;
  missionUrl?: string;
  communityUrl?: string;
  dossierUrl?: string;
  externalReferenceUrl?: string;
}

export interface AdminContributionItem {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  propertySlug: string | null;
  neighborhoodName: string | null;
  reportType: PropertyReportType;
  editorialDestination: ContributionEditorialDestination | null;
  title: string | null;
  content: string;
  authorName: string | null;
  contact: string | null;
  sourceUrl: string | null;
  referenceHint: string | null;
  attachmentPath: string | null;
  attachmentName: string | null;
  attachmentMimeType: string | null;
  attachmentSize: number | null;
  moderationStatus: PropertyReportStatus;
  createdAt: string;
  rejectionReason: string | null;
  reviewedAt: string | null;
  attachmentUrl?: string | null;
}

interface AdminContributionRow {
  id: string;
  property_id: string | null;
  report_type: PropertyReportType;
  editorial_destination: ContributionEditorialDestination | null;
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
  moderation_status: PropertyReportStatus;
  created_at: string;
  rejection_reason: string | null;
  reviewed_at: string | null;
  properties?: {
    id: string;
    title: string;
    slug: string;
    neighborhoods?: {
      name: string;
    } | Array<{
      name: string;
    }> | null;
  } | Array<{
    id: string;
    title: string;
    slug: string;
    neighborhoods?: {
      name: string;
    } | Array<{
      name: string;
    }> | null;
  }> | null;
}

function getAdminSupabaseOrThrow() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada.");
  }

  return supabase;
}

function mapRowToProperty(row: AdminPropertyRow): AdminPropertyEditorData {
  const neighborhood = Array.isArray(row.neighborhoods) ? row.neighborhoods[0] : row.neighborhoods;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    address: row.address,
    neighborhoodId: row.neighborhood_id,
    neighborhoodName: neighborhood?.name ?? "Nao mapeado",
    propertyType: row.property_type,
    status: row.current_status,
    criticality: row.criticality,
    lat: row.latitude,
    lng: row.longitude,
    excerpt: row.excerpt ?? "",
    description: row.description ?? "",
    historicalContext: row.historical_context ?? "",
    socialUsePotential: row.social_use_potential ?? "",
    currentUse: row.current_use ?? "",
    areaEstimate: row.area_estimate ?? "",
    legalNotes: row.legal_notes ?? [],
    tags: row.tags ?? [],
    isPublic: row.is_public,
    missionUrl: row.mission_url ?? undefined,
    communityUrl: row.community_url ?? undefined,
    dossierUrl: row.dossier_url ?? undefined,
    externalReferenceUrl: row.external_reference_url ?? undefined,
  };
}

export async function getAdminPropertyOptions(): Promise<AdminPropertyFormOptions> {
  const supabase = getAdminSupabaseOrThrow();

  const { data, error } = await supabase.from("neighborhoods").select("id, name").order("name", { ascending: true });

  if (error) {
    throw new Error(`Falha ao buscar bairros: ${error.message}`);
  }

  return {
    neighborhoods: data ?? [],
    propertyTypes: ["clube", "galpao", "casa-tecnica", "terreno", "outro"],
    statuses: ["ocupado", "vazio", "em-disputa", "uso-institucional"],
    criticalities: ["alta", "media", "baixa"],
  };
}

export async function getAdminProperties(): Promise<AdminPropertyEditorData[]> {
  const supabase = getAdminSupabaseOrThrow();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, slug, title, address, neighborhood_id, excerpt, description, historical_context, social_use_potential, current_use, area_estimate, current_status, criticality, property_type, latitude, longitude, legal_notes, tags, mission_url, community_url, dossier_url, external_reference_url, is_public, neighborhoods(id, name)",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao buscar properties: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRowToProperty(row as unknown as AdminPropertyRow));
}

export async function getAdminPropertyById(id: string): Promise<AdminPropertyEditorData | null> {
  const supabase = getAdminSupabaseOrThrow();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, slug, title, address, neighborhood_id, excerpt, description, historical_context, social_use_potential, current_use, area_estimate, current_status, criticality, property_type, latitude, longitude, legal_notes, tags, mission_url, community_url, dossier_url, external_reference_url, is_public, neighborhoods(id, name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar property: ${error.message}`);
  }

  return data ? mapRowToProperty(data as unknown as AdminPropertyRow) : null;
}

export async function getAdminSummary() {
  const supabase = getAdminSupabaseOrThrow();
  const [propertiesResult, publishedPropertiesResult, reportsResult, pendingReportsResult, highCriticalityResult, activeActionsResult] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("is_public", true),
    supabase.from("property_reports").select("*", { count: "exact", head: true }),
    supabase.from("property_reports").select("*", { count: "exact", head: true }).eq("moderation_status", "pendente"),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("criticality", "alta"),
    supabase.from("property_actions").select("*", { count: "exact", head: true }).eq("is_public", true),
  ]);

  for (const result of [propertiesResult, publishedPropertiesResult, reportsResult, pendingReportsResult, highCriticalityResult, activeActionsResult]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  return {
    totalProperties: propertiesResult.count ?? 0,
    publishedProperties: publishedPropertiesResult.count ?? 0,
    totalReports: reportsResult.count ?? 0,
    pendingReports: pendingReportsResult.count ?? 0,
    highCriticality: highCriticalityResult.count ?? 0,
    activeActions: activeActionsResult.count ?? 0,
  };
}

export async function getAdminContributionPropertyOptions(): Promise<AdminContributionPropertyOption[]> {
  const supabase = getAdminSupabaseOrThrow();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, slug, neighborhoods(name)")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Falha ao buscar opcoes de imoveis para contribuicoes: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    const neighborhoodRecord = Array.isArray(row.neighborhoods) ? row.neighborhoods[0] : row.neighborhoods;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      neighborhoodName: neighborhoodRecord && !Array.isArray(neighborhoodRecord) ? neighborhoodRecord.name : "Nao mapeado",
    };
  });
}

function mapPropertyActionRow(row: AdminPropertyActionRow): AdminPropertyActionData {
  return {
    id: row.id,
    propertyId: row.property_id,
    title: row.title,
    kind: row.kind,
    ctaLabel: row.cta_label,
    href: row.href,
    description: row.description ?? "",
    isPriority: row.is_priority ?? false,
    isPublic: row.is_public ?? true,
    position: row.position,
    missionUrl: row.mission_url ?? undefined,
    communityUrl: row.community_url ?? undefined,
    dossierUrl: row.dossier_url ?? undefined,
    externalReferenceUrl: row.external_reference_url ?? undefined,
  };
}

function mapContributionRow(row: AdminContributionRow): AdminContributionItem {
  const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
  const neighborhoodRecord = property
    ? Array.isArray(property.neighborhoods)
      ? property.neighborhoods[0]
      : property.neighborhoods
    : null;

  return {
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: property?.title ?? null,
    propertySlug: property?.slug ?? null,
    neighborhoodName: neighborhoodRecord && !Array.isArray(neighborhoodRecord) ? neighborhoodRecord.name : null,
    reportType: row.report_type,
    editorialDestination: row.editorial_destination,
    title: row.title,
    content: row.content,
    authorName: row.author_name,
    contact: row.contact,
    sourceUrl: row.source_url,
    referenceHint: row.reference_hint,
    attachmentPath: row.attachment_path,
    attachmentName: row.attachment_name,
    attachmentMimeType: row.attachment_mime_type,
    attachmentSize: row.attachment_size,
    moderationStatus: row.moderation_status,
    createdAt: row.created_at,
    rejectionReason: row.rejection_reason,
    reviewedAt: row.reviewed_at,
  };
}

async function resolveContributionAttachmentUrl(supabase: ReturnType<typeof getAdminSupabaseOrThrow>, item: AdminContributionItem) {
  if (!item.attachmentPath) {
    return item;
  }

  const { data: signedUrlData } = await supabase.storage.from("report-attachments").createSignedUrl(item.attachmentPath, 60 * 15);

  return {
    ...item,
    attachmentUrl: signedUrlData?.signedUrl ?? null,
  };
}

async function getContributionsByStatus(status: "pendente" | "aprovado" | "rejeitado", limit?: number): Promise<AdminContributionItem[]> {
  const supabase = getAdminSupabaseOrThrow();
  const baseQuery = supabase
    .from("property_reports")
    .select(
      "id, property_id, report_type, editorial_destination, title, content, author_name, contact, source_url, reference_hint, attachment_path, attachment_name, attachment_mime_type, attachment_size, moderation_status, rejection_reason, reviewed_at, created_at, properties(id, title, slug, neighborhoods(name))",
    )
    .eq("moderation_status", status)
    .order(status === "pendente" ? "created_at" : "reviewed_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const query = typeof limit === "number" ? baseQuery.limit(limit) : baseQuery;

  const { data, error } = await query;

  if (error) {
    throw new Error(`Falha ao buscar contribuicoes: ${error.message}`);
  }

  return Promise.all((data ?? []).map((row) => resolveContributionAttachmentUrl(supabase, mapContributionRow(row as AdminContributionRow))));
}

export async function getPendingContributions(): Promise<AdminContributionItem[]> {
  return getContributionsByStatus("pendente");
}

export async function getRecentModeratedContributions(limit = 8): Promise<AdminContributionItem[]> {
  const supabase = getAdminSupabaseOrThrow();
  const query = supabase
    .from("property_reports")
    .select(
      "id, property_id, report_type, editorial_destination, title, content, author_name, contact, source_url, reference_hint, attachment_path, attachment_name, attachment_mime_type, attachment_size, moderation_status, rejection_reason, reviewed_at, created_at, properties(id, title, slug, neighborhoods(name))",
    )
    .neq("moderation_status", "pendente")
    .order("reviewed_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Falha ao buscar contribuicoes moderadas: ${error.message}`);
  }

  return Promise.all((data ?? []).map((row) => resolveContributionAttachmentUrl(supabase, mapContributionRow(row as AdminContributionRow))));
}

export async function getAdminPropertyActions(propertyId: string): Promise<AdminPropertyActionData[]> {
  const supabase = getAdminSupabaseOrThrow();
  const { data, error } = await supabase
    .from("property_actions")
    .select("id, property_id, title, kind, cta_label, href, description, is_priority, is_public, position, mission_url, community_url, dossier_url, external_reference_url")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Falha ao buscar acoes do imovel: ${error.message}`);
  }

  return (data ?? []).map((row) => mapPropertyActionRow(row as AdminPropertyActionRow));
}
