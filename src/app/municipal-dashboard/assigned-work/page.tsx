"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Ticket, Supervisor } from '@/types';
import ViewTickets from '@/components/view-tickets';

export default function AssignedWorkPage() {
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

      // Fetch assigned tickets
      const ticketsQuery = query(collection(db, 'tickets'), where("assignedSupervisorId", "!=", null));
      const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            submittedDate: (data.submittedDate as Timestamp).toDate(),
            estimatedResolutionDate: (data.estimatedResolutionDate as Timestamp).toDate(),
          } as Ticket;
        });
        setTickets(ticketsData);
      });

      // Fetch supervisors to pass to ViewTickets
      const supervisorsQuery = query(collection(db, 'supervisors'), where("municipalId", "==", parsedUser.id));
      const unsubscribeSupervisors = onSnapshot(supervisorsQuery, (snapshot) => {
        const supervisorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supervisor));
        setSupervisors(supervisorsData);
      });
      
      setDataLoading(false);

      return () => {
        unsubscribeTickets();
        unsubscribeSupervisors();
      };
    }
  }, [router]);
  
  return (
     <Card>
        <CardHeader>
            <CardTitle>Assigned Work</CardTitle>
            <CardDescription>A list of all tickets that have been assigned to a supervisor.</CardDescription>
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
  );
}
