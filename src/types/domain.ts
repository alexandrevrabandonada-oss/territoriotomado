export type PropertyStatus =
  | "ocupado"
  | "vazio"
  | "em-disputa"
  | "uso-institucional";

export type Criticality = "alta" | "media" | "baixa";
export type ReadyForMapFilter = "sim" | "nao";
export type PriorityReview = "alta" | "media" | "baixa";
export type LocationStatus = "confirmada" | "aproximada" | "ambigua" | "pendente";
export type ValueVenalStatus =
  | "estimado_alta_confianca"
  | "estimado_media_confianca"
  | "estimado_baixa_confianca"
  | "estimativa_confirmada_por_revisao"
  | "estimativa_suspensa_por_revisao"
  | "revisao_manual"
  | "nao_publicado";
export type PropertyType = "clube" | "galpao" | "casa-tecnica" | "terreno" | "outro";
export type PropertyReportType = "relato" | "foto" | "documento" | "denuncia" | "atualizacao" | "memoria";
export type PropertyReportEditorialDestination = "relato_publico" | "timeline" | "media";
export type PropertyActionKind =
  | "campanha"
  | "plenaria"
  | "mutirao"
  | "abaixo-assinado"
  | "protocolo-requerimento"
  | "reuniao-territorial"
  | "ato"
  | "oficina";

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  src: string;
  alt: string;
  credit?: string;
  caption?: string;
  storagePath?: string;
  isPublic?: boolean;
  isCover?: boolean;
  position?: number;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  title: string;
  type: string;
  year: number;
  summary: string;
  href?: string;
  sourceUrl?: string;
  storagePath?: string;
  fileName?: string;
  isPublic?: boolean;
  position?: number;
}

export interface PropertyTimelineItem {
  id: string;
  propertyId: string;
  year: string;
  title: string;
  description: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  author: string;
  status: "pendente" | "aprovado" | "rejeitado";
  excerpt: string;
  createdAt: string;
  reportType?: PropertyReportType;
  editorialDestination?: PropertyReportEditorialDestination | null;
  title?: string;
  content?: string;
  referenceHint?: string;
  sourceUrl?: string;
  attachmentPath?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSize?: number;
  rejectionReason?: string;
  reviewedAt?: string;
}

export type PropertyReportStatus = PropertyReport["status"];

export interface PropertyAction {
  id: string;
  propertyId: string;
  title: string;
  kind: PropertyActionKind;
  ctaLabel: string;
  href: string;
  description: string;
  isPriority?: boolean;
  missionUrl?: string;
  communityUrl?: string;
  dossierUrl?: string;
  externalReferenceUrl?: string;
}

export interface ReuseProposal {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  supporters: number;
}

export interface Profile {
  id: string;
  fullName: string;
  role: "admin" | "moderador" | "colaborador";
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  inscricaoImobiliaria?: string;
  address: string;
  neighborhoodId: string;
  neighborhoodName?: string;
  neighborhoodSlug?: string;
  propertyType?: PropertyType;
  status: PropertyStatus;
  criticality: Criticality;
  lat: number;
  lng: number;
  excerpt: string;
  description: string;
  historicalContext?: string;
  socialUsePotential?: string;
  currentUse: string;
  areaEstimate: string;
  legalNotes: string[];
  tags: string[];
  isPublic?: boolean;
  openActionCount?: number;
  publicDocumentCount?: number;
  publicImageCount?: number;
  publicReportCount?: number;
  hasOpenAction?: boolean;
  hasPublicDocument?: boolean;
  hasProof?: boolean;
  hasMedia?: boolean;
  isPriority?: boolean;
  readyForMap?: boolean;
  priorityReview?: PriorityReview;
  locationStatus?: LocationStatus;
  valueVenalStatus?: ValueVenalStatus | string;
  valueVenalConfidence?: string;
  estimatedMarketValue?: number;
  iptu2019?: number;
  iptu2025?: number;
  missionUrl?: string;
  communityUrl?: string;
  dossierUrl?: string;
  externalReferenceUrl?: string;
}

export interface PropertyBundle {
  property: Property;
  neighborhood: Neighborhood;
  images: PropertyImage[];
  documents: PropertyDocument[];
  timeline: PropertyTimelineItem[];
  reports: PropertyReport[];
  actions: PropertyAction[];
  proposals: ReuseProposal[];
}
