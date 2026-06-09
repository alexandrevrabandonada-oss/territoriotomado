"use client";

import dynamic from "next/dynamic";
import type { PropertyMapFeature } from "@/lib/data/queries";
import type { PublicListingContext } from "@/lib/navigation/public-context";

const PropertyMap = dynamic(() => import("@/components/map/property-map").then((module) => module.PropertyMap), {
  ssr: false,
  loading: () => <div className="tt-panel h-[360px] animate-pulse sm:h-[420px] lg:h-[460px] lg:min-h-0" />,
});

interface PropertyMapClientProps {
  properties: PropertyMapFeature[];
  focusSlug?: string;
  navigationContext: PublicListingContext;
  className?: string;
}

export function PropertyMapClient({ properties, focusSlug, navigationContext, className }: PropertyMapClientProps) {
  return <PropertyMap properties={properties} focusSlug={focusSlug} navigationContext={navigationContext} className={className} />;
}
