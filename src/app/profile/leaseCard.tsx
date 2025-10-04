import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { FileText, Check, X, Pencil, Ban, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
// import Link from "next/link";
import { useState } from "react";
import { LeaseDraft } from "./interface";
import { useToast } from "@/src/components/hook/use-toast";

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
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  interface DraftTermsShape { financial?: { rent?: number; deposit?: number }; dates?: { start?: string; end?: string } }
  const [formTerms, setFormTerms] = useState<Record<number, DraftTermsShape>>({});

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case 'client_accepted': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'client_rejected': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'approved': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'canceled': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'signed': return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const apiPatch = async (draftId: number, payload: Record<string, unknown>) => {
    const res = await fetch('/api/leases/draft', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftId, ...payload })
    });
    if (!res.ok) throw new Error('request failed');
    return res.json();
  };

  const clientAccept = (id: number) => runAction(id, { action: 'client_accept' }, 'Draft Accepted');
  const clientReject = (id: number) => runAction(id, { action: 'client_reject' }, 'Draft Rejected');
  const assistantCancel = (id: number) => runAction(id, { action: 'assistant_cancel' }, 'Draft Canceled');
  const managerApprove = (id: number) => runAction(id, { action: 'manager_approve' }, 'Draft Approved & Lease Created');

  const runAction = async (id: number, payload: Record<string, unknown>, successTitle: string) => {
    setLoadingAction(id);
    try {
      await apiPatch(id, payload);
      toast({ title: successTitle });
      onUpdate?.();
    } catch {
      toast({ title: 'Action failed', variant: 'destructive' });
    } finally { setLoadingAction(null); }
  };

  const startEdit = (draft: LeaseDraft) => {
    setEditingDraftId(draft.id);
  setFormTerms(prev => ({ ...prev, [draft.id]: draft.current_terms || {} }));
  };

  const updateField = (draftId: number, path: string[], value: unknown) => {
    setFormTerms(prev => {
      const clone = { ...(prev[draftId] || {}) } as Record<string, unknown>;
      let node: Record<string, unknown> = clone;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        node[key] = (node[key] as Record<string, unknown>) || {};
        node = node[key] as Record<string, unknown>;
      }
      node[path[path.length - 1]] = value;
      return { ...prev, [draftId]: clone as DraftTermsShape };
    });
  };

  const assistantSave = async (draft: LeaseDraft) => {
    setLoadingAction(draft.id);
    try {
      await apiPatch(draft.id, { action: 'assistant_update', terms: formTerms[draft.id] });
      toast({ title: 'Draft Updated' });
      setEditingDraftId(null);
      onUpdate?.();
    } catch { toast({ title: 'Update failed', variant: 'destructive' }); }
    finally { setLoadingAction(null); }
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
                        <div className="flex flex-col gap-2 min-w-[250px]">
                          {/* Client actions */}
                          {userRole === 'client' && draft.status === 'draft' && (
                            <div className="flex gap-2">
                              <Button size="sm" disabled={loadingAction===draft.id} onClick={()=>clientAccept(draft.id)}>
                                {loadingAction===draft.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Check className="h-4 w-4 mr-2"/>}
                                Accept
                              </Button>
                              <Button variant="destructive" size="sm" disabled={loadingAction===draft.id} onClick={()=>clientReject(draft.id)}>
                                {loadingAction===draft.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <X className="h-4 w-4 mr-2"/>}
                                Reject
                              </Button>
                            </div>
                          )}
                          {userRole === 'client' && draft.status === 'client_accepted' && (
                            <p className="text-xs text-gray-500">Waiting for manager approval…</p>
                          )}
                          {userRole === 'client' && draft.status === 'client_rejected' && (
                            <p className="text-xs text-gray-500">Waiting for assistant update…</p>
                          )}

                          {/* Assistant edits */}
                          {userRole === 'assistant' && ['draft','client_rejected'].includes(draft.status) && (
                            editingDraftId === draft.id ? (
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <input type="number" className="border px-2 py-1 rounded" placeholder="Rent" defaultValue={draft.current_terms?.financial?.rent} onChange={e=>updateField(draft.id,['financial','rent'], Number(e.target.value))} />
                                  <input type="number" className="border px-2 py-1 rounded" placeholder="Deposit" defaultValue={draft.current_terms?.financial?.deposit} onChange={e=>updateField(draft.id,['financial','deposit'], Number(e.target.value))} />
                                  <input type="date" className="border px-2 py-1 rounded" defaultValue={draft.current_terms?.dates?.start} onChange={e=>updateField(draft.id,['dates','start'], e.target.value)} />
                                  <input type="date" className="border px-2 py-1 rounded" defaultValue={draft.current_terms?.dates?.end} onChange={e=>updateField(draft.id,['dates','end'], e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" disabled={loadingAction===draft.id} onClick={()=>assistantSave(draft)}>
                                    {loadingAction===draft.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Check className="h-4 w-4 mr-2"/>}
                                    Save
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={()=>setEditingDraftId(null)}>Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={()=>startEdit(draft)}>
                                  <Pencil className="h-4 w-4 mr-2"/>Edit Terms
                                </Button>
                                <Button size="sm" variant="destructive" disabled={loadingAction===draft.id} onClick={()=>assistantCancel(draft.id)}>
                                  {loadingAction===draft.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Ban className="h-4 w-4 mr-2"/>}
                                  Cancel Draft
                                </Button>
                              </div>
                            )
                          )}
                          {userRole === 'assistant' && draft.status === 'client_accepted' && (
                            <p className="text-xs text-gray-500">Client accepted. Awaiting manager approval.</p>
                          )}

                          {/* Manager approval */}
                          {userRole === 'manager' && draft.status === 'client_accepted' && (
                            <Button size="sm" disabled={loadingAction===draft.id} onClick={()=>managerApprove(draft.id)}>
                              {loadingAction===draft.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Check className="h-4 w-4 mr-2"/>}
                              Approve & Finalize
                            </Button>
                          )}
                          {userRole === 'manager' && draft.status === 'approved' && (
                            <p className="text-xs text-gray-500">Lease created.</p>
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

      {/* Negotiation components removed (deprecated workflow) */}
    </>
  );
}