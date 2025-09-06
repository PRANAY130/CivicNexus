"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Ticket } from '@/types';


const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
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
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    estimatedResolutionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
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
    submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    estimatedResolutionDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
  },
];


export default function MapViewPage() {
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
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Issue Map</CardTitle>
            <CardDescription>
              Here is a map view of all reported issues in the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapView tickets={mockTickets} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
