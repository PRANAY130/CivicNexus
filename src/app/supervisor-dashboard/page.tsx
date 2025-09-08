
"use client";

import * as React from "react";
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ViewTickets from "@/components/view-tickets";
import type { Ticket } from "@/types";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase, CheckCircle2, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
             const submittedDate = data.submittedDate instanceof Timestamp ? data.submittedDate.toDate() : new Date();
            const estimatedResolutionDate = data.estimatedResolutionDate instanceof Timestamp ? data.estimatedResolutionDate.toDate() : new Date();
            const deadlineDate = data.deadlineDate instanceof Timestamp ? data.deadlineDate.toDate() : undefined;
            return {
                ...data,
                id: doc.id,
                submittedDate,
                estimatedResolutionDate,
                deadlineDate
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

  const activeTickets = tickets.filter(t => t.status === 'In Progress' || t.status === 'Pending Approval');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex items-center gap-2">
                <Megaphone className="h-7 w-7 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight font-headline text-foreground">
                    CivicPulse
                </h1>
            </div>
             <div className="ml-auto flex items-center gap-2">
                <p className="text-sm text-muted-foreground hidden sm:block">Welcome, {supervisorUser.userId}</p>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </Button>
            </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">My Work Queue</h1>
            <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active"><Briefcase className="mr-2 h-4 w-4" />Active</TabsTrigger>
                    <TabsTrigger value="resolved"><CheckCircle2 className="mr-2 h-4 w-4" />Resolved</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-6">
                    <ViewTickets tickets={activeTickets} isSupervisorView={true} />
                </TabsContent>
                <TabsContent value="resolved" className="mt-6">
                    <ViewTickets tickets={resolvedTickets} isSupervisorView={true} />
                </TabsContent>
            </Tabs>
          </div>
        </main>
    </div>
  );
}
