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
    property_id?: number; // backward compat
    clientId: number;
    client_id?: number; // backward compat
    propertyTitle: string;
    propertyAddress: string;
    current_terms: {
      financial?: { rent?: number; deposit?: number; payment_due_day?: number };
      dates?: { start?: string; end?: string };
      utilities?: { included?: string[]; not_included?: string[] };
    } | null; // server returns current_terms; parsed client side if needed
    status: 'draft' | 'client_accepted' | 'client_rejected' | 'approved' | 'canceled' | 'signed';
    version: number;
    clientName?: string;
    clientEmail?: string;
  }

  export interface UiNegotiation {
    id: number;
    draftId: number;
    proposedTerms: unknown; // UI layer – already validated server-side
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    message?: string | null;
    createdAt: Date | string;
    clientId: number;
    respondedAt?: Date | string | null;
    staffResponse?: unknown;
    responseMessage?: string | null;
    staffId?: number | null;
    previousNegotiationId?: number | null;
  }

  export interface LeaseDraftCardProps {
    drafts: LeaseDraft[];
    isStaff?: boolean;
  }