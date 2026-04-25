import type { ReactNode } from "react";
import { getActionKindLabel } from "@/lib/data/action-kinds";

export type ShareVariant = "wide" | "square" | "story";

export interface PropertySharePackData {
  title: string;
  neighborhoodName: string;
  status: string;
  criticality: string;
  phrase: string;
}

export interface ActionSharePackData {
  actionKind: string;
  propertyTitle: string;
  neighborhoodName: string;
  ctaLabel: string;
  phrase: string;
}

const variantConfig: Record<
  ShareVariant,
  {
    padding: string;
    titleSize: number;
    phraseSize: number;
    metaSize: number;
    footerSize: number;
  }
> = {
  wide: {
    padding: "64px 72px",
    titleSize: 78,
    phraseSize: 30,
    metaSize: 24,
    footerSize: 22,
  },
  square: {
    padding: "72px",
    titleSize: 86,
    phraseSize: 34,
    metaSize: 26,
    footerSize: 24,
  },
  story: {
    padding: "84px 68px 92px",
    titleSize: 88,
    phraseSize: 36,
    metaSize: 26,
    footerSize: 24,
  },
};

function Shell({
  variant,
  children,
  accentLabel,
}: {
  variant: ShareVariant;
  children: ReactNode;
  accentLabel: string;
}) {
  const config = variantConfig[variant];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#3b474f",
        color: "#f2f4ef",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(169, 188, 196, 0.28), transparent 28%), radial-gradient(circle at 82% 18%, rgba(233, 173, 18, 0.14), transparent 24%), linear-gradient(180deg, rgba(211, 217, 213, 0.16), transparent 20%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            "linear-gradient(rgba(242, 244, 239, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 244, 239, 0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.08))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: variant === "story" ? "34%" : "28%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(233, 173, 18, 0.16), rgba(169, 188, 196, 0.06) 45%, rgba(59, 71, 79, 0))",
          clipPath: "polygon(100% 0, 100% 100%, 18% 100%, 0 0)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: config.padding,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                border: "1px solid rgba(211, 217, 213, 0.22)",
                background: "rgba(70, 84, 93, 0.78)",
                color: "#ffd76a",
                padding: "10px 14px",
                fontSize: 18,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {accentLabel}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "rgba(242, 244, 239, 0.72)",
              fontSize: 16,
            }}
          >
            <span>VR Abandonada</span>
            <span>Território Tomado</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: variant === "story" ? 900 : 980 }}>
          {children}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                width: "92px",
                height: "4px",
                background: "linear-gradient(90deg, #e9ad12, #a9bcc4)",
              }}
            />
            <div style={{ fontSize: config.footerSize, textTransform: "uppercase", letterSpacing: "0.24em", color: "#f2f4ef" }}>
              Território Tomado
            </div>
          </div>
          <div
            style={{
              border: "1px solid rgba(211, 217, 213, 0.2)",
              background: "rgba(70, 84, 93, 0.72)",
              color: "rgba(242, 244, 239, 0.78)",
              padding: "12px 16px",
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            {variant === "story" ? "9:16" : variant === "square" ? "1:1" : "OG"}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertySharePack({ data, variant }: { data: PropertySharePackData; variant: ShareVariant }) {
  const config = variantConfig[variant];

  return (
    <Shell variant={variant} accentLabel="Imóvel em disputa">
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Pill tone="signal">{data.neighborhoodName}</Pill>
          <Pill tone="paper">{`status ${data.status}`}</Pill>
          <Pill tone="rust">{`criticidade ${data.criticality}`}</Pill>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: config.titleSize,
              lineHeight: 0.96,
              fontWeight: 900,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              maxWidth: variant === "story" ? 880 : 920,
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              fontSize: config.phraseSize,
              lineHeight: 1.15,
              color: "rgba(242, 244, 239, 0.84)",
              maxWidth: variant === "story" ? 760 : 860,
            }}
          >
            {data.phrase}
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function ActionSharePack({
  data,
  variant,
}: {
  data: ActionSharePackData;
  variant: ShareVariant;
}) {
  const config = variantConfig[variant];

  return (
    <Shell variant={variant} accentLabel="Frente de ação">
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Pill tone="signal">{getActionKindLabel(data.actionKind)}</Pill>
          <Pill tone="paper">{data.neighborhoodName}</Pill>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: config.titleSize, lineHeight: 0.96, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {data.propertyTitle}
          </div>
          <div
            style={{
              fontSize: config.phraseSize,
              lineHeight: 1.15,
              color: "rgba(242, 244, 239, 0.84)",
              maxWidth: variant === "story" ? 780 : 920,
            }}
          >
            {data.phrase}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              border: "1px solid rgba(211, 217, 213, 0.2)",
              background: "rgba(233, 173, 18, 0.12)",
              color: "#ffd76a",
              padding: "16px 20px",
              fontSize: variant === "story" ? 34 : 28,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            {data.ctaLabel}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Pill({ tone, children }: { tone: "signal" | "paper" | "rust"; children: ReactNode }) {
  const background = tone === "signal" ? "rgba(233, 173, 18, 0.15)" : tone === "rust" ? "rgba(143, 89, 68, 0.2)" : "rgba(242, 244, 239, 0.08)";
  const color = tone === "signal" ? "#ffd76a" : "#f2f4ef";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        border: "1px solid rgba(211, 217, 213, 0.18)",
        background,
        color,
        padding: "10px 14px",
        fontSize: 18,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}
