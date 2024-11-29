import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionDialog({ isOpen, onClose }: SubscriptionDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trial Period Expired</DialogTitle>
          <DialogDescription>
            Your 24-hour trial period has expired. Subscribe to continue enjoying premium features:
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <h4 className="font-medium">Premium Plan Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited meal planning</li>
              <li>Advanced AI recipe generation</li>
              <li>Full marketplace access</li>
              <li>Recipe monetization</li>
              <li>Extended offline access</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/pricing")}>View Plans</Button>
            <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}