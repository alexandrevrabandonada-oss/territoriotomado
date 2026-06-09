import { createElement } from "react";
import { ImageResponse } from "next/og";
import { getPublishedActionFeed } from "@/lib/data/public-queries";
import { getActionSharePhrase } from "@/lib/share-copy";
import { ActionSharePack, type ShareVariant } from "@/lib/share-pack";

export const runtime = "nodejs";

type ShareFormat = "1x1" | "9x16";

const sizeMap: Record<ShareFormat, { width: number; height: number; variant: ShareVariant }> = {
  "1x1": { width: 1080, height: 1080, variant: "square" },
  "9x16": { width: 1080, height: 1920, variant: "story" },
};

function resolveFormat(format: string) {
  return format === "1x1" || format === "9x16" ? sizeMap[format] : null;
}

export async function GET(request: Request, { params }: { params: Promise<{ format: string }> }) {
  const { format } = await params;
  const config = resolveFormat(format);

  if (!config) {
    return new Response("Not found", { status: 404 });
  }

  const actions = await getPublishedActionFeed();
  const focusedSlug = new URL(request.url).searchParams.get("imovel");
  const feed = focusedSlug ? actions.filter((action) => action.propertySlug === focusedSlug) : actions;
  const topAction = feed[0] ?? actions[0];

  if (!topAction) {
    return new Response("Not found", { status: 404 });
  }

  const data = {
    actionKind: topAction.kind,
    propertyTitle: topAction.propertyTitle,
    neighborhoodName: topAction.neighborhoodName,
    ctaLabel: topAction.ctaLabel,
    phrase: getActionSharePhrase(topAction.kind, topAction.propertyTitle),
  };

  return new ImageResponse(createElement(ActionSharePack, { data, variant: config.variant }), {
    width: config.width,
    height: config.height,
  });
}
