"use client";

import { useState } from 'react';
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
import { MapPin, Calendar, BrainCircuit, Star, FileText, Briefcase, ChevronDown, Users, ThumbsUp, ThumbsDown, MessageSquareQuote, XCircle } from "lucide-react";
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
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import type { Ticket, Supervisor } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
  supervisors?: Supervisor[];
  isMunicipalView?: boolean;
  isSupervisorView?: boolean;
}

const priorityVariantMap: Record<Ticket['priority'], "destructive" | "secondary" | "default"> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

export default function TicketCard({ ticket, supervisors, isMunicipalView = false, isSupervisorView = false }: TicketCardProps) {
  const [assignedSupervisor, setAssignedSupervisor] = useState(ticket.assignedSupervisorId || 'unassigned');
  const [completionNotes, setCompletionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSupervisorAssignment = async () => {
    if (assignedSupervisor === ticket.assignedSupervisorId || assignedSupervisor === 'unassigned') return;
    
    setIsSubmitting(true);
    try {
      const ticketRef = doc(db, 'tickets', ticket.id);
      const selectedSupervisor = supervisors?.find(s => s.id === assignedSupervisor);
      
      await updateDoc(ticketRef, {
        assignedSupervisorId: selectedSupervisor?.id,
        assignedSupervisorName: selectedSupervisor?.userId || null,
        status: 'In Progress',
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

  const handleReportSubmission = async () => {
    if (completionNotes.trim() === '') {
        toast({ variant: 'destructive', title: 'Error', description: 'Completion notes cannot be empty.' });
        return;
    }
    setIsSubmitting(true);
    try {
        const ticketRef = doc(db, 'tickets', ticket.id);
        await updateDoc(ticketRef, {
            status: 'Pending Approval',
            completionNotes: completionNotes,
            rejectionReason: null, // Clear previous rejection reason
        });
        toast({ title: 'Report Submitted', description: 'Your completion report is awaiting approval.' });
        setCompletionNotes('');
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{ticket.id}</CardTitle>
                <CardDescription>
                    {ticket.category} &bull; Submitted {formatDistanceToNow(ticket.submittedDate, { addSuffix: true })}
                </CardDescription>
            </div>
            <Badge variant={priorityVariantMap[ticket.priority]}>{ticket.priority} Priority</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <StatusTimeline currentStatus={ticket.status} />
        </div>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Separator />

              <div className="space-y-3 text-sm">
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
                    <p className="text-muted-foreground">{ticket.notes}</p>
                  </div>
                </div>
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
                    <p className="text-muted-foreground">Est. Resolution: {format(ticket.estimatedResolutionDate, "PPP")}</p>
                  </div>
                </div>
                
                {isMunicipalView && ticket.assignedSupervisorName && (
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

              {(isMunicipalView || isSupervisorView) && ticket.severityScore && ticket.severityReasoning && (
                <>
                  <Separator />
                  <div className="space-y-3 text-sm p-3 bg-secondary/50 rounded-md">
                     <div className="flex items-start">
                        <BrainCircuit className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">AI Image Analysis</p>
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
          <div className="mt-4 flex items-center gap-2">
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
            <Button onClick={handleSupervisorAssignment} disabled={isSubmitting || assignedSupervisor === ticket.assignedSupervisorId}>
              {isSubmitting ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        )}

        {isMunicipalView && ticket.status === 'Pending Approval' && (
            <div className="mt-4 space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Review Supervisor's Report</h4>
                    <p className="text-sm text-muted-foreground mb-4">{ticket.completionNotes}</p>
                    <div className="flex gap-2">
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
            <div className="mt-4 space-y-2">
                {ticket.rejectionReason && (
                    <div className="p-3 bg-destructive/10 rounded-md">
                        <p className="font-semibold text-destructive text-sm">Rejection Reason:</p>
                        <p className="text-sm text-destructive/80">{ticket.rejectionReason}</p>
                    </div>
                )}
                <Label htmlFor={`completion-notes-${ticket.id}`}>Completion Report</Label>
                <Textarea 
                    id={`completion-notes-${ticket.id}`} 
                    placeholder="Describe the work you completed..."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                />
                <Button onClick={handleReportSubmission} disabled={isSubmitting} className="w-full">
                    Submit for Approval
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
