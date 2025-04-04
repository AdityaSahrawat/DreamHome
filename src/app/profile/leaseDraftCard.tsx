import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { FileText, MessageSquare, Check, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import NegotiationDialog from "./negotiationDialog";
import LeaseDetailsDialog from "./leaseDetatils";
import { LeaseDraft } from "./interface";

interface LeaseDraftCardProps {
  drafts: LeaseDraft[];
  isStaff?: boolean;
  onUpdate?: () => void;
}

export default function LeaseDraftsCard({ drafts, isStaff = false, onUpdate }: LeaseDraftCardProps) {
  const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<LeaseDraft | null>(null);

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

  const handleViewClick = (draft: LeaseDraft) => {
    setSelectedDraft(draft);
    setDetailsDialogOpen(true);
  };

  const handleNegotiateClick = (draft: LeaseDraft) => {
    setSelectedDraft(draft);
    setNegotiationDialogOpen(true);
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
          {drafts.length > 0 ? (
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
                            onClick={() => handleViewClick(draft)}
                          >
                            View
                          </Button>
                          
                          {draft.status === 'client_review' && !isStaff && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleNegotiateClick(draft)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Negotiate
                            </Button>
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

      {/* Lease Details Dialog */}
      {selectedDraft && (
        <LeaseDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          draft={selectedDraft}
          onNegotiate={() => {
            setDetailsDialogOpen(false);
            setNegotiationDialogOpen(true);
          }}
          isStaff={isStaff}
        />
      )}

      {/* Negotiation Dialog */}
      {selectedDraft && (
        <NegotiationDialog
          open={negotiationDialogOpen}
          onOpenChange={setNegotiationDialogOpen}
          draft={selectedDraft}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}