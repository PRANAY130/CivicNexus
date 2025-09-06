"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { collection, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Ticket } from '@/types';


const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
});


export default function MapViewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    if (user) {
      setDataLoading(true);
      const ticketsCollection = collection(db, 'tickets');
      const unsubscribe = onSnapshot(ticketsCollection, (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                submittedDate: (data.submittedDate as Timestamp).toDate(),
                estimatedResolutionDate: (data.estimatedResolutionDate as Timestamp).toDate(),
            } as Ticket
        });
        setTickets(ticketsData);
        setDataLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

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
            {dataLoading ? <Skeleton className="h-[500px] w-full rounded-lg" /> : <MapView tickets={tickets} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
