"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface LocationPickerMapProps {
  onLocationSelect: (latlng: { lat: number; lng: number }) => void;
}

export default function LocationPickerMap({ onLocationSelect }: LocationPickerMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const indiaCenter: L.LatLngExpression = [20.5937, 78.9629];

  useEffect(() => {
    if (mapRef.current === null) {
      const map = L.map("location-picker-map").setView(indiaCenter, 5);

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
    }
  }, [onLocationSelect]);

  return (
      <div id="location-picker-map" className="h-[400px] w-full rounded-md border" />
  );
}
