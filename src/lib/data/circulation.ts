import { getReviewOverrides } from "@/lib/data/admin-review";
import { getFinalNeighborhoodStats, getFinalSignalRows, type FinalSignalRow } from "@/lib/data/final-signals";

export type RankingKind = "top-iptu-2025" | "valor-venal-estimado" | "concentracao-bairros" | "revisao-prioritaria";

export interface CirculationRankingItem {
  rank: number;
  inscricao: string;
  endereco: string;
  bairro: string;
  iptu2025: number | null;
  iptu2019: number | null;
  valorVenal: number | null;
  valorVenalStatus: string;
  localizacaoStatus: string;
  prioridadeRevisao: string;
  prontoParaMapa: boolean;
}

export interface NeighborhoodRankingItem {
  rank: number;
  bairro: string;
  registros: number;
  somaValorVenal: number;
  somaIptu2025: number;
  resumo: string;
  estrategicos: CirculationRankingItem[];
}

export interface CirculationRankings {
  topIptu2025: CirculationRankingItem[];
  topValorVenal: CirculationRankingItem[];
  revisaoPrioritaria: CirculationRankingItem[];
  bairrosConcentracao: NeighborhoodRankingItem[];
}

export interface RankingShareData {
  title: string;
  label: string;
  metric: string;
  metricLabel: string;
  subject: string;
  context: string;
  sourceLabel: string;
  reviewLabel: string;
}

function toMoney(value: number | null) {
  if (value === null) {
    return "em revisao";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

function normalizeOverrideLocationStatus(value: string | undefined) {
  if (value === "localizacao_confirmada") {
    return "localizacao_confirmada";
  }

  if (value === "localizacao_aproximada") {
    return "localizacao_aproximada";
  }

  if (value === "localizacao_ambigua") {
    return "localizacao_ambigua";
  }

  if (value === "localizacao_pendente") {
    return "localizacao_pendente";
  }

  return undefined;
}

function normalizeOverrideValueStatus(value: string | undefined) {
  if (value === "estimativa_confirmada") {
    return "estimativa_confirmada_por_revisao";
  }

  if (value === "estimativa_suspensa") {
    return "estimativa_suspensa_por_revisao";
  }

  if (value === "revisao_manual") {
    return "revisao_manual";
  }

  return undefined;
}

function makeNeighborhoodSummary(item: Omit<NeighborhoodRankingItem, "resumo" | "estrategicos">) {
  const concentration = item.registros >= 40 ? "concentracao alta" : item.registros >= 20 ? "concentracao relevante" : "concentracao localizada";
  const fiscalPressure = item.somaIptu2025 > 0 ? `${toMoney(item.somaIptu2025)} em IPTU 2025 observado` : "IPTU 2025 ainda em revisao";
  const estimatedPressure = item.somaValorVenal > 0 ? `${toMoney(item.somaValorVenal)} em valor venal estimado` : "valor venal ainda em revisao";

  return `${item.bairro} tem ${concentration}: ${item.registros} registros ligados a CSN, ${fiscalPressure} e ${estimatedPressure}. Use este recorte para pauta local, cobranca publica e organizacao de revisao.`;
}

function mapFinalSignalRow(row: FinalSignalRow, index: number, overrides: Awaited<ReturnType<typeof getReviewOverrides>>): CirculationRankingItem {
  const override = overrides[row.inscricao];

  return {
    rank: index + 1,
    inscricao: row.inscricao,
    endereco: override?.enderecoConfirmado ?? row.endereco,
    bairro: override?.bairroConfirmado ?? row.bairro,
    iptu2025: row.iptu2025,
    iptu2019: row.iptu2019,
    valorVenal: row.estimatedMarketValue,
    valorVenalStatus: normalizeOverrideValueStatus(override?.valorVenalStatus) ?? row.valueVenalStatus,
    localizacaoStatus: normalizeOverrideLocationStatus(override?.localizacaoStatus) ?? row.rawLocationStatus,
    prioridadeRevisao: override?.decisao === "confirmado" ? "baixa" : row.priorityReview,
    prontoParaMapa: override?.localizacaoStatus === "localizacao_confirmada" || override?.localizacaoStatus === "localizacao_aproximada" || row.readyForMap,
  };
}

export async function getCirculationRankings(): Promise<CirculationRankings> {
  const [rows, neighborhoodStats, overrides] = await Promise.all([
    getFinalSignalRows(),
    getFinalNeighborhoodStats(),
    getReviewOverrides(),
  ]);
  const mappedRows = rows.map((row, index) => mapFinalSignalRow(row, index, overrides));
  function scoreStrategic(row: CirculationRankingItem) {
    const reviewScore = row.prioridadeRevisao === "alta" ? 400 : row.prioridadeRevisao === "media" ? 120 : 0;
    const locationScore = row.localizacaoStatus.includes("ambigua") || row.localizacaoStatus.includes("pendente") ? 220 : 0;
    const valueScore = Math.round((row.valorVenal ?? 0) / 100000);
    const iptuScore = Math.round((row.iptu2025 ?? 0) / 1000);

    return reviewScore + locationScore + valueScore + iptuScore;
  }

  const bairros = Array.from(neighborhoodStats.values())
    .sort((left, right) => right.registros - left.registros)
    .map((item, index) => {
      const mapped = {
        rank: index + 1,
        bairro: item.bairro,
        registros: item.registros,
        somaValorVenal: item.estimatedValueTotal,
        somaIptu2025: item.iptu2025Total,
      };
      const estrategicos = mappedRows
        .filter((row) => row.bairro.toUpperCase() === item.bairro.toUpperCase())
        .sort((left, right) => scoreStrategic(right) - scoreStrategic(left))
        .slice(0, 3)
        .map((row, strategicIndex) => ({ ...row, rank: strategicIndex + 1 }));

      return {
        ...mapped,
        resumo: makeNeighborhoodSummary(mapped),
        estrategicos,
      };
    });

  return {
    topIptu2025: mappedRows
      .filter((row) => row.iptu2025 !== null)
      .sort((left, right) => (right.iptu2025 ?? 0) - (left.iptu2025 ?? 0))
      .slice(0, 8)
      .map((row, index) => ({ ...row, rank: index + 1 })),
    topValorVenal: mappedRows
      .filter((row) => row.valorVenal !== null)
      .sort((left, right) => (right.valorVenal ?? 0) - (left.valorVenal ?? 0))
      .slice(0, 8)
      .map((row, index) => ({ ...row, rank: index + 1 })),
    bairrosConcentracao: bairros.slice(0, 8),
    revisaoPrioritaria: mappedRows
      .filter((row) => row.prioridadeRevisao === "alta" || row.localizacaoStatus.includes("ambigua") || row.localizacaoStatus.includes("pendente") || row.valorVenalStatus === "revisao_manual")
      .slice(0, 8)
      .map((row, index) => ({ ...row, rank: index + 1 })),
  };
}

export function getRankingMeta(kind: RankingKind) {
  const meta: Record<RankingKind, { title: string; label: string; metricLabel: string; sourceLabel: string }> = {
    "top-iptu-2025": {
      title: "Top IPTU 2025",
      label: "ranking oficial",
      metricLabel: "IPTU 2025 observado",
      sourceLabel: "dado oficial",
    },
    "valor-venal-estimado": {
      title: "Top valor venal estimado",
      label: "ranking estimado",
      metricLabel: "valor venal estimado",
      sourceLabel: "dado estimado",
    },
    "concentracao-bairros": {
      title: "Bairros com maior concentracao",
      label: "ranking territorial",
      metricLabel: "registros no bairro",
      sourceLabel: "dado oficial + estimado",
    },
    "revisao-prioritaria": {
      title: "Revisao prioritaria",
      label: "fila publica",
      metricLabel: "prioridade de revisao",
      sourceLabel: "dado em revisao",
    },
  };

  return meta[kind];
}

export async function getRankingShareData(kind: RankingKind): Promise<RankingShareData | null> {
  const rankings = await getCirculationRankings();
  const meta = getRankingMeta(kind);

  if (kind === "concentracao-bairros") {
    const item = rankings.bairrosConcentracao[0];
    if (!item) {
      return null;
    }

    return {
      title: meta.title,
      label: meta.label,
      metric: String(item.registros),
      metricLabel: meta.metricLabel,
      subject: item.bairro,
      context: item.resumo,
      sourceLabel: meta.sourceLabel,
      reviewLabel: "leitura por bairro",
    };
  }

  const source =
    kind === "top-iptu-2025" ? rankings.topIptu2025 : kind === "valor-venal-estimado" ? rankings.topValorVenal : rankings.revisaoPrioritaria;
  const item = source[0];

  if (!item) {
    return null;
  }

  return {
    title: meta.title,
    label: meta.label,
    metric:
      kind === "top-iptu-2025"
        ? toMoney(item.iptu2025)
        : kind === "valor-venal-estimado"
          ? toMoney(item.valorVenal)
          : normalizeLabel(item.prioridadeRevisao),
    metricLabel: meta.metricLabel,
    subject: item.endereco,
    context: `${item.bairro}. Localizacao: ${normalizeLabel(item.localizacaoStatus)}. Valor venal: ${normalizeLabel(item.valorVenalStatus)}.`,
    sourceLabel: meta.sourceLabel,
    reviewLabel: `revisao ${normalizeLabel(item.prioridadeRevisao)}`,
  };
}

export async function getNeighborhoodShareData(bairro: string): Promise<RankingShareData | null> {
  const rankings = await getCirculationRankings();
  const decoded = decodeURIComponent(bairro).replaceAll("-", " ").toUpperCase();
  const item = rankings.bairrosConcentracao.find((candidate) => candidate.bairro.toUpperCase() === decoded) ?? rankings.bairrosConcentracao[0];

  if (!item) {
    return null;
  }

  return {
    title: "Bairro em disputa",
    label: "card de bairro",
    metric: String(item.registros),
    metricLabel: "registros ligados a CSN",
    subject: item.bairro,
    context: item.resumo,
    sourceLabel: "oficial + estimado",
    reviewLabel: "leitura territorial",
  };
}

export function money(value: number | null) {
  return toMoney(value);
}

export function publicLabel(value: string) {
  return normalizeLabel(value);
}
