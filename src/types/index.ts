export type Ticket = {
  id: string;
  category: string;
  photo: string;
  notes: string;
  location: { lat: number; lng: number };
  address: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  submittedDate: Date;
  estimatedResolutionDate: Date;
  severityScore?: number;
  severityReasoning?: string;
};
