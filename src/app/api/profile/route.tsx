import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db';
import { authenticateToken } from '@/src/middleware';
import { User, Client, Staff, Owner, StaffApplication, Property, Property_image } from '@/src/types';

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
                console.log("1")
                // const leasesResult = await query(
                //     `SELECT l.id, p.id as property_id, p.address as property_address, 
                //      l.start_date, l.end_date, l.monthly_rent, l.status
                //      FROM leases l
                //      JOIN properties p ON l.property_id = p.id
                //      WHERE l.client_id = $1`,
                //     [id]
                // );
                
                responseData = {
                    user: {
                        id: userDetails.id,
                        name: userDetails.name,
                        email: userDetails.email,
                        role: role,
                        branch_id: userDetails.branch_id
                    },
                    // leases: leasesResult.rows.map(lease => ({
                    //     id: lease.id,
                    //     propertyId: lease.property_id,
                    //     propertyAddress: lease.property_address,
                    //     startDate: lease.start_date,
                    //     endDate: lease.end_date,
                    //     monthlyRent: lease.monthly_rent,
                    //     status: lease.status
                    // }))
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
                console.log("3")
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
                        'Select * FROM staff WHERE role = "assistant" AND branch_id =3' 
                    ) as any[]
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
                    pendingProperties: role === 'manager' ? pendingProperties : undefined ,
                    assistants : role === "manager" ? assistants : undefined
                };
                break;

            case 'owner':
                const ownerResult = await query(
                    'SELECT id, name, email, role FROM owners WHERE id = $1',
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
                );
                
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