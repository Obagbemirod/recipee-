import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionDialog } from '../subscription/SubscriptionDialog';
import { useNavigate } from 'react-router-dom';

export const useFeatureAccess = () => {
  const { plan, isTrialExpired } = useSubscription();
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const navigate = useNavigate();

  const checkAccess = () => {
    if (!plan && isTrialExpired) {
      setShowSubscriptionDialog(true);
      return false;
    }
    return true;
  };

  return {
    checkAccess,
    SubscriptionPrompt: () => (
      <SubscriptionDialog
        isOpen={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
      />
    )
  };
};