'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/hook/use-toast";
import { useState } from "react";
import { Property, LeaseTerms } from "@/src/types";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2 } from "lucide-react";
import TermsEditor from "./termEditor";

interface CreateLeaseDialogProps {
  properties: Property[];
  onSuccess: () => void;
}

export default function CreateLeaseDialog({ 
  properties,
  onSuccess 
}: CreateLeaseDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [terms, setTerms] = useState<LeaseTerms>({
    financial: {
      rent: 0,
      deposit: 0,
      payment_due_day: 1
    },
    dates: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    utilities: {
      included: [],
      not_included: []
    }
  });

  const handleSubmit = async () => {
    if (!propertyId) {
      toast({
        title: "Property Required",
        description: "Please select a property",
        variant: "destructive"
      });
      return;
    }

    if (!clientId) {
      toast({
        title: "Client Required",
        description: "Please enter a client ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/lease-drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          property_id: Number(propertyId),
          client_id: Number(clientId),
          terms
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create lease');
      }

      toast({
        title: "Success",
        description: "Lease draft created successfully",
      });

      setOpen(false);
      setClientId("");
      setPropertyId("");
      setTerms({
        financial: {
          rent: 0,
          deposit: 0,
          payment_due_day: 1
        },
        dates: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        },
        utilities: {
          included: [],
          not_included: []
        }
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          Create New Lease
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lease Draft</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property">Property *</Label>
              <select
                id="property"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.address}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                type="number"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client ID"
                required
              />
            </div>
          </div>

          <TermsEditor 
            currentTerms={terms}
            proposedTerms={terms}
            onChange={(newTerms) => setTerms({ ...terms, ...newTerms })}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading || !propertyId || !clientId}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Lease"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}