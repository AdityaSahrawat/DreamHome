// components/DashboardPage.tsx
"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
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

type User = {
  id: string;
  name?: string;
  email: string;
  role: string;
  branch_id?: number;
  contact?: string | null;
};

type ProfileData = {
  user: User;
  leases?: Lease[];
  properties?: any[];
  staffApplications?: any[];
  pendingProperties?: any[];
  assistants?: any[];
  leaseRequests?: any[];
  viewRequests?: any[];
  leaseDrafts? : LeaseDraft[]
};

interface Lease {
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

interface LeaseDraft {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  status: 'draft' | 'client_review' | 'manager_review' | 'approved' | 'signed';
  version: number;
  clientName?: string;
  clientEmail?: string;
}

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

  const handlePropertyStatus = async (propertyId: string, status: 'approved'|'rejected', assistantId?: string) => {
    console.log(propertyId , assistantId , status)

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
      
      console.log(assistantId)
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
      console.log(response)
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
    console.log(requestId)
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
  
  // Add this function
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

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
        {profileData.user.role === 'client'  && (
        <>
          {profileData.leaseDrafts && <LeaseDraftsCard drafts={profileData.leaseDrafts} userRole={profileData.user.role as 'client'} onUpdate={fetchProfileData} />}
        </>
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

        {profileData.user.role === "assistant" && (
          <LeaseDraftsCard 
            // @ts-expect-error backend shape differs; future: align types
            drafts={profileData.leaseDrafts} 
            isStaff={['assistant'].includes(profileData.user.role)}
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