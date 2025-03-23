// types.ts
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

export interface Property{
    id : number;
    client_id : number;
    title : string;
    description : string;
    price : number;
    location : string;
    status : 'pending' | 'approved' | 'rejected';
    branch_id : number,
    created_at : Date
}