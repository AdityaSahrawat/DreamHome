import { prismaClient } from '@/database';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/src/middleware';

interface UserDetails {
    id: number;
    name: string;
    email: string;
    role: string;
    branchId?: number | null;
    contact?: string;
}

interface ResponseData {
    user: UserDetails;
    leases?: unknown[];
    leaseDrafts?: unknown[];
    properties?: unknown[];
    staffApplications?: unknown[];
    pendingProperties?: unknown[];
    assistants?: unknown[];
    viewRequests?: unknown[];
}

// Then update the GET function
export async function GET(req: NextRequest) {
    const authResult = await authenticateToken(req);

    if (authResult instanceof NextResponse) {
        return authResult;
    }
    // If authenticateToken returned null (public route logic) treat as unauthorized for this protected endpoint
    if (authResult === null) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    const { id, role, branch_id } = authResult;
    try {
        let userDetails: UserDetails;
        let responseData: ResponseData = {} as ResponseData;

        switch (role) {
            case 'client': {
                const userData = await prismaClient.user.findUnique({
                    where: { id: id },
                    select: { id: true, name: true, email: true, role: true, branchId: true }
                });

                if (!userData) {
                    return NextResponse.json(
                        { message: 'User not found' },
                        { status: 404 }
                    );
                }

                userDetails = userData;

                const clientLeases = await prismaClient.lease.findMany({
                    where: { 
                        draft: { 
                            clientId: id 
                        } 
                    },
                    include: {
                        draft: {
                            include: {
                                property: true
                            }
                        }
                    }
                });

                const clientDrafts = await prismaClient.leaseDraft.findMany({
                    where: { clientId: id },
                    include: { property: true }
                });

                responseData = {
                    user: userDetails,
                    leases: clientLeases.map(lease => ({
                        id: lease.id,
                        propertyId: lease.draft.property.id,
                        propertyTitle: lease.draft.property.title,
                        propertyAddress: lease.draft.property.address,
                        signedByClient: lease.signedByClient,
                        signedByAgent: lease.signedByAgent,
                        activeFrom: lease.activeFrom
                    })),
                    leaseDrafts: clientDrafts.map(draft => ({
                        id: draft.id,
                        propertyId: draft.property.id,
                        propertyTitle: draft.property.title,
                        propertyAddress: draft.property.address,
                        status: draft.status,
                        version: draft.version
                    }))
                };
                break;
            }
            case 'manager':
            case 'supervisor':
            case 'assistant':
                const userData = await prismaClient.user.findUnique({
                    where: { id: id },
                    select: { id: true, name: true, email: true, role: true, branchId: true }
                });
                
                if (!userData) {
                    return NextResponse.json(
                        { message: 'User not found' },
                        { status: 404 }
                    );
                }

                userDetails = userData;
                
                const propertiesResult = await prismaClient.property.findMany({
                    where: { 
                        branchId: branch_id,
                        status: 'approved'
                    }
                });
                
                let staffApplications: unknown[] = [];
                if (role === 'manager') {
                    staffApplications = await prismaClient.staffApplication.findMany({
                        where: { 
                            branchId: branch_id,
                            status: 'pending'
                        }
                    });
                }
                
                let pendingProperties: unknown[] = [];
                if (role === 'manager') {
                    pendingProperties = await prismaClient.property.findMany({
                        where: { 
                            branchId: branch_id,
                            status: 'pending'
                        }
                    });
                }

                let assistants: unknown[] = [];
                if(role == 'manager'){
                    assistants = await prismaClient.user.findMany({
                        where: { 
                            role: 'assistant',
                            branchId: branch_id
                        }
                    });
                }

                let viewRequests: unknown[] = []
                if(role == 'manager'){
                    viewRequests = await prismaClient.viewRequest.findMany({
                        where: {
                            property: {
                                branchId: branch_id
                            },
                            status: 'pending'
                        },
                        include: {
                            property: {
                                select: { title: true }
                            },
                            client: {
                                select: { name: true, email: true }
                            }
                        }
                    });
                }
                
                // Get lease drafts for staff (based on role)
                let leaseDrafts: unknown[] = [];
                if (role === 'assistant' || role === 'manager') {
                    leaseDrafts = await prismaClient.leaseDraft.findMany({
                        where: {
                            property: {
                                branchId: branch_id
                            },
                            status: {
                                in: ['draft', 'client_review', 'manager_review']
                            }
                        },
                        include: {
                            property: {
                                select: { id: true, title: true, address: true }
                            },
                            client: {
                                select: { name: true, email: true }
                            }
                        }
                    });
                }
                
                // Get leases for staff (based on role)
                let leases: unknown[] = [];
                if (role === 'assistant' || role === 'manager') {
                    leases = await prismaClient.lease.findMany({
                        where: {
                            draft: {
                                property: {
                                    branchId: branch_id
                                }
                            }
                        },
                        include: {
                            draft: {
                                include: {
                                    property: {
                                        select: { id: true, title: true, address: true }
                                    },
                                    client: {
                                        select: { name: true, email: true }
                                    }
                                }
                            }
                        }
                    });
                }
                
                responseData = {
                    user: {
                        id: userDetails.id,
                        name: userDetails.name,
                        email: userDetails.email,
                        contact: undefined,
                        role: role,
                        branchId: userDetails.branchId
                    },
                    properties: propertiesResult,
                    staffApplications: role === 'manager' ? staffApplications : undefined,
                    pendingProperties: role === 'manager' ? pendingProperties : undefined,
                    assistants: role === "manager" ? assistants : undefined,
                    viewRequests: role === "manager" ? (viewRequests as any[]).map(v => ({
                        request_id: v.id,
                        property_title: v.property?.title,
                        client_name: v.client?.name,
                        client_email: v.client?.email,
                        scheduled_time: v.scheduledTime,
                        status: v.status
                    })) : undefined,
                    leaseDrafts: (role === 'assistant' || role === 'manager') ? leaseDrafts.map((draft: unknown) => {
                        const d = draft as Record<string, unknown>;
                        return {
                            id: (d.id as number),
                            propertyId: ((d.property as Record<string, unknown>).id as number),
                            propertyTitle: ((d.property as Record<string, unknown>).title as string),
                            propertyAddress: ((d.property as Record<string, unknown>).address as string),
                            clientName: ((d.client as Record<string, unknown>).name as string),
                            clientEmail: ((d.client as Record<string, unknown>).email as string),
                            status: (d.status as string),
                            version: (d.version as number)
                        };
                    }) : undefined,
                    leases: (role === 'assistant' || role === 'manager') ? leases.map((lease: unknown) => {
                        const l = lease as Record<string, unknown>;
                        const draft = l.draft as Record<string, unknown>;
                        return {
                            id: (l.id as number),
                            propertyId: ((draft.property as Record<string, unknown>).id as number),
                            propertyTitle: ((draft.property as Record<string, unknown>).title as string),
                            propertyAddress: ((draft.property as Record<string, unknown>).address as string),
                            clientName: ((draft.client as Record<string, unknown>).name as string),
                            clientEmail: ((draft.client as Record<string, unknown>).email as string),
                            signedByClient: (l.signedByClient as boolean),
                            signedByAgent: (l.signedByAgent as boolean),
                            activeFrom: (l.activeFrom as Date)
                        };
                    }) : undefined
                };
                break;

            case 'owner':
                const ownerData = await prismaClient.user.findUnique({
                    where: { id: id },
                    select: { id: true, name: true, email: true, role: true }
                });
                
                if (!ownerData) {
                    return NextResponse.json(
                        { message: 'User not found' },
                        { status: 404 }
                    );
                }

                userDetails = ownerData;
                
                const ownedPropertiesResult = await prismaClient.property.findMany({
                    where: { agentId: id },
                    include: {
                        branch: {
                            select: { name: true }
                        }
                    }
                });
                
                responseData = {
                    user: {
                        id: userDetails.id,
                        name: userDetails.name,
                        email: userDetails.email,
                        contact: undefined,
                        role: role
                    },
                    properties: ownedPropertiesResult.map(prop => ({
                        id: prop.id,
                        title: prop.title,
                        address: prop.address,
                        city: prop.city,
                        price: prop.price,
                        status: prop.status,
                        branch_name: prop.branch?.name || null
                    }))
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