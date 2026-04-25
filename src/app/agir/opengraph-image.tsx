import { ImageResponse } from "next/og";
import { getPublishedActionFeed } from "@/lib/data/public-queries";
import { getActionSharePhrase } from "@/lib/share-copy";
import { ActionSharePack } from "@/lib/share-pack";

export const runtime = "edge";

export const alt = "Territorio Tomado | Agir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const actions = await getPublishedActionFeed();
  const topAction = actions[0];

  if (!topAction) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#3b474f",
            color: "#f2f4ef",
            fontSize: 64,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Territorio Tomado
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <ActionSharePack
        variant="wide"
        data={{
          actionKind: topAction.kind,
          propertyTitle: topAction.propertyTitle,
          neighborhoodName: topAction.neighborhoodName,
          ctaLabel: topAction.ctaLabel,
          phrase: getActionSharePhrase(topAction.kind, topAction.propertyTitle),
        }}
      />
    ),
    size,
  );
}
