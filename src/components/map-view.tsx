"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Ticket } from "@/types";

interface MapViewProps {
  tickets: Ticket[];
}

export default function MapView({ tickets }: MapViewProps) {
  const defaultPosition: LatLngExpression = [34.0522, -118.2437]; // Default to LA

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">Issues Map</h2>
      <p className="text-muted-foreground mb-4">
        Here is a map view of all reported issues.
      </p>
      <MapContainer center={defaultPosition} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tickets.map((ticket) => (
          <Marker
            key={ticket.id}
            position={[ticket.location.lat, ticket.location.lng]}
          >
            <Popup>
              <div className="font-bold">{ticket.category}</div>
              <div>ID: {ticket.id}</div>
              <div>Priority: {ticket.priority}</div>
              <div>Status: {ticket.status}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
