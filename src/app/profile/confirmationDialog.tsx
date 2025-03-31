// components/ConfirmationDialog.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/src/components/ui/alert-dialog";
  
  export default function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    action,
    onConfirm
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    action: string;
    onConfirm: () => void;
  }) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'approved' 
                ? "Are you sure you want to approve this property? This action will assign the selected assistant to manage this property."
                : "Are you sure you want to reject this property? This action cannot be undone."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              {action === 'approved' ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }