export interface Lease {
    id: number;
    propertyId: number;
    propertyTitle: string;
    propertyAddress: string;
    signedByClient: boolean;
    signedByAgent: boolean;
    activeFrom: Date;
    clientName?: string;
    clientEmail?: string;
  }
  
  export interface LeaseDraft {
    id: number;
    propertyId: number;
    propertyTitle: string;
    propertyAddress: string;
    current_terms : JSON
    status: 'draft' | 'client_review' | 'manager_review' | 'approved' | 'signed';
    version: number;
    clientName?: string;
    clientEmail?: string;
  }

  export interface LeaseDraftCardProps {
    drafts: LeaseDraft[];
    isStaff?: boolean;
  }