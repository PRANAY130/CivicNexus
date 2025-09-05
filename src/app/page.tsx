"use client";

import * as React from "react";
import dynamic from 'next/dynamic'
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import ReportIssueForm from "@/components/report-issue-form";
import ViewTickets from "@/components/view-tickets";

import type { Ticket } from "@/types";

const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

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


export default function Home() {
  const [tickets, setTickets] = React.useState<Ticket[]>(mockTickets);
  
  const handleIssueSubmitted = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Tabs defaultValue="report" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="report">Report an Issue</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="report">
            <Card>
              <CardContent className="pt-6">
                <ReportIssueForm onIssueSubmitted={handleIssueSubmitted} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tickets">
            <ViewTickets tickets={tickets} />
          </TabsContent>
          <TabsContent value="map">
             <Card>
              <CardContent className="pt-6">
                <MapView tickets={tickets} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
