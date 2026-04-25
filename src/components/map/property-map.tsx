"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { PropertyMapFeature } from "@/lib/data/queries";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPublicListingHref, type PublicListingContext } from "@/lib/navigation/public-context";
import { cn } from "@/lib/utils/cn";

const mapCenter: [number, number] = [-22.5233, -44.1045];
const mapZoom = 14;

const statusMarkerStyles: Record<PropertyMapFeature["status"], { fill: string; ring: string; border: string }> = {
  ocupado: { fill: "#7d909b", ring: "rgba(125,144,155,0.24)", border: "#f2f4ef" },
  vazio: { fill: "#8f5944", ring: "rgba(196,139,112,0.22)", border: "#c48b70" },
  "em-disputa": { fill: "#e9ad12", ring: "rgba(233,173,18,0.28)", border: "#ffd76a" },
  "uso-institucional": { fill: "#46545d", ring: "rgba(242,244,239,0.22)", border: "#d3d9d5" },
};

function createMarkerIcon(status: PropertyMapFeature["status"], isFocused = false) {
  const style = statusMarkerStyles[status];
  const scale = isFocused ? 1.42 : 1;
  const shadow = isFocused
    ? `${style.ring}, 0 0 0 6px rgba(242,244,239,0.08), 0 0 0 12px rgba(233,173,18,0.16), 0 14px 28px rgba(39,50,58,0.38)`
    : `${style.ring}, 0 8px 18px rgba(39,50,58,0.18)`;
  const inset = isFocused ? "#1f2a31" : "rgba(39,50,58,0.2)";

  return L.divIcon({
    className: "tt-property-pin",
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;transform:translateY(${isFocused ? "-6px" : "0"});">
        <div style="position:relative;width:${18 * scale}px;height:${18 * scale}px;transform:rotate(45deg);border:2px solid ${style.border};background:${style.fill};box-shadow:0 0 0 5px ${shadow};">
          <span style="position:absolute;inset:3px;border:1px solid ${style.border};background:${inset};opacity:${isFocused ? 1 : 0.36};"></span>
          ${isFocused ? '<span style="position:absolute;left:50%;top:50%;width:6px;height:6px;border-radius:999px;background:#ffd76a;box-shadow:0 0 0 4px rgba(255,215,106,0.16);transform:translate(-50%,-50%) rotate(-45deg);"></span>' : ""}
        </div>
        ${isFocused ? '<span style="display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(233,173,18,0.45);background:rgba(20,25,29,0.92);padding:4px 8px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#ffd76a;white-space:nowrap;">em foco</span>' : ""}
      </div>
    `,
    iconSize: [56, isFocused ? 76 : 34],
    iconAnchor: [10 * scale, 10 * scale],
    popupAnchor: [0, -18],
  });
}

function FitMapToMarkers({ properties, focusSlug }: { properties: PropertyMapFeature[]; focusSlug?: string }) {
  const map = useMap();

  useEffect(() => {
    if (focusSlug) {
      const focusedProperty = properties.find((property) => property.slug === focusSlug);

      if (focusedProperty) {
        map.setView([focusedProperty.lat, focusedProperty.lng], 16);
        return;
      }
    }

    if (properties.length === 0) {
      map.setView(mapCenter, mapZoom);
      return;
    }

    if (properties.length === 1) {
      map.setView([properties[0].lat, properties[0].lng], 15);
      return;
    }

    const bounds = L.latLngBounds(properties.map((property) => [property.lat, property.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [36, 36] });
  }, [focusSlug, map, properties]);

  return null;
}

interface PropertyMapProps {
  properties: PropertyMapFeature[];
  focusSlug?: string;
  navigationContext: PublicListingContext;
  className?: string;
}

export function PropertyMap({ properties, focusSlug, navigationContext, className }: PropertyMapProps) {
  return (
    <div className={cn("tt-map shadow-tt-map relative h-[430px] overflow-hidden border border-concrete/22 bg-concrete sm:h-[560px] lg:h-[calc(100vh-190px)] lg:min-h-[680px]", className)}>
      <div className="pointer-events-none absolute inset-0 z-[400] bg-[linear-gradient(180deg,rgba(59,71,79,0.08),rgba(59,71,79,0.02)_40%,rgba(59,71,79,0.16))]" />
      <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom className="h-full w-full bg-concrete">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapToMarkers properties={properties} focusSlug={focusSlug} />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={createMarkerIcon(property.status, property.slug === focusSlug)}
            zIndexOffset={property.slug === focusSlug ? 1000 : 0}
          >
            <Popup>
              <div className="min-w-[220px] space-y-3">
                <div className="space-y-1 border-b border-[#d6d1c8] pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a4b20]">imovel</p>
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">{property.title}</p>
                </div>
                <div className="grid gap-2 text-[11px] uppercase tracking-[0.16em] text-ink/72">
                  <div className="flex items-center justify-between gap-3">
                    <span>bairro</span>
                    <span className="text-right font-semibold text-ink">{property.neighborhoodName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>status</span>
                    <Badge kind="status" value={property.status} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>criticidade</span>
                    <Badge kind="criticality" value={property.criticality}>{property.criticality}</Badge>
                  </div>
                  {property.slug === focusSlug ? <Badge kind="territory" value="foco-ativo">em foco</Badge> : null}
                </div>
                <div className="pt-1">
                  <ButtonLink
                    href={buildPublicListingHref(`/imoveis/${property.slug}`, navigationContext, {
                      imovel: property.slug,
                      from: "mapa",
                    })}
                    className="w-full justify-center text-xs"
                  >
                    Ver ficha
                  </ButtonLink>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
