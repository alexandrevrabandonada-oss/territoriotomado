import type { Criticality, PropertyStatus } from "@/types/domain";

export interface PublicListingContext {
  status: PropertyStatus | "todos";
  criticality: Criticality | "todos";
  neighborhood: string | "todos";
  imovel?: string;
  from?: "mapa" | "imoveis";
}

const statusValues = new Set<PropertyStatus>(["ocupado", "vazio", "em-disputa", "uso-institucional"]);
const criticalityValues = new Set<Criticality>(["alta", "media", "baixa"]);

function readParam(source: URLSearchParams | Record<string, string | string[] | undefined> | undefined, key: string) {
  if (!source) {
    return undefined;
  }

  if (source instanceof URLSearchParams) {
    return source.get(key) ?? undefined;
  }

  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

function normalizeStatus(value: string | undefined): PublicListingContext["status"] {
  if (value === "todos") {
    return "todos";
  }

  return value && statusValues.has(value as PropertyStatus) ? (value as PropertyStatus) : "todos";
}

function normalizeCriticality(value: string | undefined): PublicListingContext["criticality"] {
  if (value === "todos") {
    return "todos";
  }

  return value && criticalityValues.has(value as Criticality) ? (value as Criticality) : "todos";
}

function normalizeNeighborhood(value: string | undefined): PublicListingContext["neighborhood"] {
  if (!value || value === "todos") {
    return "todos";
  }

  return value;
}

function normalizeFrom(value: string | undefined): PublicListingContext["from"] | undefined {
  if (value === "mapa" || value === "imoveis") {
    return value;
  }

  return undefined;
}

export function parsePublicListingContext(source?: URLSearchParams | Record<string, string | string[] | undefined>) {
  return {
    status: normalizeStatus(readParam(source, "status")),
    criticality: normalizeCriticality(readParam(source, "criticidade")),
    neighborhood: normalizeNeighborhood(readParam(source, "bairro")),
    imovel: readParam(source, "imovel"),
    from: normalizeFrom(readParam(source, "from")),
  } satisfies PublicListingContext;
}

export function buildPublicListingHref(
  pathname: string,
  context: Partial<PublicListingContext> = {},
  overrides: Partial<PublicListingContext> = {},
) {
  const params = new URLSearchParams();
  const merged = { ...context, ...overrides };

  if (merged.status && merged.status !== "todos") {
    params.set("status", merged.status);
  }

  if (merged.criticality && merged.criticality !== "todos") {
    params.set("criticidade", merged.criticality);
  }

  if (merged.neighborhood && merged.neighborhood !== "todos") {
    params.set("bairro", merged.neighborhood);
  }

  if (merged.imovel) {
    params.set("imovel", merged.imovel);
  }

  if (merged.from) {
    params.set("from", merged.from);
  }

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function getPublicReturnHref(context: PublicListingContext) {
  const origin = context.from === "mapa" ? "/mapa" : "/imoveis";

  return buildPublicListingHref(origin, context);
}

export function getPublicReturnLabel(context: PublicListingContext) {
  return context.from === "mapa" ? "Voltar ao mapa" : "Voltar a lista";
}

