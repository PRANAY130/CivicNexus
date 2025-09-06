
"use client";

import TicketCard from "./ticket-card";
import type { Ticket, Supervisor } from "@/types";
import { Inbox } from 'lucide-react';

interface ViewTicketsProps {
  tickets: Ticket[];
  supervisors?: Supervisor[];
  isMunicipalView?: boolean;
  isSupervisorView?: boolean;
}

export default function ViewTickets({ tickets, supervisors, isMunicipalView = false, isSupervisorView = false }: ViewTicketsProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold font-headline">No Tickets Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no tickets to display in this view.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard 
          key={ticket.id} 
          ticket={ticket} 
          supervisors={supervisors} 
          isMunicipalView={isMunicipalView} 
          isSupervisorView={isSupervisorView}
        />
      ))}
    </div>
  );
}
