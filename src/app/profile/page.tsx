// components/DashboardPage.tsx
"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { UserCircle, HomeIcon, FileText } from "lucide-react";
import Navbar from "@/src/components/navbar";
import { useToast } from "@/src/components/hook/use-toast";
import UserInfoCard from "./userInfo";
import LeasesCard from "./leaseCard";
import PropertiesCard from "./propertiesCard";
import ManagerTabs from "./managerTab";
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
  leases?: any[];
  properties?: any[];
  staffApplications?: any[];
  pendingProperties?: any[];
  assistants?: any[];
};

const DashboardPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: "",
    propertyId: "",
    assistantId: "",
    title: "",
  });

  const handlePropertyStatus = async (propertyId: string, status: 'approved'|'rejected', assistantId?: string) => {
    console.log(propertyId , assistantId , status)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

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
      assistantId,
      title: status === 'approved' ? "Approve Property" : "Reject Property"
    });
  };

  const confirmAction = async () => {
    const { action, propertyId, assistantId } = confirmationDialog;
    const token = localStorage.getItem('token');
    
    try {
      setConfirmationDialog(prev => ({ ...prev, open: false }));
      
      console.log(assistantId)
      await axios.post(`/api/properties/add/${propertyId}`, {
        status: action,
        assistantId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type' : 'application/json'
        }
      });
      console.log(response)
      setProfileData(response.data);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [router]);

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
        {profileData.user.role === 'client' && profileData.leases && (
          <LeasesCard leases={profileData.leases} />
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
            onStatusChange={handlePropertyStatus}
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