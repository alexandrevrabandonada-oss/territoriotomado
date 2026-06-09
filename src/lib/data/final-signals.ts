import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LocationStatus, PriorityReview, Property } from "@/types/domain";

const outputDir = "C:\\Users\\Micro\\OneDrive\\Documentos\\Estudo renda mediana histórica\\data\\output";
const finalUnifiedFile = path.join(outputDir, "base_csn_final_unificada.csv");

export interface FinalSignalRow {
  inscricao: string;
  endereco: string;
  bairro: string;
  lat: number | null;
  lng: number | null;
  iptu2019: number | null;
  iptu2025: number | null;
  estimatedMarketValue: number | null;
  valueVenalStatus: string;
  valueVenalConfidence: string;
  locationStatus: LocationStatus;
  rawLocationStatus: string;
  readyForMap: boolean;
  priorityReview: PriorityReview;
  source: "supabase" | "base_csn_final_unificada";
}

export interface FinalNeighborhoodStats {
  bairro: string;
  registros: number;
  readyForMapCount: number;
  priorityCount: number;
  iptu2025Total: number;
  estimatedValueTotal: number;
}

interface AppReadyRow {
  inscricao_imobiliaria?: string;
  endereco_oficial?: string;
  bairro_oficial?: string;
  latitude?: number | null;
  longitude?: number | null;
  iptu_2019_lancado?: number | string | null;
  iptu_2019_lancado_num?: number | string | null;
  iptu_2025_observado?: number | string | null;
  iptu_2025_observado_num?: number | string | null;
  valor_venal_estimado?: number | string | null;
  valor_venal_estimado_num?: number | string | null;
  valor_venal_status?: string | null;
  confianca_valor_venal?: string | null;
  localizacao_status_final?: string | null;
  pronto_para_mapa?: boolean | string | null;
  prioridade_revisao?: string | null;
}

interface PersistedSignalRow {
  inscricao_imobiliaria: string;
  endereco_oficial: string | null;
  bairro_oficial: string | null;
  latitude?: number | null;
  longitude?: number | null;
  iptu_2019_lancado: number | null;
  iptu_2025_observado: number | null;
  valor_venal_estimado: number | null;
  valor_venal_status: string | null;
  confianca_valor_venal: string | null;
  localizacao_status_final: string | null;
  pronto_para_mapa: boolean | null;
  prioridade_revisao: string | null;
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeText(value: string | undefined | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

function normalizeLocationStatus(value: string | undefined | null): LocationStatus {
  const normalized = normalizeText(value).replaceAll(" ", "_").toLowerCase();

  if (normalized.includes("confirmada")) {
    return "confirmada";
  }

  if (normalized.includes("ambigua")) {
    return "ambigua";
  }

  if (normalized.includes("pendente") || normalized.includes("nao_disponivel")) {
    return "pendente";
  }

  return "aproximada";
}

function normalizePriorityReview(value: string | undefined | null): PriorityReview {
  return value === "alta" || value === "media" || value === "baixa" ? value : "media";
}

function normalizeBoolean(value: boolean | string | undefined | null) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value.toLowerCase() === "sim";
  }

  return null;
}

function normalizeAppRow(row: AppReadyRow, source: FinalSignalRow["source"]): FinalSignalRow {
  const locationStatus = normalizeLocationStatus(row.localizacao_status_final);
  const lat = toNumber(row.latitude);
  const lng = toNumber(row.longitude);

  return {
    inscricao: row.inscricao_imobiliaria ?? "",
    endereco: row.endereco_oficial ?? "Endereco em revisao",
    bairro: row.bairro_oficial ?? "Bairro em revisao",
    lat,
    lng,
    iptu2019: toNumber(row.iptu_2019_lancado_num ?? row.iptu_2019_lancado),
    iptu2025: toNumber(row.iptu_2025_observado_num ?? row.iptu_2025_observado),
    estimatedMarketValue: toNumber(row.valor_venal_estimado_num ?? row.valor_venal_estimado),
    valueVenalStatus: row.valor_venal_status ?? "nao_publicado",
    valueVenalConfidence: row.confianca_valor_venal ?? "nao_disponivel",
    locationStatus,
    rawLocationStatus: row.localizacao_status_final ?? locationStatus,
    readyForMap: normalizeBoolean(row.pronto_para_mapa) ?? (lat !== null && lng !== null && locationStatus !== "pendente" && locationStatus !== "ambigua"),
    priorityReview: normalizePriorityReview(row.prioridade_revisao),
    source,
  };
}

function normalizePersistedRow(row: PersistedSignalRow): FinalSignalRow {
  return normalizeAppRow(
    {
      inscricao_imobiliaria: row.inscricao_imobiliaria,
      endereco_oficial: row.endereco_oficial ?? undefined,
      bairro_oficial: row.bairro_oficial ?? undefined,
      latitude: row.latitude,
      longitude: row.longitude,
      iptu_2019_lancado: row.iptu_2019_lancado,
      iptu_2025_observado: row.iptu_2025_observado,
      valor_venal_estimado: row.valor_venal_estimado,
      valor_venal_status: row.valor_venal_status,
      confianca_valor_venal: row.confianca_valor_venal,
      localizacao_status_final: row.localizacao_status_final,
      pronto_para_mapa: row.pronto_para_mapa,
      prioridade_revisao: row.prioridade_revisao,
    },
    "supabase",
  );
}

function parseCsv(content: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < content.length; index++) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index++;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index++;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [header, ...body] = rows;
  if (!header) {
    return [];
  }

  const normalizedHeader = header.map((key) => key.replace(/^\uFEFF/, "").trim());

  return body
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(normalizedHeader.map((key, index) => [key, values[index] ?? ""]))) as AppReadyRow[];
}

async function readAppReadyRows() {
  try {
    const rows = parseCsv(await readFile(finalUnifiedFile, "utf8"));
    return rows.map((row) => normalizeAppRow(row, "base_csn_final_unificada")).filter((row) => row.inscricao);
  } catch {
    return [];
  }
}

function createSupabaseSignalClient() {
  const adminClient = createSupabaseAdminClient();

  if (adminClient) {
    return adminClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, { auth: { persistSession: false } });
}

async function readPersistedRows() {
  const supabase = createSupabaseSignalClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("property_fiscal_signals")
    .select(
      "inscricao_imobiliaria, endereco_oficial, bairro_oficial, latitude, longitude, iptu_2019_lancado, iptu_2025_observado, valor_venal_estimado, valor_venal_status, confianca_valor_venal, localizacao_status_final, pronto_para_mapa, prioridade_revisao",
    )
    .returns<PersistedSignalRow[]>();

  if (error || !data?.length) {
    return [];
  }

  return data.map(normalizePersistedRow);
}

export async function getFinalSignalRows() {
  const persistedRows = await readPersistedRows();

  if (persistedRows.length > 0) {
    return persistedRows;
  }

  return readAppReadyRows();
}

function tokenScore(left: string, right: string) {
  const leftTokens = new Set(normalizeText(left).split(" ").filter((token) => token.length > 2));
  const rightTokens = new Set(normalizeText(right).split(" ").filter((token) => token.length > 2));
  let score = 0;

  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      score += 1;
    }
  }

  return score;
}

function distanceKm(property: Pick<Property, "lat" | "lng">, row: FinalSignalRow) {
  if (row.lat === null || row.lng === null || !Number.isFinite(property.lat) || !Number.isFinite(property.lng)) {
    return 99;
  }

  return Math.hypot((row.lat - property.lat) * 111, (row.lng - property.lng) * 102);
}

function neighborhoodScore(property: Property, row: FinalSignalRow) {
  const propertyNeighborhood = normalizeText(property.neighborhoodName ?? property.neighborhoodSlug ?? "");
  const rowNeighborhood = normalizeText(row.bairro);

  if (!propertyNeighborhood || !rowNeighborhood) {
    return 0;
  }

  if (rowNeighborhood.includes(propertyNeighborhood) || propertyNeighborhood.includes(rowNeighborhood)) {
    return 8;
  }

  if (propertyNeighborhood.includes("VILA SANTA CECILIA") && rowNeighborhood.includes("SANTA CECILIA")) {
    return 8;
  }

  return 0;
}

export async function getFinalSignalForProperty(property: Property) {
  const rows = await getFinalSignalRows();

  return rows
    .map((row) => {
      const distance = distanceKm(property, row);
      const score =
        neighborhoodScore(property, row) +
        tokenScore(property.address, row.endereco) * 3 +
        tokenScore(property.title, row.endereco) -
        Math.min(distance, 8);

      return { row, score };
    })
    .sort((left, right) => right.score - left.score)[0]?.row;
}

export async function getFinalNeighborhoodStats() {
  const rows = await getFinalSignalRows();
  const stats = new Map<string, FinalNeighborhoodStats>();

  for (const row of rows) {
    const key = normalizeText(row.bairro) || "BAIRRO EM REVISAO";
    const current =
      stats.get(key) ??
      {
        bairro: row.bairro,
        registros: 0,
        readyForMapCount: 0,
        priorityCount: 0,
        iptu2025Total: 0,
        estimatedValueTotal: 0,
      };

    current.registros += 1;
    current.readyForMapCount += row.readyForMap ? 1 : 0;
    current.priorityCount += row.priorityReview === "alta" ? 1 : 0;
    current.iptu2025Total += row.iptu2025 ?? 0;
    current.estimatedValueTotal += row.estimatedMarketValue ?? 0;
    stats.set(key, current);
  }

  return stats;
}

export function matchNeighborhoodStat(stats: Map<string, FinalNeighborhoodStats>, name: string) {
  const normalizedName = normalizeText(name);
  return (
    stats.get(normalizedName) ??
    Array.from(stats.entries()).find(([key]) => key.includes(normalizedName) || normalizedName.includes(key))?.[1] ??
    null
  );
}
