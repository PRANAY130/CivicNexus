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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StatusTimeline from "./status-timeline";
import { MapPin, Calendar, BrainCircuit, Star, FileText, Briefcase, ChevronDown } from "lucide-react";
import { Button } from '@/components/ui/button';
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
}

const priorityVariantMap: Record<Ticket['priority'], "destructive" | "secondary" | "default"> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

export default function TicketCard({ ticket, supervisors, isMunicipalView = false }: TicketCardProps) {
  const [assignedSupervisor, setAssignedSupervisor] = useState(ticket.assignedSupervisorId || 'unassigned');
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
                {ticket.assignedSupervisorName && (
                  <div className="flex items-start">
                    <Briefcase className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Assigned Supervisor</p>
                      <p className="text-muted-foreground">{ticket.assignedSupervisorName}</p>
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
        {isMunicipalView && supervisors && (
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
      </CardContent>
    </Card>
  );
}
