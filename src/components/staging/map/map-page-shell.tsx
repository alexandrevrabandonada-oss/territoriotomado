"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/types/domain";

const PropertyMap = dynamic(() => import("@/components/staging/map/property-map").then((module) => module.PropertyMap), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse border border-paper/10 bg-paper/5" />,
});

interface MapPageShellProps {
  properties: Property[];
}

export function MapPageShell({ properties }: MapPageShellProps) {
  return <PropertyMap properties={properties} />;
}
