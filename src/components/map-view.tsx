"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Ensure cleanup if React tries to remount
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map("map", {
      center: [51.505, -0.09],
      zoom: 13,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove(); // ✅ cleanup when component unmounts
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      id="map"
      style={{ height: "500px", width: "100%" }}
    />
  );
}
