"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Megaphone, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <section className="relative w-full h-[60vh] bg-black/50 flex items-center justify-center text-white">
        <Image
          src="https://picsum.photos/1200/800"
          alt="Community background"
          data-ai-hint="city community"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0 -z-10"
        />
        <div className="text-center space-y-4 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-headline">
            Make Your Voice Heard
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            CivicPulse empowers you to report local issues, track their resolution, and contribute to a better community.
          </p>
          <Link href="/report-issue" passHref>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Report an Issue <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight font-headline mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10">A simple, three-step process to improve your neighborhood.</p>
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-left">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                            Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Snap a photo, add details, and submit a report for any civic issue you encounter. It takes less than a minute.</p>
                    </CardContent>
                </Card>
                 <Card className="text-left">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                            Track
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Follow the progress of your submitted tickets and see updates as they happen. View all issues on an interactive map.</p>
                    </CardContent>
                </Card>
                 <Card className="text-left">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                             <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                            Resolve
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Our AI-powered system prioritizes issues to help local authorities address them efficiently. Together, we make a difference.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>
    </>
  );
}
