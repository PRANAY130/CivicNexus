
"use client";

import * as React from 'react';
import type { Supervisor, Ticket } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeHelp, CheckCircle, Shield, ShieldAlert } from 'lucide-react';

interface SupervisorAnalyticsProps {
    supervisor: Supervisor;
    tickets: Ticket[];
}

export default function SupervisorAnalytics({ supervisor, tickets }: SupervisorAnalyticsProps) {
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
    const pendingCount = tickets.length - resolvedCount;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{supervisor.trustPoints || 100}</div>
                    <p className="text-xs text-muted-foreground">Based on report approvals</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Image Warnings</CardTitle>
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{supervisor.aiImageWarningCount || 0}</div>
                    <p className="text-xs text-muted-foreground">Penalties for inauthentic images</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{resolvedCount}</div>
                    <p className="text-xs text-muted-foreground">Total completed jobs</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
                    <BadgeHelp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                    <p className="text-xs text-muted-foreground">Jobs currently in progress</p>
                </CardContent>
            </Card>
        </div>
    );
}
