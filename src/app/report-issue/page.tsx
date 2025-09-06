"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import ReportIssueForm from "@/components/report-issue-form";
import type { Ticket } from "@/types";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportIssuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleIssueSubmitted = (newTicket: Ticket) => {
    // In a real app, you'd likely want to navigate to the tickets page
    // and see the new ticket there. For now, we'll just redirect.
    router.push('/my-tickets');
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Report a New Issue</CardTitle>
            <CardDescription>Fill out the form below to submit a new civic issue report. Our team will review it shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportIssueForm onIssueSubmitted={handleIssueSubmitted} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}