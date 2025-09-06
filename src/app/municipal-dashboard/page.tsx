"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Ticket } from '@/types';

const MunicipalMapView = dynamic(() => import('@/components/municipal-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
});

export default function MunicipalDashboardPage() {
  const router = useRouter();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [municipalUser, setMunicipalUser] = React.useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('municipalUser');
    if (!storedUser) {
      router.push('/login');
    } else {
      setMunicipalUser(JSON.parse(storedUser));
    }
  }, [router]);

  React.useEffect(() => {
    if (municipalUser) {
        const ticketsCollection = collection(db, 'tickets');
        const unsubscribeTickets = onSnapshot(ticketsCollection, (snapshot) => {
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

        return () => {
            unsubscribeTickets();
        }
    }
  }, [municipalUser]);

  if (!municipalUser || dataLoading) {
      return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[500px] w-full rounded-lg" />
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues Map</CardTitle>
        <CardDescription>All reported issues are plotted on the map below, colored by priority.</CardDescription>
      </CardHeader>
      <CardContent>
        <MunicipalMapView tickets={tickets} />
      </CardContent>
    </Card>
  );
}
