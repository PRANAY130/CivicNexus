import { GeoPoint } from 'firebase/firestore';

export type Ticket = {
  id: string;
  userId: string;
  category: string;
  notes: string;
  location: GeoPoint;
  address: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  submittedDate: Date;
  estimatedResolutionDate: Date;
  severityScore?: number;
  severityReasoning?: string;
};
