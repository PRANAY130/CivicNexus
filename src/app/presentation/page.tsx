
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, FilePen, Map, Users } from 'lucide-react';

const workflowSteps = [
    { title: "Citizen Reporting", description: "A citizen finds an issue, takes a photo, provides details (text or audio), and submits it." },
    { title: "AI Analysis", description: "The system's AI automatically checks image relevancy, transcribes audio, determines priority, and generates a title." },
    { title: "Citizen Confirmation", description: "The citizen reviews the AI's analysis and confirms the report." },
    { title: "Triage (Municipal Official)", description: "A new ticket is created, which an official assigns to a field supervisor with a deadline." },
    { title: "Resolution (Supervisor)", description: "The supervisor performs the work and submits a completion report with photos." },
    { title: "Final Approval", description: "The official reviews the supervisor's report, approving or rejecting it." },
];

const citizenFeatures = [
    "AI-Assisted Reporting: Effortless submission with automatic analysis.",
    "Gamification Engine: Earn Utility Points & Badges, climb the Leaderboard.",
    "Interactive Map View: See all reported issues in the community.",
    "Collaborative Reporting: 'Join' existing reports to increase their priority.",
    "Real-Time Tracking: Monitor your tickets from 'Submitted' to 'Resolved'.",
    "Feedback System: Rate completed work to influence supervisor Trust Scores."
];

const municipalFeatures = [
    "Centralized Triage Dashboard: One organized queue for all new reports.",
    "AI-Powered Insights: Instant prioritization for smarter decision-making.",
    "Supervisor Management: Create, manage, and assign tasks efficiently.",
    "Comprehensive Analytics: Visualize issue categories, resolution times, and performance.",
    "Live GIS Map: View all issues color-coded by priority on an interactive map."
];

const supervisorFeatures = [
    "Personalized Work Queue: A clear dashboard of active and resolved tickets.",
    "Performance Analytics: Track Efficiency Points, Trust Score, and history with charts.",
    "AI-Guarded Submissions: Prevents fraudulent reports by detecting AI-generated images.",
    "Streamlined Reporting: Easily submit completion reports with photos from the field.",
    "Leaderboard Ranking: Compete for the top spot based on a rewarding efficiency system."
];

const futureScope = [
    "Predictive Maintenance: Use historical data to predict future issues.",
    "Automated Supervisor Assignment: AI-driven assignment based on location and workload.",
    "Multi-language Support: Expand accessibility to support multiple languages.",
    "Deeper Integrations: Connect with municipal ERP systems and communication channels.",
    "Community Forums: Allow citizens to discuss issues and propose solutions."
];

export default function PresentationPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return null;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
            <header className="text-center space-y-2">
                <Badge variant="secondary">SIH 2024 Presentation</Badge>
                <h1 className="text-5xl font-bold tracking-tight font-headline text-primary">CivicPulse</h1>
                <p className="text-xl text-muted-foreground">Empowering Communities, One Report at a Time.</p>
            </header>

            <Separator />

            <section>
                <Card>
                    <CardHeader>
                        <CardTitle>The Problem</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p><strong>Disconnected Citizens:</strong> Citizens lack a simple, direct, and effective way to report local infrastructure issues (like potholes, broken lights, or waste).</p>
                        <p><strong>Inefficient Municipalities:</strong> Local governments are overwhelmed with disorganized reports from various channels, making it difficult to prioritize and track tasks.</p>
                        <p><strong>Lack of Transparency:</strong> There's no clear communication channel for citizens to see the status of their reports, leading to frustration and a feeling of being unheard.</p>
                        <p><strong>Delayed Resolutions:</strong> Inefficient workflows lead to significant delays in addressing critical public issues, impacting community well-being and safety.</p>
                    </CardContent>
                </Card>
            </section>

             <section>
                <Card>
                    <CardHeader>
                        <CardTitle>Proposed Solution: CivicPulse</CardTitle>
                         <CardDescription>An AI-powered, mobile-first Progressive Web App (PWA) that bridges the gap between citizens and their local government.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-muted-foreground">
                            <p><strong>Detailed Explanation:</strong> CivicPulse is a comprehensive, three-sided platform designed to streamline civic issue reporting and resolution. It empowers citizens to become active community members, equips municipal officials with powerful management tools, and provides field supervisors with a clear, efficient workflow.</p>
                            <p><strong>How it Addresses the Problem:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>It solves citizen disconnection by providing an engaging, gamified, and easy-to-use mobile app.</li>
                                <li>It tackles municipal inefficiency by using AI to automatically triage, categorize, and prioritize incoming reports, saving valuable time.</li>
                                <li>It eliminates the lack of transparency by offering real-time status tracking for everyone involved, from the reporting citizen to the resolving supervisor.</li>
                            </ul>
                            <p><strong>Innovation and Uniqueness:</strong></p>
                             <ul className="list-disc list-inside space-y-1">
                                <li><strong>AI-Driven Triage:</strong> Our "Hybrid Priority Engine" uses Google's Gemini AI to analyze images for severity and user notes for keywords, creating an intelligent and automated priority level.</li>
                                <li><strong>Gamification Engine:</strong> We don't just take reports; we build a community. Utility Points, Trust Scores, Efficiency Scores, and unlockable badges encourage high-quality, continuous engagement from both citizens and supervisors.</li>
                                <li><strong>Three-Sided Platform:</strong> Unlike simple reporting tools, CivicPulse creates a complete, closed-loop ecosystem for citizens, municipal officials, and field supervisors, ensuring accountability and efficiency at every stage.</li>
                             </ul>
                        </div>
                       <p className="text-lg text-center font-medium text-primary bg-primary/10 p-4 rounded-md">
                        Our Mission: To create a transparent, efficient, and collaborative ecosystem for reporting and resolving civic issues, making our communities better, together.
                       </p>
                    </CardContent>
                </Card>
            </section>
            
            <section>
                <Card>
                     <CardHeader>
                        <CardTitle>How It Works</CardTitle>
                        <CardDescription>A simple, three-step process to make a real impact.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                             <FilePen className="h-10 w-10 text-primary mb-3" />
                             <h3 className="font-bold text-lg">Report</h3>
                             <p className="text-sm text-muted-foreground">Citizens snap a photo and submit a report. Our AI helps categorize and prioritize it instantly.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                             <Map className="h-10 w-10 text-primary mb-3" />
                             <h3 className="font-bold text-lg">Manage</h3>
                             <p className="text-sm text-muted-foreground">Officials assign tasks to supervisors from a central dashboard and track all issues on a map.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                             <CheckCircle2 className="h-10 w-10 text-primary mb-3" />
                             <h3 className="font-bold text-lg">Resolve</h3>
                             <p className="text-sm text-muted-foreground">Supervisors complete the work, submit photo proof, and the citizen is notified of the resolution.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

             <section className="grid md:grid-cols-1 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Methodology and Implementation Process</CardTitle>
                        <CardDescription>The application follows a clear, step-by-step process from issue reporting to resolution, ensuring transparency and accountability. The workflow is visualized below, and a live working prototype is available for demonstration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code>
{`graph TD
    subgraph Citizen
        A[Start: Report Issue] --> B{Snap Photo & Add Notes/Audio};
        B --> C[Submit for Analysis];
    end

    subgraph AI Processing
        C --> D{1. Analyze Image Relevancy & Severity};
        D -- Irrelevant --> D_Reject[Reject & Notify User];
        D -- Relevant --> E{2. Transcribe Audio (if any)};
        E --> F{3. Determine Priority};
        F --> G{4. Generate Title};
    end
    
    subgraph Citizen Review
        G --> H{Review AI Analysis};
        H -- Looks Good --> I[Confirm & Submit Report];
        H -- Needs Changes --> B;
    end

    subgraph Municipal Official
        I --> J[Ticket Created in Triage Queue];
        J --> K{Assign to Supervisor & Set Deadline};
    end

    subgraph Field Supervisor
        K --> L[Ticket in 'In Progress' Queue];
        L --> M{Perform Work};
        M --> N[Submit Completion Report];
    end

    subgraph Municipal Official Review
        N --> O{Review Supervisor's Report};
        O -- Approve --> P[Ticket 'Resolved'];
        O -- Reject w/ Reason --> L;
    end

    A --> Z([End]);
    D_Reject --> Z;
    P --> Z;
`}
                            </code></pre>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Technologies to be Used</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Programming Languages:</strong> TypeScript, JavaScript</p>
                        <p><strong>Frameworks:</strong> Next.js, React, Genkit (for AI), Tailwind CSS, ShadCN UI</p>
                        <p><strong>GenAI Model:</strong> Google's Gemini 2.5 Flash for image analysis, text generation, and audio transcription.</p>
                        <p><strong>Backend & Database:</strong> Firebase (Authentication, Firestore, Storage)</p>
                        <p><strong>Hosting:</strong> Firebase App Hosting</p>
                         <p><strong>Hardware:</strong> No specialized hardware is required. The application is a PWA accessible via any modern web browser on a smartphone or computer.</p>
                    </CardContent>
                </Card>
             </section>

            <section className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> For Citizens</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {citizenFeatures.map((feature, index) => <p key={index} className="text-sm text-muted-foreground flex"><ArrowRight className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-primary"/>{feature}</p>)}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> For Officials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {municipalFeatures.map((feature, index) => <p key={index} className="text-sm text-muted-foreground flex"><ArrowRight className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-primary"/>{feature}</p>)}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> For Supervisors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {supervisorFeatures.map((feature, index) => <p key={index} className="text-sm text-muted-foreground flex"><ArrowRight className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-primary"/>{feature}</p>)}
                    </CardContent>
                </Card>
            </section>

             <section className="grid md:grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Future Scope & Vision</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-2">
                        {futureScope.map((feature, index) => <p key={index} className="text-sm text-muted-foreground flex"><ArrowRight className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-primary"/>{feature}</p>)}
                    </CardContent>
                </Card>
             </section>

             <footer className="text-center py-6">
                <h2 className="text-2xl font-bold font-headline text-primary">Thank You!</h2>
                <p className="text-muted-foreground">Any Questions?</p>
             </footer>
        </div>
    );
}
