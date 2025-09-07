"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface LocationPickerMapProps {
  onLocationSelect: (latlng: { lat: number; lng: number }) => void;
  initialCenter?: { lat: number; lng: number } | null;
}

export default function LocationPickerMap({ onLocationSelect, initialCenter }: LocationPickerMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const indiaCenter: L.LatLngExpression = [20.5937, 78.9629];
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const center = initialCenter ? ([initialCenter.lat, initialCenter.lng] as L.LatLngExpression) : indiaCenter;
    const zoom = initialCenter ? 15 : 5;

    if (mapRef.current === null) {
      const map = L.map("location-picker-map").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng).addTo(map);
        }
        map.panTo(e.latlng);
      });

      mapRef.current = map;
      setMapInitialized(true);
    } else if (mapInitialized) {
        mapRef.current.setView(center, zoom);
    }
  }, [onLocationSelect, initialCenter, mapInitialized]);

  return (
      <div id="location-picker-map" className="h-[400px] w-full rounded-md border" />
  );
}
