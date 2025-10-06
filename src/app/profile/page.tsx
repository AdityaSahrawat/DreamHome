// components/DashboardPage.tsx
"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import { UserCircle } from "lucide-react";
import Navbar from "@/src/components/navbar";
import { useToast } from "@/src/components/hook/use-toast";
import UserInfoCard from "./userInfo";
import LeaseDraftsCard from "./leaseCard";
import PropertiesCard from "./propertiesCard";
import ManagerTabs from "./managerTab";
import BranchManagement from "./BranchManagement";
import ConfirmationDialog from "./confirmationDialog";
import { Loader2 } from "lucide-react";
import { Lease, LeaseDraft as FullLeaseDraft } from "./interface";

type User = {
  id: string;
  name?: string;
  email: string;
  role: string;
  branch_id?: number;
  contact?: string | null;
};

// Narrowed interface shapes used only for rendering concerns on the dashboard.
interface PropertySummary {
  id: string;
  title: string;
  address: string;
  city: string;
  status: string;
  type?: string;
  bedrooms?: number;
  price?: number;
  created_at?: string;
}

interface StaffApplicationSummary {
  application_id: string;
  name: string;
  email: string;
  role: string; // requested role
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AssistantSummary { id: string; name: string; email?: string }

interface ViewingRequestSummary {
  request_id: string;
  property_title: string;
  client_name: string;
  client_email: string;
  scheduled_time: string; // ISO
  status: 'pending' | 'approved' | 'rejected';
}

// Backend returns a subset of FullLeaseDraft; define a relaxed shape we accept then normalize.
type DashboardLeaseDraft = Partial<FullLeaseDraft> & Pick<FullLeaseDraft, 'id' | 'propertyId' | 'propertyTitle' | 'propertyAddress' | 'status' | 'version'> & {
  clientName?: string; clientEmail?: string;
  // legacy snake_case keys from older API responses
  client_name?: string; client_email?: string;
  property_id?: number; client_id?: number; current_terms?: FullLeaseDraft['current_terms'];
};

interface ProfileData {
  user: User;
  leases?: Lease[];
  properties?: PropertySummary[];
  staffApplications?: StaffApplicationSummary[];
  pendingProperties?: PropertySummary[];
  assistants?: AssistantSummary[];
  leaseRequests?: ViewingRequestSummary[]; // legacy naming
  viewRequests?: ViewingRequestSummary[];
  leaseDrafts?: DashboardLeaseDraft[];
}

const normalizeLeaseDrafts = (drafts: DashboardLeaseDraft[]): FullLeaseDraft[] => {
  return drafts.map(d => ({
    // required core
    id: d.id,
    propertyId: d.propertyId ?? d.property_id ?? 0,
    clientId: d.clientId ?? d.client_id ?? 0,
    propertyTitle: d.propertyTitle || 'Unknown Property',
    propertyAddress: d.propertyAddress || 'Unknown Address',
    status: ((): FullLeaseDraft['status'] => {
      const allowed: FullLeaseDraft['status'][] = ['draft','client_accepted','client_rejected','approved','canceled','signed'];
      return allowed.includes(d.status as FullLeaseDraft['status']) ? d.status as FullLeaseDraft['status'] : 'draft';
    })(),
    version: d.version ?? 1,
    current_terms: d.current_terms ?? null,
    clientName: d.clientName ?? d.client_name,
    clientEmail: d.clientEmail ?? d.client_email
  }));
};

const DashboardPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  // const [createLeaseDialogOpen, setCreateLeaseDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: "",
    propertyId: "",
    assistantId: "",
    title: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const normalizedLeaseDrafts = useMemo(() => profileData?.leaseDrafts ? normalizeLeaseDrafts(profileData.leaseDrafts) : [], [profileData?.leaseDrafts]);

  const handlePropertyStatus = async (propertyId: string, status: 'approved'|'rejected', assistantId?: string) => {
  // Removed debug log: propertyId, assistantId, status

    if (status === 'approved' && !assistantId) {
      toast({
        title: "Selection Required",
        description: "Please select an assistant before approving the property.",
        variant: "destructive"
      });
      return;
    }

    setConfirmationDialog({
      open: true,
      action: status,
      propertyId,
      assistantId: assistantId || "",
      title: status === 'approved' ? "Approve Property" : "Reject Property"
    });
  };

  const confirmAction = async () => {
    const { action, propertyId, assistantId } = confirmationDialog;
    
    try {
      setConfirmationDialog(prev => ({ ...prev, open: false }));
      
  // Removed debug log: assistantId
      await axios.post(`/api/properties/add/${propertyId}`, {
        status: action,
        assistantId
      });
      
      
      fetchProfileData();
      
      toast({
        title: `Property ${action === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The property has been successfully ${action === 'approved' ? 'approved' : 'rejected'}.`,
        variant: action === 'approved' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Action Failed",
        description: "There was a problem updating the property status.",
        variant: "destructive"
      });
    }
  };

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profile');
  // Removed debug log: response
      setProfileData(response.data);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleScheduleStatusChange = async (requestId: string, status: 'approved'|'rejected') => {
  // Removed debug log: requestId
    try {
      await axios.put('/api/leases/schedule', {
        requestId ,
        status
      });
  
      fetchProfileData();
      
      toast({
        title: `Viewing Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The viewing request has been ${status === 'approved' ? 'approved' : 'rejected'}.`,
        variant: status === 'approved' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error updating viewing request:', error);
      toast({
        title: "Action Failed",
        description: "There was a problem updating the viewing request.",
        variant: "destructive"
      });
    }
  };

  const handleStaffApplicationStatusChange = async (applicationId: string, status: 'approved'|'rejected') => {
    try {
      await axios.post(`/api/auth/register/staff/${applicationId}`, {
        status
      });
  
      fetchProfileData();
      
      toast({
        title: `Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The staff application has been ${status === 'approved' ? 'approved and the account created' : 'rejected'}.`,
        variant: status === 'approved' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error updating staff application:', error);
      toast({
        title: "Action Failed",
        description: "There was a problem updating the staff application.",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData, refreshKey]);

  // Refresh helper
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Removed duplicate effect that caused double fetch

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 pt-16">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your profile and properties</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="flex items-center gap-2">
              <UserCircle size={18} />
              {profileData.user.role.charAt(0).toUpperCase() + profileData.user.role.slice(1)} Account
            </Button>
          </div>
        </header>

        <UserInfoCard user={profileData.user} />

        {/* Client-specific content */}
        {profileData.user.role === 'client'  && normalizedLeaseDrafts.length > 0 && (
          <LeaseDraftsCard 
            drafts={normalizedLeaseDrafts} 
            userRole="client" 
            onUpdate={fetchProfileData} 
          />
        )}

        {/* Staff/Owner-specific content */}
        {['manager', 'supervisor', 'assistant', 'owner'].includes(profileData.user.role) && profileData.properties && (
          <PropertiesCard 
            properties={profileData.properties} 
            role={profileData.user.role} 
          />
        )}

        {/* Manager-specific content */}
        {profileData.user.role === 'manager' && (
          <ManagerTabs 
            pendingProperties={profileData.pendingProperties || []}
            staffApplications={profileData.staffApplications || []}
            assistants={profileData.assistants || []}
            viewRequests={profileData.viewRequests || []}
            onStatusChange={handlePropertyStatus}
            onScheduleStatusChange={handleScheduleStatusChange}
            onStaffApplicationStatusChange={handleStaffApplicationStatusChange}
          />
        )}

        {/* Owner-specific content */}
        {profileData.user.role === 'owner' && (
          <BranchManagement />
        )}

        {profileData.user.role === "assistant" && normalizedLeaseDrafts.length > 0 && (
          <LeaseDraftsCard 
            drafts={normalizedLeaseDrafts} 
            isStaff
            userRole="assistant"
            onUpdate={handleRefresh}
          />
        )}

        <ConfirmationDialog 
          open={confirmationDialog.open}
          onOpenChange={(open) => setConfirmationDialog(prev => ({ ...prev, open }))}
          title={confirmationDialog.title}
          action={confirmationDialog.action}
          onConfirm={confirmAction}
        />
      </div>
    </div>
  );
};

export default DashboardPage;