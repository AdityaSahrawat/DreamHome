'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import LeaseTermsDisplay from "./leaseTermDisplay";
import { MessageSquare, FileText, Check, X } from "lucide-react";
import { LeaseDraft } from "./interface";

interface LeaseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: LeaseDraft;
  onNegotiate: () => void;
  isStaff?: boolean;
}

export default function LeaseDetailsDialog({
  open,
  onOpenChange,
  draft,
  onNegotiate,
  isStaff = false
}: LeaseDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lease Draft Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Property</h4>
              <p>{draft.propertyTitle}</p>
              <p className="text-sm text-gray-500">{draft.propertyAddress}</p>
            </div>
            <div>
              <h4 className="font-medium">Status</h4>
              <Badge variant="outline" className="mt-1">
                {draft.status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Lease Terms (v{draft.version})</h4>
            <LeaseTermsDisplay terms={draft.current_terms} />
          </div>

          {draft.status === 'client_review' && !isStaff && (
            <div className="flex justify-end">
              <Button onClick={onNegotiate}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Propose Changes
              </Button>
            </div>
          )}

          {isStaff && draft.status === 'manager_review' && (
            <div className="flex justify-end gap-2">
              <Button variant="destructive">
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="default">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}