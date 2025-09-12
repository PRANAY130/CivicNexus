
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { format, formatDistanceToNow } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StatusTimeline from "./status-timeline";
import { MapPin, Calendar, BrainCircuit, Star, FileText, Briefcase, ChevronDown, Users, ThumbsUp, ThumbsDown, MessageSquareQuote, XCircle, UserPlus, Hash, Timer, Waves, Image as ImageIcon, Camera, Upload } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { analyzeCompletionReport } from '@/ai/flows/analyze-completion-report';
import CameraModal from './camera-modal';
import { Input } from './ui/input';

import type { Ticket, Supervisor } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
  supervisors?: Supervisor[];
  isMunicipalView?: boolean;
  isSupervisorView?: boolean;
isNearbyView?: boolean;
  onJoinReport?: (ticketId: string) => void;
}

const priorityVariantMap: Record<Ticket['priority'], "destructive" | "secondary" | "default"> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

export default function TicketCard({ ticket, supervisors, isMunicipalView = false, isSupervisorView = false, isNearbyView = false, onJoinReport }: TicketCardProps) {
  const [assignedSupervisor, setAssignedSupervisor] = useState(ticket.assignedSupervisorId || 'unassigned');
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(ticket.deadlineDate);
  const [completionNotes, setCompletionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [completionPhotoDataUri, setCompletionPhotoDataUri] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const completionFileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSupervisorAssignment = async () => {
    if (assignedSupervisor === 'unassigned') {
        toast({ variant: 'destructive', title: 'No supervisor selected', description: 'Please select a supervisor to assign this ticket.' });
        return;
    }
     if (!deadlineDate) {
        toast({ variant: 'destructive', title: 'No deadline set', description: 'Please select a deadline for this ticket.' });
        return;
    }
    
    setIsSubmitting(true);
    try {
      const ticketRef = doc(db, 'tickets', ticket.id);
      const selectedSupervisor = supervisors?.find(s => s.id === assignedSupervisor);
      
      await updateDoc(ticketRef, {
        assignedSupervisorId: selectedSupervisor?.id,
        assignedSupervisorName: selectedSupervisor?.userId || null,
        status: 'In Progress',
        deadlineDate: Timestamp.fromDate(deadlineDate)
      });

      toast({
        title: "Ticket Assigned",
        description: `Ticket ${ticket.id} has been assigned to ${selectedSupervisor?.userId}.`,
      });
    } catch (error) {
      console.error("Error assigning ticket: ", error);
      toast({
        variant: 'destructive',
        title: "Assignment Failed",
        description: "There was an error assigning the ticket.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletionFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompletionPhotoDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmission = async () => {
    if (completionNotes.trim() === '') {
        toast({ variant: 'destructive', title: 'Error', description: 'Completion notes cannot be empty.' });
        return;
    }
    if (!completionPhotoDataUri) {
        toast({ variant: 'destructive', title: 'Error', description: 'A completion photo is required.' });
        return;
    }
    if (!ticket.imageUrl) {
        toast({ variant: 'destructive', title: 'Error', description: 'Original image URL is missing.' });
        return;
    }

    setIsSubmitting(true);
    try {
        const { analysis } = await analyzeCompletionReport({
            originalPhotoUrl: ticket.imageUrl,
            originalNotes: ticket.notes,
            originalAudioTranscription: ticket.audioTranscription,
            completionPhotoDataUri: completionPhotoDataUri,
            completionNotes: completionNotes,
        });
        
        const imageRef = storageRef(storage, `tickets/${ticket.id}_completion.jpg`);
        await uploadString(imageRef, completionPhotoDataUri, 'data_url');
        const imageUrl = await getDownloadURL(imageRef);

        const ticketRef = doc(db, 'tickets', ticket.id);
        await updateDoc(ticketRef, {
            status: 'Pending Approval',
            completionNotes: completionNotes,
            completionImageUrl: imageUrl,
            completionAnalysis: analysis,
            rejectionReason: null, // Clear previous rejection reason
        });
        toast({ title: 'Report Submitted', description: 'Your completion report is awaiting approval.' });
        setCompletionNotes('');
        setCompletionPhotoDataUri(null);
    } catch (error) {
        console.error("Error submitting report: ", error);
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'Could not submit your report.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleApproval = async () => {
    setIsSubmitting(true);
    try {
        const ticketRef = doc(db, 'tickets', ticket.id);
        await updateDoc(ticketRef, {
            status: 'Resolved',
            rejectionReason: null,
        });
        toast({ title: 'Work Approved', description: 'The ticket has been marked as resolved.' });
    } catch (error) {
        console.error("Error approving work: ", error);
        toast({ variant: 'destructive', title: 'Approval Failed', description: 'Could not approve the work.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleRejection = async () => {
      if (rejectionReason.trim() === '') {
        toast({ variant: 'destructive', title: 'Error', description: 'Rejection reason cannot be empty.' });
        return;
      }
      setIsSubmitting(true);
      try {
          const ticketRef = doc(db, 'tickets', ticket.id);
          await updateDoc(ticketRef, {
              status: 'In Progress',
              rejectionReason: rejectionReason,
          });
          toast({ title: 'Work Rejected', description: 'The report has been sent back to the supervisor.' });
          setRejectionReason('');
      } catch (error) {
          console.error("Error rejecting work: ", error);
          toast({ variant: 'destructive', title: 'Rejection Failed', description: 'Could not reject the work.' });
      } finally {
          setIsSubmitting(false);
      }
  };
  
  const selectedSupervisorName = supervisors?.find(s => s.id === assignedSupervisor)?.userId || "Unassigned";
  const deadlineDateAsDate = ticket.deadlineDate instanceof Timestamp ? ticket.deadlineDate.toDate() : ticket.deadlineDate;

  return (
    <>
    <CameraModal 
        open={isCameraModalOpen}
        onOpenChange={setIsCameraModalOpen}
        onPhotoCapture={(dataUri) => {
            setCompletionPhotoDataUri(dataUri);
            setIsCameraModalOpen(false);
        }}
    />
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{ticket.title || ticket.category}</CardTitle>
                <CardDescription>
                    {ticket.category} &bull; Submitted {formatDistanceToNow(new Date(ticket.submittedDate), { addSuffix: true })}
                </CardDescription>
            </div>
            <Badge variant={priorityVariantMap[ticket.priority]}>{ticket.priority} Priority</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <StatusTimeline currentStatus={ticket.status} />
        </div>

        {isSupervisorView && deadlineDateAsDate && (
          <div className="flex items-center p-3 my-4 bg-secondary/50 rounded-lg border">
            <Timer className="h-5 w-5 mr-3 flex-shrink-0 text-foreground" />
            <div>
              <p className="font-semibold text-sm">Deadline</p>
              <p className="text-sm text-muted-foreground">{format(deadlineDateAsDate, "PPP")}</p>
            </div>
          </div>
        )}
        
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Separator />

              {ticket.imageUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-semibold">
                      <ImageIcon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground"/>
                      <span>Submitted Photo</span>
                    </div>
                    <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                       <Image src={ticket.imageUrl} alt={`Image for ticket ${ticket.id}`} fill style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
              )}

              <div className="space-y-3 text-sm">
                 <div className="flex items-start">
                  <Hash className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Ticket ID</p>
                    <p className="text-muted-foreground">{ticket.id}</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <Users className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Report Count</p>
                    <p className="text-muted-foreground">{ticket.reportCount || 1}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">User Notes</p>
                    <p className="text-muted-foreground">{ticket.notes || "N/A"}</p>
                  </div>
                </div>
                {ticket.audioTranscription && (
                  <div className="flex items-start">
                    <Waves className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Audio Transcription</p>
                        <p className="text-muted-foreground italic">"{ticket.audioTranscription}"</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{ticket.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                   <div>
                    <p className="font-semibold">Timeline</p>
                    <p className="text-muted-foreground">Est. Resolution: {format(new Date(ticket.estimatedResolutionDate), "PPP")}</p>
                  </div>
                </div>

                {deadlineDateAsDate && !isSupervisorView && (
                  <div className="flex items-start">
                    <Timer className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Deadline</p>
                      <p className="text-muted-foreground">{format(deadlineDateAsDate, "PPP")}</p>
                    </div>
                  </div>
                )}
                
                {ticket.assignedSupervisorName && (
                  <div className="flex items-start">
                    <Briefcase className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Assigned Supervisor</p>
                      <p className="text-muted-foreground">{ticket.assignedSupervisorName}</p>
                    </div>
                  </div>
                )}
                 
                {!isSupervisorView && ticket.completionNotes && (
                  <div className="flex items-start">
                    <MessageSquareQuote className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Supervisor's Report</p>
                      <p className="text-muted-foreground">{ticket.completionNotes}</p>
                    </div>
                  </div>
                )}

                {isSupervisorView && ticket.rejectionReason && (
                   <div className="flex items-start p-3 bg-destructive/10 rounded-md">
                    <XCircle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-destructive" />
                    <div>
                      <p className="font-semibold text-destructive">Reason for Rejection</p>
                      <p className="text-destructive/80">{ticket.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {ticket.severityScore && ticket.severityReasoning && (
                <>
                  <Separator />
                  <div className="space-y-3 text-sm p-3 bg-secondary/50 rounded-md">
                     <div className="flex items-start">
                        <BrainCircuit className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">AI Image Analysis (Original)</p>
                            <p className="text-muted-foreground">{ticket.severityReasoning}</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <Star className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">AI Severity Score</p>
                            <p className="text-muted-foreground">{ticket.severityScore} / 10</p>
                        </div>
                    </div>
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {isMunicipalView && ticket.status === 'Submitted' && supervisors && (
          <div className="mt-4 flex flex-col md:flex-row items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedSupervisorName}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuRadioGroup value={assignedSupervisor} onValueChange={setAssignedSupervisor}>
                  <DropdownMenuRadioItem value="unassigned">Unassigned</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  {supervisors.map((supervisor) => (
                    <DropdownMenuRadioItem key={supervisor.id} value={supervisor.id}>
                      {supervisor.userId} ({supervisor.department})
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadlineDate && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a deadline</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                        mode="single"
                        selected={deadlineDate}
                        onSelect={setDeadlineDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Button onClick={handleSupervisorAssignment} disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        )}

        {isMunicipalView && ticket.status === 'Pending Approval' && (
            <div className="mt-4 space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Review Supervisor's Report</h4>
                    <p className="text-sm text-muted-foreground mb-4">{ticket.completionNotes}</p>
                    
                    {ticket.completionImageUrl && (
                      <div className="space-y-2 mb-4">
                        <Label>Completion Photo</Label>
                        <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                          <Image src={ticket.completionImageUrl} alt="Completion photo" fill style={{ objectFit: 'cover' }} />
                        </div>
                      </div>
                    )}
                    
                    {ticket.completionAnalysis && (
                        <div className="space-y-2 text-sm p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-start">
                                <BrainCircuit className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-blue-800">AI Completion Analysis</p>
                                    <p className="text-blue-700">{ticket.completionAnalysis}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleApproval} disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                           <ThumbsUp className="mr-2 h-4 w-4"/> Approve
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex-1" disabled={isSubmitting}><ThumbsDown className="mr-2 h-4 w-4"/> Reject</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Reject Completion Report?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Please provide a reason for rejecting this report. The supervisor will be notified and asked to resubmit.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="space-y-2">
                                    <Label htmlFor="rejectionReason">Rejection Reason</Label>
                                    <Textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., The issue is still visible..." />
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRejection} disabled={isSubmitting || !rejectionReason}>Submit Rejection</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        )}

        {isSupervisorView && ticket.status === 'In Progress' && (
            <div className="mt-4 space-y-4">
                {ticket.rejectionReason && (
                    <div className="p-3 bg-destructive/10 rounded-md">
                        <p className="font-semibold text-destructive text-sm">Reason for Rejection:</p>
                        <p className="text-sm text-destructive/80">{ticket.rejectionReason}</p>
                    </div>
                )}
                <div className="space-y-2">
                    <Label>Completion Photo</Label>
                    <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border flex items-center justify-center">
                        {completionPhotoDataUri ? (
                            <Image src={completionPhotoDataUri} alt="Completion Preview" fill style={{ objectFit: 'cover' }} />
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                <ImageIcon className="mx-auto h-12 w-12" />
                                <p>Upload a photo of the completed work</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsCameraModalOpen(true)}>
                            <Camera className="mr-2" /> Capture
                        </Button>
                        <Input ref={completionFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCompletionFileSelect} />
                        <Button type="button" size="sm" variant="outline" onClick={() => completionFileInputRef.current?.click()}>
                            <Upload className="mr-2" /> Upload
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`completion-notes-${ticket.id}`}>Completion Report</Label>
                    <Textarea 
                        id={`completion-notes-${ticket.id}`} 
                        placeholder="Describe the work you completed..."
                        value={completionNotes}
                        onChange={(e) => setCompletionNotes(e.target.value)}
                    />
                </div>
                <Button onClick={handleReportSubmission} disabled={isSubmitting || !completionPhotoDataUri} className="w-full">
                    {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
            </div>
        )}
      </CardContent>
       {isNearbyView && onJoinReport && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => onJoinReport(ticket.id)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Join Report
          </Button>
        </CardFooter>
      )}
    </Card>
    </>
  );
}
