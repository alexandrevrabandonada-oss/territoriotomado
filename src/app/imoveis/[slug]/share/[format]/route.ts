import { createElement } from "react";
import { ImageResponse } from "next/og";
import { getPublishedPropertyBundle } from "@/lib/data/public-queries";
import { getPropertySharePhrase } from "@/lib/share-copy";
import { PropertySharePack, type ShareVariant } from "@/lib/share-pack";

export const runtime = "edge";

type ShareFormat = "1x1" | "9x16";

const sizeMap: Record<ShareFormat, { width: number; height: number; variant: ShareVariant }> = {
  "1x1": { width: 1080, height: 1080, variant: "square" },
  "9x16": { width: 1080, height: 1920, variant: "story" },
};

function resolveFormat(format: string) {
  return format === "1x1" || format === "9x16" ? sizeMap[format] : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; format: string }> }) {
  const { slug, format } = await params;
  const config = resolveFormat(format);

  if (!config) {
    return new Response("Not found", { status: 404 });
  }

  const bundle = await getPublishedPropertyBundle(slug);

  if (!bundle) {
    return new Response("Not found", { status: 404 });
  }

  const { property, neighborhood } = bundle;
  const data = {
    title: property.title,
    neighborhoodName: neighborhood.name,
    status: property.status,
    criticality: property.criticality,
    phrase: getPropertySharePhrase(property.status, property.criticality),
  };

  return new ImageResponse(createElement(PropertySharePack, { data, variant: config.variant }), {
    width: config.width,
    height: config.height,
  });
}
