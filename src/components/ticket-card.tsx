"use client";

import Image from "next/image";
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
import { MapPin, Calendar, GitCommitHorizontal, FileText, BrainCircuit, Star } from "lucide-react";

import type { Ticket } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
}

const priorityVariantMap: Record<Ticket['priority'], "destructive" | "secondary" | "default"> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

export default function TicketCard({ ticket }: TicketCardProps) {
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
      </CardContent>
    </Card>
  );
}
