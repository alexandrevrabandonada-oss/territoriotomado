import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getFinalNeighborhoodStats, getFinalSignalForProperty, matchNeighborhoodStat, type FinalSignalRow } from "@/lib/data/final-signals";
import { PROPERTY_DOC_BUCKET, PROPERTY_IMAGE_BUCKET } from "@/lib/data/media-constants";
import type {
  Criticality,
  LocationStatus,
  Neighborhood,
  PriorityReview,
  Property,
  PropertyAction,
  PropertyBundle,
  PropertyDocument,
  PropertyImage,
  PropertyReport,
  PropertyReportType,
  PropertyStatus,
  PropertyTimelineItem,
  ReuseProposal,
} from "@/types/domain";

export interface PropertyFilters {
  status?: PropertyStatus | "todos";
  neighborhood?: string | "todos";
  criticality?: Criticality | "todos";
  readyForMap?: "sim" | "nao" | "todos";
  priorityReview?: PriorityReview | "todos";
  locationStatus?: LocationStatus | "todos";
}

export interface PropertyMapFeature {
  id: string;
  slug: string;
  title: string;
  neighborhoodId: string;
  neighborhoodName: string;
  neighborhoodSlug?: string;
  status: PropertyStatus;
  criticality: Criticality;
  lat: number;
  lng: number;
  readyForMap: boolean;
  priorityReview: PriorityReview;
  locationStatus: LocationStatus;
}

export interface PublishedPropertyOption {
  id: string;
  title: string;
  slug: string;
  neighborhoodName: string;
}

export interface PublishedNeighborhoodSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  propertyCount: number;
  criticalPropertyCount: number;
  openActionCount: number;
  proofPropertyCount: number;
  publicDocumentCount: number;
  priorityPropertyCount: number;
  readyForMapCount: number;
  narrative: string;
}

export interface PublishedNeighborhoodDetail extends PublishedNeighborhoodSummary {
  properties: Property[];
  actions: PublishedActionFeedItem[];
}

export interface PublishedActionFeedItem {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  neighborhoodName: string;
  status: PropertyStatus;
  criticality: Criticality;
  propertyOpenActionCount: number;
  propertyPublicDocumentCount: number;
  propertyHasProof: boolean;
  propertyHasMedia: boolean;
  propertyIsPriority: boolean;
  title: string;
  kind: PropertyAction["kind"];
  ctaLabel: string;
  href: string;
  description: string;
  isPriority: boolean;
  position: number;
  missionUrl?: string;
  communityUrl?: string;
  dossierUrl?: string;
  externalReferenceUrl?: string;
}

interface PropertyRow {
  id: string;
  slug: string;
  inscricao_imobiliaria?: string | null;
  title: string;
  address: string;
  neighborhood_id: string;
  excerpt: string | null;
  description: string | null;
  current_use: string | null;
  area_estimate: string | null;
  current_status: PropertyStatus;
  criticality: Criticality;
  latitude: number;
  longitude: number;
  legal_notes: string[] | null;
  tags: string[] | null;
  mission_url: string | null;
  community_url: string | null;
  dossier_url: string | null;
  external_reference_url: string | null;
  localizacao_status_final?: string | null;
  pronto_para_mapa?: boolean | null;
  prioridade_revisao?: PriorityReview | null;
  neighborhoods?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  } | null;
}

interface PropertyFiscalSignalRow {
  property_id: string | null;
  inscricao_imobiliaria?: string | null;
  iptu_2019_lancado: number | null;
  iptu_2025_observado: number | null;
  valor_venal_estimado: number | null;
  valor_venal_status: string | null;
  confianca_valor_venal: string | null;
  localizacao_status_final?: string | null;
  pronto_para_mapa?: boolean | null;
  prioridade_revisao?: PriorityReview | null;
}

interface PropertyImageRow {
  id: string;
  property_id: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  credit: string | null;
  storage_path: string | null;
  is_public: boolean | null;
  is_cover: boolean | null;
  position: number;
}

interface PropertyDocumentRow {
  id: string;
  property_id: string;
  title: string;
  summary: string | null;
  document_type: string;
  published_year: number | null;
  document_url: string | null;
  storage_path: string | null;
  file_name: string | null;
  source_url: string | null;
  is_public: boolean | null;
  position: number;
}

interface PropertyTimelineRow {
  id: string;
  property_id: string;
  event_year: number | null;
  title: string;
  description: string;
}

interface PropertyActionRow {
  id: string;
  property_id: string;
  title: string;
  kind: PropertyAction["kind"];
  cta_label: string;
  href: string;
  description: string | null;
  is_priority: boolean | null;
  position: number;
  mission_url: string | null;
  community_url: string | null;
  dossier_url: string | null;
  external_reference_url: string | null;
}

interface ReuseProposalRow {
  id: string;
  property_id: string;
  title: string;
  description: string;
  supporters_count: number;
}

interface PropertyReportRow {
  id: string;
  property_id: string | null;
  author_name: string | null;
  moderation_status: PropertyReport["status"];
  report_type: PropertyReportType;
  editorial_destination: PropertyReport["editorialDestination"] | null;
  title: string | null;
  content: string;
  reference_hint: string | null;
  source_url: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_mime_type: string | null;
  attachment_size: number | null;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

function mapNeighborhood(row: NonNullable<PropertyRow["neighborhoods"]>): Neighborhood {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
  };
}

function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    inscricaoImobiliaria: row.inscricao_imobiliaria ?? undefined,
    title: row.title,
    address: row.address,
    neighborhoodId: row.neighborhood_id,
    neighborhoodName: row.neighborhoods?.name ?? "Nao mapeado",
    neighborhoodSlug: row.neighborhoods?.slug ?? undefined,
    status: row.current_status,
    criticality: row.criticality,
    lat: row.latitude,
    lng: row.longitude,
    excerpt: row.excerpt ?? "",
    description: row.description ?? "",
    currentUse: row.current_use ?? "Nao informado",
    areaEstimate: row.area_estimate ?? "Nao informado",
    legalNotes: row.legal_notes ?? [],
    tags: row.tags ?? [],
    missionUrl: row.mission_url ?? undefined,
    communityUrl: row.community_url ?? undefined,
    dossierUrl: row.dossier_url ?? undefined,
    externalReferenceUrl: row.external_reference_url ?? undefined,
    readyForMap: row.pronto_para_mapa ?? undefined,
    priorityReview: row.prioridade_revisao ?? undefined,
    locationStatus: normalizePersistedLocationStatus(row.localizacao_status_final),
  };
}

function mapPropertyImage(row: PropertyImageRow): PropertyImage {
  return {
    id: row.id,
    propertyId: row.property_id,
    src: row.image_url,
    alt: row.alt_text,
    credit: row.credit ?? undefined,
    caption: row.caption ?? undefined,
    storagePath: row.storage_path ?? undefined,
    isPublic: row.is_public ?? undefined,
    isCover: row.is_cover ?? undefined,
    position: row.position,
  };
}

function mapPropertyDocument(row: PropertyDocumentRow): PropertyDocument {
  return {
    id: row.id,
    propertyId: row.property_id,
    title: row.title,
    type: row.document_type,
    year: row.published_year ?? 0,
    summary: row.summary ?? "",
    href: row.document_url ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    storagePath: row.storage_path ?? undefined,
    fileName: row.file_name ?? undefined,
    isPublic: row.is_public ?? undefined,
    position: row.position,
  };
}

function mapPropertyTimeline(row: PropertyTimelineRow): PropertyTimelineItem {
  return {
    id: row.id,
    propertyId: row.property_id,
    year: row.event_year ? String(row.event_year) : "sem data",
    title: row.title,
    description: row.description,
  };
}

function mapPropertyAction(row: PropertyActionRow): PropertyAction {
  return {
    id: row.id,
    propertyId: row.property_id,
    title: row.title,
    kind: row.kind,
    ctaLabel: row.cta_label,
    href: row.href,
    description: row.description ?? "",
    isPriority: row.is_priority ?? false,
    missionUrl: row.mission_url ?? undefined,
    communityUrl: row.community_url ?? undefined,
    dossierUrl: row.dossier_url ?? undefined,
    externalReferenceUrl: row.external_reference_url ?? undefined,
  };
}

function mapReuseProposal(row: ReuseProposalRow): ReuseProposal {
  return {
    id: row.id,
    propertyId: row.property_id,
    title: row.title,
    description: row.description,
    supporters: row.supporters_count,
  };
}

function mapPropertyReport(row: PropertyReportRow): PropertyReport {
  return {
    id: row.id,
    propertyId: row.property_id ?? "",
    author: row.author_name ?? "Contribuicao publica",
    status: row.moderation_status,
    excerpt: row.content,
    createdAt: row.created_at,
    reportType: row.report_type,
    editorialDestination: row.editorial_destination ?? null,
    title: row.title ?? undefined,
    content: row.content,
    referenceHint: row.reference_hint ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    attachmentPath: row.attachment_path ?? undefined,
    attachmentName: row.attachment_name ?? undefined,
    attachmentMimeType: row.attachment_mime_type ?? undefined,
    attachmentSize: row.attachment_size ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    reviewedAt: row.reviewed_at ?? undefined,
  };
}

function buildNeighborhoodNarrative(name: string, propertyCount: number, criticalPropertyCount: number, openActionCount: number, description: string) {
  const trimmedDescription = description.trim();

  if (trimmedDescription) {
    return trimmedDescription;
  }

  return `${name} concentra ${propertyCount} imoveis publicados, ${criticalPropertyCount} criticos e ${openActionCount} frentes abertas.`;
}

function derivePriorityReview(property: Pick<Property, "criticality" | "hasProof" | "hasOpenAction" | "isPriority">): PriorityReview {
  if (property.isPriority || property.criticality === "alta") {
    return "alta";
  }

  if (property.criticality === "media" || property.hasOpenAction || !property.hasProof) {
    return "media";
  }

  return "baixa";
}

function deriveLocationStatus(property: Pick<Property, "lat" | "lng" | "hasProof" | "hasMedia" | "criticality">): LocationStatus {
  if (!Number.isFinite(property.lat) || !Number.isFinite(property.lng)) {
    return "pendente";
  }

  if (property.hasProof && property.hasMedia) {
    return "confirmada";
  }

  if (property.criticality === "alta" && !property.hasProof) {
    return "ambigua";
  }

  return "aproximada";
}

function normalizePersistedLocationStatus(value: string | null | undefined): LocationStatus | undefined {
  if (!value) {
    return undefined;
  }

  if (value.includes("confirmada")) {
    return "confirmada";
  }

  if (value.includes("ambigua")) {
    return "ambigua";
  }

  if (value.includes("pendente")) {
    return "pendente";
  }

  return "aproximada";
}

function enrichTerritorialFields(property: Property): Property {
  const readyForMap = property.readyForMap ?? (Number.isFinite(property.lat) && Number.isFinite(property.lng));
  const priorityReview = property.priorityReview ?? derivePriorityReview(property);
  const locationStatus = property.locationStatus ?? deriveLocationStatus(property);

  return {
    ...property,
    readyForMap,
    priorityReview,
    locationStatus,
  };
}

function applyFiscalSignal(property: Property, signal: PropertyFiscalSignalRow | FinalSignalRow | undefined): Property {
  if (!signal) {
    return property;
  }

  if ("estimatedMarketValue" in signal) {
    return {
      ...property,
      readyForMap: property.readyForMap ?? signal.readyForMap,
      priorityReview: property.priorityReview ?? signal.priorityReview,
      locationStatus: property.locationStatus ?? signal.locationStatus,
      iptu2019: signal.iptu2019 ?? undefined,
      iptu2025: signal.iptu2025 ?? undefined,
      estimatedMarketValue: signal.estimatedMarketValue ?? undefined,
      valueVenalStatus: signal.valueVenalStatus,
      valueVenalConfidence: signal.valueVenalConfidence,
    };
  }

  return {
    ...property,
    iptu2019: typeof signal.iptu_2019_lancado === "number" ? signal.iptu_2019_lancado : undefined,
    iptu2025: typeof signal.iptu_2025_observado === "number" ? signal.iptu_2025_observado : undefined,
    estimatedMarketValue: typeof signal.valor_venal_estimado === "number" ? signal.valor_venal_estimado : undefined,
    valueVenalStatus: signal.valor_venal_status ?? property.valueVenalStatus,
    valueVenalConfidence: signal.confianca_valor_venal ?? property.valueVenalConfidence,
    locationStatus: normalizePersistedLocationStatus(signal.localizacao_status_final) ?? property.locationStatus,
    readyForMap: signal.pronto_para_mapa ?? property.readyForMap,
    priorityReview: signal.prioridade_revisao ?? property.priorityReview,
  };
}

async function applyFinalSignals(properties: Property[], fiscalSignals: Map<string, PropertyFiscalSignalRow>) {
  return Promise.all(
    properties.map(async (property) => {
      const persistedSignal = fiscalSignals.get(property.id) ?? (property.inscricaoImobiliaria ? fiscalSignals.get(property.inscricaoImobiliaria) : undefined);

      if (persistedSignal) {
        return applyFiscalSignal(property, persistedSignal);
      }

      return applyFiscalSignal(property, await getFinalSignalForProperty(property));
    }),
  );
}

async function getSupabaseOrThrow() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase server client indisponivel.");
  }

  return supabase;
}

async function resolveImageSrc(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  storagePath: string | null | undefined,
  imageUrl: string,
) {
  if (!storagePath) {
    return imageUrl;
  }

  const { data } = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(storagePath);

  return data.publicUrl || imageUrl;
}

async function resolveDocumentHref(row: PropertyDocumentRow) {
  if (row.storage_path) {
    const admin = createSupabaseAdminClient();

    if (admin) {
      const { data } = await admin.storage.from(PROPERTY_DOC_BUCKET).createSignedUrl(row.storage_path, 60 * 60);

      return data?.signedUrl ?? row.document_url ?? row.source_url ?? undefined;
    }
  }

  if (row.document_url) {
    return row.document_url;
  }

  if (row.source_url) {
    return row.source_url;
  }

  return undefined;
}

export async function getPublishedProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const supabase = await getSupabaseOrThrow();
  let query = supabase
    .from("properties")
    .select(
      "*, neighborhoods(id, name, slug, description)",
    )
    .eq("is_public", true)
    .order("title", { ascending: true });

  if (filters.status && filters.status !== "todos") {
    query = query.eq("current_status", filters.status);
  }

  if (filters.criticality && filters.criticality !== "todos") {
    query = query.eq("criticality", filters.criticality);
  }

  if (filters.neighborhood && filters.neighborhood !== "todos") {
    query = query.eq("neighborhood_id", filters.neighborhood);
  }

  const { data, error } = await query.returns<PropertyRow[]>();

  if (error) {
    throw new Error(`Falha ao buscar properties publicadas: ${error.message}`);
  }

  const properties = (data ?? []).map(mapProperty);

  if (properties.length === 0) {
    return properties;
  }

  const propertyIds = properties.map((property) => property.id);
  const inscricoesList = properties
    .map((p) => p.inscricaoImobiliaria)
    .filter((x): x is string => Boolean(x))
    .map((x) => `"${x}"`)
    .join(",");

  const [actionsResult, documentsResult, imagesResult, reportsResult, fiscalSignalsResult] = await Promise.all([
    supabase
      .from("property_actions")
      .select("property_id, is_priority")
      .in("property_id", propertyIds)
      .eq("is_public", true),
    supabase
      .from("property_documents")
      .select("property_id")
      .in("property_id", propertyIds)
      .eq("is_public", true),
    supabase
      .from("property_images")
      .select("property_id")
      .in("property_id", propertyIds)
      .eq("is_public", true),
    supabase
      .from("property_reports")
      .select("property_id")
      .in("property_id", propertyIds)
      .eq("moderation_status", "aprovado")
      .eq("editorial_destination", "relato_publico"),
    supabase
      .from("property_fiscal_signals")
      .select("property_id, inscricao_imobiliaria, iptu_2019_lancado, iptu_2025_observado, valor_venal_estimado, valor_venal_status, confianca_valor_venal, localizacao_status_final, pronto_para_mapa, prioridade_revisao")
      .or(`property_id.in.(${propertyIds.join(",")}),inscricao_imobiliaria.in.(${inscricoesList || '"__none__"'})`)
      .returns<PropertyFiscalSignalRow[]>(),
  ]);

  for (const result of [actionsResult, documentsResult, imagesResult, reportsResult]) {
    if (result.error) {
      throw new Error(`Falha ao enriquecer properties publicadas: ${result.error.message}`);
    }
  }

  const openActionCounts = new Map<string, number>();
  const priorityFlags = new Map<string, boolean>();
  const publicDocumentCounts = new Map<string, number>();
  const publicImageCounts = new Map<string, number>();
  const publicReportCounts = new Map<string, number>();
  const fiscalSignals = new Map<string, PropertyFiscalSignalRow>();

  for (const row of actionsResult.data ?? []) {
    openActionCounts.set(row.property_id, (openActionCounts.get(row.property_id) ?? 0) + 1);

    if (row.is_priority) {
      priorityFlags.set(row.property_id, true);
    }
  }

  for (const row of documentsResult.data ?? []) {
    publicDocumentCounts.set(row.property_id, (publicDocumentCounts.get(row.property_id) ?? 0) + 1);
  }

  for (const row of imagesResult.data ?? []) {
    publicImageCounts.set(row.property_id, (publicImageCounts.get(row.property_id) ?? 0) + 1);
  }

  for (const row of reportsResult.data ?? []) {
    if (!row.property_id) {
      continue;
    }

    publicReportCounts.set(row.property_id, (publicReportCounts.get(row.property_id) ?? 0) + 1);
  }

  for (const row of fiscalSignalsResult.error ? [] : fiscalSignalsResult.data ?? []) {
    if (row.property_id && !fiscalSignals.has(row.property_id)) {
      fiscalSignals.set(row.property_id, row);
    }
    if (row.inscricao_imobiliaria && !fiscalSignals.has(row.inscricao_imobiliaria)) {
      fiscalSignals.set(row.inscricao_imobiliaria, row);
    }
  }

  const propertiesWithCounts = properties.map((property) => {
    const openActionCount = openActionCounts.get(property.id) ?? 0;
    const publicDocumentCount = publicDocumentCounts.get(property.id) ?? 0;
    const publicImageCount = publicImageCounts.get(property.id) ?? 0;
    const publicReportCount = publicReportCounts.get(property.id) ?? 0;
    const hasProof = publicDocumentCount > 0 || publicReportCount > 0;

    return {
      ...property,
      openActionCount,
      publicDocumentCount,
      publicImageCount,
      publicReportCount,
      hasOpenAction: openActionCount > 0,
      hasPublicDocument: publicDocumentCount > 0,
      hasProof,
      hasMedia: publicImageCount > 0,
      isPriority: priorityFlags.get(property.id) ?? property.criticality === "alta",
    };
  });

  return (await applyFinalSignals(propertiesWithCounts, fiscalSignals)).map(enrichTerritorialFields);
}

export async function getPublishedPropertyOptions(): Promise<PublishedPropertyOption[]> {
  const properties = await getPublishedProperties();

  return properties.map((property) => ({
    id: property.id,
    title: property.title,
    slug: property.slug,
    neighborhoodName: property.neighborhoodName ?? "Nao mapeado",
  }));
}

export async function getPublishedActionFeed(): Promise<PublishedActionFeedItem[]> {
  const supabase = await getSupabaseOrThrow();
  const [properties, actionsResult] = await Promise.all([
    getPublishedProperties(),
    supabase
      .from("property_actions")
      .select("id, property_id, title, kind, cta_label, href, description, position, is_priority, mission_url, community_url, dossier_url, external_reference_url")
      .eq("is_public", true)
      .order("position", { ascending: true })
      .returns<PropertyActionRow[]>(),
  ]);

  if (actionsResult.error) {
    throw new Error(`Falha ao buscar actions publicas: ${actionsResult.error.message}`);
  }

  const propertyById = new Map(properties.map((property) => [property.id, property]));

  const items = (actionsResult.data ?? []).reduce<PublishedActionFeedItem[]>((acc, row) => {
      const property = propertyById.get(row.property_id);

      if (!property) {
        return acc;
      }

      acc.push({
        id: row.id,
        propertyId: property.id,
        propertySlug: property.slug,
        propertyTitle: property.title,
        neighborhoodName: property.neighborhoodName ?? "Nao mapeado",
        status: property.status,
        criticality: property.criticality,
        propertyOpenActionCount: property.openActionCount ?? 0,
        propertyPublicDocumentCount: property.publicDocumentCount ?? 0,
        propertyHasProof: property.hasProof ?? false,
        propertyHasMedia: property.hasMedia ?? false,
        propertyIsPriority: property.isPriority ?? false,
        title: row.title,
        kind: row.kind,
        ctaLabel: row.cta_label,
        href: row.href,
        description: row.description ?? "",
        isPriority: row.is_priority ?? false,
        position: row.position,
        missionUrl: row.mission_url ?? undefined,
        communityUrl: row.community_url ?? undefined,
        dossierUrl: row.dossier_url ?? undefined,
        externalReferenceUrl: row.external_reference_url ?? undefined,
      });

      return acc;
    }, []);

  return items.sort((left, right) => {
      if (left.isPriority !== right.isPriority) {
        return left.isPriority ? -1 : 1;
      }

      const criticalityRank = { alta: 0, media: 1, baixa: 2 } as const;
      if (criticalityRank[left.criticality] !== criticalityRank[right.criticality]) {
        return criticalityRank[left.criticality] - criticalityRank[right.criticality];
      }

      return left.position - right.position;
    });
}

export async function getPublishedMapProperties(filters: PropertyFilters = {}): Promise<PropertyMapFeature[]> {
  const properties = (await getPublishedProperties(filters)).filter((property) => {
    const matchesReady =
      !filters.readyForMap ||
      filters.readyForMap === "todos" ||
      (filters.readyForMap === "sim" ? property.readyForMap : !property.readyForMap);
    const matchesPriority =
      !filters.priorityReview || filters.priorityReview === "todos" || property.priorityReview === filters.priorityReview;
    const matchesLocation =
      !filters.locationStatus || filters.locationStatus === "todos" || property.locationStatus === filters.locationStatus;

    return matchesReady && matchesPriority && matchesLocation;
  });

  return properties.map((property) => ({
    id: property.id,
    slug: property.slug,
    title: property.title,
    neighborhoodId: property.neighborhoodId,
    neighborhoodName: property.neighborhoodName ?? "Nao mapeado",
    neighborhoodSlug: property.neighborhoodSlug,
    status: property.status,
    criticality: property.criticality,
    lat: property.lat,
    lng: property.lng,
    readyForMap: property.readyForMap ?? true,
    priorityReview: property.priorityReview ?? "media",
    locationStatus: property.locationStatus ?? "aproximada",
  }));
}

export async function getPublishedMapFilterOptions() {
  const supabase = await getSupabaseOrThrow();

  const { data, error } = await supabase
    .from("neighborhoods")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Falha ao buscar neighborhoods: ${error.message}`);
  }

  return {
    statuses: ["todos", "ocupado", "vazio", "em-disputa", "uso-institucional"] as const,
    criticalities: ["todos", "alta", "media", "baixa"] as const,
    readyForMap: ["todos", "sim", "nao"] as const,
    priorityReviews: ["todos", "alta", "media", "baixa"] as const,
    locationStatuses: ["todos", "confirmada", "aproximada", "ambigua", "pendente"] as const,
    neighborhoods: data ?? [],
  };
}

export async function getPublishedNeighborhoodCount(): Promise<number> {
  const supabase = await getSupabaseOrThrow();
  const { count, error } = await supabase.from("neighborhoods").select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Falha ao contar neighborhoods: ${error.message}`);
  }

  return count ?? 0;
}

export async function getPublishedNeighborhoodSummaries(): Promise<PublishedNeighborhoodSummary[]> {
  const supabase = await getSupabaseOrThrow();
  const [neighborhoodsResult, properties, actions, finalNeighborhoodStats] = await Promise.all([
    supabase.from("neighborhoods").select("id, slug, name, description").order("name", { ascending: true }),
    getPublishedProperties(),
    getPublishedActionFeed(),
    getFinalNeighborhoodStats(),
  ]);

  if (neighborhoodsResult.error) {
    throw new Error(`Falha ao buscar bairros: ${neighborhoodsResult.error.message}`);
  }

  const propertyCounts = new Map<string, number>();
  const criticalCounts = new Map<string, number>();
  const actionCounts = new Map<string, number>();
  const proofPropertyCounts = new Map<string, number>();
  const documentCounts = new Map<string, number>();
  const priorityPropertyCounts = new Map<string, number>();
  const readyForMapCounts = new Map<string, number>();
  const propertyById = new Map(properties.map((property) => [property.id, property]));

  for (const property of properties) {
    propertyCounts.set(property.neighborhoodId, (propertyCounts.get(property.neighborhoodId) ?? 0) + 1);

    if (property.criticality === "alta") {
      criticalCounts.set(property.neighborhoodId, (criticalCounts.get(property.neighborhoodId) ?? 0) + 1);
    }

    if (property.hasProof) {
      proofPropertyCounts.set(property.neighborhoodId, (proofPropertyCounts.get(property.neighborhoodId) ?? 0) + 1);
    }

    if ((property.publicDocumentCount ?? 0) > 0) {
      documentCounts.set(property.neighborhoodId, (documentCounts.get(property.neighborhoodId) ?? 0) + (property.publicDocumentCount ?? 0));
    }

    if (property.isPriority) {
      priorityPropertyCounts.set(property.neighborhoodId, (priorityPropertyCounts.get(property.neighborhoodId) ?? 0) + 1);
    }

    if (property.readyForMap) {
      readyForMapCounts.set(property.neighborhoodId, (readyForMapCounts.get(property.neighborhoodId) ?? 0) + 1);
    }
  }

  for (const action of actions) {
    const property = propertyById.get(action.propertyId);

    if (!property) {
      continue;
    }

    actionCounts.set(property.neighborhoodId, (actionCounts.get(property.neighborhoodId) ?? 0) + 1);
  }

  return (neighborhoodsResult.data ?? []).map((neighborhood) => {
    const finalStats = matchNeighborhoodStat(finalNeighborhoodStats, neighborhood.name);
    const propertyCount = finalStats?.registros ?? propertyCounts.get(neighborhood.id) ?? 0;
    const criticalPropertyCount = criticalCounts.get(neighborhood.id) ?? 0;
    const openActionCount = actionCounts.get(neighborhood.id) ?? 0;
    const proofPropertyCount = proofPropertyCounts.get(neighborhood.id) ?? 0;
    const publicDocumentCount = documentCounts.get(neighborhood.id) ?? 0;
    const priorityPropertyCount = finalStats?.priorityCount ?? priorityPropertyCounts.get(neighborhood.id) ?? 0;
    const readyForMapCount = finalStats?.readyForMapCount ?? readyForMapCounts.get(neighborhood.id) ?? 0;

    return {
      id: neighborhood.id,
      slug: neighborhood.slug,
      name: neighborhood.name,
      description: neighborhood.description ?? "",
      propertyCount,
      criticalPropertyCount,
      openActionCount,
      proofPropertyCount,
      publicDocumentCount,
      priorityPropertyCount,
      readyForMapCount,
      narrative: buildNeighborhoodNarrative(neighborhood.name, propertyCount, criticalPropertyCount, openActionCount, neighborhood.description ?? ""),
    };
  });
}

export async function getPublishedNeighborhoodDetail(slug: string): Promise<PublishedNeighborhoodDetail | null> {
  const summaries = await getPublishedNeighborhoodSummaries();
  const summary = summaries.find((item) => item.slug === slug);

  if (!summary) {
    return null;
  }

  const [properties, actions] = await Promise.all([getPublishedProperties({ neighborhood: summary.id }), getPublishedActionFeed()]);
  const propertyIds = new Set(properties.map((property) => property.id));
  const filteredActions = actions.filter((action) => propertyIds.has(action.propertyId));

  return {
    ...summary,
    properties,
    actions: filteredActions,
  };
}

export async function getPublishedPropertyBundle(slug: string): Promise<PropertyBundle | null> {
  const supabase = await getSupabaseOrThrow();
  const { data: propertyRow, error: propertyError } = await supabase
    .from("properties")
    .select(
      "*, neighborhoods(id, name, slug, description)",
    )
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle<PropertyRow>();

  if (propertyError) {
    throw new Error(`Falha ao buscar property por slug: ${propertyError.message}`);
  }

  if (!propertyRow || !propertyRow.neighborhoods) {
    return null;
  }

  const property = mapProperty(propertyRow);
  const neighborhood = mapNeighborhood(propertyRow.neighborhoods);

  const [imagesResult, documentsResult, timelineResult, actionsResult, proposalsResult, reportsResult, fiscalSignalsResult] = await Promise.all([
    supabase
      .from("property_images")
      .select("id, property_id, image_url, alt_text, caption, credit, storage_path, is_public, is_cover, position")
      .eq("property_id", property.id)
      .eq("is_public", true)
      .order("position", { ascending: true })
      .returns<PropertyImageRow[]>(),
    supabase
      .from("property_documents")
      .select("id, property_id, title, summary, document_type, published_year, document_url, storage_path, file_name, source_url, is_public, position")
      .eq("property_id", property.id)
      .eq("is_public", true)
      .order("position", { ascending: true })
      .order("published_year", { ascending: false })
      .returns<PropertyDocumentRow[]>(),
    supabase
      .from("property_timeline")
      .select("id, property_id, event_year, title, description")
      .eq("property_id", property.id)
      .order("position", { ascending: true })
      .returns<PropertyTimelineRow[]>(),
    supabase
      .from("property_actions")
      .select("id, property_id, title, kind, cta_label, href, description, is_priority, mission_url, community_url, dossier_url, external_reference_url")
      .eq("property_id", property.id)
      .eq("is_public", true)
      .order("position", { ascending: true })
      .returns<PropertyActionRow[]>(),
    supabase
      .from("reuse_proposals")
      .select("id, property_id, title, description, supporters_count")
      .eq("property_id", property.id)
      .eq("is_public", true)
      .order("supporters_count", { ascending: false })
      .returns<ReuseProposalRow[]>(),
    supabase
      .from("property_reports")
      .select(
        "id, property_id, author_name, moderation_status, report_type, editorial_destination, title, content, reference_hint, source_url, attachment_path, attachment_name, attachment_mime_type, attachment_size, rejection_reason, reviewed_at, created_at",
      )
      .eq("property_id", property.id)
      .eq("moderation_status", "aprovado")
      .eq("editorial_destination", "relato_publico")
      .order("created_at", { ascending: false })
      .returns<PropertyReportRow[]>(),
    supabase
      .from("property_fiscal_signals")
      .select("property_id, inscricao_imobiliaria, iptu_2019_lancado, iptu_2025_observado, valor_venal_estimado, valor_venal_status, confianca_valor_venal, localizacao_status_final, pronto_para_mapa, prioridade_revisao")
      .or(`property_id.eq.${property.id}${property.inscricaoImobiliaria ? `,inscricao_imobiliaria.eq."${property.inscricaoImobiliaria}"` : ""}`)
      .limit(1)
      .returns<PropertyFiscalSignalRow[]>(),
  ]);

  for (const result of [imagesResult, documentsResult, timelineResult, actionsResult, proposalsResult, reportsResult]) {
    if (result.error) {
      throw new Error(`Falha ao buscar dados relacionados da property: ${result.error.message}`);
    }
  }

  const resolvedImages = await Promise.all(
    (imagesResult.data ?? []).map(async (image) => ({
      ...mapPropertyImage(image),
      src: await resolveImageSrc(supabase, image.storage_path, image.image_url),
    })),
  );

  const resolvedDocuments = await Promise.all(
    (documentsResult.data ?? [])
      .filter((document) => document.published_year !== null)
      .map(async (document) => {
        const mapped = mapPropertyDocument(document);
        const href = await resolveDocumentHref(document);

        return {
          ...mapped,
          href,
        };
      }),
  );

  return {
    property: enrichTerritorialFields(
      applyFiscalSignal(
        applyFiscalSignal(property, fiscalSignalsResult.error ? undefined : fiscalSignalsResult.data?.[0]),
        fiscalSignalsResult.error || !fiscalSignalsResult.data?.[0] ? await getFinalSignalForProperty(property) : undefined,
      ),
    ),
    neighborhood,
    images: resolvedImages.sort((left, right) => Number(!!right.isCover) - Number(!!left.isCover) || (left.position ?? 0) - (right.position ?? 0)),
    documents: resolvedDocuments,
    timeline: (timelineResult.data ?? []).map(mapPropertyTimeline),
    reports: (reportsResult.data ?? []).map(mapPropertyReport),
    actions: (actionsResult.data ?? []).map(mapPropertyAction),
    proposals: (proposalsResult.data ?? []).map(mapReuseProposal),
  };
}
