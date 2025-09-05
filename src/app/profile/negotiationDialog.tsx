'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textArea";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/hook/use-toast";
import { useState } from "react";
import TermsEditor from "./termEditor";
import { LeaseDraft } from "./interface";
import { LeaseTerms, negotiations } from "@/src/types";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { Loader2 } from "lucide-react";

interface NegotiationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: LeaseDraft;
  negotiation?: negotiations;
  onSuccess?: () => void;
  userRole: 'client' | 'assistant' | 'manager' | 'supervisor' | 'owner';
}

export default function NegotiationDialog({ 
  open, 
  onOpenChange, 
  draft,
  negotiation,
  onSuccess,
  userRole
}: NegotiationDialogProps) {
  const { toast } = useToast();
  const [terms, setTerms] = useState<Partial<LeaseTerms>>(
    negotiation?.proposed_terms as Partial<LeaseTerms> || draft.current_terms as Partial<LeaseTerms> || {}
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseType, setResponseType] = useState<'accept' | 'counter'>('counter');

  const isStaff = ['assistant', 'manager', 'supervisor'].includes(userRole);
  const isClient = userRole === 'client';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      let endpoint, method, body;

      if (negotiation && isStaff) {
        // Staff responding to client negotiation
        endpoint = `/api/negotiations/${negotiation.id}`;
        method = 'PATCH';
        body = JSON.stringify({
          action: responseType,
          response_message: message,
          ...(responseType === 'counter' && { counter_terms: terms })
        });
      } else if (isClient) {
        // Client initiating new negotiation
        endpoint = '/api/negotiations';
        method = 'POST';
        body = JSON.stringify({
          draft_id: draft.id,
          proposed_terms: terms,
          message,
          initiated_by: 'client'
        });
      } else {
        throw new Error('Invalid negotiation context');
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit negotiation');
      }

      toast({
        title: negotiation 
          ? responseType === 'accept' 
            ? 'Negotiation accepted' 
            : 'Counter offer sent'
          : 'Negotiation submitted',
        description: negotiation
          ? responseType === 'accept'
            ? 'The terms have been accepted'
            : 'Your counter offer has been sent'
          : 'Your proposed changes have been sent for review.'
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit negotiation';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {negotiation 
              ? isStaff 
                ? 'Respond to Negotiation' 
                : 'Negotiation Details'
              : 'Negotiate Lease Terms'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {negotiation && isStaff && (
            <div className="space-y-2">
              <Label>Response Type</Label>
              <RadioGroup 
                value={responseType}
                onValueChange={(val: 'accept' | 'counter') => setResponseType(val)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accept" id="accept" />
                  <Label htmlFor="accept">Accept Proposal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="counter" id="counter" />
                  <Label htmlFor="counter">Make Counter Offer</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {negotiation && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Current Proposal</h4>
              <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(negotiation.proposed_terms, null, 2)}
              </pre>
            </div>
          )}

          {(responseType === 'counter' || !negotiation) && (
            <TermsEditor 
              currentTerms={draft.current_terms as unknown as LeaseTerms}
              proposedTerms={terms}
              onChange={setTerms}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="message">
              {negotiation 
                ? isStaff 
                  ? 'Response Message' 
                  : 'Your Message'
                : 'Message (Optional)'}
            </Label>
            <Textarea
              id="message"
              placeholder={
                negotiation 
                  ? isStaff
                    ? 'Explain your response...' 
                    : 'Original message from assistant...'
                  : 'Explain your proposed changes...'
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              readOnly={!isStaff && !!negotiation}
            />
          </div>

          {(isStaff || (!negotiation && isClient)) && (
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={
                  isSubmitting || 
                  (responseType === 'counter' && Object.keys(terms).length === 0)
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {negotiation 
                      ? responseType === 'accept' 
                        ? 'Accepting...' 
                        : 'Sending...'
                      : 'Submitting...'}
                  </>
                ) : (
                  negotiation
                    ? responseType === 'accept'
                      ? 'Accept Proposal'
                      : 'Send Counter Offer'
                    : 'Submit Proposal'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}