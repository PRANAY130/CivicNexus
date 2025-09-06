"use client";

import * as React from "react";
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ViewTickets from "@/components/view-tickets";
import type { Ticket } from "@/types";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyTicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const { user, loading } = useAuth();
  const [dataLoading, setDataLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  React.useEffect(() => {
    if (user) {
      setDataLoading(true);
      const ticketsCollection = collection(db, 'tickets');
      const q = query(ticketsCollection, where("userId", "==", user.uid), orderBy("submittedDate", "desc"));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ticketsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                submittedDate: (data.submittedDate as Timestamp).toDate(),
                estimatedResolutionDate: (data.estimatedResolutionDate as Timestamp).toDate(),
            } as Ticket;
        });
        setTickets(ticketsData);
        setDataLoading(false);
      }, (error) => {
        console.error("Error fetching tickets: ", error);
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">My Tickets</h1>
        {dataLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        ) : (
            <ViewTickets tickets={tickets} />
        )}
      </div>
    </div>
  );
}
