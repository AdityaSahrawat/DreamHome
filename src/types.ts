// types.ts

export interface User {
    id : number, 
    email : string,
    role :  'client' | 'owner' |'manager' |'assistant'| 'supervisor'
}

export interface Client {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'client';
    branch_id: number;
    created_at: Date;
}

export interface Staff {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'manager' | 'supervisor' | 'assistant';
    branch_id: number;
    created_at: Date;
}

export interface Owner {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'owner';
    branch_id: null ;
    created_at: Date;
}

export interface StaffApplication {
    application_id: number;
    name: string;
    email: string;
    password: string;
    role: 'manager' | 'supervisor' | 'assistant';
    branch_id: number;
    created_at: Date;
}

export interface Property {
    id: number;
    title: string;
    agent_id : number,
    description: string;
    address: string;
    city : string,
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    type: string;
    status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented' ;
    latitude : number,
    longitude : number,
    year_built : number,
    created_at: string;
    updated_at: string;
}

export interface Property_image {
    id : number,
    photo_url : string,
    property_id : number
}

export interface ViewRequest {
    id : number;
    client_id: number;
    property_id: number;
    assistant_id: number | null;
    status: 'pending' | 'approved' | 'rejected';
    scheduled_time: string;
    message: string;
}


// Simplified lease draft lifecycle statuses
// draft -> (client_accept | client_reject) -> client_accepted | client_rejected -> (assistant_update resets to draft) -> manager_approve -> approved -> signed (optional after lease creation)
// canceled is terminal when assistant cancels before approval
export type LeaseDraftStatus =
    | 'draft'
    | 'client_accepted'
    | 'client_rejected'
    | 'approved'
    | 'canceled'
    | 'signed'; // retained for backward compatibility with finalization routes
export type NegotiationStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

export interface LeaseDraft {
    id: number;
    propertyId: number;
    clientId: number;
    currentTerms?: LeaseTerms; // Source of truth for current proposed/accepted terms
    status: LeaseDraftStatus;
    version: number;
    createdAt?: Date; // optional while DB column naming verified
    updatedAt?: Date;
}

export interface Negotiation {
    id: number;
    draftId: number;
    proposedTerms: LeaseTerms; // Normalized typed structure instead of generic JSON
    status: NegotiationStatus;
    message?: string | null;
    createdAt: Date;
    clientId: number;
    respondedAt?: Date | null;
    staffResponse?: LeaseTerms | null; // Counter terms if staff issued counter
    responseMessage?: string | null;
    staffId?: number | null; // Null until a staff member responds
    previousNegotiationId?: number | null;
    clientName?: string; // denormalized for DTO convenience (API layer only)
    staffName?: string;  // denormalized for DTO convenience (API layer only)
}

export interface Lease {
    id: number;
    draftId: number;
    finalTerms: LeaseTerms;
    signedByClient: boolean;
    signedByAgent: boolean;
    activeFrom: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Backwards compatibility (to be removed once all usages migrated)
export type Lease_draft = LeaseDraft;
export type negotiations = Negotiation;
export type Leases = Lease;

export interface LeaseTerms {
    financial: {
      rent: number;
      deposit: number;
      payment_due_day: number;
    };
    dates: {
      start: string;
      end: string;
    };
    utilities: {
      included: string[];
      not_included: string[];
    };
  }