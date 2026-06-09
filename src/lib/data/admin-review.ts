import { readFile, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const outputDir = "C:\\Users\\Micro\\OneDrive\\Documentos\\Estudo renda mediana histórica\\data\\output";
const appReadyFile = path.join(outputDir, "base_csn_app_ready.json");
const historyFile = path.join(process.cwd(), "data", "review-history.json");
const overridesFile = path.join(process.cwd(), "data", "review-overrides.json");

export type ReviewDecision = "confirmado" | "suspenso" | "manter_revisao";
export type ReviewLocationStatus = "localizacao_confirmada" | "localizacao_aproximada" | "localizacao_ambigua" | "localizacao_pendente";
export type ReviewValueStatus = "estimativa_confirmada" | "estimativa_suspensa" | "revisao_manual";

export interface ReviewSourceRow {
  inscricao_imobiliaria: string;
  endereco_oficial: string;
  bairro_oficial: string;
  latitude?: number | null;
  longitude?: number | null;
  localizacao_status_final: string;
  valor_venal_status: string;
  prioridade_revisao: string;
  pronto_para_mapa: boolean;
  iptu_2025_observado?: number | null;
  valor_venal_estimado?: number | null;
}

export interface ReviewOverride {
  inscricao: string;
  enderecoConfirmado: string;
  bairroConfirmado: string;
  latitude: number | null;
  longitude: number | null;
  localizacaoStatus: ReviewLocationStatus;
  valorVenalStatus: ReviewValueStatus;
  decisao: ReviewDecision;
  observacao: string;
  reviewedAt: string;
  reviewer: string;
}

export interface ReviewHistoryEntry extends ReviewOverride {
  id: string;
  previousEndereco: string;
  previousBairro: string;
  previousLocalizacaoStatus: string;
  previousValorVenalStatus: string;
  previousPrioridade: string;
}

export interface ReviewQueueItem extends ReviewSourceRow {
  flags: string[];
  currentOverride?: ReviewOverride;
  reviewed: boolean;
  publicImpact: string;
  impactScore: number;
  fiscalImpact: number;
  canImproveMap: boolean;
  canResolveAmbiguity: boolean;
  canCirculate: boolean;
}

export interface ReviewOperationState {
  items: ReviewQueueItem[];
  allItems: ReviewQueueItem[];
  weeklyFocus: {
    neighborhoods: Array<{
      bairro: string;
      pending: number;
      highPriority: number;
      releasedForMap: number;
      circulationCandidates: number;
      fiscalImpact: number;
      topItems: ReviewQueueItem[];
    }>;
    newlyClosed: ReviewQueueItem[];
    releasedForMap: ReviewQueueItem[];
    circulationCandidates: ReviewQueueItem[];
  };
  byNeighborhood: Array<{
    bairro: string;
    total: number;
    pending: number;
    highPriority: number;
    readyForMap: number;
    fiscalImpact: number;
    topItems: ReviewQueueItem[];
  }>;
  fiscalViews: {
    biggestFiscalImpact: ReviewQueueItem[];
    biggestIptu: ReviewQueueItem[];
    biggestEstimatedValue: ReviewQueueItem[];
  };
  history: ReviewHistoryEntry[];
  metrics: {
    totalFocus: number;
    reviewed: number;
    pending: number;
    ambiguousLocation: number;
    pendingLocation: number;
    manualValueReview: number;
    highPriority: number;
    readyForMapAfterReview: number;
    releasedForMap: number;
    resolvedAmbiguity: number;
    releasedForCirculation: number;
    progressPercent: number;
  };
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function toNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isReviewLocationStatus(value: string): value is ReviewLocationStatus {
  return ["localizacao_confirmada", "localizacao_aproximada", "localizacao_ambigua", "localizacao_pendente"].includes(value);
}

function isReviewValueStatus(value: string): value is ReviewValueStatus {
  return ["estimativa_confirmada", "estimativa_suspensa", "revisao_manual"].includes(value);
}

function isReviewDecision(value: string): value is ReviewDecision {
  return ["confirmado", "suspenso", "manter_revisao"].includes(value);
}

async function getSourceRows(): Promise<ReviewSourceRow[]> {
  const rows = await readJsonFile<ReviewSourceRow[]>(appReadyFile, []);
  return rows;
}

export async function getReviewOverrides(): Promise<Record<string, ReviewOverride>> {
  return readJsonFile<Record<string, ReviewOverride>>(overridesFile, {});
}

async function getReviewHistory(): Promise<ReviewHistoryEntry[]> {
  return readJsonFile<ReviewHistoryEntry[]>(historyFile, []);
}

async function persistReviewToSupabase(source: ReviewSourceRow, override: ReviewOverride, historyEntry: ReviewHistoryEntry) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  try {
    await supabase.from("property_fiscal_signals").upsert(
      {
        inscricao_imobiliaria: override.inscricao,
        endereco_oficial: override.enderecoConfirmado || source.endereco_oficial,
        bairro_oficial: override.bairroConfirmado || source.bairro_oficial,
        latitude: override.latitude ?? source.latitude ?? null,
        longitude: override.longitude ?? source.longitude ?? null,
        iptu_2025_observado: source.iptu_2025_observado ?? null,
        valor_venal_estimado: source.valor_venal_estimado ?? null,
        valor_venal_status: override.valorVenalStatus,
        confianca_valor_venal: source.valor_venal_status === "revisao_manual" ? "revisao" : null,
        localizacao_status_final: override.localizacaoStatus,
        pronto_para_mapa:
          override.decisao === "confirmado" &&
          (override.localizacaoStatus === "localizacao_confirmada" || override.localizacaoStatus === "localizacao_aproximada") &&
          override.latitude !== null &&
          override.longitude !== null,
        prioridade_revisao: override.decisao === "confirmado" ? "baixa" : source.prioridade_revisao,
        fonte: "admin_revisao",
        revisado_em: override.reviewedAt,
        revisado_por: override.reviewer,
        observacao: override.observacao || null,
      },
      { onConflict: "inscricao_imobiliaria" },
    );

    await supabase.from("property_signal_reviews").insert({
      inscricao_imobiliaria: override.inscricao,
      previous_payload: {
        endereco: historyEntry.previousEndereco,
        bairro: historyEntry.previousBairro,
        localizacao_status_final: historyEntry.previousLocalizacaoStatus,
        valor_venal_status: historyEntry.previousValorVenalStatus,
        prioridade_revisao: historyEntry.previousPrioridade,
      },
      next_payload: {
        endereco: override.enderecoConfirmado,
        bairro: override.bairroConfirmado,
        latitude: override.latitude,
        longitude: override.longitude,
        localizacao_status_final: override.localizacaoStatus,
        valor_venal_status: override.valorVenalStatus,
        decisao: override.decisao,
      },
      decision: override.decisao,
      reviewer: override.reviewer,
      notes: override.observacao || null,
    });
  } catch {
    // Migration may not be applied yet; local history remains the compatibility layer.
  }
}

function getFlags(row: ReviewSourceRow) {
  const flags: string[] = [];

  if (row.localizacao_status_final === "localizacao_ambigua") {
    flags.push("localizacao_ambigua");
  }

  if (row.localizacao_status_final === "localizacao_pendente") {
    flags.push("localizacao_pendente");
  }

  if (row.valor_venal_status === "revisao_manual") {
    flags.push("valor_venal_revisao_manual");
  }

  if (row.prioridade_revisao === "alta") {
    flags.push("prioridade_revisao_alta");
  }

  return flags;
}

function isReadyForMapByOverride(override?: ReviewOverride) {
  return (
    override?.decisao === "confirmado" &&
    (override.localizacaoStatus === "localizacao_confirmada" || override.localizacaoStatus === "localizacao_aproximada") &&
    override.latitude !== null &&
    override.longitude !== null
  );
}

function canCirculateAfterOverride(row: ReviewSourceRow, override?: ReviewOverride) {
  if (!override || override.decisao !== "confirmado") {
    return false;
  }

  const valueResolved = override.valorVenalStatus === "estimativa_confirmada" || override.valorVenalStatus === "estimativa_suspensa";
  const locationResolved = override.localizacaoStatus === "localizacao_confirmada" || override.localizacaoStatus === "localizacao_aproximada";

  return valueResolved && locationResolved && (row.iptu_2025_observado !== null || row.valor_venal_estimado !== null);
}

function fiscalImpact(row: ReviewSourceRow) {
  return (row.iptu_2025_observado ?? 0) + Math.round((row.valor_venal_estimado ?? 0) / 100);
}

function priorityWeight(priority: string) {
  if (priority === "alta") {
    return 800;
  }

  if (priority === "media") {
    return 250;
  }

  return 0;
}

function impactScore(row: ReviewSourceRow) {
  const mapWeight = row.pronto_para_mapa ? 0 : 350;
  const ambiguityWeight = row.localizacao_status_final === "localizacao_ambigua" ? 260 : row.localizacao_status_final === "localizacao_pendente" ? 420 : 0;
  const valueWeight = row.valor_venal_status === "revisao_manual" ? 220 : 0;

  return priorityWeight(row.prioridade_revisao) + mapWeight + ambiguityWeight + valueWeight + Math.round(fiscalImpact(row) / 1000);
}

function applyOverride(row: ReviewSourceRow, override?: ReviewOverride): ReviewQueueItem {
  const flags = getFlags(row);
  const readyAfterReview = isReadyForMapByOverride(override);
  const canImproveMap = !row.pronto_para_mapa && (row.latitude !== null || override?.latitude !== null);
  const canResolveAmbiguity = row.localizacao_status_final === "localizacao_ambigua" || row.localizacao_status_final === "localizacao_pendente";
  const canCirculate = row.valor_venal_status !== "revisao_manual" && row.localizacao_status_final !== "localizacao_pendente";

  return {
    ...row,
    flags,
    currentOverride: override,
    reviewed: Boolean(override),
    impactScore: impactScore(row),
    fiscalImpact: fiscalImpact(row),
    canImproveMap,
    canResolveAmbiguity,
    canCirculate,
    publicImpact: override
      ? readyAfterReview
        ? "melhora o mapa publico"
        : override.decisao === "suspenso"
          ? "suspende estimativa ate checagem"
          : "mantem item em revisao publica"
      : "aguarda decisao operacional",
  };
}

export type ReviewSortMode = "impacto_fiscal" | "prioridade_revisao" | "bairro" | "pronto_para_mapa" | "inteligencia";

function sortItems(items: ReviewQueueItem[], sortMode: ReviewSortMode) {
  const pendingFirst = (a: ReviewQueueItem, b: ReviewQueueItem) => Number(a.reviewed) - Number(b.reviewed);
  const priorityOrder = (priority: string) => (priority === "alta" ? 3 : priority === "media" ? 2 : 1);

  return [...items].sort((a, b) => {
    const reviewed = pendingFirst(a, b);

    if (reviewed !== 0) {
      return reviewed;
    }

    if (sortMode === "impacto_fiscal") {
      return b.fiscalImpact - a.fiscalImpact || b.impactScore - a.impactScore;
    }

    if (sortMode === "prioridade_revisao") {
      return priorityOrder(b.prioridade_revisao) - priorityOrder(a.prioridade_revisao) || b.impactScore - a.impactScore;
    }

    if (sortMode === "bairro") {
      return a.bairro_oficial.localeCompare(b.bairro_oficial) || b.impactScore - a.impactScore;
    }

    if (sortMode === "pronto_para_mapa") {
      return Number(a.pronto_para_mapa) - Number(b.pronto_para_mapa) || b.impactScore - a.impactScore;
    }

    return b.impactScore - a.impactScore || b.flags.length - a.flags.length || a.endereco_oficial.localeCompare(b.endereco_oficial);
  });
}

function groupByNeighborhood(items: ReviewQueueItem[]) {
  const groups = new Map<string, ReviewQueueItem[]>();

  for (const item of items) {
    groups.set(item.bairro_oficial, [...(groups.get(item.bairro_oficial) ?? []), item]);
  }

  return Array.from(groups.entries())
    .map(([bairro, group]) => ({
      bairro,
      total: group.length,
      pending: group.filter((item) => !item.reviewed).length,
      highPriority: group.filter((item) => item.prioridade_revisao === "alta").length,
      readyForMap: group.filter((item) => item.pronto_para_mapa || isReadyForMapByOverride(item.currentOverride)).length,
      fiscalImpact: group.reduce((total, item) => total + item.fiscalImpact, 0),
      topItems: sortItems(group, "inteligencia").slice(0, 3),
    }))
    .sort((a, b) => b.pending - a.pending || b.fiscalImpact - a.fiscalImpact || a.bairro.localeCompare(b.bairro));
}

function buildWeeklyFocus(items: ReviewQueueItem[], history: ReviewHistoryEntry[]) {
  const recentlyReviewed = history
    .map((entry) => items.find((item) => item.inscricao_imobiliaria === entry.inscricao))
    .filter((item): item is ReviewQueueItem => Boolean(item));

  const releasedForMap = items
    .filter((item) => !item.pronto_para_mapa && isReadyForMapByOverride(item.currentOverride))
    .sort((left, right) => right.fiscalImpact - left.fiscalImpact)
    .slice(0, 6);

  const circulationCandidates = items
    .filter((item) => item.reviewed ? canCirculateAfterOverride(item, item.currentOverride) : item.canCirculate)
    .sort((left, right) => {
      const leftPriority = left.prioridade_revisao === "alta" ? 1 : 0;
      const rightPriority = right.prioridade_revisao === "alta" ? 1 : 0;

      return rightPriority - leftPriority || right.fiscalImpact - left.fiscalImpact;
    })
    .slice(0, 8);

  const neighborhoods = groupByNeighborhood(items)
    .map((group) => {
      const groupItems = items.filter((item) => item.bairro_oficial === group.bairro);

      return {
        bairro: group.bairro,
        pending: group.pending,
        highPriority: group.highPriority,
        releasedForMap: groupItems.filter((item) => !item.pronto_para_mapa && isReadyForMapByOverride(item.currentOverride)).length,
        circulationCandidates: groupItems.filter((item) => item.reviewed ? canCirculateAfterOverride(item, item.currentOverride) : item.canCirculate).length,
        fiscalImpact: group.fiscalImpact,
        topItems: group.topItems,
      };
    })
    .sort((left, right) => {
      const leftScore = left.pending * 12 + left.highPriority * 20 + left.releasedForMap * 18 + left.circulationCandidates * 10 + Math.round(left.fiscalImpact / 100000);
      const rightScore = right.pending * 12 + right.highPriority * 20 + right.releasedForMap * 18 + right.circulationCandidates * 10 + Math.round(right.fiscalImpact / 100000);

      return rightScore - leftScore || right.fiscalImpact - left.fiscalImpact || left.bairro.localeCompare(right.bairro);
    })
    .slice(0, 4);

  return {
    neighborhoods,
    newlyClosed: recentlyReviewed.slice(0, 6),
    releasedForMap,
    circulationCandidates,
  };
}

export async function getReviewOperationState(options: { sort?: ReviewSortMode; bairro?: string } = {}): Promise<ReviewOperationState> {
  const [rows, overrides, history] = await Promise.all([getSourceRows(), getReviewOverrides(), getReviewHistory()]);
  const focusRows = rows.filter((row) => getFlags(row).length > 0);
  const allItems = focusRows.map((row) => applyOverride(row, overrides[row.inscricao_imobiliaria]));
  const selectedNeighborhood = options.bairro?.trim();
  const scopedItems = selectedNeighborhood ? allItems.filter((item) => item.bairro_oficial === selectedNeighborhood) : allItems;
  const items = sortItems(scopedItems, options.sort ?? "inteligencia").slice(0, 80);
  const reviewed = focusRows.filter((row) => Boolean(overrides[row.inscricao_imobiliaria])).length;
  const readyForMapAfterReview = allItems.filter((item) => isReadyForMapByOverride(item.currentOverride)).length;
  const releasedForMap = allItems.filter((item) => !item.pronto_para_mapa && isReadyForMapByOverride(item.currentOverride)).length;
  const resolvedAmbiguity = allItems.filter(
    (item) =>
      (item.localizacao_status_final === "localizacao_ambigua" || item.localizacao_status_final === "localizacao_pendente") &&
      (item.currentOverride?.localizacaoStatus === "localizacao_confirmada" || item.currentOverride?.localizacaoStatus === "localizacao_aproximada"),
  ).length;
  const releasedForCirculation = allItems.filter((item) => canCirculateAfterOverride(item, item.currentOverride)).length;

  return {
    items,
    allItems,
    weeklyFocus: buildWeeklyFocus(allItems, history),
    byNeighborhood: groupByNeighborhood(allItems),
    fiscalViews: {
      biggestFiscalImpact: sortItems(allItems, "impacto_fiscal").slice(0, 8),
      biggestIptu: [...allItems].sort((a, b) => (b.iptu_2025_observado ?? 0) - (a.iptu_2025_observado ?? 0)).slice(0, 8),
      biggestEstimatedValue: [...allItems].sort((a, b) => (b.valor_venal_estimado ?? 0) - (a.valor_venal_estimado ?? 0)).slice(0, 8),
    },
    history: history.slice(0, 12),
    metrics: {
      totalFocus: focusRows.length,
      reviewed,
      pending: Math.max(focusRows.length - reviewed, 0),
      ambiguousLocation: focusRows.filter((row) => row.localizacao_status_final === "localizacao_ambigua").length,
      pendingLocation: focusRows.filter((row) => row.localizacao_status_final === "localizacao_pendente").length,
      manualValueReview: focusRows.filter((row) => row.valor_venal_status === "revisao_manual").length,
      highPriority: focusRows.filter((row) => row.prioridade_revisao === "alta").length,
      readyForMapAfterReview,
      releasedForMap,
      resolvedAmbiguity,
      releasedForCirculation,
      progressPercent: focusRows.length ? Math.round((reviewed / focusRows.length) * 100) : 100,
    },
  };
}

export async function saveReviewAction(formData: FormData) {
  "use server";

  const target = getString(formData, "redirect_to") || "/admin/revisao";
  const inscricao = getString(formData, "inscricao");
  const enderecoConfirmado = getString(formData, "endereco_confirmado");
  const bairroConfirmado = getString(formData, "bairro_confirmado");
  const localizacaoStatus = getString(formData, "localizacao_status");
  const valorVenalStatus = getString(formData, "valor_venal_status");
  const decisao = getString(formData, "decisao");
  const observacao = getString(formData, "observacao");
  const reviewer = getString(formData, "reviewer") || "equipe";
  const latitude = toNumber(formData.get("latitude"));
  const longitude = toNumber(formData.get("longitude"));

  if (!inscricao || !enderecoConfirmado || !bairroConfirmado) {
    redirect(`${target}?error=${encodeURIComponent("Confirme inscricao, endereco e bairro.")}`);
  }

  if (!isReviewLocationStatus(localizacaoStatus) || !isReviewValueStatus(valorVenalStatus) || !isReviewDecision(decisao)) {
    redirect(`${target}?error=${encodeURIComponent("Decisao de revisao invalida.")}`);
  }

  if ((localizacaoStatus === "localizacao_confirmada" || localizacaoStatus === "localizacao_aproximada") && (latitude === null || longitude === null)) {
    redirect(`${target}?error=${encodeURIComponent("Localizacao marcada exige latitude e longitude.")}`);
  }

  const rows = await getSourceRows();
  const source = rows.find((row) => row.inscricao_imobiliaria === inscricao);

  if (!source) {
    redirect(`${target}?error=${encodeURIComponent("Registro nao encontrado na base de saida.")}`);
  }

  const reviewedAt = new Date().toISOString();
  const override: ReviewOverride = {
    inscricao,
    enderecoConfirmado,
    bairroConfirmado,
    latitude,
    longitude,
    localizacaoStatus,
    valorVenalStatus,
    decisao,
    observacao,
    reviewedAt,
    reviewer,
  };
  const historyEntry: ReviewHistoryEntry = {
    id: `${Date.now()}-${inscricao.replace(/[^a-zA-Z0-9]/g, "")}`,
    ...override,
    previousEndereco: source?.endereco_oficial ?? "",
    previousBairro: source?.bairro_oficial ?? "",
    previousLocalizacaoStatus: source?.localizacao_status_final ?? "",
    previousValorVenalStatus: source?.valor_venal_status ?? "",
    previousPrioridade: source?.prioridade_revisao ?? "",
  };
  const [overrides, history] = await Promise.all([getReviewOverrides(), getReviewHistory()]);

  await Promise.all([
    writeFile(overridesFile, `${JSON.stringify({ ...overrides, [inscricao]: override }, null, 2)}\n`, "utf8"),
    writeFile(historyFile, `${JSON.stringify([historyEntry, ...history], null, 2)}\n`, "utf8"),
    persistReviewToSupabase(source as ReviewSourceRow, override, historyEntry),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/revisao");
  revalidatePath("/circulacao");
  revalidatePath("/mapa");
  redirect(`${target}?saved=1`);
}
