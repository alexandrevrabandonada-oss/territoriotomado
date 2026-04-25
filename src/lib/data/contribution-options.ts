import type { PropertyReportType } from "@/types/domain";

export type ContributionReportType = Exclude<PropertyReportType, "memoria">;

export interface ContributionReportOption {
  value: ContributionReportType;
  label: string;
  description: string;
}

export const contributionReportOptions: ContributionReportOption[] = [
  {
    value: "foto",
    label: "Foto atual",
    description: "Registro visual do estado presente do imóvel.",
  },
  {
    value: "relato",
    label: "Relato histórico",
    description: "Memória, contexto e informação situada sobre o imóvel.",
  },
  {
    value: "denuncia",
    label: "Denúncia",
    description: "Sinalização de risco, abuso ou irregularidade.",
  },
  {
    value: "atualizacao",
    label: "Atualização",
    description: "Mudança recente de uso, obra, ocupação ou situação.",
  },
  {
    value: "documento",
    label: "Prova documental",
    description: "Arquivo, recorte ou evidência de apoio à triagem.",
  },
];

export const contributionReportLabelByValue = Object.fromEntries(
  contributionReportOptions.map((option) => [option.value, option.label] as const),
) as Record<ContributionReportType, string>;

export function isContributionReportType(value: string): value is ContributionReportType {
  return contributionReportOptions.some((option) => option.value === value);
}

export function getContributionTypeLabel(value: string) {
  return contributionReportOptions.find((option) => option.value === value)?.label ?? value;
}
