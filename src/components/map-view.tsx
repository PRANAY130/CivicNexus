"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";


import type { Ticket } from '@/types';

interface MapViewProps {
  tickets: Ticket[];
}

const MapView = ({ tickets }: MapViewProps) => {
  const defaultPosition: LatLngExpression = [34.0522, -118.2437]; // Default to Los Angeles

  // Get the center position from the first ticket if available
  const centerPosition = tickets.length > 0
    ? [tickets[0].location.lat, tickets[0].location.lng] as LatLngExpression
    : defaultPosition;

  return (
    <div>
        <p className="mb-4 text-sm text-muted-foreground">
            Here is a map view of all reported issues.
        </p>
        <MapContainer center={centerPosition} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {tickets.map((ticket) => (
            <Marker key={ticket.id} position={[ticket.location.lat, ticket.location.lng]}>
                <Popup>
                <div>
                    <h3 className="font-bold">{ticket.category}</h3>
                    <p>{ticket.address}</p>
                    <p>Status: {ticket.status}</p>
                </div>
                </Popup>
            </Marker>
            ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
