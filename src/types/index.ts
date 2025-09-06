import { GeoPoint, Timestamp } from 'firebase/firestore';

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
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  reportCount: number;
  reportedBy: string[];
};

export type Supervisor = {
    id: string;
    userId: string;
    department: string;
    phoneNumber: string;
    municipalId: string;
}

export type Municipality = {
    id: string;
    name: string;
    userId: string;
}
