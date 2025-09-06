
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { Ticket } from "@/types";
import { Users } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

interface MapViewProps {
  tickets: Ticket[];
}

export default function MapView({ tickets }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const indiaCenter: L.LatLngExpression = [20.5937, 78.9629];
  const { user } = useAuth();
  const { toast } = useToast();

  const handleJoinReport = async (ticketId: string) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to join a report.' });
      return;
    }

    const ticketRef = doc(db, 'tickets', ticketId);

    try {
        const ticketDoc = await getDoc(ticketRef);
        if (!ticketDoc.exists()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Ticket not found.' });
            return;
        }

        const ticketData = ticketDoc.data() as Ticket;
        
        if (Array.isArray(ticketData.reportedBy) && ticketData.reportedBy.includes(user.uid)) {
            toast({ variant: 'default', title: 'Already Reported', description: 'You have already joined or created this report.' });
            return;
        }

        const currentReportCount = ticketData.reportCount || 0;
        let newPriority = ticketData.priority;
        if (currentReportCount + 1 > 5) {
            if (ticketData.priority === 'Low') newPriority = 'Medium';
            else if (ticketData.priority === 'Medium') newPriority = 'High';
        }

      await updateDoc(ticketRef, {
        reportCount: increment(1),
        reportedBy: arrayUnion(user.uid),
        priority: newPriority,
      });

      toast({ title: 'Report Joined', description: 'Thank you for supporting this report!' });

    } catch (error) {
      console.error("Error joining report: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not join the report. Please try again.' });
    }
  };


  useEffect(() => {
    if (mapRef.current === null) {
      const map = L.map("map").setView(indiaCenter, 5);

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
        const marker = L.marker([ticket.location.latitude, ticket.location.longitude])
          .addTo(map);

        const iconMarkup = renderToStaticMarkup(<Users className="h-4 w-4 inline-block mr-1" />);
        
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <b>${ticket.category}</b>
            <p>${ticket.notes}</p>
            <div style="display: flex; align-items: center; margin-top: 8px;">
                ${iconMarkup}
                <span>${ticket.reportCount || 1}</span>
            </div>
            <button id="join-report-${ticket.id}" class="join-report-button">Join Report</button>
        `;
        
        marker.bindPopup(popupContent, { autoClose: false });
        
        const joinButton = popupContent.querySelector(`#join-report-${ticket.id}`);
        if (joinButton) {
            joinButton.addEventListener('click', () => {
                handleJoinReport(ticket.id);
            });
        }
      }
    });

  }, [tickets, user]);

  return (
    <>
      <style>{`
        .join-report-button {
          margin-top: 10px;
          padding: 8px 12px;
          border: none;
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-radius: var(--radius);
          cursor: pointer;
          width: 100%;
        }
        .join-report-button:hover {
          background-color: hsl(var(--primary) / 0.9);
        }
      `}</style>
      <div id="map" className="h-[600px] w-full" />
    </>
  );
}
