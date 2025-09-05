import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { FileText, MessageSquare, Check, X, History } from "lucide-react";
import { Button } from "@/src/components/ui/button";
// import Link from "next/link";
import NegotiationDialog from "./negotiationDialog";
import { useState } from "react";
import { LeaseDraft } from "./interface";
import NegotiationHistoryDialog from "./negotiationHistory";
import { useToast } from "@/src/components/hook/use-toast";
import { Loader2 } from "lucide-react";

interface LeaseDraftCardProps {
  drafts: LeaseDraft[];
  isStaff?: boolean;
  onUpdate?: () => void;
  userRole: 'client' | 'assistant' | 'manager' | 'supervisor' | 'owner';
}

export default function LeaseDraftsCard({ 
  drafts, 
  isStaff = false, 
  onUpdate,
  userRole 
}: LeaseDraftCardProps) {
  const { toast } = useToast();
  const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<LeaseDraft | null>(null);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case 'client_review': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'manager_review': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'approved': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'signed': return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleNegotiate = (draft: LeaseDraft) => {
    setSelectedDraft(draft);
    setNegotiationDialogOpen(true);
  };

  const handleViewHistory = (draft: LeaseDraft) => {
    setSelectedDraft(draft);
    setHistoryDialogOpen(true);
  };

  const handleStatusUpdate = async (draftId: number, action: 'approve' | 'reject') => {
    setLoadingAction(draftId);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/lease-drafts/${draftId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) throw new Error('Failed to update draft status');

      toast({
        title: `Draft ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The lease draft has been ${action === 'approve' ? 'approved' : 'rejected'}.`
      });

      if (onUpdate) onUpdate();
      // eslint-disable-next-line
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update draft status",
        variant: "destructive"
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lease Drafts
          </CardTitle>
        </CardHeader>
        <CardContent>
          { drafts &&  drafts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    {isStaff && <TableHead>Client</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drafts.map((draft) => (
                    <TableRow key={draft.id}>
                      <TableCell className="font-medium">
                        {draft.propertyTitle}
                        <p className="text-sm text-gray-500">{draft.propertyAddress}</p>
                      </TableCell>
                      {isStaff && (
                        <TableCell>
                          {draft.clientName}
                          <p className="text-sm text-gray-500">{draft.clientEmail}</p>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(draft.status)}>
                          {draft.status.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>v{draft.version}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewHistory(draft)}
                          >
                            <History className="h-4 w-4 mr-2" />
                            History
                          </Button>

                          {/* Negotiate button for clients */}
                          {userRole === 'client' && draft.status === 'client_review' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleNegotiate(draft)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Negotiate
                            </Button>
                          )}
                          
                          {/* Approve/Reject buttons for staff */}
                          {isStaff && draft.status === 'manager_review' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(draft.id, 'approve')}
                                disabled={loadingAction === draft.id}
                              >
                                {loadingAction === draft.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleStatusUpdate(draft.id, 'reject')}
                                disabled={loadingAction === draft.id}
                              >
                                {loadingAction === draft.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 mr-2" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">No lease drafts found.</p>
          )}
        </CardContent>
      </Card>

      {/* Negotiation Dialog */}
      {selectedDraft && (
        <NegotiationDialog
          open={negotiationDialogOpen}
          onOpenChange={setNegotiationDialogOpen}
          draft={selectedDraft}
          onSuccess={onUpdate}
          userRole={userRole}
        />
      )}

      {/* History Dialog */}
      {selectedDraft && (
        <NegotiationHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          draftId={selectedDraft.id}
          userRole={userRole}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}