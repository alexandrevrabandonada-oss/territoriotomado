import { ImageResponse } from "next/og";
import { getPublishedPropertyBundle } from "@/lib/data/public-queries";
import { getPropertySharePhrase } from "@/lib/share-copy";
import { PropertySharePack } from "@/lib/share-pack";

export const runtime = "edge";

export const alt = "Territorio Tomado | Imovel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PropertyOgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: PropertyOgImageProps) {
  const { slug } = await params;
  const bundle = await getPublishedPropertyBundle(slug);

  if (!bundle) {
    return new Response("Not found", { status: 404 });
  }

  const { property, neighborhood } = bundle;

  return new ImageResponse(
    (
      <PropertySharePack
        variant="wide"
        data={{
          title: property.title,
          neighborhoodName: neighborhood.name,
          status: property.status,
          criticality: property.criticality,
          phrase: getPropertySharePhrase(property.status, property.criticality),
        }}
      />
    ),
    size,
  );
}
