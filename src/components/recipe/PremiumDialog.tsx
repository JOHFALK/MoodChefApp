import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function PremiumDialog({ open, onOpenChange, onUpgrade }: PremiumDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Premium Recipe</DialogTitle>
          <DialogDescription>
            This delicious recipe is available exclusively to our premium members. 
            Upgrade your account to unlock this and many other premium recipes!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={onUpgrade}>
            Upgrade to Premium
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}