'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/components/hook/use-toast";
import { useEffect, useState } from "react";
import { negotiations } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import NegotiationDialog from "./negotiationDialog";

interface NegotiationHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftId: number;
  userRole: 'client' | 'assistant' | 'manager' | 'supervisor' | 'owner';
  onUpdate?: () => void;
}

export default function NegotiationHistoryDialog({ 
  open, 
  onOpenChange,
  draftId,
  userRole,
  onUpdate
}: NegotiationHistoryDialogProps) {
  const { toast } = useToast();
  const [negotiations, setNegotiations] = useState<negotiations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<negotiations | null>(null);
  const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false);

  const isStaff = ['assistant', 'manager', 'supervisor'].includes(userRole);

  useEffect(() => {
    if (open) {
      fetchNegotiations();
    }
  }, [open]);

  const fetchNegotiations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/negotiations?draft_id=${draftId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch negotiations');
      
      const data = await response.json();
      setNegotiations(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load negotiation history',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'accepted': return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleRespond = (negotiation: negotiations) => {
    setSelectedNegotiation(negotiation);
    setNegotiationDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchNegotiations();
    setNegotiationDialogOpen(false);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Negotiation History</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Initiated By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Date</TableHead>
                    {isStaff && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {negotiations.length > 0 ? (
                    negotiations.map((negotiation) => (
                      <TableRow key={negotiation.id}>
                        <TableCell className="capitalize">
                          {/* {negotiation.initiated_by} */}
                          "client"
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(negotiation.status)}
                        </TableCell>
                        <TableCell>
                          <pre className="text-xs max-w-xs overflow-x-auto py-2">
                            {JSON.stringify(negotiation.proposed_terms, null, 2)}
                          </pre>
                        </TableCell>
                        <TableCell>
                          {new Date(negotiation.created_at).toLocaleString()}
                        </TableCell>
                        {isStaff && negotiation.status === 'pending' && (
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleRespond(negotiation)}
                            >
                              Respond
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isStaff ? 5 : 4} className="text-center py-8">
                        No negotiation history found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedNegotiation && (
        <NegotiationDialog
          open={negotiationDialogOpen}
          onOpenChange={setNegotiationDialogOpen}
          draft={{
            id: draftId,
            current_terms: selectedNegotiation.proposed_terms,
            propertyTitle: "",
            propertyAddress: "",
            status: "",
            version: 0
          }}
          negotiation={selectedNegotiation}
          onSuccess={handleSuccess}
          userRole={userRole}
        />
      )}
    </>
  );
}