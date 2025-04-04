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

export interface Lease_draft {
    id : number,
    property_id : number, 
    client_id : number,
    current_terms?: LeaseTerms;
    status : 'draft' | 'client_review' | 'manager_review' | 'manager_review' | 'approved' | 'signed';
    version : number
}

export interface negotiations {
    id: number;
    draft_id: number;
    proposed_terms: JSON; 
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    message : string
    created_at: Date;
    client_id: number;
    responded_at?: Date;
    staff_response?: JSON; 
    response_message?: string;
    staff_id?: number; 
    previous_negotiation_id?: number;
}

export interface Leases {
    id : number,
    draft_id : number;
    final_terms : JSON,
    signed_by_client : boolean;
    signed_by_agent : boolean;
    active_from : Date
}

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