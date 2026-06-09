import { ImageResponse } from "next/og";
import { getRankingShareData } from "@/lib/data/circulation";
import { RankingSharePack } from "@/lib/share-pack";

export const runtime = "nodejs";

export const alt = "Territorio Tomado | Circulacao politica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const data = await getRankingShareData("top-iptu-2025");

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(<RankingSharePack data={data} variant="wide" />, size);
}
