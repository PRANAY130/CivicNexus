
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Ticket, Supervisor } from '@/types';
import ViewTickets from '@/components/view-tickets';
import { Button } from '@/components/ui/button';
import { LogOut, UserPlus } from 'lucide-react';
import Link from 'next/link';
import ManageSupervisors from '@/components/manage-supervisors';

const MunicipalMapView = dynamic(() => import('@/components/municipal-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
});


export default function MunicipalDashboardPage() {
  const router = useRouter();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [supervisors, setSupervisors] = React.useState<Supervisor[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [municipalUser, setMunicipalUser] = React.useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('municipalUser');
    if (!storedUser) {
      router.push('/login');
    } else {
        const parsedUser = JSON.parse(storedUser);
        setMunicipalUser(parsedUser);

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
        });
        
        const supervisorsCollection = collection(db, 'supervisors');
        const q = query(supervisorsCollection, where("municipalId", "==", parsedUser.id));
        const unsubscribeSupervisors = onSnapshot(q, (snapshot) => {
            const supervisorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supervisor));
            setSupervisors(supervisorsData);
        });

        setDataLoading(false);

        return () => {
            unsubscribeTickets();
            unsubscribeSupervisors();
        }
    }
  }, [router]);
  
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
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
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
                <div className="grid gap-6 md:grid-cols-2">
                    <ManageSupervisors municipalId={municipalUser?.id} supervisors={supervisors} />
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
                                <ViewTickets tickets={tickets} supervisors={supervisors} isMunicipalView={true} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    </div>
  );
}
