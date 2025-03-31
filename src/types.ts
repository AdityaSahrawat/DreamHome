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