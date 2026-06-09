import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Territorio Tomado";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#3b474f",
          color: "#f2f4ef",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(169, 188, 196, 0.28), transparent 30%), radial-gradient(circle at 84% 18%, rgba(233, 173, 18, 0.14), transparent 24%), linear-gradient(180deg, rgba(211, 217, 213, 0.16), transparent 22%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(242, 244, 239, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 244, 239, 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
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
            padding: "68px 72px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid rgba(211, 217, 213, 0.24)",
                  background: "rgba(70, 84, 93, 0.78)",
                  color: "#ffd76a",
                  padding: "10px 14px",
                  fontSize: 18,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Territorio Tomado
              </div>
              <div
                style={{
                  fontSize: 78,
                  lineHeight: 0.96,
                  fontWeight: 900,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  maxWidth: 920,
                }}
              >
                Mapa, acervo e acao sobre o territorio
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
                color: "rgba(242, 244, 239, 0.74)",
                fontSize: 16,
              }}
            >
              <span>VR Abandonada</span>
              <span>circulacao publica</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ width: "96px", height: "4px", background: "linear-gradient(90deg, #e9ad12, #a9bcc4)" }} />
              <div style={{ fontSize: 22, textTransform: "uppercase", letterSpacing: "0.24em" }}>Territorio Tomado</div>
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
              share ready
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
