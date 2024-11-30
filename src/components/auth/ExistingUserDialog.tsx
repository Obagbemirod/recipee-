import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExistingUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const ExistingUserDialog = ({ isOpen, onClose, email }: ExistingUserDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Already Exists</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>An account with the email {email} already exists.</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/auth")}>
              Go to Login
            </Button>
            <Button variant="outline" onClick={() => navigate("/forgot-password")}>
              Reset Password
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};