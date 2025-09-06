
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
import ViewTickets from '@/components/view-tickets';
import { useToast } from '@/hooks/use-toast';


const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
});

// Function to calculate distance between two lat/lng points in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}


export default function MapViewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [userLocation, setUserLocation] = React.useState<{latitude: number; longitude: number} | null>(null);
  const [nearbyTickets, setNearbyTickets] = React.useState<Ticket[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                toast({
                    variant: 'destructive',
                    title: 'Location Error',
                    description: 'Unable to retrieve your location. Nearby issues will not be shown.',
                });
            }
        );
    }
  }, [toast]);

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

  React.useEffect(() => {
    if (userLocation && tickets.length > 0) {
        const nearby = tickets.filter(ticket => {
            if (ticket.location) {
                const distance = getDistanceFromLatLonInKm(
                    userLocation.latitude,
                    userLocation.longitude,
                    ticket.location.latitude,
                    ticket.location.longitude
                );
                return distance <= 0.1; // 100 meters radius
            }
            return false;
        });
        setNearbyTickets(nearby);
    }
  }, [userLocation, tickets]);


  if (loading || !user) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
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

       <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Nearby Issues</CardTitle>
            <CardDescription>
              Issues reported within a 100m radius of your current location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userLocation ? (
                <ViewTickets tickets={nearbyTickets} />
            ) : (
                <p className="text-muted-foreground text-sm text-center">Getting your location to find nearby issues...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
