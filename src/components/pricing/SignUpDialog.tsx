import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignUpForm } from "@/components/auth/SignUpForm";

interface SignUpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: any;
  onSubmit: (values: any) => Promise<void>;
}

export function SignUpDialog({ isOpen, onOpenChange, selectedPlan, onSubmit }: SignUpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Create your account</h3>
          <p className="text-sm text-muted-foreground">
            {selectedPlan?.planId === "24_hour_trial" 
              ? "Sign up to start your free trial" 
              : `Sign up to continue with your ${selectedPlan?.name} subscription`}
          </p>
        </div>
        <SignUpForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}