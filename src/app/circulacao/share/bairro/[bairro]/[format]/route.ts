import { createElement } from "react";
import { ImageResponse } from "next/og";
import { getNeighborhoodShareData } from "@/lib/data/circulation";
import { RankingSharePack, type ShareVariant } from "@/lib/share-pack";

export const runtime = "nodejs";

type ShareFormat = "1x1" | "9x16";

const sizeMap: Record<ShareFormat, { width: number; height: number; variant: ShareVariant }> = {
  "1x1": { width: 1080, height: 1080, variant: "square" },
  "9x16": { width: 1080, height: 1920, variant: "story" },
};

function resolveFormat(format: string) {
  return format === "1x1" || format === "9x16" ? sizeMap[format] : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ bairro: string; format: string }> }) {
  const { bairro, format } = await params;
  const config = resolveFormat(format);

  if (!config) {
    return new Response("Not found", { status: 404 });
  }

  const data = await getNeighborhoodShareData(bairro);

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(createElement(RankingSharePack, { data, variant: config.variant }), {
    width: config.width,
    height: config.height,
  });
}
