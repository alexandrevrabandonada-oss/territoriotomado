"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { Property } from "@/types/domain";

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:16px;height:16px;border:2px solid #16110f;background:#f2b300;box-shadow:0 0 0 4px rgba(242,179,0,0.18);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface PropertyMapProps {
  properties: Property[];
}

export function PropertyMap({ properties }: PropertyMapProps) {
  return (
    <div className="h-[520px] overflow-hidden border border-paper/10">
      <MapContainer center={[-22.5233, -44.1045]} zoom={14} scrollWheelZoom className="h-full w-full bg-ink">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker key={property.id} position={[property.lat, property.lng]} icon={markerIcon}>
            <Popup>
              <div className="space-y-2">
                <p className="text-sm font-semibold">{property.title}</p>
                <p className="text-xs">{property.excerpt}</p>
                <Link href={`/imoveis/${property.slug}`} className="text-xs font-semibold uppercase text-[#7a4b20]">
                  Abrir ficha
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}