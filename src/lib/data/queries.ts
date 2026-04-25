import {
  neighborhoods,
  propertyActions,
  propertyDocuments,
  propertyImages,
  propertyReports,
  properties,
  propertyTimeline,
  reuseProposals,
} from "@/lib/data/mock-data";
import type { Criticality, PropertyBundle, PropertyStatus } from "@/types/domain";

export interface PropertyFilters {
  status?: PropertyStatus | "todos";
  neighborhood?: string | "todos";
  criticality?: Criticality | "todos";
}

export interface PropertyMapFeature {
  id: string;
  slug: string;
  title: string;
  neighborhoodId: string;
  neighborhoodName: string;
  status: PropertyStatus;
  criticality: Criticality;
  lat: number;
  lng: number;
}

export function getProperties(filters: PropertyFilters = {}) {
  return properties.filter((property) => {
    const matchesStatus = !filters.status || filters.status === "todos" || property.status === filters.status;
    const matchesNeighborhood =
      !filters.neighborhood ||
      filters.neighborhood === "todos" ||
      property.neighborhoodId === filters.neighborhood;
    const matchesCriticality =
      !filters.criticality ||
      filters.criticality === "todos" ||
      property.criticality === filters.criticality;

    return matchesStatus && matchesNeighborhood && matchesCriticality;
  });
}

export function getMapProperties(filters: PropertyFilters = {}): PropertyMapFeature[] {
  return getProperties(filters).map((property) => ({
    id: property.id,
    slug: property.slug,
    title: property.title,
    neighborhoodId: property.neighborhoodId,
    neighborhoodName: getNeighborhoodName(property.neighborhoodId),
    status: property.status,
    criticality: property.criticality,
    lat: property.lat,
    lng: property.lng,
  }));
}

export function getMapFilterOptions() {
  return {
    statuses: ["todos", "ocupado", "vazio", "em-disputa", "uso-institucional"] as const,
    criticalities: ["todos", "alta", "media", "baixa"] as const,
    neighborhoods: neighborhoods.map((neighborhood) => ({
      id: neighborhood.id,
      name: neighborhood.name,
    })),
  };
}

export function getPropertyBundle(slug: string): PropertyBundle | null {
  const property = properties.find((item) => item.slug === slug);

  if (!property) {
    return null;
  }

  const neighborhood = neighborhoods.find((item) => item.id === property.neighborhoodId);

  if (!neighborhood) {
    return null;
  }

  return {
    property,
    neighborhood,
    images: propertyImages.filter((item) => item.propertyId === property.id),
    documents: propertyDocuments.filter((item) => item.propertyId === property.id),
    timeline: propertyTimeline.filter((item) => item.propertyId === property.id),
    reports: propertyReports.filter((item) => item.propertyId === property.id),
    actions: propertyActions.filter((item) => item.propertyId === property.id),
    proposals: reuseProposals.filter((item) => item.propertyId === property.id),
  };
}

export function getNeighborhoodName(neighborhoodId: string) {
  return neighborhoods.find((item) => item.id === neighborhoodId)?.name ?? "Nao mapeado";
}

export function getDashboardSummary() {
  return {
    totalProperties: properties.length,
    totalReports: propertyReports.length,
    pendingReports: propertyReports.filter((item) => item.status === "pendente").length,
    highCriticality: properties.filter((item) => item.criticality === "alta").length,
  };
}
