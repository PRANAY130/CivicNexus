"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1.5.5-1.5 1.5V12h3l-.5 3h-2.5v6.95A10.02 10.02 0 0 0 22 12z" />
    </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setIsLoading(true);
    try {
      if (action === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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

  const renderAuthContent = (isLogin: boolean) => (
       <Card>
            <CardHeader>
                <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
                <CardDescription>{isLogin ? 'Enter your credentials to access your account.' : 'Create an account to start reporting issues.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                    Sign in with Google
                </Button>
                <div className="flex items-center space-x-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${isLogin ? 'login' : 'signup'}-email`}>Email</Label>
                    <Input id={`${isLogin ? 'login' : 'signup'}-email`} type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${isLogin ? 'login' : 'signup'}-password`}>Password</Label>
                    <Input id={`${isLogin ? 'login' : 'signup'}-password`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => handleAuthAction(isLogin ? 'login' : 'signup')} disabled={isLoading || isGoogleLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
            </CardFooter>
        </Card>
  )


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">
              CivicPulse
            </h1>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            {renderAuthContent(true)}
          </TabsContent>
          <TabsContent value="signup">
            {renderAuthContent(false)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
