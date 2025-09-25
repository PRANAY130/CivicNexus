

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, FilePen, Map, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const citizenFeatures = [
    "AI-Assisted Reporting: Effortless submission with automatic analysis.",
    "Gamification Engine: Earn Utility Points & Badges, climb the Leaderboard.",
    "Interactive Map View: See all reported issues in the community.",
    "Collaborative Reporting: 'Join' existing reports to increase their priority.",
    "Real-Time Tracking: Monitor your tickets from 'Submitted' to 'Resolved'.",
    "Feedback System: Rate completed work to influence supervisor Trust Scores."
];

const workflowSteps = [
    { title: "Citizen Reporting", description: "A citizen finds an issue, takes a photo, provides details (text or audio), and submits it." },
    { title: "AI Analysis", description: "The system's AI automatically checks image relevancy, transcribes audio, determines priority, and generates a title." },
    { title: "Citizen Confirmation", description: "The citizen reviews the AI's analysis and confirms the report." },
    { title: "Triage (Municipal Official)", description: "A new ticket is created, which an official assigns to a field supervisor with a deadline." },
    { title: "Resolution (Supervisor)", description: "The supervisor performs the work and submits a completion report with photos." },
    { title: "Final Approval", description: "The official reviews the supervisor's report, approving or rejecting it." },
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

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">View In-Depth Project Breakdown</AccordionTrigger>
                    <AccordionContent>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Detailed Idea Description</CardTitle>
                                <CardDescription>A comprehensive breakdown of the CivicPulse platform, its features, and workflows.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">1. Core Concept: A Three-Sided Ecosystem</h4>
                                    <p className="text-muted-foreground text-sm">CivicPulse is not just a reporting app; it's a complete ecosystem that connects three key groups, each with their own tailored interface and set of tools:</p>
                                    <ul className="list-disc list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                                        <li><strong>Citizens:</strong> The eyes and ears of the community. They report issues, track progress, and provide feedback. Their experience is gamified to encourage participation.</li>
                                        <li><strong>Municipal Officials:</strong> The administrative backbone. They manage incoming reports, assign tasks to supervisors, and monitor overall performance through an analytics dashboard.</li>
                                        <li><strong>Field Supervisors:</strong> The hands-on problem solvers. They receive assigned tasks, perform the necessary work, and report back with photo evidence of completion.</li>
                                    </ul>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">2. The Citizen Workflow: Report, Track, Engage</h4>
                                    <p className="text-muted-foreground text-sm mb-3">The citizen journey is designed to be simple, engaging, and rewarding.</p>
                                    <ol className="list-decimal list-inside space-y-3 text-sm">
                                        <li><strong>AI-Assisted Reporting:</strong> A citizen encounters an issue (e.g., a large pothole). They open the CivicPulse PWA, and in a few taps:
                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                <li>They take one or more photos of the issue.</li>
                                                <li>They can add optional text notes or record a voice message.</li>
                                                <li>The app automatically captures their GPS coordinates, which are reverse-geocoded to a street address.</li>
                                                <li>They select a category (e.g., "Pothole").</li>
                                                <li>Upon clicking "Analyze," our AI engine (Gemini) processes the images and notes to generate a suggested title, a severity score (1-10), and a priority level (Low, Medium, High).</li>
                                            </ul>
                                        </li>
                                        <li><strong>Review & Submit:</strong> The citizen reviews the AI's analysis. If it looks correct, they confirm and submit. This creates a new ticket in the system with a unique ID (e.g., #CP-12345).</li>
                                        <li><strong>Gamification & Rewards:</strong> For submitting a valid report, the citizen instantly earns "Utility Points" based on the severity score. They might also unlock badges like "New Reporter" or "Sharp Eye" (for high-severity issues). These points contribute to their rank on the community leaderboard.</li>
                                        <li><strong>Real-Time Tracking:</strong> In their "My Tickets" section, the citizen can see a visual timeline showing the status of their report—from 'Submitted' to 'In Progress' and finally 'Resolved'.</li>
                                        <li><strong>Collaborative Reporting:</strong> Citizens can view a map of all issues. If they see an issue that's already been reported nearby, they can "Join Report." This action adds to the report's "join count," which can automatically elevate its priority (e.g., a low-priority issue becomes medium after 5 joins).</li>
                                        <li><strong>Feedback Loop:</strong> Once a supervisor marks a ticket as resolved, the citizen is notified. They can then provide a rating (1-10) and an optional comment on the quality of the work. This feedback directly impacts the supervisor's "Trust Score."</li>
                                    </ol>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">3. The Municipal & Supervisor Workflow: Triage, Assign, Resolve, Verify</h4>
                                    <p className="text-muted-foreground text-sm mb-3">The backend workflow is designed for maximum efficiency and accountability.</p>
                                     <ol className="list-decimal list-inside space-y-3 text-sm">
                                        <li><strong>Triage & Assignment (Official):</strong> New tickets appear in the Municipal Official's "Triage Queue." They can see all relevant details, including the AI-generated priority. Based on the category and location, the official assigns the ticket to the most relevant Field Supervisor and sets a deadline.</li>
                                        <li><strong>Work Execution (Supervisor):</strong> The ticket now appears in the Supervisor's "Active Work Queue" on their dashboard. They can view all details and directions. After completing the work, they submit a completion report, which must include photos of the finished job and written notes.</li>
                                        <li><strong>AI-Guarded Verification:</strong> To prevent fraud, when a supervisor submits a completion photo, our AI runs a check to detect if the image is AI-generated. If it is, the submission is rejected, and the supervisor's "Trust Score" is penalized.</li>
                                        <li><strong>Final Approval (Official):</strong> The ticket, now in "Pending Approval" status, returns to the Official's dashboard. They see a side-by-side comparison: the original issue photos/notes vs. the supervisor's completion photos/notes, along with an AI analysis of the resolution.
                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                <li>If the work is satisfactory, they click "Approve." The ticket is marked 'Resolved', and the supervisor earns "Efficiency Points."</li>
                                                <li>If the work is unsatisfactory, they "Reject" it, providing a reason. The ticket is sent back to the supervisor's queue, and their "Trust Score" is slightly reduced.</li>
                                            </ul>
                                        </li>
                                    </ol>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">4. Uniqueness & Innovation: The Engines Driving CivicPulse</h4>
                                    <p className="text-muted-foreground text-sm mb-3">Our core innovations are what set CivicPulse apart from simple reporting tools.</p>
                                     <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                        <li><strong>The Hybrid Priority Engine:</strong> This is our AI-powered brain. It combines multiple data points for an intelligent, automated assessment:
                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                <li><strong>Image Analysis:</strong> Gemini Pro Vision analyzes photos for a severity score (1-10) and reasoning.</li>
                                                <li><strong>NLP Keyword Analysis:</strong> The AI scans written notes and audio transcriptions for keywords like "urgent," "dangerous," or "blockage" that influence priority.</li>
                                                <li><strong>Categorical Weighting:</strong> Issues like "Safety Hazard" are inherently given a higher base priority than "Graffiti."</li>
                                                <li><strong>Community Weighting:</strong> The number of "joins" from other users acts as a multiplier, elevating the issue's importance.</li>
                                            </ul>
                                        </li>
                                        <li><strong>The Gamification Engine:</strong> We use game mechanics to foster a positive and continuous cycle of engagement:
                                             <ul className="list-disc list-inside ml-4 mt-1">
                                                <li><strong>For Citizens (Utility Points):</strong> Earned for submitting valid reports. Encourages quantity and quality of reports.</li>
                                                <li><strong>For Supervisors (Efficiency Points):</strong> Earned for timely and approved resolutions. Encourages speed and quality of work.</li>
                                                <li><strong>Trust Score:</strong> A universal reputation score. Citizens lose points for irrelevant reports; supervisors lose points for rejected work or AI-detected fake photos. It ensures the integrity of the system.</li>
                                                <li><strong>Badges & Leaderboards:</strong> Provide long-term goals and social recognition, turning civic duty into a rewarding experience.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
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
                        <div className="flex justify-center p-4 rounded-lg bg-muted overflow-x-auto">
                            <pre className="text-sm font-code">
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

    style A fill:#22c55e,stroke:#fff,stroke-width:2px,color:#fff
    style Z fill:#ef4444,stroke:#fff,stroke-width:2px,color:#fff
`}
                            </pre>
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
                <Card>
                    <CardHeader>
                        <CardTitle>Feasibility, Challenges, and Risks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Analysis of Feasibility</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                <li><strong>Technical Feasibility:</strong> High. The proposed tech stack (Next.js, Firebase, Genkit) is mature and well-suited for building scalable web applications. Google's Gemini models provide powerful, accessible AI capabilities for the required tasks.</li>
                                <li><strong>Operational Feasibility:</strong> Moderate. Success depends on adoption by municipal bodies. The platform is designed to be intuitive, reducing the training required for officials and supervisors, thus increasing the likelihood of adoption.</li>
                                <li><strong>Economic Feasibility:</strong> High. The initial development cost is manageable within a hackathon scope. For a real-world product, a subscription-based model for municipalities is a proven SaaS strategy. The cloud-based infrastructure (Firebase) scales with demand, minimizing upfront investment.</li>
                            </ul>
                        </div>
                        <Separator/>
                        <div>
                            <h4 className="font-semibold mb-2">Potential Challenges and Risks</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                <li><strong>User Adoption:</strong> Both citizens and municipal bodies need to be convinced to adopt a new platform.</li>
                                <li><strong>Data Quality & Misuse:</strong> Low-quality reports or fraudulent submissions can clog the system.</li>
                                <li><strong>Data Privacy & Security:</strong> Handling user data and location information requires robust security measures.</li>
                            </ul>
                        </div>
                        <Separator/>
                        <div>
                            <h4 className="font-semibold mb-2">Strategies for Overcoming Challenges</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                <li><strong>Adoption Strategy:</strong> Launch pilot programs with a few tech-forward municipalities. Use community outreach and the gamification engine to drive citizen engagement.</li>
                                <li><strong>Quality Control:</strong> The AI's relevancy check acts as a first-line defense. The Trust Score system disincentivizes spam by penalizing users for irrelevant reports and supervisors for fake completion photos.</li>
                                <li><strong>Security Measures:</strong> Leverage Firebase's built-in security rules for database access control and ensure all data transmission is encrypted. User PII (Personally Identifiable Information) will be handled with care, and location data is only used for issue reporting.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Potential Impact & Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2 text-primary">Social Benefits</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                <li>Increases civic engagement and strengthens community pride.</li>
                                <li>Builds trust and transparency between citizens and local government.</li>
                                <li>Improves public safety and quality of life by resolving issues faster.</li>
                            </ul>
                        </div>
                        <Separator/>
                        <div>
                            <h4 className="font-semibold mb-2 text-primary">Economic Benefits</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                <li>Reduces operational costs for municipalities through efficient, AI-driven workflows.</li>
                                <li>Helps prevent costly damage to public infrastructure with proactive reporting.</li>
                                <li>Supports local businesses by fostering a cleaner, safer, and more attractive environment.</li>
                            </ul>
                        </div>
                        <Separator/>
                        <div>
                            <h4 className="font-semibold mb-2 text-primary">Environmental Benefits</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                <li>Promotes a cleaner environment by streamlining waste management and pollution reporting.</li>
                                <li>Helps maintain green spaces through efficient tracking of tree and park maintenance needs.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Competitive Analysis</CardTitle>
                        <CardDescription>How CivicPulse compares to existing solutions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">Feature</TableHead>
                                    <TableHead className="text-center font-bold">Traditional Methods (Phone/Email)</TableHead>
                                    <TableHead className="text-center font-bold">Basic Trackers</TableHead>
                                    <TableHead className="text-center font-bold text-primary">CivicPulse</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>AI-Powered Triage</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gamification Engine</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>3-Sided Platform (Citizen, Official, Supervisor)</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center">Partial</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Real-time Status Tracking</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Centralized Dashboard</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center">Partial</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell>Analytics & Reporting</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-destructive">❌</TableCell>
                                    <TableCell className="text-center text-green-500">✅</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>References & Research Work</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>Our solution is built upon established principles of civic technology and user engagement. Key concepts include:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li><a href="#" className="text-primary hover:underline">"The Impact of Gamification on Civic Engagement" - Journal of Urban Technology</a></li>
                            <li><a href="#" className="text-primary hover:underline">"AI in the Public Sector: A Framework for Ethical Implementation" - GovTech Review</a></li>
                            <li><a href="#" className="text-primary hover:underline">Firebase and Google Cloud documentation for scalable, secure application development.</a></li>
                        </ul>
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

    

    