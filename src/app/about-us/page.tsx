
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Code, Bot, Brush, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const teamMembers = [
    {
        name: "Amitava Datta",
        role: "Project Lead & Full-Stack Developer",
        icon: <Code className="h-5 w-5" />
    },
    {
        name: "Pranay De",
        role: "AI/ML Specialist",
        icon: <Bot className="h-5 w-5" />
    },
    {
        name: "Rudranil Das",
        role: "Frontend Developer",
        icon: <Code className="h-5 w-5" />
    },
    {
        name: "Srinjinee Mitra",
        role: "UI/UX Designer",
        icon: <Brush className="h-5 w-5" />
    },
    {
        name: "Aitijhya Roy",
        role: "Backend & Firebase Lead",
        icon: <Database className="h-5 w-5" />
    }
];

function getInitials(name: string) {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
}

export default function AboutUsPage() {
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
        <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight font-headline text-primary">About Us</h1>
                <p className="text-lg text-muted-foreground">The team behind CivicPulse.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Our Team
                    </CardTitle>
                    <CardDescription>
                        We are a passionate team of developers dedicated to creating innovative solutions for our communities.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
                                <Avatar className="h-12 w-12 text-lg">
                                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-lg font-semibold">{member.name}</p>
                                    <Badge variant="secondary" className="mt-1">
                                        {member.icon}
                                        <span className="ml-1.5">{member.role}</span>
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
