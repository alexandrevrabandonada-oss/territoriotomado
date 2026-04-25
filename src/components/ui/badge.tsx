import { cn } from "@/lib/utils/cn";
import type { Criticality, PropertyActionKind, PropertyReportStatus, PropertyStatus } from "@/types/domain";

interface BadgeProps {
  children?: React.ReactNode;
  tone?: BadgeTone;
  variant?: "solid" | "outline" | "soft";
  kind?: "status" | "criticality" | "moderation" | "action" | "territory";
  value?: string;
  className?: string;
}

type BadgeTone = "yellow" | "blue" | "rust" | "alert" | "neutral" | "default" | "warning" | "critical" | "muted";
type CanonicalBadgeTone = "yellow" | "blue" | "rust" | "alert" | "neutral";

const toneAlias: Record<BadgeTone, CanonicalBadgeTone> = {
  yellow: "yellow",
  blue: "blue",
  rust: "rust",
  alert: "alert",
  neutral: "neutral",
  default: "blue",
  warning: "rust",
  critical: "alert",
  muted: "neutral",
};

const toneClasses: Record<"solid" | "outline" | "soft", Record<CanonicalBadgeTone, string>> = {
  solid: {
    yellow: "border-signal/55 bg-signal/85 text-ink-deep",
    blue: "border-glass/45 bg-steel/55 text-paper",
    rust: "border-rust/50 bg-rust/60 text-paper",
    alert: "border-signal/65 bg-signal text-ink-deep",
    neutral: "border-concrete/30 bg-concrete/28 text-paper",
  },
  outline: {
    yellow: "border-signal/55 bg-transparent text-signal",
    blue: "border-glass/50 bg-transparent text-glass-cold",
    rust: "border-rust/50 bg-transparent text-rust-light",
    alert: "border-signal/70 bg-transparent text-signal-light",
    neutral: "border-concrete/26 bg-transparent text-paper/72",
  },
  soft: {
    yellow: "border-signal/36 bg-signal/12 text-signal",
    blue: "border-glass/40 bg-steel/18 text-glass-cold",
    rust: "border-rust/42 bg-rust/12 text-rust-light",
    alert: "border-signal/48 bg-signal/16 text-signal-light",
    neutral: "border-concrete/18 bg-concrete/9 text-paper/72",
  },
};

const statusTone: Record<PropertyStatus, BadgeTone> = {
  ocupado: "neutral",
  vazio: "rust",
  "em-disputa": "alert",
  "uso-institucional": "blue",
};

const criticalityTone: Record<Criticality, BadgeTone> = {
  alta: "alert",
  media: "yellow",
  baixa: "neutral",
};

const moderationTone: Record<PropertyReportStatus, BadgeTone> = {
  aprovado: "blue",
  pendente: "yellow",
  rejeitado: "alert",
};

const actionTone: Record<PropertyActionKind, BadgeTone> = {
  campanha: "yellow",
  plenaria: "blue",
  mutirao: "blue",
  "abaixo-assinado": "yellow",
  "protocolo-requerimento": "neutral",
  "reuniao-territorial": "blue",
  ato: "alert",
  oficina: "rust",
};

const territoryTone: Record<string, BadgeTone> = {
  bairro: "blue",
  "pressao-alta": "alert",
  "leitura-ativa": "neutral",
  "foco-ativo": "yellow",
  "sem-recorte": "neutral",
  "recorte-ativo": "yellow",
};

export const badgeToneByStatus: Record<PropertyStatus, BadgeTone> = statusTone;
export const badgeToneByCriticality: Record<Criticality, BadgeTone> = criticalityTone;
export const badgeToneByReportStatus: Record<PropertyReportStatus, BadgeTone> = moderationTone;

function normalizeTone(tone: BadgeTone) {
  return toneAlias[tone];
}

function getTone(kind: BadgeProps["kind"], value: string | undefined, tone: BadgeTone) {
  if (!kind || !value) {
    return normalizeTone(tone);
  }

  if (kind === "status" && value in statusTone) {
    return normalizeTone(statusTone[value as PropertyStatus]);
  }

  if (kind === "criticality" && value in criticalityTone) {
    return normalizeTone(criticalityTone[value as Criticality]);
  }

  if (kind === "moderation" && value in moderationTone) {
    return normalizeTone(moderationTone[value as PropertyReportStatus]);
  }

  if (kind === "action" && value in actionTone) {
    return normalizeTone(actionTone[value as PropertyActionKind]);
  }

  if (kind === "territory" && value in territoryTone) {
    return normalizeTone(territoryTone[value]);
  }

  return normalizeTone(tone);
}

function getLabel(children: React.ReactNode, value: string | undefined) {
  return children ?? value;
}

export function Badge({ children, tone = "default", variant = "soft", kind, value, className }: BadgeProps) {
  const resolvedTone = getTone(kind, value, tone);

  return (
    <span
      className={cn(
        "tt-chip inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
        toneClasses[variant][resolvedTone],
        className,
      )}
    >
      {getLabel(children, value)}
    </span>
  );
}
