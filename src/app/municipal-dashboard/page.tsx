
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Ticket } from '@/types';
import ViewTickets from '@/components/view-tickets';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';


const MunicipalMapView = dynamic(() => import('@/components/municipal-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
});


export default function MunicipalDashboardPage() {
  const router = useRouter();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  React.useEffect(() => {
    // Basic protection for the route
    const isMunicipalUser = localStorage.getItem('municipalUser');
    if (!isMunicipalUser) {
      router.push('/login');
    }
  }, [router]);
  
  React.useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('municipalUser');
    router.push('/login');
  }

  return (
    <div className="flex h-screen bg-muted/40">
        <div className="flex flex-col flex-1">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <div className="flex-1">
                    <h1 className="font-semibold text-lg">Municipal Dashboard</h1>
                </div>
                 <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </Button>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Issues Map</CardTitle>
                        <CardDescription>All reported issues are plotted on the map below, colored by priority.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dataLoading ? <Skeleton className="h-[500px] w-full rounded-lg" /> : <MunicipalMapView tickets={tickets} />}
                    </CardContent>
                   </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>All Tickets</CardTitle>
                        <CardDescription>A complete list of all submitted issues.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {dataLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-[125px] w-full" />
                                <Skeleton className="h-[125px] w-full" />
                                <Skeleton className="h-[125px] w-full" />
                            </div>
                        ) : (
                            <ViewTickets tickets={tickets} />
                        )}
                    </CardContent>
                 </Card>
            </main>
        </div>
    </div>
  );
}
