import type { PropertyReportType } from "@/types/domain";

export type ContributionEditorialDestination = "relato_publico" | "timeline" | "media";
export type ContributionMediaTarget = "image" | "document";

export interface ContributionEditorialOption {
  value: ContributionEditorialDestination;
  label: string;
  description: string;
}

export const contributionEditorialOptions: ContributionEditorialOption[] = [
  {
    value: "relato_publico",
    label: "Relato publico",
    description: "Entra como relato aprovado no acervo publico do imovel.",
  },
  {
    value: "timeline",
    label: "Linha do tempo",
    description: "Vira marco historico ou registro situado na ficha do imovel.",
  },
  {
    value: "media",
    label: "Acervo de midia",
    description: "Vira imagem ou documento do imovel, conforme o anexo ou link.",
  },
];

export const contributionEditorialLabelByValue = Object.fromEntries(
  contributionEditorialOptions.map((option) => [option.value, option.label] as const),
) as Record<ContributionEditorialDestination, string>;

export function isContributionEditorialDestination(value: string): value is ContributionEditorialDestination {
  return contributionEditorialOptions.some((option) => option.value === value);
}

export function getContributionEditorialDestinationLabel(value: string) {
  return contributionEditorialLabelByValue[value as ContributionEditorialDestination] ?? value;
}

export function getDefaultEditorialDestination(reportType: PropertyReportType) {
  switch (reportType) {
    case "foto":
    case "documento":
      return "media" as const;
    case "atualizacao":
      return "timeline" as const;
    case "denuncia":
    case "relato":
    default:
      return "relato_publico" as const;
  }
}

export function inferContributionMediaTarget(args: {
  reportType: PropertyReportType;
  attachmentMimeType: string | null;
  sourceUrl: string | null;
}): ContributionMediaTarget | null {
  if (args.attachmentMimeType?.startsWith("image/")) {
    return "image";
  }

  if (args.reportType === "foto") {
    return "image";
  }

  if (args.attachmentMimeType === "application/pdf" || args.reportType === "documento" || args.sourceUrl) {
    return "document";
  }

  return null;
}

