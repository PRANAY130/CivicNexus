
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { differenceInDays, format } from 'date-fns';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell, Line, LineChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import type { Ticket } from '@/types';

const COLORS = {
  High: 'hsl(var(--destructive))',
  Medium: 'hsl(var(--primary))',
  Low: 'hsl(var(--accent))',
};

const STATUS_COLORS: { [key: string]: string } = {
    Submitted: '#fde047', // yellow-300
    'In Progress': '#60a5fa', // blue-400
    'Pending Approval': '#f97316', // orange-500
    Resolved: '#22c55e', // green-500
};


export default function AnalyticsPage() {
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
      setDataLoading(true);
      const ticketsCollection = collection(db, 'tickets');
      const unsubscribe = onSnapshot(ticketsCollection, (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => {
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
      });
      return () => unsubscribe();
    }
  }, [municipalUser, router]);

  const priorityData = React.useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const statusData = React.useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] }));
  }, [tickets]);

  const categoryData = React.useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [tickets]);

  const resolutionTimeData = React.useMemo(() => {
      const resolvedTickets = tickets.filter(t => t.status === 'Resolved' && t.deadlineDate);
      const averageTimes = resolvedTickets.reduce((acc, ticket) => {
          if (!acc[ticket.category]) {
              acc[ticket.category] = { totalDays: 0, count: 0 };
          }
          const resolutionDays = differenceInDays(ticket.deadlineDate!, ticket.submittedDate);
          acc[ticket.category].totalDays += resolutionDays;
          acc[ticket.category].count += 1;
          return acc;
      }, {} as Record<string, { totalDays: number, count: number }>);

      return Object.entries(averageTimes).map(([category, data]) => ({
          name: category,
          avgDays: parseFloat((data.totalDays / data.count).toFixed(1)),
      }));
  }, [tickets]);

  if (dataLoading) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
           <Card><CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
           <Card><CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
           <Card className="md:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
           <Card className="md:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Analytics Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Priority</CardTitle>
            <CardDescription>Distribution of tickets based on their priority level.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
            <CardDescription>Current status of all reported tickets.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
            <CardDescription>Breakdown of tickets across different issue categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" name="Ticket Count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Average Resolution Time</CardTitle>
                <CardDescription>Average number of days to resolve issues by category.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resolutionTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgDays" name="Avg. Days to Resolve" fill="hsl(var(--accent))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
