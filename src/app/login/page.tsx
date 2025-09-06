
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Loader2, Building, User, Briefcase } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1.5.5-1.5 1.5V12h3l-.5 3h-2.5v6.95A10.02 10.02 0 0 0 22 12z" />
    </svg>
);


export default function LoginPage() {
  const [municipalId, setMunicipalId] = useState('');
  const [municipalPassword, setMunicipalPassword] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [supervisorPassword, setSupervisorPassword] = useState('');

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMunicipalLoading, setIsMunicipalLoading] = useState(false);
  const [isSupervisorLoading, setIsSupervisorLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    } finally {
        setIsGoogleLoading(false);
    }
  }

  const handleMunicipalLogin = async () => {
    setIsMunicipalLoading(true);
    try {
        const q = query(collection(db, "municipality"), where("userId", "==", municipalId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid User ID or Password.");
        }

        let municipalData;
        querySnapshot.forEach(doc => {
            if (doc.data().password === municipalPassword) {
                municipalData = { id: doc.id, ...doc.data()};
            }
        });

        if (municipalData) {
            localStorage.setItem('municipalUser', JSON.stringify(municipalData));
            router.push('/municipal-dashboard');
        } else {
            throw new Error("Invalid User ID or Password.");
        }
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message,
        });
    } finally {
        setIsMunicipalLoading(false);
    }
  }

  const handleSupervisorLogin = async () => {
    setIsSupervisorLoading(true);
    try {
        const q = query(collection(db, "supervisors"), where("userId", "==", supervisorId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid User ID or Password.");
        }

        let supervisorData;
        querySnapshot.forEach(doc => {
            if (doc.data().password === supervisorPassword) {
                supervisorData = { id: doc.id, ...doc.data() };
            }
        });

        if (supervisorData) {
            localStorage.setItem('supervisorUser', JSON.stringify(supervisorData));
            router.push('/supervisor-dashboard');
        } else {
            throw new Error("Invalid User ID or Password.");
        }
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message,
        });
    } finally {
        setIsSupervisorLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">
              CivicPulse
            </h1>
        </div>
        <Tabs defaultValue="citizen" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="citizen">
                <User className="mr-2 h-4 w-4" />
                Citizen
            </TabsTrigger>
            <TabsTrigger value="municipality">
                <Building className="mr-2 h-4 w-4" />
                Official
            </TabsTrigger>
            <TabsTrigger value="supervisor">
                <Briefcase className="mr-2 h-4 w-4" />
                Supervisor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="citizen">
             <Card>
                <CardHeader>
                    <CardTitle>Citizen Login</CardTitle>
                    <CardDescription>Sign in with your Google account to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="municipality">
              <Card>
                <CardHeader>
                    <CardTitle>Municipal Login</CardTitle>
                    <CardDescription>Enter your official credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="municipal-id">User ID</Label>
                        <Input id="municipal-id" type="text" placeholder="Enter your User ID" value={municipalId} onChange={(e) => setMunicipalId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="municipal-password">Password</Label>
                        <Input id="municipal-password" type="password" value={municipalPassword} onChange={(e) => setMunicipalPassword(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleMunicipalLogin} disabled={isMunicipalLoading}>
                        {isMunicipalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </CardFooter>
              </Card>
          </TabsContent>
          <TabsContent value="supervisor">
            <Card>
                <CardHeader>
                    <CardTitle>Supervisor Login</CardTitle>
                    <CardDescription>Enter your credentials to access your assigned tasks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="supervisor-id">User ID</Label>
                        <Input id="supervisor-id" type="text" placeholder="Enter your User ID" value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supervisor-password">Password</Label>
                        <Input id="supervisor-password" type="password" value={supervisorPassword} onChange={(e) => setSupervisorPassword(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSupervisorLogin} disabled={isSupervisorLoading}>
                        {isSupervisorLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </CardFooter>
            </Card>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
