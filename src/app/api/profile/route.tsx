import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { User, Client, Staff, Owner, StaffApplication, Property, Property_image, Lease_draft, Leases, negotiations } from '@/src/types';
// First, let's define a type for the query results that includes joined properties
interface LeaseWithProperty extends Leases {
    property_id: number;
    property_title: string;
    property_address: string;
    client_name?: string;
    client_email?: string;
}

interface LeaseDraftWithProperty extends Lease_draft {
    property_id: number;
    property_title: string;
    property_address: string;
    client_name?: string;
    client_email?: string;
}

// Then update the GET function
export async function GET(req: NextRequest) {
    const authResult = await authenticateToken(req);

    if (authResult instanceof NextResponse) {
        return authResult;
    }
    
    const { id, role, branch_id } = authResult;
    try {
        let userDetails: any;
        let responseData: any = {};

        switch (role) {
            case 'client':
                const clientResult = await query(
                    'SELECT id, name, email, role, branch_id FROM client WHERE id = ?',
                    [id]
                ) as Client[]
                userDetails = clientResult[0]
                
                // Get leases for client
                const clientLeases = await query(
                    `SELECT l.id, l.signed_by_client, l.signed_by_agent, l.active_from,
                     ld.property_id, p.title as property_title, p.address as property_address
                     FROM leases l
                     JOIN lease_draft ld ON l.draft_id = ld.id
                     JOIN properties p ON ld.property_id = p.id
                     WHERE ld.client_id = ?`,
                    [id]
                ) as LeaseWithProperty[];
                
                // Get lease drafts for client
                const clientDrafts = await query(
                    `SELECT ld.id, ld.status, ld.version,
                     ld.property_id, p.title as property_title, p.address as property_address
                     FROM lease_draft ld
                     JOIN properties p ON ld.property_id = p.id
                     WHERE ld.client_id = ?`,
                    [id]
                ) as LeaseDraftWithProperty[];
                
                responseData = {
                    user: {
                        id: userDetails.id,
                        name: userDetails.name,
                        email: userDetails.email,
                        role: role,
                        branch_id: userDetails.branch_id
                    },
                    leases: clientLeases.map(lease => ({
                        id: lease.id,
                        propertyId: lease.property_id,
                        propertyTitle: lease.property_title,
                        propertyAddress: lease.property_address,
                        signedByClient: lease.signed_by_client,
                        signedByAgent: lease.signed_by_agent,
                        activeFrom: lease.active_from
                    })),
                    leaseDrafts: clientDrafts.map(draft => ({
                        id: draft.id,
                        propertyId: draft.property_id,
                        propertyTitle: draft.property_title,
                        propertyAddress: draft.property_address,
                        status: draft.status,
                        version: draft.version
                    }))
                };
                break;
            case 'manager':
            case 'supervisor':
            case 'assistant':
                const staffResult = await query(
                    'SELECT id, name, email, role, branch_id FROM staff WHERE id = ?',
                    [id]
                ) as Staff[]
                userDetails = staffResult[0];
                
                const propertiesResult = await query(
                    `SELECT *
                     FROM properties 
                     WHERE branch_id = ? AND status = 'approved'`,
                    [branch_id]
                ) as Property[]
                
                let staffApplications: StaffApplication[] = [];
                if (role === 'manager') {
                    const applicationsResult = await query(
                        `SELECT *
                         FROM staffapplications 
                         WHERE branch_id = ? AND status = 'pending'`,
                        [branch_id]
                    ) as StaffApplication[]
                    staffApplications = applicationsResult;
                }
                
                let pendingProperties: Property[] = [];
                if (role === 'manager') {
                    const pendingPropsResult = await query(
                        `SELECT *
                         FROM properties
                         WHERE branch_id = ? AND status = 'pending'`,
                        [branch_id]
                    ) as Property[]
                    pendingProperties = pendingPropsResult;
                }

                let assistants: Staff[] = [];
                if(role == 'manager'){
                    assistants = await query(
                        'Select * FROM staff WHERE role = "assistant" AND branch_id = ?',
                        [branch_id]
                    ) as Staff[]
                }

                let viewRequests : any[] = []
                if(role == 'manager'){
                    viewRequests = await query(
                        `SELECT vr.request_id, p.title as property_title, 
                         vr.scheduled_time, vr.status,
                         c.name as client_name, c.email as client_email
                         FROM viewrequests vr
                         JOIN properties p ON vr.property_id = p.id
                         JOIN client c ON vr.client_id = c.id
                         WHERE p.branch_id = ? AND vr.status = 'pending'`,
                        [branch_id]
                    ) as any[];
                }
                
                // Get lease drafts for staff (based on role)
                let leaseDrafts: LeaseDraftWithProperty[] = [];
                if (role === 'assistant' || role === 'manager') {
                    leaseDrafts = await query(
                        `SELECT ld.id, ld.status, ld.version,
                         ld.property_id, p.title as property_title, p.address as property_address,
                         c.name as client_name, c.email as client_email
                         FROM lease_draft ld
                         JOIN properties p ON ld.property_id = p.id
                         JOIN client c ON ld.client_id = c.id
                         WHERE p.branch_id = ? AND ld.status IN ('draft', 'client_review', 'manager_review')`,
                        [branch_id]
                    ) as LeaseDraftWithProperty[];
                }
                
                // Get leases for staff (based on role)
                let leases: LeaseWithProperty[] = [];
                if (role === 'assistant' || role === 'manager') {
                    leases = await query(
                        `SELECT l.id, l.signed_by_client, l.signed_by_agent, l.active_from,
                         ld.property_id, p.title as property_title, p.address as property_address,
                         c.name as client_name, c.email as client_email
                         FROM leases l
                         JOIN lease_draft ld ON l.draft_id = ld.id
                         JOIN properties p ON ld.property_id = p.id
                         JOIN client c ON ld.client_id = c.id
                         WHERE p.branch_id = ?`,
                        [branch_id]
                    ) as LeaseWithProperty[];
                }
                
                responseData = {
                    user: {
                        id: userDetails.id,
                        name: userDetails.name,
                        email: userDetails.email,
                        contact: userDetails.contact || null,
                        role: role,
                        branch_id: userDetails.branch_id
                    },
                    properties: propertiesResult,
                    staffApplications: role === 'manager' ? staffApplications : undefined,
                    pendingProperties: role === 'manager' ? pendingProperties : undefined,
                    assistants: role === "manager" ? assistants : undefined,
                    viewRequests: role === "manager" ? viewRequests : undefined,
                    leaseDrafts: (role === 'assistant' || role === 'manager') ? leaseDrafts.map(draft => ({
                        id: draft.id,
                        propertyId: draft.property_id,
                        propertyTitle: draft.property_title,
                        propertyAddress: draft.property_address,
                        clientName: draft.client_name,
                        clientEmail: draft.client_email,
                        status: draft.status,
                        version: draft.version
                    })) : undefined,
                    leases: (role === 'assistant' || role === 'manager') ? leases.map(lease => ({
                        id: lease.id,
                        propertyId: lease.property_id,
                        propertyTitle: lease.property_title,
                        propertyAddress: lease.property_address,
                        clientName: lease.client_name,
                        clientEmail: lease.client_email,
                        signedByClient: lease.signed_by_client,
                        signedByAgent: lease.signed_by_agent,
                        activeFrom: lease.active_from
                    })) : undefined
                };
                break;

            case 'owner':
                const ownerResult = await query(
                    'SELECT id, name, email, role FROM owners WHERE id = ?',
                    [id]
                ) as Owner[]
                userDetails = ownerResult[0];
                
                const ownedPropertiesResult = await query(
                    `SELECT p.id, p.title, p.address, p.city, p.price, p.status, 
                     b.name as branch_name
                     FROM properties p
                     LEFT JOIN branches b ON p.branch_id = b.id
                     WHERE p.owner_id = ?`,
                    [id]
                ) as any[];
                
                responseData = {
                    user: {
                        id: userDetails.id,
                        name: userDetails.name,
                        email: userDetails.email,
                        contact: userDetails.contact || null,
                        role: role
                    },
                    properties: ownedPropertiesResult
                };
                break;

            default:
                return NextResponse.json(
                    { message: 'Unauthorized - Invalid role' },
                    { status: 401 }
                );
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/profile:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}