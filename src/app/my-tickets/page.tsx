"use client";

import * as React from "react";
import ViewTickets from "@/components/view-tickets";
import type { Ticket } from "@/types";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth-context";

// Mock data remains for demonstration until a database is connected.
const mockTickets: Ticket[] = [
  {
    id: 'CP-83610',
    category: 'Pothole',
    photo: 'https://picsum.photos/600/400',
    notes: 'Large pothole on the main road, causing traffic issues.',
    location: { lat: 34.0522, lng: -118.2437 },
    address: '123 Main St, Los Angeles, CA',
    status: 'In Progress',
    priority: 'High',
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    estimatedResolutionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    severityScore: 8,
    severityReasoning: "The pothole is large and located on a busy street, posing a significant risk to vehicles and potentially causing accidents."
  },
  {
    id: 'CP-19472',
    category: 'Graffiti',
    photo: 'https://picsum.photos/600/401',
    notes: 'Graffiti on the park wall.',
    location: { lat: 34.0588, lng: -118.2515 },
    address: '456 Park Ave, Los Angeles, CA',
    status: 'Submitted',
    priority: 'Low',
    submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    estimatedResolutionDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
    severityScore: 2,
    severityReasoning: "The graffiti is purely aesthetic and doesn't pose any immediate safety or environmental risk."
  },
];

export default function MyTicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>(mockTickets);
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">My Tickets</h1>
        <ViewTickets tickets={tickets} />
      </div>
    </div>
  );
}