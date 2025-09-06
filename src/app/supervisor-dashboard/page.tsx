"use client";

import * as React from "react";
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ViewTickets from "@/components/view-tickets";
import type { Ticket } from "@/types";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SupervisorDashboardPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [supervisorUser, setSupervisorUser] = React.useState<any>(null);
  const [dataLoading, setDataLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('supervisorUser');
    if (!storedUser) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setSupervisorUser(parsedUser);
    }
  }, [router]);
  
  React.useEffect(() => {
    if (supervisorUser) {
      setDataLoading(true);
      const ticketsCollection = collection(db, 'tickets');
      const q = query(ticketsCollection, where("assignedSupervisorId", "==", supervisorUser.id));
      
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
  }, [supervisorUser]);

  const handleLogout = () => {
    localStorage.removeItem('supervisorUser');
    router.push('/login');
  }

  if (dataLoading || !supervisorUser) {
     return (
       <div className="flex h-screen bg-muted/40 items-center justify-center">
        <Skeleton className="h-24 w-full" />
       </div>
     )
  }
  
  return (
    <div className="flex h-screen bg-muted/40">
        <div className="flex flex-col flex-1">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <div className="flex-1">
                    <h1 className="font-semibold text-lg">Supervisor Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Welcome, {supervisorUser.userId}</p>
                </div>
                 <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </Button>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Assigned Tickets</h1>
                 <ViewTickets tickets={tickets} />
              </div>
            </main>
        </div>
    </div>
  );
}
