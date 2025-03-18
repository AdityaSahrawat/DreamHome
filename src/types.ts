// types.ts
export interface Client {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    branch: string;
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