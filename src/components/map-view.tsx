"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import type { Ticket } from "@/types";

interface MapViewProps {
  tickets: Ticket[];
}

export default function MapView({ tickets }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const indiaCenter: L.LatLngExpression = [20.5937, 78.9629];

  useEffect(() => {
    if (mapRef.current === null) {
      const map = L.map("map", {
        center: indiaCenter,
        zoom: 5,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    }
    
    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    tickets.forEach((ticket) => {
      if (ticket.location) {
        L.marker([ticket.location.latitude, ticket.location.longitude])
          .addTo(map)
          .bindPopup(
            `<b>${ticket.category}</b><br>${ticket.notes}`
          );
      }
    });

  }, [tickets]);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
}
